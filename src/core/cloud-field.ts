import { clamp, fbm3, hash3, mix, smoothstep } from "./noise.js";
export { defaultCloudParams, defaultLegacyCloudParams, paramsFromLegacy, paramsToLegacy } from "./parameters.js";
export type { CloudParams, LegacyCloudParams } from "./parameters.js";
import type { CloudParams } from "./parameters.js";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const CAULIFLOWER_LAYER_COUNT = 6;
const CAULIFLOWER_MAX_MAIN_LOBES = 3;
const CAULIFLOWER_SUB_LOBE_COUNT = 3;
const FIELD_SAFE_MARGIN_X = 0.08;
const FIELD_SAFE_MARGIN_TOP = 0.34;
const FIELD_SAFE_MARGIN_BOTTOM = 0.08;

export function sampleCloudDensity(x: number, y: number, time: number, params: CloudParams): number {
  const framed = frameCloudStudyCoordinate(x, y);
  if (!framed.inside) {
    return 0;
  }

  const sampleX = framed.x;
  const sampleY = framed.y;
  const safeFrameMask =
    smoothstep(0, 0.08, sampleX) *
    (1 - smoothstep(0.92, 1, sampleX)) *
    smoothstep(0, 0.1, sampleY) *
    (1 - smoothstep(0.96, 1, sampleY));
  const seed = params.seed;
  const morphology = params.billowMorphology;
  const centeredX = (sampleX - 0.5) * 2;
  const altitude = 1 - sampleY;
  const lifecycle = params.stormLifecycle;
  const humidity = params.humidityUplift;
  const wind = params.anvilWind;
  const slowTime = time * (0.012 + wind.windShear * 0.032 + lifecycle.stormAge * 0.014);

  const warpA = fbm3(centeredX * 1.7 + slowTime, sampleY * 2.2, slowTime, seed + 19, 4);
  const warpB = fbm3(centeredX * 2.3 - slowTime, sampleY * 1.8 + 4, slowTime + 9, seed + 43, 4);
  const wx = centeredX + (warpA - 0.5) * (0.28 + wind.turbulentEntrainment * 0.32);
  const wy = sampleY + (warpB - 0.5) * (0.1 + humidity.upliftStrength * 0.1);
  const lobeScale = clamp(0.35 + morphology.lobeScale * 1.45, 0.18, 1.55);
  const detailScale = detailBodyScale(morphology.microBillowScale);

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
  const starterBillows = sampleCumulonimbusStarterBillows(sampleX, sampleY, time, params);
  const verticalColumnSupport = mix(0.58, 1, smoothstep(0.34, 0.72, sampleY));
  const anvilSupport = smoothstep(tropopause - 0.1, 0.99, altitude) * mix(0.42, 0.76, wind.anvilPersistence);
  const anvilShelf =
    anvil *
    smoothstep(tropopause - 0.12, 1, altitude) *
    (1 - smoothstep(towerWidth + anvil * 1.05, towerWidth + anvil * 1.72, Math.abs(wx))) *
    mix(0.18, 0.42, wind.anvilPersistence) *
    smoothstep(threshold - 0.05, threshold + 0.32, cellular * 0.58 + billows * 0.42);
  const fieldSupport = clamp(Math.max(verticalColumnSupport, anvilSupport));
  const fieldWeight = mix(0.42, 0.9, wind.anvilOutflow);
  const evolvedDensity = (fieldDensity + anvilShelf) * fieldWeight * fieldSupport;
  const starterWeight = clamp(morphology.starterBlend * (0.7 + wind.anvilOutflow * 0.2));
  const upperAnvilEnvelope = smoothstep(tropopause - 0.12, 1, altitude) * mix(0.34, 0.64, wind.anvilPersistence);
  const lowerBaseEnvelope = smoothstep(0.82, 1, sampleY) * mix(0.06, 0.16, morphology.baseDeckHeight);
  const towerEnvelope =
    mix(0.28, 0.46, smoothstep(0.42, 0.82, sampleY)) * mix(0.82, 1.18, lobeScale);
  const envelopeWidth = towerEnvelope + upperAnvilEnvelope + lowerBaseEnvelope;
  const portraitEnvelope = 1 - smoothstep(envelopeWidth, envelopeWidth + 0.26, Math.abs(centeredX));
  return clamp(Math.max(evolvedDensity, starterBillows * starterWeight) * portraitEnvelope * safeFrameMask);
}

