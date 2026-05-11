import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defaultCloudParams } from "../dist/core/cloud-field.js";
import { hdrSettingsFromParams, sceneLinearToPq16 } from "../dist/core/hdr.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";
import {
  compareRenderMetrics,
  createMetricsAccumulator,
  finalizeRenderMetrics,
  sampleFrameMetrics,
  writeMetricsJson
} from "../dist/core/metrics.js";

const quick = process.argv.includes("--quick");
const width = readNumberArg("--width", quick ? 180 : 540);
const height = readNumberArg("--height", quick ? 320 : 960);
const fps = readNumberArg("--fps", 30);
const seconds = readNumberArg("--seconds", quick ? 1 : 5);
const frames = Math.max(1, Math.round(fps * seconds));
const outputDir = "outputs";
const framesDir = join(outputDir, "frames");
const outputFile = join(outputDir, quick ? "cumulonimbus-quick-hdr.mp4" : "cumulonimbus-test-hdr.mp4");
const metricsFile = join(outputDir, "metrics", quick ? "cumulonimbus-quick-hdr.json" : "cumulonimbus-test-hdr.json");
const baselinePath = readStringArg("--baseline", "");
const params = {
  ...defaultCloudParams,
  seed: readNumberArg("--seed", defaultCloudParams.seed)
};
const field = new IterativeCloudField(width, height);
const warmupFrames = Math.round(fps * 0.8);
const hdrSettings = hdrSettingsFromParams(params);
const metricsAccumulator = createMetricsAccumulator();
const startedAt = performance.now();
const projectVersion = readProjectVersion();
const sourceDescriptor = `render-test-video:${readGitCommit()}`;

mkdirSync(outputDir, { recursive: true });
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

for (let frame = -warmupFrames; frame < 0; frame += 1) {
  field.step(frame / fps, 1 / fps, params);
}

for (let frame = 0; frame < frames; frame += 1) {
  const time = frame / fps;
  const frameMetrics = field.step(time, 1 / fps, params);
  const ppm = renderPpm16(width, height, params, field, hdrSettings);
  sampleFrameMetrics(field, params, metricsAccumulator, frameMetrics);
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
  `hdr10=1:repeat-headers=1:colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc:master-display=G(13250,34500)B(7500,3000)R(34000,16000)WP(15635,16450)L(${Math.round(params.lightingHdr.masterDisplayPeakNits * 10000)},50):max-cll=${Math.round(params.lightingHdr.maxCll)},400`,
  outputFile
];

const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const renderMetrics = finalizeRenderMetrics(
  {
    mode: quick ? "quick-hdr" : "test-hdr",
    width,
    height,
    fps,
    seconds,
    frames,
    seed: params.seed,
    backend: "cpu"
  },
  params,
  metricsAccumulator,
  performance.now() - startedAt,
  {
    source: sourceDescriptor,
    projectVersion
  }
);
maybeAddComparison(renderMetrics, baselinePath);
writeMetricsJson(metricsFile, renderMetrics);
console.log(`Wrote ${outputFile}`);
console.log(`Wrote ${metricsFile}`);

const comparisonText = extractComparisonText(renderMetrics.comparison);
if (comparisonText) {
  console.log(comparisonText);
}

function renderPpm16(frameWidth, frameHeight, cloudParams, cloudField, encodingSettings) {
  const header = Buffer.from(`P6\n${frameWidth} ${frameHeight}\n65535\n`, "ascii");
  const body = Buffer.alloc(frameWidth * frameHeight * 6);
  let offset = 0;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const pixel = cloudField.samplePixel(x, y, cloudParams);
      write16(body, offset, sceneLinearToPq16(pixel.r, encodingSettings));
      write16(body, offset + 2, sceneLinearToPq16(pixel.g, encodingSettings));
      write16(body, offset + 4, sceneLinearToPq16(pixel.b, encodingSettings));
      offset += 6;
    }
  }

  return Buffer.concat([header, body]);
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

function readStringArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  return process.argv[index + 1] ?? fallback;
}

function readProjectVersion() {
  try {
    const packageData = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    return typeof packageData.version === "string" ? packageData.version : "0.0.0";
  }
  catch {
    return "0.0.0";
  }
}

function readGitCommit() {
  const result = spawnSync("git", ["-C", process.cwd(), "rev-parse", "--short", "HEAD"], {
    encoding: "utf8"
  });
  if (result.status !== 0 || !result.stdout) {
    return "unknown";
  }
  return result.stdout.trim();
}

function maybeAddComparison(renderMetrics, path) {
  if (!path) {
    return;
  }
  if (!existsSync(path)) {
    console.warn(`Baseline metrics missing: ${path}`);
    return;
  }
  const raw = readFileSync(path, "utf8");
  const baseline = JSON.parse(raw);
  if (!baseline || typeof baseline !== "object") {
    console.warn(`Baseline metrics schema mismatch: ${path}`);
    return;
  }
  const comparisonTarget = normalizeBaselineForComparison(baseline, path);
  if (!comparisonTarget) {
    console.warn(`Baseline metrics is missing required fields: ${path}`);
    return;
  }
  comparisonTarget.comparison = undefined;
  renderMetrics.comparison = compareRenderMetrics(renderMetrics, comparisonTarget);
  if (renderMetrics.comparison) {
    renderMetrics.comparison.sourcePath = path;
  }
}

function extractComparisonText(comparison) {
  if (!comparison) {
    return "";
  }
  return [
    "Metrics comparison:",
    `  baseline: ${comparison.sourceRunId} @ ${comparison.sourceGeneratedAt}`,
    `  avgDensity Δ=${formatDelta(comparison.deltas.averageDensity)} rel=${formatPct(comparison.ratios.averageDensity)}`,
    `  edge Δ=${formatDelta(comparison.deltas.activeEdgeRatio)} rel=${formatPct(comparison.ratios.activeEdgeRatio)}`,
    `  peakScene Δ=${formatDelta(comparison.deltas.peakSceneValue)} rel=${formatPct(comparison.ratios.peakSceneValue)}`,
    `  peakNits Δ=${formatDelta(comparison.deltas.peakNits)} rel=${formatPct(comparison.ratios.peakNits)}`
  ].join("\n");
}

function formatDelta(value) {
  return `${value.toFixed(6)}`;
}

function formatPct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function normalizeBaselineForComparison(candidate, sourcePath) {
  if ("metadata" in candidate && candidate?.metadata?.runId) {
    return candidate;
  }

  const fallback = candidate;
  const fallbackRenderConfig = typeof fallback.renderConfig === "object" && fallback.renderConfig !== null ? fallback.renderConfig : {};
  if (
    typeof fallback.averageDensity !== "number" ||
    typeof fallback.activeEdgeRatio !== "number" ||
    typeof fallback.peakSceneValue !== "number" ||
    typeof fallback.peakNits !== "number" ||
    typeof fallback.generatedAt !== "string"
  ) {
    return null;
  }

  return {
    ...fallback,
    metadata: {
      runId: "legacy",
      schemaVersion: "1.0.0",
      projectVersion: "legacy",
      source: sourcePath,
      paramsFingerprint: "legacy",
      paramsFingerprintKey: "legacy"
    },
    renderConfig: {
      ...fallbackRenderConfig,
      backend: "cpu"
    }
  };
}
