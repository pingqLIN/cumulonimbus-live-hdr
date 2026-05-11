import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { defaultCloudParams } from "../dist/core/cloud-field.js";
import { hdrSettingsFromParams, sceneLinearToPq16 } from "../dist/core/hdr.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";
import { createCloudPresetParams } from "../dist/core/presets.js";
import {
  createMetricsAccumulator,
  finalizeRenderMetrics,
  sampleFrameMetrics,
  writeMetricsJson
} from "../dist/core/metrics.js";

const fps = readNumberArg("--fps", 30);
const seconds = readNumberArg("--seconds", 60);
const width = readNumberArg("--width", 720);
const height = readNumberArg("--height", 1280);
const driftCycle = readNumberArg("--drift-cycle", 90);
const driftAmount = clamp01(readNumberArg("--drift-amount", 0.35));
const quick = process.argv.includes("--quick");
const outputDir = "outputs";
const framesDir = join(outputDir, "frames");
const outputFile = readStringArg(
  "--output",
  quick ? join(outputDir, "cumulonimbus-demo-loop-quick.mp4") : join(outputDir, "cumulonimbus-demo-loop.mp4")
);
const metricsFile = readStringArg(
  "--metrics",
  quick
    ? join(outputDir, "metrics", "cumulonimbus-demo-loop-quick.json")
    : join(outputDir, "metrics", "cumulonimbus-demo-loop.json")
);
const preset = readStringArg("--preset", "demo");
const seed = readNumberArg("--seed", defaultCloudParams.seed);
const warmupFrames = Math.max(1, Math.round(fps * 0.6));
const frames = Math.max(1, Math.round(seconds * fps));
const totalSeconds = frames / fps;

const baseParams = {
  ...getDemoPreset(preset),
  seed
};
const field = new IterativeCloudField(width, height);
const metricsAccumulator = createMetricsAccumulator();
const startedAt = performance.now();
const projectVersion = readProjectVersion();
const sourceDescriptor = `render-demo-loop:${readGitCommit()}:${preset}`;
let terminalParams = { ...baseParams };

mkdirSync(outputDir, { recursive: true });
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

for (let frame = -warmupFrames; frame < 0; frame += 1) {
  const time = frame / fps;
  const driftedParams = makeDemoDriftParams(baseParams, time, driftCycle, driftAmount);
  field.step(time, 1 / fps, driftedParams);
}

for (let frame = 0; frame < frames; frame += 1) {
  const time = frame / fps;
  const driftedParams = makeDemoDriftParams(baseParams, time, driftCycle, driftAmount);
  const frameMetrics = field.step(time, 1 / fps, driftedParams);
  terminalParams = driftedParams;
  const ppm = renderPpm16(width, height, driftedParams, field);
  sampleFrameMetrics(field, driftedParams, metricsAccumulator, frameMetrics);
  writeFileSync(join(framesDir, `frame_${String(frame).padStart(4, "0")}.ppm`), ppm);
  process.stdout.write(`\rRendered ${frame + 1}/${frames}`);
}
process.stdout.write("\n");

const result = spawnSync("ffmpeg", buildFfmpegArgs(outputFile, width, height, fps, quick, framesDir, baseParams), {
  stdio: "inherit"
});
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const renderMetrics = finalizeRenderMetrics(
  {
    mode: quick ? "demo-loop-quick" : "demo-loop",
    width,
    height,
    fps,
    seconds: totalSeconds,
    frames,
    seed,
    backend: "cpu"
  },
  terminalParams,
  metricsAccumulator,
  performance.now() - startedAt,
  {
    source: sourceDescriptor,
    projectVersion
  }
);

writeMetricsJson(metricsFile, renderMetrics);
console.log(`Wrote ${outputFile}`);
console.log(`Wrote ${metricsFile}`);

function getDemoPreset(presetName) {
  return createCloudPresetParams(presetName, defaultCloudParams.seed);
}

function makeDemoDriftParams(base, time, cycleSeconds, amount) {
  const cycle = (Math.PI * 2 * time) / Math.max(1, cycleSeconds);
  const slow = Math.sin(cycle);
  const slower = Math.sin(cycle * 0.42 + 1.25);
  const phase = Math.sin(cycle * 0.27 - 1.1);
  const stormAge = clamp01(base.stormLifecycle.stormAge + slow * 0.22 * amount);
  const humidity = clamp01(base.humidityUplift.humidity + slower * 0.24 * amount);
  const uplift = clamp01(base.humidityUplift.upliftStrength + phase * 0.22 * amount);
  const windShear = clamp01(base.anvilWind.windShear + slow * 0.22 * amount);
  const anvilOutflow = clamp01(base.anvilWind.anvilOutflow + slower * 0.24 * amount);
  const anvilPersistence = clamp01(base.anvilWind.anvilPersistence + phase * 0.16 * amount);
  const haze = clamp01(base.lightingHdr.haze + slow * 0.16 * amount);
  const sunShift = slower * 150 * amount + slow * 90 * amount;
  const maxSun = Math.max(480, Math.min(1700, base.lightingHdr.sunEdgePeakNits + sunShift));

  return {
    ...base,
    stormLifecycle: {
      ...base.stormLifecycle,
      stormAge,
      phase: stormAge < 0.33 ? "developing" : stormAge > 0.78 ? "dissipating" : "mature"
    },
    humidityUplift: {
      ...base.humidityUplift,
      humidity,
      upliftStrength: uplift,
      condensationRate: clamp01(base.humidityUplift.condensationRate + 0.1 * slow * amount) * 0.7 + 0.1,
      evaporationRate: clamp01(base.humidityUplift.evaporationRate + 0.04 * phase * amount) * 0.85 + 0.02
    },
    anvilWind: {
      ...base.anvilWind,
      windShear,
      anvilOutflow,
      anvilPersistence,
      turbulentEntrainment: clamp01(base.anvilWind.turbulentEntrainment + 0.08 * slower * amount),
      tropopauseHeight: clamp01(base.anvilWind.tropopauseHeight + 0.06 * phase * amount)
    },
    lightingHdr: {
      ...base.lightingHdr,
      haze,
      silverLining: clamp01(base.lightingHdr.silverLining + slower * 0.08 * amount),
      sunEdgePeakNits: maxSun,
      maxCll: maxSun
    }
  };
}

function renderPpm16(frameWidth, frameHeight, cloudParams, cloudField) {
  const header = Buffer.from(`P6\n${frameWidth} ${frameHeight}\n65535\n`, "ascii");
  const body = Buffer.alloc(frameWidth * frameHeight * 6);
  const settings = hdrSettingsFromParams(cloudParams);
  let offset = 0;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const pixel = cloudField.samplePixel(x, y, cloudParams);
      write16(body, offset, sceneLinearToPq16(pixel.r, settings));
      write16(body, offset + 2, sceneLinearToPq16(pixel.g, settings));
      write16(body, offset + 4, sceneLinearToPq16(pixel.b, settings));
      offset += 6;
    }
  }

  return Buffer.concat([header, body]);
}

function buildFfmpegArgs(outputFile, _width, _height, fps, isQuick, frameDir, params) {
  return [
    "-y",
    "-framerate",
    String(fps),
    "-i",
    join(frameDir, "frame_%04d.ppm"),
    "-vf",
    "format=yuv420p10le",
    "-c:v",
    "libx265",
    "-preset",
    isQuick ? "fast" : "slow",
    "-crf",
    isQuick ? "22" : "18",
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

function clamp01(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}
