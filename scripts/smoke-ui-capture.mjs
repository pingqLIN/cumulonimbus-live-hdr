import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const orientation = readStringArg("--orientation", "portrait");
const width = readNumberArg("--width", orientation === "landscape" ? 960 : 800);
const height = readNumberArg("--height", orientation === "landscape" ? 540 : 600);
const outputPath = resolve(
  projectRoot,
  readStringArg("--out", join("outputs", "analysis", "cumulonimbus-ui-capture-smoke.png"))
);

const capture = spawnSync(
  process.execPath,
  [
    join(projectRoot, "scripts", "capture-3d-still.mjs"),
    "--source",
    "ui",
    "--view",
    readStringArg("--view", "3d"),
    "--look",
    readStringArg("--look", "demo-like"),
    "--simPreset",
    readStringArg("--simPreset", "low"),
    "--orientation",
    orientation,
    "--width",
    String(width),
    "--height",
    String(height),
    "--waitMs",
    String(readNumberArg("--waitMs", 4000)),
    "--captureFrames",
    String(readNumberArg("--captureFrames", 12)),
    "--out",
    outputPath
  ],
  {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true
  }
);

if (capture.status !== 0) {
  throw new Error(
    `UI capture smoke failed with exit code ${capture.status}.\n${capture.stderr || capture.stdout}`
  );
}

const result = JSON.parse(capture.stdout);
assert.equal(result.ok, true);
assert.match(result.url, /[?&]view=3d(?:&|$)/);
assert.match(result.url, /[?&]look=demo-like(?:&|$)/);
assert.match(result.url, new RegExp(`[?&]orientation=${orientation}(?:&|$)`));
assert.doesNotMatch(result.url, /[?&]capture=1(?:&|$)/);
assert.doesNotMatch(result.url, /[?&]live=1(?:&|$)/);
assert.ok(
  result.png.width > 0 && result.png.width <= width,
  `expected UI canvas width to be within 1..${width}, got ${result.png.width}`
);
assert.ok(
  result.png.height > 0 && result.png.height <= height,
  `expected UI canvas height to be within 1..${height}, got ${result.png.height}`
);
assert.ok(
  result.analysis.maxLuma > 42,
  `expected visible UI highlights, got ${result.analysis.maxLuma}`
);
assert.ok(
  result.analysis.lumaStdDev > 4,
  `expected non-flat UI capture, got ${result.analysis.lumaStdDev}`
);
assert.ok(
  result.analysis.brightPixelRatio > 0.001,
  `expected bright UI/cloud pixels, got ratio ${result.analysis.brightPixelRatio}`
);

console.log(
  JSON.stringify({ ok: true, outputPath, url: result.url, analysis: result.analysis }, null, 2)
);

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
