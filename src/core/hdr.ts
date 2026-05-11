import type { CloudParams, LightingHdrParams } from "./parameters.js";
import type { Rgb } from "./cloud-field.js";
import { clamp } from "./noise.js";

const pqM1 = 2610 / 16384;
const pqM2 = (2523 / 4096) * 128;
const pqC1 = 3424 / 4096;
const pqC2 = (2413 / 4096) * 32;
const pqC3 = (2392 / 4096) * 32;

export interface HdrEncodingSettings {
  diffuseWhiteNits: number;
  sunEdgePeakNits: number;
  masterDisplayPeakNits: number;
  maxCll: number;
}

export function hdrSettingsFromParams(params: CloudParams): HdrEncodingSettings {
  return {
    diffuseWhiteNits: params.lightingHdr.diffuseWhiteNits,
    sunEdgePeakNits: params.lightingHdr.sunEdgePeakNits,
    masterDisplayPeakNits: params.lightingHdr.masterDisplayPeakNits,
    maxCll: params.lightingHdr.maxCll
  };
}

export function sceneLinearToNits(value: number, settings: HdrEncodingSettings): number {
  const diffuseWhite = Math.max(1, settings.diffuseWhiteNits);
  const peak = Math.max(diffuseWhite, settings.sunEdgePeakNits, settings.maxCll);
  const shoulderStart = 1;
  const linear = Math.max(0, value);
  if (linear <= shoulderStart) {
    return linear * diffuseWhite;
  }
  const highlight = 1 - Math.exp(-(linear - shoulderStart) * 1.25);
  return diffuseWhite + highlight * (peak - diffuseWhite);
}

export function nitsToPq(nits: number): number {
  const normalized = clamp(nits / 10000);
  const powered = Math.pow(normalized, pqM1);
  const numerator = pqC1 + pqC2 * powered;
  const denominator = 1 + pqC3 * powered;
  return clamp(Math.pow(numerator / denominator, pqM2));
}

export function sceneLinearToPq(value: number, settings: HdrEncodingSettings): number {
  return nitsToPq(sceneLinearToNits(value, settings));
}

export function sceneLinearToPq16(value: number, settings: HdrEncodingSettings): number {
  return Math.round(sceneLinearToPq(value, settings) * 65535);
}

export function maxSceneChannel(pixel: Rgb): number {
  return Math.max(pixel.r, pixel.g, pixel.b);
}

export function maxPixelNits(pixel: Rgb, lighting: LightingHdrParams): number {
  const settings: HdrEncodingSettings = {
    diffuseWhiteNits: lighting.diffuseWhiteNits,
    sunEdgePeakNits: lighting.sunEdgePeakNits,
    masterDisplayPeakNits: lighting.masterDisplayPeakNits,
    maxCll: lighting.maxCll
  };
  return sceneLinearToNits(maxSceneChannel(pixel), settings);
}
