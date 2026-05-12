import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzePng } from "./lib/png-analysis.mjs";

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