function frameCloudStudyCoordinate(
  x: number,
  y: number
): { inside: boolean; x: number; y: number } {
  const scaleX = 1 - FIELD_SAFE_MARGIN_X * 2;
  const scaleY = 1 - FIELD_SAFE_MARGIN_TOP - FIELD_SAFE_MARGIN_BOTTOM;
  const framedX = (x - FIELD_SAFE_MARGIN_X) / scaleX;
  const framedY = (y - FIELD_SAFE_MARGIN_TOP) / scaleY;
  return {
    inside: framedX >= 0 && framedX <= 1 && framedY >= 0 && framedY <= 1,
    x: framedX,
    y: framedY
  };
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
  const textureScale = detailTextureScale(morphology.microBillowScale);
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
  const density = sampleProceduralCauliflowerBillows(
    x,
    y,
    timeDrift,
    globalScallop,
    lobeScale,
    sharpness,
    params
  );

  const detailFrequency = detailFrequencyScale(morphology.microBillowScale);
  const starterDetailScale = clamp(0.5 + detailFrequency * 0.95, 0.5, 10);
  const microBillow = fbm3(x * 22 * starterDetailScale, y * 24 * starterDetailScale, timeDrift + 4, params.seed + 1700, 3);
  const erosion = fbm3(
    x * 28 * starterDetailScale,
    y * 30 * starterDetailScale,
    timeDrift + 7,
    params.seed + 1907,
    4
  );
  const edgeMask = 1 - smoothstep(0.62, 0.96, density);
  const edgeBreak = smoothstep(0.42, 0.9, erosion) * edgeMask * mix(0.04, 0.22, clamp(morphology.edgeScallop, 0, 1));
  const erodedDensity = clamp(density - edgeBreak);
  const starter = erodedDensity * strength * mix(0.84, 1.08, globalScallop) * Math.max(baseDeckMask, towerMask);
  const microAdjusted = clamp(starter * (1 + microBillow * detailTextureScale(morphology.microBillowScale) * 0.2));
  return clamp(microAdjusted * clamp(0.86 + humidity.humidity * 0.24, 0.7, 1.1) * (0.7 + morphology.starterBlend * 0.3));
}

function detailFrequencyScale(value: number): number {
  return clamp(value, 0.1, 10);
}

function detailBodyScale(value: number): number {
  return clamp(0.55 + Math.sqrt(detailFrequencyScale(value)) * 1.15, 0.6, 4.2);
}

function detailTextureScale(value: number): number {
  return clamp(0.72 + Math.sqrt(detailFrequencyScale(value)) * 0.58, 0.85, 2.7);
}

