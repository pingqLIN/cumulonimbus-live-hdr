import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defaultCloudParams, tonemapSdr } from "../dist/core/cloud-field.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";
import { createCloudPresetParams } from "../dist/core/presets.js";

const referencePath = readStringArg("--reference", "demo.mov");
const referenceTime = readNumberArg("--reference-time", 2.5);
const referenceTimesArg = readStringArg("--reference-times", String(referenceTime));
const referenceTimeWeightsArg = readStringArg("--reference-time-weights", "");
const width = readNumberArg("--width", 96);
const height = readNumberArg("--height", 192);
const fps = readNumberArg("--fps", 30);
const frames = readNumberArg("--frames", 36);
const samples = readNumberArg("--samples", 48);
const seed = readNumberArg("--seed", defaultCloudParams.seed);
const localSearch = hasArg("--local-search");
const localPerturb = readNumberArg("--local-perturb", 0.06);
const localCenterPreset = readStringArg("--local-center", "billow-v1");
const referenceTimesWeight = readNumberArg("--reference-times-weight", 1);
const outputDir = readStringArg("--output-dir", "outputs/analysis/tuning");
const startedAt = performance.now();

mkdirSync(outputDir, { recursive: true });

const referenceTimes = parseReferenceTimes(referenceTimesArg, referenceTime);
const referenceTimeWeights = normalizeReferenceWeights(parseReferenceWeights(referenceTimeWeightsArg), referenceTimes.length);
const referenceFrames = referenceTimes.map((time) => extractReferenceImage(referencePath, time, width, height));
const referenceFeatures = aggregateFeatures(referenceFrames.map(measureImage));
const referenceTargets = buildReferenceTargets(referenceTimes, frames, referenceTimeWeights, referenceTimesWeight);
const candidates = buildCandidates(samples, seed, localSearch, localCenterPreset, localPerturb);
const results = [];

const referencePpm = join(outputDir, "reference.ppm");
writePpm8(referencePpm, width, height, averageFrames(referenceFrames));
convertPpmToPng(referencePpm, join(outputDir, "reference.png"));

for (let index = 0; index < candidates.length; index += 1) {
  const candidate = candidates[index];
  const evaluation = evaluateCandidate(candidate.params, width, height, fps, frames, referenceTargets);
  const score = scoreFeatures(referenceFeatures, evaluation.features);
  results.push({
    rank: 0,
    label: candidate.label,
    score,
    features: evaluation.features,
    params: candidate.params
  });
  process.stdout.write(`\rTuned ${index + 1}/${candidates.length}`);
}
process.stdout.write("\n");

results.sort((left, right) => left.score - right.score);
for (let index = 0; index < results.length; index += 1) {
  results[index].rank = index + 1;
}

const top = results.slice(0, Math.min(5, results.length));
for (const result of top) {
  const evaluation = evaluateCandidate(result.params, width, height, fps, frames, referenceTargets);
  const base = `candidate-${String(result.rank).padStart(2, "0")}-${slug(result.label)}`;
  const ppmPath = join(outputDir, `${base}.ppm`);
  writePpm8(ppmPath, width, height, evaluation.image);
  convertPpmToPng(ppmPath, join(outputDir, `${base}.png`));
}

const report = {
  ok: true,
  generatedAt: new Date().toISOString(),
  durationMs: performance.now() - startedAt,
  reference: {
    path: referencePath,
    timeSeconds: referenceTime,
    referenceTimes,
    width,
    height,
    features: referenceFeatures
  },
  search: {
    samples: candidates.length,
    frames,
    fps,
    seed,
    localSearch,
    localPerturb,
    localCenterPreset,
    referenceTimesWeight
  },
  verdict: makeVerdict(results[0]),
  top
};

writeJson(join(outputDir, "report.json"), report);
console.log(`Best score: ${results[0]?.score.toFixed(4) ?? "n/a"} (${results[0]?.label ?? "none"})`);
console.log(`Verdict: ${report.verdict}`);
console.log(`Wrote ${join(outputDir, "report.json")}`);

