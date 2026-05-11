import { clamp, fbm3, mix, smoothstep } from "./noise.js";
export { defaultCloudParams, defaultLegacyCloudParams, paramsFromLegacy, paramsToLegacy } from "./parameters.js";
export type { CloudParams, LegacyCloudParams } from "./parameters.js";
import type { CloudParams } from "./parameters.js";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

type BillowLobe = readonly [x: number, y: number, radiusX: number, radiusY: number, weight: number];

const CUMULONIMBUS_STARTER_LOBES: readonly BillowLobe[] = [
  [0.33, 0.52, 0.08, 0.06, 0.82],
  [0.43, 0.48, 0.15, 0.1, 0.96],
  [0.5, 0.43, 0.08, 0.06, 0.9],
  [0.55, 0.51, 0.17, 0.11, 1],
  [0.66, 0.54, 0.09, 0.07, 0.78],
  [0.34, 0.58, 0.17, 0.13, 0.95],
  [0.22, 0.63, 0.09, 0.07, 0.72],
  [0.66, 0.62, 0.19, 0.14, 0.92],
  [0.79, 0.67, 0.1, 0.08, 0.72],
  [0.24, 0.71, 0.21, 0.15, 0.78],
  [0.39, 0.68, 0.1, 0.08, 0.78],
  [0.48, 0.73, 0.25, 0.18, 0.9],
  [0.58, 0.68, 0.1, 0.08, 0.8],
  [0.76, 0.76, 0.22, 0.17, 0.74],
  [0.9, 0.79, 0.1, 0.08, 0.58],
  [0.12, 0.88, 0.22, 0.14, 0.54],
  [0.35, 0.91, 0.24, 0.16, 0.68],
  [0.62, 0.9, 0.27, 0.18, 0.7],
  [0.9, 0.89, 0.18, 0.14, 0.5]
];

export function sampleCloudDensity(x: number, y: number, time: number, params: CloudParams): number {
  const seed = params.seed;
  const morphology = params.billowMorphology;
  const centeredX = (x - 0.5) * 2;
  const altitude = 1 - y;
  const lifecycle = params.stormLifecycle;
  const humidity = params.humidityUplift;
  const wind = params.anvilWind;
  const slowTime = time * (0.012 + wind.windShear * 0.032 + lifecycle.stormAge * 0.014);

  const warpA = fbm3(centeredX * 1.7 + slowTime, y * 2.2, slowTime, seed + 19, 4);
  const warpB = fbm3(centeredX * 2.3 - slowTime, y * 1.8 + 4, slowTime + 9, seed + 43, 4);
  const wx = centeredX + (warpA - 0.5) * (0.28 + wind.turbulentEntrainment * 0.32);
  const wy = y + (warpB - 0.5) * (0.1 + humidity.upliftStrength * 0.1);
  const lobeScale = clamp(0.35 + morphology.lobeScale * 1.45, 0.18, 1.55);
  const detailScale = clamp(0.55 + morphology.microBillowScale * 1.35, 0.6, 2.0);

  const towerWidth = mix(0.18, 0.42, smoothstep(0.02, 0.86, wy)) * mix(0.78, 1.24, lobeScale);
  const tropopause = mix(0.58, 0.9, wind.tropopauseHeight);
  const anvil = smoothstep(tropopause - 0.08, 0.98, altitude) * wind.anvilOutflow;
  const silhouette = 1 - smoothstep(towerWidth + anvil * 0.42, towerWidth + anvil * 0.92, Math.abs(wx));
  const baseLift = smoothstep(0.98, mix(0.18, 0.42, morphology.baseDeckHeight), wy);
  const cap = smoothstep(
    mix(0.03, 0.10, morphology.towerCrownHeight),
    0.30 + humidity.upliftStrength * 0.34 * mix(0.5, 1.4, morphology.lobeSharpness),
    altitude
  );
  const mass = silhouette * baseLift * cap;

  const cellular = fbm3(wx * 3.4 * detailScale, wy * 3.2 * detailScale - slowTime * 0.7, slowTime, seed + 101, 6);
  const billows = fbm3(
    wx * 7.8 * detailScale + cellular * 0.8,
    wy * 8.4 * detailScale,
    slowTime * 1.6,
    seed + 211,
    5
  );
  const scallopNoise = (fbm3(wx * 5.4, wy * 4.9, slowTime, seed + 401, 4) - 0.5) * 0.14;
  const scallop = smoothstep(
    -0.8,
    0.8,
    scallopNoise * mix(0.4, 1.2, clamp(morphology.edgeScallop, 0, 1)) + wind.anvilOutflow - 0.5
  );
  const erosion = fbm3(
    wx * 18.0 * scallop,
    wy * 18.0 * scallop + slowTime * 2.2,
    slowTime,
    seed + 503,
    3
  );

  const stormMaturity = lifecycle.phase === "developing" ? lifecycle.stormAge * 0.78 : lifecycle.stormAge;
  const humidityThreshold = mix(0.54, 0.32, humidity.humidity);
  const threshold = humidityThreshold - stormMaturity * 0.09 + smoothstep(0.0, 0.22, wy) * 0.06;
  const body = smoothstep(
    threshold + (scallop - 0.5) * 0.08,
    threshold + mix(0.14, 0.34, morphology.lobeSharpness),
    cellular * 0.65 + billows * 0.5 - erosion * 0.16
  );

  const dissipatingLoss = lifecycle.phase === "dissipating" ? smoothstep(0.45, 1, lifecycle.stormAge) * 0.24 : 0;
  const fieldDensity = mass * body * (1.05 + humidity.upliftStrength * 0.28 - dissipatingLoss);
  const starterBillows = sampleCumulonimbusStarterBillows(x, y, time, params);
  const upperColumnLimiter = mix(0.22, 1, smoothstep(0.36, 0.68, y));
  const fieldWeight = mix(0.22, 0.86, wind.anvilOutflow);
  const evolvedDensity = fieldDensity * fieldWeight * upperColumnLimiter;
  const starterWeight = clamp(morphology.starterBlend * (0.7 + wind.anvilOutflow * 0.2));
  return clamp(Math.max(evolvedDensity, starterBillows * starterWeight));
}

