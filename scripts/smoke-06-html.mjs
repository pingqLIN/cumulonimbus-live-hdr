import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 900);
const height = readIntegerArg(args, "height", 506);
const outputPath = resolve(
  projectRoot,
  args.out ?? join("outputs", "analysis", "mainline-html-smoke.png")
);
rmSync(outputPath, { force: true });

const captureArgs = [
  join(projectRoot, "scripts", "capture-3d-still.mjs"),
  "--source",
  "live",
  "--orientation",
  width >= height ? "landscape" : "portrait",
  "--width",
  String(width),
  "--height",
  String(height),
  "--waitMs",
  String(readIntegerArg(args, "waitMs", 4000)),
  "--browserTimeoutMs",
  String(readIntegerArg(args, "browserTimeoutMs", 90000)),
  "--out",
  outputPath,
  "--preset",
  args.preset ?? "mobile-horizon",
  "--captureFrames",
  args.captureFrames ?? "1",
  "--seed",
  args.seed ?? "574"
];

for (const key of [
  "browser",
  "fps",
  "cameraYawDegrees",
  "cameraPitchDegrees",
  "cameraDistance",
  "cameraDistanceScale",
  "cameraTargetOffsetX",
  "cameraTargetOffsetY",
  "cameraTargetOffsetZ",
  "sunAzimuthDegrees",
  "sunElevationDegrees",
  "sunElevation",
  "sunViewerAngle",
  "sunAngle",
  "sunIntensityScale",
  "sun",
  "sunIntensity",
  "ambient",
  "ambientIntensity",
  "lightContrast",
  "exposureScale",
  "systems",
  "tropopause",
  "freezingLevel",
  "windShear",
  "fbmOctaves",
  "octaves",
  "cloudCurl",
  "curl",
  "horizon",
  "horizonStrength",
  "stepSize",
  "maxSteps",
  "sky",
  "light",
  "photographic",
  "photo",
  "ortho",
  "maxPixels"
]) {
  if (args[key] !== undefined && args[key] !== "") {
    captureArgs.push(`--${key}`, String(args[key]));
  }
}

const capture = spawnSync(process.execPath, captureArgs, {
  cwd: projectRoot,
  encoding: "utf8",
  timeout: readIntegerArg(args, "browserTimeoutMs", 90000) + 15000,
  windowsHide: true
});

if (capture.status !== 0) {
  throw new Error(
    `Cloud-only smoke screenshot failed with exit code ${capture.status}.\n${capture.stderr || capture.stdout}`
  );
}

const result = JSON.parse(capture.stdout);
assert.equal(result.ok, true);
assert.equal(result.png.width, width);
assert.equal(result.png.height, height);
assert.ok(result.analysis.maxLuma > 42, `expected visible cloud highlights, got ${result.analysis.maxLuma}`);
assert.ok(result.analysis.lumaStdDev > 4, `expected non-flat cloud output, got ${result.analysis.lumaStdDev}`);
assert.ok(
  result.analysis.cloudBounds.coverage > 0.01,
  `expected visible cloud coverage, got ${result.analysis.cloudBounds.coverage}`
);

console.log(
  JSON.stringify(
    {
      ok: true,
      outputPath,
      url: result.url,
      bytes: result.bytes,
      processCleanup: result.processCleanup,
      analysis: result.analysis
    },
    null,
    2
  )
);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=", 2);
    const value = inlineValue ?? rawArgs[index + 1];
    if (inlineValue === undefined) {
      index += 1;
    }
    parsed[key] = value;
  }
  return parsed;
}

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}