function sampleProceduralCauliflowerBillows(
  x: number,
  y: number,
  timeDrift: number,
  globalScallop: number,
  lobeScale: number,
  sharpness: number,
  params: CloudParams
): number {
  const morphology = params.billowMorphology;
  const wind = params.anvilWind;
  const seed = params.seed;
  let density = 0;

  for (let layerIndex = 0; layerIndex < CAULIFLOWER_LAYER_COUNT; layerIndex += 1) {
    const layerT = layerIndex / (CAULIFLOWER_LAYER_COUNT - 1);
    const layerY = mix(0.86, 0.36, layerT) + (seededUnit(seed, layerIndex, 1, 0) - 0.5) * 0.045;
    const spineX =
      0.5 +
      Math.sin(layerIndex * 1.31 + seed * 0.0017) * 0.025 +
      (seededUnit(seed, layerIndex, 2, 0) - 0.5) * mix(0.035, 0.08, wind.windShear);
    const upperT = smoothstep(0.18, 1, layerT);
    const mainRadius = mix(0.17, 0.07, upperT) * lobeScale;
    const lateralSpread = mix(0.08, 0.34, upperT) * mix(0.78, 1.28, wind.anvilOutflow);
    const mainLobeCount =
      2 + (seededUnit(seed, layerIndex, 3, 0) > mix(0.68, 0.42, upperT) ? 1 : 0);
    if (Math.abs(y - layerY) > mainRadius * 2.25 + 0.08) {
      continue;
    }

    for (let lobeIndex = 0; lobeIndex < CAULIFLOWER_MAX_MAIN_LOBES; lobeIndex += 1) {
      if (lobeIndex >= mainLobeCount) {
        continue;
      }

      const slot = mainLobeCount <= 1 ? 0 : lobeIndex / (mainLobeCount - 1) - 0.5;
      const localSeed = layerIndex * 17 + lobeIndex * 5;
      const depth = seededUnit(seed, localSeed, 4, 0);
      const depthWeight = mix(0.66, 1.12, depth);
      const driftX = Math.sin(timeDrift * 4.2 + localSeed * 1.19) * 0.018 * (0.35 + wind.windShear);
      const driftY = Math.cos(timeDrift * 3.1 + localSeed * 0.83) * 0.012;
      const centerX =
        spineX +
        slot * lateralSpread +
        (seededUnit(seed, localSeed, 5, 0) - 0.5) * lateralSpread * 0.46 +
        driftX;
      const centerY = layerY + (seededUnit(seed, localSeed, 6, 0) - 0.5) * 0.038 + driftY;
      const radiusX = mainRadius * mix(0.82, 1.28, seededUnit(seed, localSeed, 7, 0));
      const radiusY = mainRadius * mix(0.68, 1.04, seededUnit(seed, localSeed, 8, 0));
      const large = sampleCauliflowerLobe(
        x,
        y,
        centerX,
        centerY,
        radiusX,
        radiusY,
        sharpness,
        globalScallop,
        localSeed,
        morphology.edgeScallop
      );
      density = Math.max(density, large * depthWeight * mix(0.92, 1.08, 1 - upperT));

      for (let subIndex = 0; subIndex < CAULIFLOWER_SUB_LOBE_COUNT; subIndex += 1) {
        const subSeed = localSeed * 19 + subIndex * 7;
        const angle =
          seededUnit(seed, subSeed, 9, 0) * Math.PI * 2 +
          slot * mix(0.2, 0.8, upperT) +
          timeDrift * 0.28;
        const edgeDistance = mix(0.62, 1.04, seededUnit(seed, subSeed, 10, 0));
        const subCenterX = centerX + Math.cos(angle) * radiusX * edgeDistance;
        const subCenterY = centerY + Math.sin(angle) * radiusY * edgeDistance * mix(0.7, 1.08, 1 - upperT);
        const subRadiusX = radiusX * mix(0.28, 0.48, seededUnit(seed, subSeed, 11, 0));
        const subRadiusY = radiusY * mix(0.3, 0.56, seededUnit(seed, subSeed, 12, 0));
        const subDepth = mix(0.54, 0.96, seededUnit(seed, subSeed, 13, 0)) * depthWeight;
        const subLobe = sampleCauliflowerLobe(
          x,
          y,
          subCenterX,
          subCenterY,
          subRadiusX,
          subRadiusY,
          sharpness * 0.92,
          globalScallop,
          subSeed,
          morphology.edgeScallop
        );
        density = Math.max(density, subLobe * subDepth);
      }
    }
  }

  return clamp(density);
}

function sampleCauliflowerLobe(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  sharpness: number,
  globalScallop: number,
  lobeIndex: number,
  edgeScallop: number
): number {
  const safeRadiusX = Math.max(0.02, radiusX);
  const safeRadiusY = Math.max(0.02, radiusY);
  if (Math.abs(x - centerX) > safeRadiusX * 1.28 || Math.abs(y - centerY) > safeRadiusY * 1.28) {
    return 0;
  }
  const dx = (x - centerX) / safeRadiusX;
  const dy = (y - centerY) / safeRadiusY;
  const radial = Math.hypot(dx, dy);
  const scallop = (globalScallop - 0.5) * mix(0.08, 0.24, clamp(edgeScallop, 0, 1));
  const localScallop = Math.sin((x * 1.7 + y * 2.1) * 18 + lobeIndex * 0.73) * mix(0.01, 0.055, edgeScallop);
  const profile = smoothstep(1.08 + scallop + localScallop, 0.28, radial);
  return Math.pow(profile, sharpness);
}

function seededUnit(seed: number, x: number, y: number, z: number): number {
  return hash3(Math.floor(x), Math.floor(y), Math.floor(z), seed);
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
