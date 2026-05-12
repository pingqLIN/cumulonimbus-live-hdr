import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzePng } from "./lib/png-analysis.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const looks = readStringArg("--looks", "structural,demo-like,soft-volumetric-ish")
  .split(",")
  .map((look) => look.trim())
  .filter(Boolean);
const width = readNumberArg("--width", 270);
const height = readNumberArg("--height", 480);
const waitMs = readNumberArg("--waitMs", 4000);
const simPreset = readStringArg("--simPreset", "mid");
const referencePath = resolve(
  projectRoot,
  readStringArg("--reference", join("outputs", "analysis", "demo_mid.png"))
);
const outputDir = resolve(
  projectRoot,
  readStringArg("--output-dir", join("outputs", "analysis", "3d-looks"))
);
const reportPath = resolve(outputDir, "report.json");

mkdirSync(outputDir, { recursive: true });

const reference = existsSync(referencePath)
  ? {
      path: referencePath,
      analysis: analyzePng(referencePath)
    }
  : null;

const results = looks.map((look) => {
  const outputPath = join(outputDir, `${look}.png`);
  runCapture(look, outputPath);
  const analysis = analyzePng(outputPath);
  return {
    look,
    outputPath,
    analysis,
    referenceScore: reference ? scoreAgainstReference(reference.analysis, analysis) : null
  };
});

const ranked = [...results].sort((left, right) => {
  const leftScore = left.referenceScore ?? Number.POSITIVE_INFINITY;
  const rightScore = right.referenceScore ?? Number.POSITIVE_INFINITY;
  return leftScore - rightScore;
});

const report = {
  ok: true,
  generatedAt: new Date().toISOString(),
  width,
  height,
  waitMs,
  simPreset,
  reference,
  bestLook: ranked[0]?.look ?? null,
  results
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ok: true, reportPath, bestLook: report.bestLook, results }, null, 2));

function runCapture(look, outputPath) {
  const result = spawnSync(
    process.execPath,
    [
      join(projectRoot, "scripts", "capture-3d-still.mjs"),
      "--look",
      look,
      "--simPreset",
      simPreset,
      "--width",
      String(width),
      "--height",
      String(height),
      "--waitMs",
      String(waitMs),
      "--out",
      outputPath
    ],
    {
      cwd: projectRoot,
      encoding: "utf8"
    }
  );

  if (result.status !== 0) {
    throw new Error(`Capture failed for ${look}: ${result.stderr || result.stdout}`);
  }
}

function scoreAgainstReference(referenceAnalysis, candidateAnalysis) {
  const referenceBounds = referenceAnalysis.cloudBounds;
  const candidateBounds = candidateAnalysis.cloudBounds;
  const score =
    weightedAbs(referenceAnalysis.averageLuma, candidateAnalysis.averageLuma, 0.006) +
    weightedAbs(referenceAnalysis.lumaStdDev, candidateAnalysis.lumaStdDev, 0.014) +
    weightedAbs(referenceAnalysis.brightPixelRatio, candidateAnalysis.brightPixelRatio, 1.8) +
    weightedAbs(referenceBounds.coverage, candidateBounds.coverage, 1.6) +
    weightedAbs(referenceBounds.centroidX, candidateBounds.centroidX, 0.7) +
    weightedAbs(referenceBounds.centroidY, candidateBounds.centroidY, 1.6) +
    weightedAbs(referenceBounds.width, candidateBounds.width, 0.9) +
    weightedAbs(referenceBounds.height, candidateBounds.height, 1.2);
  return Number(score.toFixed(6));
}

function weightedAbs(left, right, weight) {
  return Math.abs(left - right) * weight;
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