function evaluateCandidate(params, frameWidth, frameHeight, renderFps, frameCount, referenceTargets) {
  const field = new IterativeCloudField(frameWidth, frameHeight);
  const targets = referenceTargets ?? [];
  const sampled = [];
  const sampledFeatures = [];
  const frameFeatureMap = new Map();
  const shouldSampleAll = targets.length > 0;
  for (let frame = 0; frame < frameCount; frame += 1) {
    field.step(frame / renderFps, 1 / renderFps, params);
    const needsSample = shouldSampleAll || frame % Math.max(1, Math.floor(frameCount / 4)) === 0 || frame === frameCount - 1;
    if (needsSample) {
      const pixels = renderFrameToRgb(field, frameWidth, frameHeight, params);
      sampled.push(pixels);
      const measured = measureImage(pixels);
      sampledFeatures.push(measured);
      frameFeatureMap.set(frame, measured);
    }
  }

  const features = targets.length > 0
    ? aggregateWeightedFeatures(frameFeatureMap, targets)
    : aggregateFeatures(sampledFeatures);

  return {
    image: sampled[sampled.length - 1],
    features
  };
}

function renderFrameToRgb(field, frameWidth, frameHeight, params) {
  const pixels = new Uint8Array(frameWidth * frameHeight * 3);
  let offset = 0;
  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const pixel = field.samplePixel(x, y, params);
      pixels[offset] = Math.round(tonemapSdr(pixel.r) * 255);
      pixels[offset + 1] = Math.round(tonemapSdr(pixel.g) * 255);
      pixels[offset + 2] = Math.round(tonemapSdr(pixel.b) * 255);
      offset += 3;
    }
  }
  return pixels;
}

