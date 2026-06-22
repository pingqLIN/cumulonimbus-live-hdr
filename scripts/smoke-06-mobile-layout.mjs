import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 390);
const height = readIntegerArg(args, "height", 844);
const outputPath = resolve(
  projectRoot,
  args.out ?? join("outputs", "analysis", "mainline-mobile-horizon-smoke.png")
);

const smokeArgs = [
  join(projectRoot, "scripts", "smoke-06-html.mjs"),
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
  args.seed ?? "574",
  "--time",
  args.time ?? "2.2",
  "--maxPixels",
  args.maxPixels ?? String(width * height)
];

for (const key of [
  "browser",
  "systems",
  "windShear",
  "sunElevation",
  "sunViewerAngle",
  "sunAngle",
  "fbmOctaves",
  "octaves",
  "cloudCurl",
  "curl",
  "horizon",
  "horizonStrength",
  "stepSize",
  "maxSteps",
  "staticMaxSteps",
  "compileSteps",
  "shaderSteps",
  "sky",
  "light",
  "debugShaders",
  "shaderDiagnostics"
]) {
  if (args[key] !== undefined && args[key] !== "") {
    smokeArgs.push(`--${key}`, String(args[key]));
  }
}

const smoke = spawnSync(process.execPath, smokeArgs, {
  cwd: projectRoot,
  encoding: "utf8",
  timeout: readIntegerArg(args, "browserTimeoutMs", 90000) + 60000,
  windowsHide: true
});

if (smoke.status !== 0) {
  throw new Error(
    `Mobile single-canvas smoke failed with exit code ${smoke.status}.\n${smoke.stderr || smoke.stdout}`
  );
}

const result = JSON.parse(smoke.stdout);
assert.equal(result.ok, true);
const url = new URL(result.url);
assert.equal(url.searchParams.get("orientation"), "portrait");
assert.equal(url.searchParams.get("simWidth"), String(width));
assert.equal(url.searchParams.get("simHeight"), String(height));
assert.equal(url.searchParams.get("preset"), args.preset ?? "mobile-horizon");
assert.equal(url.searchParams.get("live"), "1");
assert.equal(result.analysis.width, width);
assert.equal(result.analysis.height, height);
assert.ok(result.analysis.maxLuma > 42, `expected visible mobile highlights, got ${result.analysis.maxLuma}`);
assert.ok(result.analysis.lumaStdDev > 4, `expected non-flat mobile output, got ${result.analysis.lumaStdDev}`);
assert.ok(
  result.analysis.cloudBounds.coverage > 0.01,
  `expected visible mobile cloud coverage, got ${result.analysis.cloudBounds.coverage}`
);
assert.ok(
  result.analysis.edgeDetailDensity.averageGradient > 0.5,
  `expected textured mobile cloud detail, got ${result.analysis.edgeDetailDensity.averageGradient}`
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
