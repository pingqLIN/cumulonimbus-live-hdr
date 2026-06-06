import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzePng } from "./lib/png-analysis.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(projectRoot, readStringArg("--output-dir", join("outputs", "analysis", "photographic-cb")));
const reportPath = resolve(outputDir, "reference-match-report.json");
const width = readNumberArg("--width", 900);
const height = readNumberArg("--height", 506);
const waitMs = readNumberArg("--waitMs", 7000);

const references = [
  {
    archetype: "daylight-mature-landscape",
    path: resolve(projectRoot, "references", "images", "reference_landscape_cumulonimbus.png")
  },
  {
    archetype: "portrait-tower-close",
    path: resolve(projectRoot, "references", "images", "reference_portrait_cumulonimbus.png")
  },
  {
    archetype: "warm-ocean-anvil",
    path: resolve(projectRoot, "references", "videos", "cumulonimbus_cloud_simulationmp_frames", "frame_03.png")
  },
  {
    archetype: "blue-sky-airfield",
    path: resolve(projectRoot, "references", "videos", "cumulonimbus_cloud_simulationmp_frames", "frame_04.png")
  }
].filter((reference) => existsSync(reference.path));

const captures = [
  {
    name: "landscape-front",
    archetype: "daylight-mature-landscape",
    outputPath: resolve(outputDir, "photographic-cb-landscape-front.png"),
    args: {
      width,
      height,
      controls: 0,
      hud: 0,
      grid: 0,
      ortho: 0,
      cameraYawDegrees: 0,
      cameraPitchDegrees: 0,
      cameraDistance: 34,
      systems: 3,
      preset: "photographic-mature",
      style: "photographic-cb"
    }
  },
  {
    name: "landscape-side",
    archetype: "warm-ocean-anvil",
    outputPath: resolve(outputDir, "photographic-cb-landscape-side.png"),
    args: {
      width,
      height,
      controls: 0,
      hud: 0,
      grid: 0,
      ortho: 0,
      cameraYawDegrees: 90,
      cameraPitchDegrees: 24,
      cameraDistance: 42,
      systems: 3,
      preset: "warm-low-angle",
      style: "photographic-cb"
    }
  },
  {
    name: "portrait-front",
    archetype: "portrait-tower-close",
    outputPath: resolve(outputDir, "photographic-cb-portrait-front.png"),
    args: {
      width: 360,
      height: 640,
      controls: 0,
      hud: 0,
      grid: 0,
      ortho: 0,
      viewport: "portrait",
      systems: 3,
      preset: "photographic-mature",
      style: "photographic-cb"
    }
  },
  {
    name: "high-sun-daylight",
    archetype: "blue-sky-airfield",
    outputPath: resolve(outputDir, "photographic-cb-daylight.png"),
    args: {
      width,
      height,
      controls: 0,
      hud: 0,
      grid: 0,
      ortho: 0,
      cameraYawDegrees: 0,
      cameraPitchDegrees: 0,
      cameraDistance: 30,
      systems: 3,
      preset: "high-sun-daylight",
      style: "photographic-cb"
    }
  }
];

mkdirSync(outputDir, { recursive: true });

const referenceAnalyses = references.map((reference) => ({
  ...reference,
  analysis: analyzePng(reference.path)
}));

const results = captures.map((capture) => {
  runCapture(capture);
  const analysis = analyzePng(capture.outputPath);
  const reference = referenceAnalyses.find((item) => item.archetype === capture.archetype) ?? null;
  const score = reference ? scoreAgainstReference(reference.analysis, analysis) : null;
  return {
    name: capture.name,
    archetype: capture.archetype,
    outputPath: capture.outputPath,
    referencePath: reference?.path ?? null,
    score,
    gaps: reference ? rankGaps(reference.analysis, analysis) : [],
    analysis
  };
});

const rankedCandidates = [...results].sort((left, right) => {
  if (left.score === null) return 1;
  if (right.score === null) return -1;
  return left.score.total - right.score.total;
});

const report = {
  ok: true,
  generatedAt: new Date().toISOString(),
  advisory: true,
  note:
    "Metrics are used to guide visual review. They are not a pixel-match acceptance target and do not replace smoke tests.",
  referenceAvailable: referenceAnalyses.length > 0,
  outputDir,
  captures: results,
  rankedCandidates: rankedCandidates.map((result) => ({
    name: result.name,
    archetype: result.archetype,
    outputPath: result.outputPath,
    referencePath: result.referencePath,
    totalScore: result.score?.total ?? null,
    largestGaps: result.gaps.slice(0, 4)
  }))
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ok: true, reportPath, rankedCandidates: report.rankedCandidates }, null, 2));

function runCapture(capture) {
  const args = [
    join(projectRoot, "scripts", "smoke-06-html.mjs"),
    "--browserTimeoutMs",
    "70000",
    "--waitMs",
    String(waitMs),
    "--out",
    capture.outputPath
  ];

  for (const [key, value] of Object.entries(capture.args)) {
    args.push(`--${key}`, String(value));
  }

  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: "utf8",
    timeout: 90000,
    windowsHide: true
  });

  if (result.status !== 0) {
    throw new Error(`Capture failed for ${capture.name}: ${result.stderr || result.stdout}`);
  }
}

function scoreAgainstReference(referenceAnalysis, candidateAnalysis) {
  const gaps = rankGaps(referenceAnalysis, candidateAnalysis);
  const total = gaps.reduce((sum, gap) => sum + gap.weightedDelta, 0);
  return {
    total: Number(total.toFixed(6)),
    components: gaps
  };
}

function rankGaps(referenceAnalysis, candidateAnalysis) {
  const referenceBounds = referenceAnalysis.cloudBounds;
  const candidateBounds = candidateAnalysis.cloudBounds;
  const metrics = [
    ["coverage", referenceBounds.coverage, candidateBounds.coverage, 2.0],
    ["towerHeightRatio", referenceAnalysis.morphology.towerHeightRatio, candidateAnalysis.morphology.towerHeightRatio, 1.35],
    ["anvilSpreadRatio", referenceAnalysis.morphology.anvilSpreadRatio, candidateAnalysis.morphology.anvilSpreadRatio, 1.1],
    ["bottomPosition", referenceAnalysis.morphology.bottomPosition, candidateAnalysis.morphology.bottomPosition, 1.5],
    ["brightPixelRatio", referenceAnalysis.brightPixelRatio, candidateAnalysis.brightPixelRatio, 2.0],
    ["lumaStdDev", referenceAnalysis.lumaStdDev, candidateAnalysis.lumaStdDev, 0.018],
    ["edgeDetailDensity", referenceAnalysis.edgeDetailDensity.ratio, candidateAnalysis.edgeDetailDensity.ratio, 1.6],
    ["averageBlue", referenceAnalysis.averageRgb.blue, candidateAnalysis.averageRgb.blue, 0.008],
    ["averageRed", referenceAnalysis.averageRgb.red, candidateAnalysis.averageRgb.red, 0.006]
  ];

  return metrics
    .map(([metric, referenceValue, candidateValue, weight]) => ({
      metric,
      referenceValue,
      candidateValue,
      delta: Number(Math.abs(referenceValue - candidateValue).toFixed(6)),
      weightedDelta: Number((Math.abs(referenceValue - candidateValue) * weight).toFixed(6))
    }))
    .sort((left, right) => right.weightedDelta - left.weightedDelta);
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