function extractReferenceImage(path, timeSeconds, frameWidth, frameHeight) {
  const result = spawnSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-ss",
      String(timeSeconds),
      "-i",
      path,
      "-frames:v",
      "1",
      "-vf",
      `scale=${frameWidth}:${frameHeight}`,
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgb24",
      "pipe:1"
    ],
    { encoding: "buffer", maxBuffer: frameWidth * frameHeight * 8 }
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed to extract ${path}: ${String(result.stderr)}`);
  }
  if (result.stdout.length !== frameWidth * frameHeight * 3) {
    throw new Error(`Unexpected reference frame size: ${result.stdout.length}`);
  }
  return new Uint8Array(result.stdout);
}

function averageFrames(frames) {
  const [first] = frames;
  if (!first) {
    return new Uint8Array();
  }
  const count = frames.length;
  const average = new Float64Array(first.length);

  for (const frame of frames) {
    for (let index = 0; index < frame.length; index += 1) {
      average[index] += frame[index] ?? 0;
    }
  }
  for (let index = 0; index < average.length; index += 1) {
    average[index] /= count;
  }

  const output = new Uint8Array(average.length);
  for (let index = 0; index < average.length; index += 1) {
    output[index] = Math.round(average[index]);
  }
  return output;
}

function parseReferenceTimes(raw, fallbackSeconds) {
  if (!raw || raw.trim() === "") {
    return [fallbackSeconds];
  }
  const parsed = raw
    .split(",")
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((left, right) => left - right);
  if (parsed.length > 0) {
    return parsed;
  }
  return [fallbackSeconds];
}

function measureImage(pixels) {
  const luminance = new Float64Array(width * height);
  for (let index = 0, pixel = 0; index < pixels.length; index += 3, pixel += 1) {
    luminance[pixel] = (0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2]) / 255;
  }

  const sorted = Array.from(luminance).sort((left, right) => left - right);
  const p20 = quantile(sorted, 0.2);
  const p45 = quantile(sorted, 0.45);
  const p90 = quantile(sorted, 0.9);
  const threshold = Math.max(p45, p20 + (p90 - p20) * 0.42);
  const mask = new Uint8Array(width * height);
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  const bands = new Array(8).fill(0);
  const bandTotals = new Array(8).fill(0);
  let edgeTransitions = 0;
  let mean = 0;

  for (let y = 0; y < height; y += 1) {
    const band = Math.min(bands.length - 1, Math.floor((y / height) * bands.length));
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const value = luminance[index];
      mean += value;
      bandTotals[band] += 1;
      if (value >= threshold) {
        mask[index] = 1;
        count += 1;
        sumX += x / (width - 1);
        sumY += y / (height - 1);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        bands[band] += 1;
      }
    }
  }

  for (let y = 1; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      const index = y * width + x;
      if (mask[index] !== mask[index - 1] || mask[index] !== mask[index - width]) {
        edgeTransitions += 1;
      }
    }
  }

  mean /= luminance.length;
  const coverage = count / luminance.length;
  const normalizedBands = bands.map((value, index) => value / bandTotals[index]);
  return {
    threshold,
    coverage,
    meanLuma: mean,
    p90Luma: p90,
    centroidX: count > 0 ? sumX / count : 0.5,
    centroidY: count > 0 ? sumY / count : 0.5,
    bbox: {
      left: count > 0 ? minX / (width - 1) : 0,
      top: count > 0 ? minY / (height - 1) : 0,
      right: count > 0 ? maxX / (width - 1) : 0,
      bottom: count > 0 ? maxY / (height - 1) : 0
    },
    edgeRatio: edgeTransitions / luminance.length,
    topCoverage: normalizedBands.slice(0, 3).reduce((sum, value) => sum + value, 0) / 3,
    lowerCoverage: normalizedBands.slice(4).reduce((sum, value) => sum + value, 0) / 4,
    bands: normalizedBands
  };
}

function aggregateFeatures(features) {
  const count = features.length;
  if (count === 0) {
    return {
      threshold: 0,
      coverage: 0,
      meanLuma: 0,
      p90Luma: 0,
      centroidX: 0,
      centroidY: 0,
      bbox: { left: 0, top: 0, right: 0, bottom: 0 },
      edgeRatio: 0,
      topCoverage: 0,
      lowerCoverage: 0,
      bands: []
    };
  }

  const aggregated = {
    threshold: 0,
    coverage: 0,
    meanLuma: 0,
    p90Luma: 0,
    centroidX: 0,
    centroidY: 0,
    bbox: { left: 0, top: 0, right: 0, bottom: 0 },
    edgeRatio: 0,
    topCoverage: 0,
    lowerCoverage: 0,
    bands: new Array(features[0]?.bands.length ?? 0).fill(0)
  };

  for (const feature of features) {
    aggregated.threshold += feature.threshold;
    aggregated.coverage += feature.coverage;
    aggregated.meanLuma += feature.meanLuma;
    aggregated.p90Luma += feature.p90Luma;
    aggregated.centroidX += feature.centroidX;
    aggregated.centroidY += feature.centroidY;
    aggregated.bbox.left += feature.bbox.left;
    aggregated.bbox.top += feature.bbox.top;
    aggregated.bbox.right += feature.bbox.right;
    aggregated.bbox.bottom += feature.bbox.bottom;
    aggregated.edgeRatio += feature.edgeRatio;
    aggregated.topCoverage += feature.topCoverage;
    aggregated.lowerCoverage += feature.lowerCoverage;
    for (let index = 0; index < feature.bands.length; index += 1) {
      aggregated.bands[index] += feature.bands[index] ?? 0;
    }
  }

  aggregated.threshold /= count;
  aggregated.coverage /= count;
  aggregated.meanLuma /= count;
  aggregated.p90Luma /= count;
  aggregated.centroidX /= count;
  aggregated.centroidY /= count;
  aggregated.bbox.left /= count;
  aggregated.bbox.top /= count;
  aggregated.bbox.right /= count;
  aggregated.bbox.bottom /= count;
  aggregated.edgeRatio /= count;
  aggregated.topCoverage /= count;
  aggregated.lowerCoverage /= count;
  aggregated.bands = aggregated.bands.map((value) => value / count);
  return aggregated;
}

function scoreFeatures(reference, candidate) {
  return (
    weightedAbs(reference.coverage, candidate.coverage, 1.8) +
    weightedAbs(reference.centroidX, candidate.centroidX, 0.6) +
    weightedAbs(reference.centroidY, candidate.centroidY, 2.2) +
    weightedAbs(reference.bbox.top, candidate.bbox.top, 2.4) +
    weightedAbs(reference.bbox.bottom, candidate.bbox.bottom, 1.2) +
    weightedAbs(reference.topCoverage, candidate.topCoverage, 2.2) +
    weightedAbs(reference.lowerCoverage, candidate.lowerCoverage, 1.8) +
    weightedAbs(reference.edgeRatio, candidate.edgeRatio, 1.2) +
    bandDistance(reference.bands, candidate.bands, 1.2)
  );
}

function buildCandidates(count, baseSeed, isLocalSearch, localPresetName, localPerturb) {
  const candidates = [
    {
      label: "billow-preset",
      params: createCloudPresetParams("billow", baseSeed)
    },
    {
      label: "current-default",
      params: cloneParams(defaultCloudParams, baseSeed)
    },
    {
      label: "low-anvil-high-humidity",
      params: makeParams(baseSeed, 0.64, 0.94, 0.86, 0.04, 0.08, 0.88, 0.36, 0.5, 0.58, 0.38)
    },
    {
      label: "bottom-billow-bias",
      params: makeParams(baseSeed, 0.72, 0.98, 0.95, 0.02, 0.02, 0.92, 0.28, 0.42, 0.76, 0.3)
    },
    {
      label: "mature-tower",
      params: makeParams(baseSeed, 0.78, 0.86, 0.9, 0.08, 0.14, 0.8, 0.48, 0.58, 0.68, 0.42)
    },
    {
      label: "billow-v1",
      params: createCloudPresetParams("billow-v1", baseSeed)
    }
  ];

  if (isLocalSearch) {
    const center = cloneParams(createCloudPresetParams(localPresetName, baseSeed), baseSeed);
    const nextRandom = makePrng(baseSeed);
    let localIndex = 1;
    while (candidates.length < count) {
      candidates.push({
        label: `local-${String(localIndex).padStart(2, "0")}`,
        params: perturbParams(center, nextRandom, localPerturb)
      });
      localIndex += 1;
    }
    return candidates.slice(0, count);
  }

  let state = hashSeed(baseSeed);
  while (candidates.length < count) {
    const random = () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 0xffffffff;
    };
    const stormAge = mixRange(0.42, 0.92, random());
    const humidity = mixRange(0.68, 1, random());
    const uplift = mixRange(0.52, 1, random());
    const windShear = Math.pow(random(), 2) * 0.32;
    const anvilOutflow = Math.pow(random(), 2.2) * 0.52;
    const anvilPersistence = mixRange(0.54, 0.96, random());
    const tropopause = mixRange(0.24, 0.78, random());
    const turbulent = mixRange(0.26, 0.82, random());
    const silver = mixRange(0.42, 0.88, random());
    const haze = mixRange(0.08, 0.54, random());
    const morphology = {
      lobeScale: mixRange(0.35, 0.95, random()),
      lobeSharpness: mixRange(0.5, 1, random()),
      microBillowScale: mixRange(0.4, 1, random()),
      edgeScallop: mixRange(0.2, 0.78, random()),
      shadowDepth: mixRange(0.45, 1, random()),
      baseDeckHeight: mixRange(0.28, 0.78, random()),
      towerCrownHeight: mixRange(0.34, 0.76, random()),
      skyDarkness: mixRange(0.3, 0.82, random()),
      starterBlend: mixRange(0.6, 1.0, random())
    };
    candidates.push({
      label: `trial-${String(candidates.length + 1).padStart(2, "0")}`,
      params: makeParams(
        baseSeed,
        stormAge,
        humidity,
        uplift,
        windShear,
        anvilOutflow,
        anvilPersistence,
        tropopause,
        turbulent,
        silver,
        haze,
        morphology
      )
    });
  }

  return candidates;
}

function makeParams(
  paramSeed,
  stormAge,
  humidity,
  uplift,
  windShear,
  anvilOutflow,
  anvilPersistence,
  tropopause,
  turbulent,
  silver,
  haze,
  billowMorphology
) {
  const params = cloneParams(defaultCloudParams, paramSeed);
  params.stormLifecycle.stormAge = stormAge;
  params.stormLifecycle.phase = stormAge > 0.78 ? "dissipating" : stormAge < 0.33 ? "developing" : "mature";
  params.humidityUplift.humidity = humidity;
  params.humidityUplift.upliftStrength = uplift;
  params.humidityUplift.condensationRate = 0.24 + humidity * 0.18;
  params.humidityUplift.evaporationRate = 0.025 + (1 - humidity) * 0.06;
  params.anvilWind.windShear = windShear;
  params.anvilWind.anvilOutflow = anvilOutflow;
  params.anvilWind.anvilPersistence = anvilPersistence;
  params.anvilWind.tropopauseHeight = tropopause;
  params.anvilWind.turbulentEntrainment = turbulent;
  params.lightingHdr.silverLining = silver;
  params.lightingHdr.haze = haze;
  params.lightingHdr.sunEdgePeakNits = 900;
  params.lightingHdr.maxCll = 900;
  params.billowMorphology = {
    ...params.billowMorphology,
    ...billowMorphology
  };
  return params;
}

function cloneParams(params, paramSeed) {
  return {
    seed: paramSeed,
    stormLifecycle: { ...params.stormLifecycle },
    humidityUplift: { ...params.humidityUplift },
    anvilWind: { ...params.anvilWind },
    lightingHdr: { ...params.lightingHdr },
    billowMorphology: { ...params.billowMorphology }
  };
}

function buildReferenceTargets(times, frameCount, timeWeights, referenceTimesWeight) {
  const maxTime = Math.max(...times);
  if (!times.length || !Number.isFinite(maxTime) || maxTime <= 0 || frameCount <= 0) {
    return [];
  }
  return times.map((time, index) => {
    const ratio = Math.min(1, Math.max(0, time / maxTime));
    return {
      frameIndex: Math.max(0, Math.min(frameCount - 1, Math.round(ratio * (frameCount - 1)))),
      weight: Math.max(
        0,
        (timeWeights[index] ?? 1) * (Number.isFinite(referenceTimesWeight) && referenceTimesWeight > 0 ? referenceTimesWeight : 1)
      )
    };
  });
}

function aggregateWeightedFeatures(frameFeatures, referenceTargets) {
  const aggregated = {
    threshold: 0,
    coverage: 0,
    meanLuma: 0,
    p90Luma: 0,
    centroidX: 0,
    centroidY: 0,
    bbox: { left: 0, top: 0, right: 0, bottom: 0 },
    edgeRatio: 0,
    topCoverage: 0,
    lowerCoverage: 0,
    bands: new Array(8).fill(0)
  };
  let totalWeight = 0;
  for (const target of referenceTargets) {
    const feature = frameFeatures.get(target.frameIndex);
    if (!feature) {
      continue;
    }
    const weight = Math.max(0, target.weight);
    totalWeight += weight;
    aggregated.threshold += feature.threshold * weight;
    aggregated.coverage += feature.coverage * weight;
    aggregated.meanLuma += feature.meanLuma * weight;
    aggregated.p90Luma += feature.p90Luma * weight;
    aggregated.centroidX += feature.centroidX * weight;
    aggregated.centroidY += feature.centroidY * weight;
    aggregated.bbox.left += feature.bbox.left * weight;
    aggregated.bbox.top += feature.bbox.top * weight;
    aggregated.bbox.right += feature.bbox.right * weight;
    aggregated.bbox.bottom += feature.bbox.bottom * weight;
    aggregated.edgeRatio += feature.edgeRatio * weight;
    aggregated.topCoverage += feature.topCoverage * weight;
    aggregated.lowerCoverage += feature.lowerCoverage * weight;
    for (let index = 0; index < feature.bands.length; index += 1) {
      aggregated.bands[index] += feature.bands[index] * weight;
    }
  }

  if (totalWeight === 0) {
    return aggregateFeatures(Array.from(frameFeatures.values()));
  }
  aggregated.threshold /= totalWeight;
  aggregated.coverage /= totalWeight;
  aggregated.meanLuma /= totalWeight;
  aggregated.p90Luma /= totalWeight;
  aggregated.centroidX /= totalWeight;
  aggregated.centroidY /= totalWeight;
  aggregated.bbox.left /= totalWeight;
  aggregated.bbox.top /= totalWeight;
  aggregated.bbox.right /= totalWeight;
  aggregated.bbox.bottom /= totalWeight;
  aggregated.edgeRatio /= totalWeight;
  aggregated.topCoverage /= totalWeight;
  aggregated.lowerCoverage /= totalWeight;
  aggregated.bands = aggregated.bands.map((value) => value / totalWeight);
  return aggregated;
}

function perturbParams(base, random, jitter) {
  const params = cloneParams(base, base.seed);
  const scale = Number.isFinite(jitter) && jitter > 0 ? jitter : 0;
  params.stormLifecycle.stormAge = clamp(
    params.stormLifecycle.stormAge + (random() * 2 - 1) * 0.5 * scale,
    0.42,
    0.92
  );
  params.humidityUplift.humidity = jitterRange(params.humidityUplift.humidity, random, scale, 0.68, 1);
  params.humidityUplift.upliftStrength = jitterRange(params.humidityUplift.upliftStrength, random, scale, 0.52, 1);
  params.anvilWind.windShear = jitterRange(params.anvilWind.windShear, random, scale, 0, 0.32);
  params.anvilWind.anvilOutflow = jitterRange(params.anvilWind.anvilOutflow, random, scale, 0, 0.52);
  params.anvilWind.anvilPersistence = jitterRange(params.anvilWind.anvilPersistence, random, scale, 0.54, 0.96);
  params.anvilWind.tropopauseHeight = jitterRange(params.anvilWind.tropopauseHeight, random, scale, 0.24, 0.78);
  params.anvilWind.turbulentEntrainment = jitterRange(params.anvilWind.turbulentEntrainment, random, scale, 0.26, 0.82);
  params.lightingHdr.silverLining = jitterRange(params.lightingHdr.silverLining, random, scale, 0.42, 0.88);
  params.lightingHdr.haze = jitterRange(params.lightingHdr.haze, random, scale, 0.08, 0.54);
  params.billowMorphology = {
    ...params.billowMorphology,
    lobeScale: jitterRange(params.billowMorphology.lobeScale, random, scale, 0.35, 0.95),
    lobeSharpness: jitterRange(params.billowMorphology.lobeSharpness, random, scale, 0.5, 1),
    microBillowScale: jitterRange(params.billowMorphology.microBillowScale, random, scale, 0.4, 1),
    edgeScallop: jitterRange(params.billowMorphology.edgeScallop, random, scale, 0.2, 0.78),
    shadowDepth: jitterRange(params.billowMorphology.shadowDepth, random, scale, 0.45, 1),
    baseDeckHeight: jitterRange(params.billowMorphology.baseDeckHeight, random, scale, 0.28, 0.78),
    towerCrownHeight: jitterRange(params.billowMorphology.towerCrownHeight, random, scale, 0.34, 0.76),
    skyDarkness: jitterRange(params.billowMorphology.skyDarkness, random, scale, 0.3, 0.82),
    starterBlend: jitterRange(params.billowMorphology.starterBlend, random, scale, 0.6, 1)
  };
  params.stormLifecycle.phase = params.stormLifecycle.stormAge > 0.78 ? "dissipating" : "mature";
  params.humidityUplift.condensationRate = 0.24 + params.humidityUplift.humidity * 0.18;
  params.humidityUplift.evaporationRate = 0.025 + (1 - params.humidityUplift.humidity) * 0.06;
  return params;
}

function makePrng(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function jitterRange(value, random, scale, left, right) {
  return clamp(value + (random() * 2 - 1) * (right - left) * scale * 0.5, left, right);
}

function clamp(value, left, right) {
  return Math.min(right, Math.max(left, value));
}

function parseReferenceWeights(raw) {
  if (!raw || raw.trim() === "") {
    return [];
  }
  return raw.split(",").map((value) => Number.parseFloat(value.trim())).filter((value) => Number.isFinite(value));
}

function normalizeReferenceWeights(rawWeights, count) {
  const weights = new Array(count).fill(1);
  for (let index = 0; index < Math.min(count, rawWeights.length); index += 1) {
    weights[index] = rawWeights[index];
  }
  return weights;
}

function makeVerdict(best) {
  if (!best) {
    return "no candidates evaluated";
  }
  if (best.score < 1.1) {
    return "parameter search found a plausible demo-like starting point";
  }
  if (best.score < 2.25 && /billow|tower/i.test(best.label)) {
    return "use the direct cumulonimbus billow starter as the base; parameter-only search was insufficient";
  }
  if (best.score < 2.25) {
    return "parameter search improved the composition but still needs direct cumulonimbus billow refinement";
  }
  return "parameter search is not enough; switch to a direct cumulonimbus billow starter";
}

function weightedAbs(left, right, weight) {
  return Math.abs(left - right) * weight;
}

function bandDistance(left, right, weight) {
  let total = 0;
  for (let index = 0; index < left.length; index += 1) {
    total += Math.abs(left[index] - right[index]);
  }
  return (total / left.length) * weight;
}

function quantile(sorted, ratio) {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * ratio)));
  return sorted[index];
}

function writePpm8(path, frameWidth, frameHeight, pixels) {
  const header = Buffer.from(`P6\n${frameWidth} ${frameHeight}\n255\n`, "ascii");
  writeFileSync(path, Buffer.concat([header, Buffer.from(pixels)]));
}

function convertPpmToPng(source, target) {
  const result = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", source, target], {
    stdio: "pipe"
  });
  if (result.status !== 0) {
    console.warn(`Could not write ${target}: ${String(result.stderr)}`);
  }
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
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

function hasArg(name) {
  return process.argv.includes(name);
}

function hashSeed(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mixRange(left, right, ratio) {
  return left + (right - left) * ratio;
}

function slug(value) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}
