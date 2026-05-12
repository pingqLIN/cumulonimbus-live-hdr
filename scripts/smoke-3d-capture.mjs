import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const width = readNumberArg("--width", 180);
const height = readNumberArg("--height", 320);
const outputPath = resolve(
  projectRoot,
  readStringArg("--out", join("outputs", "analysis", "cumulonimbus-3d-capture-smoke.png"))
);

const capture = spawnSync(
  process.execPath,
  [
    join(projectRoot, "scripts", "capture-3d-still.mjs"),
    "--look",
    readStringArg("--look", "demo-like"),
    "--simPreset",
    readStringArg("--simPreset", "mid"),
    "--width",
    String(width),
    "--height",
    String(height),
    "--waitMs",
    String(readNumberArg("--waitMs", 4000)),
    "--out",
    outputPath
  ],
  {
    cwd: projectRoot,
    encoding: "utf8"
  }
);

if (capture.status !== 0) {
  throw new Error(
    `3D capture smoke failed with exit code ${capture.status}.\n${capture.stderr || capture.stdout}`
  );
}

const analysis = analyzePng(outputPath);
assert.equal(analysis.width, width);
assert.equal(analysis.height, height);
assert.ok(analysis.maxLuma > 42, `expected visible highlights, got max luma ${analysis.maxLuma}`);
assert.ok(
  analysis.lumaStdDev > 4,
  `expected non-flat 3D capture, got luma stddev ${analysis.lumaStdDev}`
);
assert.ok(
  analysis.brightPixelRatio > 0.001,
  `expected some bright cloud pixels, got ratio ${analysis.brightPixelRatio}`
);

console.log(JSON.stringify({ ok: true, outputPath, ...analysis }, null, 2));

function analyzePng(path) {
  const buffer = readFileSync(path);
  const png = decodePng(buffer);
  let minLuma = Number.POSITIVE_INFINITY;
  let maxLuma = Number.NEGATIVE_INFINITY;
  let sum = 0;
  let sumSquares = 0;
  let brightPixels = 0;
  const channels = png.colorType === 6 ? 4 : 3;
  const pixelCount = png.width * png.height;

  for (let offset = 0; offset < png.pixels.length; offset += channels) {
    const red = png.pixels[offset] ?? 0;
    const green = png.pixels[offset + 1] ?? 0;
    const blue = png.pixels[offset + 2] ?? 0;
    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    minLuma = Math.min(minLuma, luma);
    maxLuma = Math.max(maxLuma, luma);
    sum += luma;
    sumSquares += luma * luma;
    if (luma > 72) {
      brightPixels += 1;
    }
  }

  const averageLuma = sum / pixelCount;
  const variance = sumSquares / pixelCount - averageLuma * averageLuma;
  return {
    width: png.width,
    height: png.height,
    minLuma: Number(minLuma.toFixed(3)),
    maxLuma: Number(maxLuma.toFixed(3)),
    averageLuma: Number(averageLuma.toFixed(3)),
    lumaStdDev: Number(Math.sqrt(Math.max(0, variance)).toFixed(3)),
    brightPixelRatio: Number((brightPixels / pixelCount).toFixed(6))
  };
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Expected PNG signature");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = buffer.subarray(dataStart, dataEnd);
    offset = dataEnd + 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8] ?? 0;
      colorType = data[9] ?? 0;
      const compression = data[10] ?? 0;
      const filter = data[11] ?? 0;
      const interlace = data[12] ?? 0;
      if (bitDepth !== 8 || compression !== 0 || filter !== 0 || interlace !== 0) {
        throw new Error("Unsupported PNG encoding for smoke analysis");
      }
      if (colorType !== 2 && colorType !== 6) {
        throw new Error(`Unsupported PNG color type ${colorType}`);
      }
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const stride = width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const pixels = Buffer.alloc(width * height * channels);
  let sourceOffset = 0;
  let previous = Buffer.alloc(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset] ?? 0;
    sourceOffset += 1;
    const row = Buffer.from(inflated.subarray(sourceOffset, sourceOffset + stride));
    sourceOffset += stride;
    unfilterScanline(row, previous, bytesPerPixel, filter);
    row.copy(pixels, y * stride);
    previous = row;
  }

  return { width, height, bitDepth, colorType, pixels };
}

function unfilterScanline(row, previous, bytesPerPixel, filter) {
  for (let index = 0; index < row.length; index += 1) {
    const left = index >= bytesPerPixel ? (row[index - bytesPerPixel] ?? 0) : 0;
    const up = previous[index] ?? 0;
    const upperLeft = index >= bytesPerPixel ? (previous[index - bytesPerPixel] ?? 0) : 0;
    const value = row[index] ?? 0;

    switch (filter) {
      case 0:
        break;
      case 1:
        row[index] = (value + left) & 0xff;
        break;
      case 2:
        row[index] = (value + up) & 0xff;
        break;
      case 3:
        row[index] = (value + Math.floor((left + up) / 2)) & 0xff;
        break;
      case 4:
        row[index] = (value + paeth(left, up, upperLeft)) & 0xff;
        break;
      default:
        throw new Error(`Unsupported PNG filter ${filter}`);
    }
  }
}

function paeth(left, up, upperLeft) {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) {
    return left;
  }
  return upDistance <= upperLeftDistance ? up : upperLeft;
}

function readNumberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function readStringArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  return process.argv[index + 1] ?? fallback;
}
