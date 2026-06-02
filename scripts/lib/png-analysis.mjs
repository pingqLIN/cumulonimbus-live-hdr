import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

export function analyzePng(path, options = {}) {
  const png = decodePng(readFileSync(path));
  const brightThreshold = options.brightThreshold ?? 72;
  const lumaThreshold = options.lumaThreshold ?? null;
  const channels = png.colorType === 6 ? 4 : 3;
  const pixelCount = png.width * png.height;
  const lumaValues = new Float64Array(pixelCount);
  let minLuma = Number.POSITIVE_INFINITY;
  let maxLuma = Number.NEGATIVE_INFINITY;
  let sum = 0;
  let sumSquares = 0;
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  let brightPixels = 0;

  for (let offset = 0, pixel = 0; offset < png.pixels.length; offset += channels, pixel += 1) {
    const red = png.pixels[offset] ?? 0;
    const green = png.pixels[offset + 1] ?? 0;
    const blue = png.pixels[offset + 2] ?? 0;
    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    lumaValues[pixel] = luma;
    redSum += red;
    greenSum += green;
    blueSum += blue;
    minLuma = Math.min(minLuma, luma);
    maxLuma = Math.max(maxLuma, luma);
    sum += luma;
    sumSquares += luma * luma;
    if (luma > brightThreshold) {
      brightPixels += 1;
    }
  }

  const averageLuma = sum / pixelCount;
  const variance = sumSquares / pixelCount - averageLuma * averageLuma;
  const lumaStdDev = Math.sqrt(Math.max(0, variance));
  const cloudThreshold = lumaThreshold ?? Math.max(32, averageLuma + lumaStdDev * 0.28);
  const cloudBounds = measureBounds(lumaValues, png.width, png.height, cloudThreshold);

  return {
    width: png.width,
    height: png.height,
    minLuma: roundMetric(minLuma),
    maxLuma: roundMetric(maxLuma),
    averageLuma: roundMetric(averageLuma),
    lumaStdDev: roundMetric(lumaStdDev),
    brightPixelRatio: roundMetric(brightPixels / pixelCount, 6),
    cloudThreshold: roundMetric(cloudThreshold),
    averageRgb: {
      red: roundMetric(redSum / pixelCount),
      green: roundMetric(greenSum / pixelCount),
      blue: roundMetric(blueSum / pixelCount)
    },
    edgeDetailDensity: measureEdgeDetail(lumaValues, png.width, png.height, cloudThreshold),
    morphology: measureMorphology(cloudBounds),
    cloudBounds
  };
}

export function decodePng(buffer) {
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
        throw new Error("Unsupported PNG encoding for analysis");
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

function measureBounds(lumaValues, width, height, threshold) {
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const luma = lumaValues[y * width + x] ?? 0;
      if (luma <= threshold) {
        continue;
      }
      count += 1;
      sumX += x;
      sumY += y;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (count === 0) {
    return {
      coverage: 0,
      centroidX: 0.5,
      centroidY: 0.5,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0
    };
  }

  return {
    coverage: roundMetric(count / (width * height), 6),
    centroidX: roundMetric(sumX / count / Math.max(1, width - 1), 6),
    centroidY: roundMetric(sumY / count / Math.max(1, height - 1), 6),
    left: roundMetric(minX / Math.max(1, width - 1), 6),
    top: roundMetric(minY / Math.max(1, height - 1), 6),
    right: roundMetric(maxX / Math.max(1, width - 1), 6),
    bottom: roundMetric(maxY / Math.max(1, height - 1), 6),
    width: roundMetric((maxX - minX + 1) / width, 6),
    height: roundMetric((maxY - minY + 1) / height, 6)
  };
}

function measureEdgeDetail(lumaValues, width, height, threshold) {
  let cloudPixels = 0;
  let edgePixels = 0;
  let gradientSum = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const center = lumaValues[y * width + x] ?? 0;
      if (center <= threshold) {
        continue;
      }
      cloudPixels += 1;
      const gradientX = Math.abs((lumaValues[y * width + x + 1] ?? 0) - (lumaValues[y * width + x - 1] ?? 0));
      const gradientY = Math.abs((lumaValues[(y + 1) * width + x] ?? 0) - (lumaValues[(y - 1) * width + x] ?? 0));
      const gradient = gradientX + gradientY;
      gradientSum += gradient;
      if (gradient >= 20) {
        edgePixels += 1;
      }
    }
  }

  if (cloudPixels === 0) {
    return {
      ratio: 0,
      averageGradient: 0
    };
  }

  return {
    ratio: roundMetric(edgePixels / cloudPixels, 6),
    averageGradient: roundMetric(gradientSum / cloudPixels)
  };
}

function measureMorphology(bounds) {
  const width = Math.max(bounds.width, 0.001);
  const height = Math.max(bounds.height, 0.001);
  const topMass = Math.max(0, 0.34 - bounds.top);
  const bottomReach = bounds.bottom;
  return {
    towerHeightRatio: roundMetric(height / width, 6),
    anvilSpreadRatio: roundMetric(width / height, 6),
    bottomPosition: roundMetric(bottomReach, 6),
    topLift: roundMetric(topMass, 6)
  };
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

function roundMetric(value, digits = 3) {
  return Number(value.toFixed(digits));
}