export function shadeCloudPixel(x: number, y: number, density: number, edge: number, params: CloudParams): Rgb {
  const altitude = 1 - y;
  const lighting = params.lightingHdr;
  const morphology = params.billowMorphology;
  const skyTop: Rgb = { r: 0.006, g: 0.012, b: 0.018 };
  const skyHorizon: Rgb = { r: 0.14, g: 0.22, b: 0.25 };
  const skyMix = smoothstep(0.0, 1.0, altitude);
  const skyWeight = mix(1.1, 0.32, clamp(morphology.skyDarkness, 0, 1));
  const haze = lighting.haze * (1 - altitude) * 0.12 * mix(0.7, 1.6, clamp(morphology.skyDarkness, 0, 1));

  const sun = clamp(1 - Math.hypot(x - 0.24, y - 0.14) * 1.55);
  const lit = smoothstep(0.08, 0.72, density + edge * 0.4);
  const shadow = smoothstep(0.2, 0.92, density) * (0.24 + y * 0.64) * clamp(morphology.shadowDepth, 0.1, 1.6);
  const textureScale = mix(0.85, 1.35, clamp(morphology.microBillowScale, 0, 1));
  const billowTexture = fbm3(x * 10.5 * textureScale, y * 12.5 * textureScale, density * 2.2, params.seed + 1701, 4);
  const fineBillows = fbm3(x * 23.0 * textureScale, y * 25.0 * textureScale, density * 4.5, params.seed + 2039, 3);
  const lobeLight = smoothstep(0.38, 0.86, billowTexture);
  const lobePocket = smoothstep(0.3, 0.74, 1 - billowTexture) * density;
  const fineRelief = smoothstep(0.42, 0.82, fineBillows) * density * (1 - smoothstep(0.82, 1, density));
  const highlightScale = lighting.sunEdgePeakNits / Math.max(1, lighting.diffuseWhiteNits);
  const silver = edge * lighting.silverLining * (0.75 + sun * 1.2);
  const interior = density * (0.96 - shadow * 0.6 + lobeLight * 0.24 + fineRelief * 0.26 - lobePocket * 0.22);
  const bloom = Math.pow(clamp(sun + silver * 0.58), 2.4) * mix(0.8, 1.24, clamp(highlightScale / 6));

  const sky: Rgb = {
    r: mix(skyHorizon.r, skyTop.r, skyMix) * skyWeight + haze,
    g: mix(skyHorizon.g, skyTop.g, skyMix) * skyWeight + haze * 0.85,
    b: mix(skyHorizon.b, skyTop.b, skyMix) * skyWeight + haze * 0.55
  };
  const cloud: Rgb = {
    r: 0.42 + interior * 0.42 + silver * 1.18 + bloom * 0.78,
    g: 0.44 + interior * 0.4 + silver * 1.08 + bloom * 0.68,
    b: 0.46 + interior * 0.36 + silver * 0.86 + bloom * 0.48
  };

  const opacity = smoothstep(0.015, 0.66, lit);
  return {
    r: sky.r * (1 - opacity) + cloud.r * opacity,
    g: sky.g * (1 - opacity) + cloud.g * opacity,
    b: sky.b * (1 - opacity) + cloud.b * opacity
  };
}

