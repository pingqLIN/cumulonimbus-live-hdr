import { clamp, fbm3, mix, smoothstep } from "./noise.js";

export interface CloudParams {
  seed: number;
  growth: number;
  edgeDrift: number;
  towerHeight: number;
  anvilSpread: number;
  silverLining: number;
  haze: number;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export const defaultCloudParams: CloudParams = {
  seed: 20260510,
  growth: 0.56,
  edgeDrift: 0.18,
  towerHeight: 0.72,
  anvilSpread: 0.64,
  silverLining: 0.77,
  haze: 0.42
};

export function sampleCloudDensity(x: number, y: number, time: number, params: CloudParams): number {
  const seed = params.seed;
  const centeredX = (x - 0.5) * 2;
  const altitude = 1 - y;
  const slowTime = time * (0.018 + params.edgeDrift * 0.035);
  const warpA = fbm3(centeredX * 1.7 + slowTime, y * 2.2, slowTime, seed + 19, 4);
  const warpB = fbm3(centeredX * 2.3 - slowTime, y * 1.8 + 4, slowTime + 9, seed + 43, 4);
  const wx = centeredX + (warpA - 0.5) * 0.42;
  const wy = y + (warpB - 0.5) * 0.16;

  const towerWidth = mix(0.18, 0.42, smoothstep(0.02, 0.86, wy));
  const anvil = smoothstep(0.64, 0.97, altitude) * params.anvilSpread;
  const silhouette = 1 - smoothstep(towerWidth + anvil * 0.42, towerWidth + anvil * 0.92, Math.abs(wx));
  const baseLift = smoothstep(0.98, 0.24, wy);
  const cap = smoothstep(0.04, 0.34 + params.towerHeight * 0.34, altitude);
  const mass = silhouette * baseLift * cap;

  const cellular = fbm3(wx * 3.4, wy * 3.2 - slowTime * 0.7, slowTime, seed + 101, 6);
  const billows = fbm3(wx * 7.8 + cellular, wy * 8.4, slowTime * 1.6, seed + 211, 5);
  const erosion = fbm3(wx * 18.0, wy * 18.0 + slowTime * 2.2, slowTime, seed + 503, 3);
  const threshold = mix(0.5, 0.35, params.growth) + smoothstep(0.0, 0.22, wy) * 0.06;
  const body = smoothstep(threshold, threshold + 0.28, cellular * 0.65 + billows * 0.5 - erosion * 0.16);

  return clamp(mass * body * 1.2);
}

export function shadeCloudPixel(
  x: number,
  y: number,
  density: number,
  edge: number,
  params: CloudParams
): Rgb {
  const altitude = 1 - y;
  const skyTop: Rgb = { r: 0.022, g: 0.06, b: 0.13 };
  const skyHorizon: Rgb = { r: 0.32, g: 0.5, b: 0.66 };
  const skyMix = smoothstep(0.0, 1.0, altitude);
  const haze = params.haze * (1 - altitude) * 0.34;

  const sun = clamp(1 - Math.hypot(x - 0.24, y - 0.14) * 1.55);
  const lit = smoothstep(0.08, 0.72, density + edge * 0.4);
  const shadow = smoothstep(0.2, 0.92, density) * (0.42 + y * 0.55);
  const silver = edge * params.silverLining * (0.75 + sun * 1.2);
  const interior = density * (1.02 - shadow * 0.58);
  const bloom = Math.pow(clamp(sun + silver * 0.58), 2.4);

  const sky: Rgb = {
    r: mix(skyHorizon.r, skyTop.r, skyMix) + haze,
    g: mix(skyHorizon.g, skyTop.g, skyMix) + haze * 0.85,
    b: mix(skyHorizon.b, skyTop.b, skyMix) + haze * 0.55
  };
  const cloud: Rgb = {
    r: 0.64 + interior * 0.55 + silver * 1.7 + bloom * 1.2,
    g: 0.68 + interior * 0.52 + silver * 1.55 + bloom * 1.0,
    b: 0.74 + interior * 0.48 + silver * 1.25 + bloom * 0.72
  };

  const opacity = smoothstep(0.015, 0.66, lit);
  return {
    r: sky.r * (1 - opacity) + cloud.r * opacity,
    g: sky.g * (1 - opacity) + cloud.g * opacity,
    b: sky.b * (1 - opacity) + cloud.b * opacity
  };
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
