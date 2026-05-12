import type { CloudParams } from "./parameters.js";

export interface BubbleModelParams {
  seed: number;
  maxInstances: number;
  minRadius: number;
  rootRadius: number;
  childCountMin: number;
  childCountMax: number;
  childRadiusMin: number;
  childRadiusMax: number;
  upwardBias: number;
  upliftSpeed: number;
  generationDamping: number;
  rotationDrift: number;
  lateralSpread: number;
  anvilSpread: number;
  spawnThreshold: number;
  surfaceDisplacement: number;
  edgeParticleDensity: number;
  lightWrap: number;
}

export const defaultBubbleModelParams: BubbleModelParams = {
  seed: 20260510,
  maxInstances: 20000,
  minRadius: 0.15,
  rootRadius: 5,
  childCountMin: 2,
  childCountMax: 4,
  childRadiusMin: 0.5,
  childRadiusMax: 0.8,
  upwardBias: 0.6,
  upliftSpeed: 1.5,
  generationDamping: 0.5,
  rotationDrift: 0.05,
  lateralSpread: 0.85,
  anvilSpread: 0.64,
  spawnThreshold: 0.75,
  surfaceDisplacement: 0.18,
  edgeParticleDensity: 0.35,
  lightWrap: 0.42
};

export function mapCloudParamsToBubbleParams(params: CloudParams): BubbleModelParams {
  const humidity = params.humidityUplift.humidity;
  const uplift = params.humidityUplift.upliftStrength;
  const windShear = params.anvilWind.windShear;
  const anvilOutflow = params.anvilWind.anvilOutflow;
  const anvilPersistence = params.anvilWind.anvilPersistence;
  const stormAge = params.stormLifecycle.stormAge;
  const morphology = params.billowMorphology;
  const edgePeakRatio =
    params.lightingHdr.sunEdgePeakNits / Math.max(1, params.lightingHdr.diffuseWhiteNits);
  const edgePeakLift = Math.min(1, Math.max(0, (edgePeakRatio - 1) / 6));

  return {
    seed: params.seed,
    maxInstances: 20000,
    minRadius: 0.11 + (1 - morphology.microBillowScale) * 0.08,
    rootRadius: 3.8 + uplift * 1.8 + stormAge * 0.9,
    childCountMin: 2,
    childCountMax: 3 + Math.round(humidity * 2),
    childRadiusMin: 0.42 + morphology.lobeSharpness * 0.12,
    childRadiusMax: 0.7 + morphology.lobeScale * 0.16,
    upwardBias: 0.46 + uplift * 0.38,
    upliftSpeed: 0.95 + uplift * 1.05,
    generationDamping: 0.36 + morphology.lobeSharpness * 0.34 + anvilPersistence * 0.12,
    rotationDrift: 0.02 + windShear * 0.12,
    lateralSpread: 0.52 + windShear * 0.8,
    anvilSpread: 0.2 + anvilOutflow * 0.92 + anvilPersistence * 0.24,
    spawnThreshold: 0.62 + stormAge * 0.14 + anvilPersistence * 0.08,
    surfaceDisplacement: 0.08 + morphology.edgeScallop * 0.28,
    edgeParticleDensity: 0.18 + morphology.microBillowScale * 0.42 + anvilPersistence * 0.16,
    lightWrap: 0.24 + params.lightingHdr.silverLining * 0.34 + edgePeakLift * 0.24
  };
}
