import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defaultCloudParams } from "../dist/core/cloud-field.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";

const quick = process.argv.includes("--quick");
const width = readNumberArg("--width", quick ? 180 : 540);
const height = readNumberArg("--height", quick ? 320 : 960);
const fps = readNumberArg("--fps", 30);
const seconds = readNumberArg("--seconds", quick ? 1 : 5);
const frames = Math.max(1, Math.round(fps * seconds));
const outputDir = "outputs";
const framesDir = join(outputDir, "frames");
const outputFile = join(outputDir, quick ? "cumulonimbus-quick-hdr.mp4" : "cumulonimbus-test-hdr.mp4");
const params = {
  ...defaultCloudParams,
  seed: readNumberArg("--seed", defaultCloudParams.seed)
};
const field = new IterativeCloudField(width, height);
const warmupFrames = Math.round(fps * 0.8);

mkdirSync(outputDir, { recursive: true });
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

for (let frame = -warmupFrames; frame < 0; frame += 1) {
  field.step(frame / fps, 1 / fps, params);
}

for (let frame = 0; frame < frames; frame += 1) {
  const time = frame / fps;
  field.step(time, 1 / fps, params);
  const ppm = renderPpm16(width, height, params, field);
  writeFileSync(join(framesDir, `frame_${String(frame).padStart(4, "0")}.ppm`), ppm);
  process.stdout.write(`\rRendered ${frame + 1}/${frames}`);
}
process.stdout.write("\n");

const ffmpegArgs = [
  "-y",
  "-framerate",
  String(fps),
  "-i",
  join(framesDir, "frame_%04d.ppm"),
  "-vf",
  "format=yuv420p10le",
  "-c:v",
  "libx265",
  "-preset",
  quick ? "fast" : "slow",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p10le",
  "-color_primaries",
  "bt2020",
  "-color_trc",
  "smpte2084",
  "-colorspace",
  "bt2020nc",
  "-x265-params",
  "hdr10=1:repeat-headers=1:colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc:master-display=G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(10000000,50):max-cll=1000,400",
  outputFile
];

const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Wrote ${outputFile}`);

function renderPpm16(frameWidth, frameHeight, cloudParams, cloudField) {
  const header = Buffer.from(`P6\n${frameWidth} ${frameHeight}\n65535\n`, "ascii");
  const body = Buffer.alloc(frameWidth * frameHeight * 6);
  let offset = 0;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const pixel = cloudField.samplePixel(x, y, cloudParams);
      write16(body, offset, encodeHdr(pixel.r));
      write16(body, offset + 2, encodeHdr(pixel.g));
      write16(body, offset + 4, encodeHdr(pixel.b));
      offset += 6;
    }
  }

  return Buffer.concat([header, body]);
}

function encodeHdr(value) {
  return Math.round(Math.min(1, Math.max(0, value / 4)) * 65535);
}

function write16(buffer, offset, value) {
  buffer[offset] = (value >> 8) & 0xff;
  buffer[offset + 1] = value & 0xff;
}

function readNumberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) ? value : fallback;
}