function sampleCumulonimbusStarterBillows(x: number, y: number, time: number, params: CloudParams): number {
  const morphology = params.billowMorphology;
  const humidity = params.humidityUplift;
  const wind = params.anvilWind;
  const lifecycle = params.stormLifecycle;
  const strength =
    smoothstep(0.36, 0.9, humidity.humidity) *
    smoothstep(0.28, 0.88, humidity.upliftStrength) *
    mix(0.74, 1.08, lifecycle.stormAge) *
    mix(1.04, 0.66, wind.anvilOutflow);

  const baseDeckHeight = clamp(0.18 + morphology.baseDeckHeight * 0.72, 0.18, 0.82);
  const baseDeckMask = smoothstep(baseDeckHeight, 0.95, y);
  const towerMask = smoothstep(mix(0.16, 0.24, morphology.towerCrownHeight), 0.52, y) * (1 - smoothstep(0.92, 1, y));
  const timeDrift = time * (0.01 + wind.windShear * 0.018);
  const globalScallop = fbm3(x * 8.5, y * 9.5, timeDrift, params.seed + 1409, 4);
  const lobeScale = clamp(0.4 + morphology.lobeScale * 1.35, 0.2, 2.1);
  const sharpness = clamp(0.55 + morphology.lobeSharpness * 1.3, 0.55, 2.2);
  let density = 0;

  for (let index = 0; index < CUMULONIMBUS_STARTER_LOBES.length; index += 1) {
    const lobeDefinition = CUMULONIMBUS_STARTER_LOBES[index];
    if (!lobeDefinition) {
      continue;
    }
    const [centerX, centerY, radiusX, radiusY, weight] = lobeDefinition;
    const driftX = Math.sin(timeDrift * 4.1 + index * 1.73) * 0.018 * (0.35 + wind.windShear);
    const driftY = Math.cos(timeDrift * 3.4 + index * 2.11) * 0.012;
    const dx = (x - centerX - driftX) / (radiusX * lobeScale);
    const dy = (y - centerY - driftY) / (radiusY * lobeScale);
    const radial = Math.hypot(dx, dy);
    const scallop = (globalScallop - 0.5) * mix(0.08, 0.22, clamp(morphology.edgeScallop, 0, 1));
    const localScallop = Math.sin((x + y) * 18 + index * 0.9 + timeDrift * 3) * mix(0.01, 0.05, morphology.edgeScallop);
    const profile = smoothstep(1.12 + scallop + localScallop, 0.35, radial);
    const lobe = Math.pow(profile, sharpness) * weight;
    density = Math.max(density, lobe);
  }

  const microBillow = fbm3(x * 22 * clamp(0.5 + morphology.microBillowScale * 1.5, 0.5, 2.0), y * 24, timeDrift + 4, params.seed + 1700, 3);
  const erosion = smoothstep(0.2, 0.78, globalScallop);
  const starter = density * strength * mix(0.82, 1.08, erosion) * Math.max(baseDeckMask, towerMask);
  const microAdjusted = clamp(starter * (1 + microBillow * morphology.microBillowScale * 0.28));
  return clamp(microAdjusted * clamp(0.86 + humidity.humidity * 0.24, 0.7, 1.1) * (0.7 + morphology.starterBlend * 0.3));
}

export function sampleCloudPixel(x: number, y: number, time: number, params: CloudParams): Rgb {
  const density = sampleCloudDensity(x, y, time, params);
  const dx = sampleCloudDensity(x + 0.0025, y, time, params) - sampleCloudDensity(x - 0.0025, y, time, params);
  const dy = sampleCloudDensity(x, y + 0.0025, time, params) - sampleCloudDensity(x, y - 0.0025, time, params);
  const edge = clamp(Math.hypot(dx, dy) * 9);
  return shadeCloudPixel(x, y, density, edge, params);
}

export function tonemapSdr(value: number): number {
  const mapped = 1 - Math.exp(-Math.max(0, value) * 1.05);
  return Math.pow(clamp(mapped), 1 / 2.2);
}
