import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const width = readNumberArg("--width", 120);
const height = readNumberArg("--height", 213);
const waitMs = readNumberArg("--waitMs", 1500);
const outputDir = resolve(
  projectRoot,
  readStringArg("--output-dir", join("outputs", "analysis", "3d-looks-smoke"))
);
const referencePath = readStringArg("--reference", "");
const reportArgs = [
  join(projectRoot, "scripts", "report-3d-looks.mjs"),
  "--width",
  String(width),
  "--height",
  String(height),
  "--waitMs",
  String(waitMs),
  "--output-dir",
  outputDir
];
if (referencePath) {
  reportArgs.push("--reference", referencePath);
}

const report = spawnSync(process.execPath, reportArgs, {
  cwd: projectRoot,
  encoding: "utf8"
});

if (report.status !== 0) {
  throw new Error(
    `3D looks smoke failed with exit code ${report.status}.\n${report.stderr || report.stdout}`
  );
}

const reportPath = join(outputDir, "report.json");
const reportJson = JSON.parse(readFileSync(reportPath, "utf8"));
assert.equal(reportJson.ok, true);
assert.equal(reportJson.width, width);
assert.equal(reportJson.height, height);
assert.equal(reportJson.results.length, 3);
assert.equal(reportJson.scoreSummary.referenceAvailable, Boolean(reportJson.reference));

for (const result of reportJson.results) {
  assert.equal(result.analysis.width, width);
  assert.equal(result.analysis.height, height);
  assert.ok(result.analysis.maxLuma > 42, `${result.look} should have visible highlights`);
  assert.ok(result.analysis.lumaStdDev > 4, `${result.look} should not be flat`);
  assert.ok(result.analysis.brightPixelRatio > 0.001, `${result.look} should have bright pixels`);
  assert.ok(
    result.analysis.cloudBounds.coverage > 0.02,
    `${result.look} should have cloud coverage`
  );
}

if (reportJson.reference) {
  assert.ok(reportJson.bestLook, "reference-backed report should choose a best look");
  assert.ok(Number.isFinite(reportJson.scoreSummary.bestReferenceScore));
  assert.ok(Number.isFinite(reportJson.scoreSummary.scoreSpread));
  assert.ok(reportJson.scoreSummary.scoreSpread >= 0);
} else {
  assert.equal(reportJson.bestLook, null);
  assert.equal(reportJson.scoreSummary.bestReferenceScore, null);
  assert.equal(reportJson.scoreSummary.scoreSpread, null);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      reportPath,
      bestLook: reportJson.bestLook,
      scoreSummary: reportJson.scoreSummary
    },
    null,
    2
  )
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
