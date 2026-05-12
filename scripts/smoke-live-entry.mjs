import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const orientation = readStringArg("--orientation", "portrait");
const width = readNumberArg("--width", orientation === "landscape" ? 480 : 270);
const height = readNumberArg("--height", orientation === "landscape" ? 270 : 480);
const outputPath = resolve(
  projectRoot,
  readStringArg("--out", join("outputs", "analysis", "cumulonimbus-live-entry-smoke.png"))
);

const capture = spawnSync(
  process.execPath,
  [
    join(projectRoot, "scripts", "capture-3d-still.mjs"),
    "--source",
    "live",
    "--look",
    readStringArg("--look", "demo-like"),
    "--simPreset",
    readStringArg("--simPreset", "mid"),
    "--orientation",
    orientation,
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
    `Live entry smoke failed with exit code ${capture.status}.\n${capture.stderr || capture.stdout}`
  );
}

const result = JSON.parse(capture.stdout);
assert.equal(result.ok, true);
assert.match(result.url, /[?&]live=1(?:&|$)/);
assert.match(result.url, new RegExp(`[?&]orientation=${orientation}(?:&|$)`));
assert.doesNotMatch(result.url, /[?&]capture=1(?:&|$)/);
assert.equal(result.png.width, width);
assert.equal(result.png.height, height);
assert.ok(
  result.analysis.maxLuma > 42,
  `expected visible highlights, got ${result.analysis.maxLuma}`
);
assert.ok(
  result.analysis.lumaStdDev > 4,
  `expected non-flat live output, got ${result.analysis.lumaStdDev}`
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
