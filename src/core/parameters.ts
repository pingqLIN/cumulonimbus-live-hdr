export type StormPhase = "developing" | "mature" | "dissipating";

export interface StormLifecycleParams {
  stormAge: number;
  phase: StormPhase;
}

export interface HumidityUpliftParams {
  humidity: number;
  upliftStrength: number;
  condensationRate: number;
  evaporationRate: number;
}

export interface AnvilWindParams {
  windShear: number;
  anvilOutflow: number;
  anvilPersistence: number;
  turbulentEntrainment: number;
  tropopauseHeight: number;
}

export interface LightingHdrParams {
  diffuseWhiteNits: number;
  sunEdgePeakNits: number;
  masterDisplayPeakNits: number;
  maxCll: number;
  silverLining: number;
  haze: number;
}

export interface BillowMorphologyParams {
  lobeScale: number;
  lobeSharpness: number;
  microBillowScale: number;
  edgeScallop: number;
  shadowDepth: number;
  baseDeckHeight: number;
  towerCrownHeight: number;
  skyDarkness: number;
  starterBlend: number;
}

export interface CloudParams {
  seed: number;
  stormLifecycle: StormLifecycleParams;
  humidityUplift: HumidityUpliftParams;
  anvilWind: AnvilWindParams;
  lightingHdr: LightingHdrParams;
  billowMorphology: BillowMorphologyParams;
}

export interface LegacyCloudParams {
  seed: number;
  growth: number;
  edgeDrift: number;
  towerHeight: number;
  anvilSpread: number;
  silverLining: number;
  haze: number;
}

export const defaultCloudParams: CloudParams = {
  seed: 20260510,
  stormLifecycle: {
    stormAge: 0.48,
    phase: "mature"
  },
  humidityUplift: {
    humidity: 0.66,
    upliftStrength: 0.72,
    condensationRate: 0.28,
    evaporationRate: 0.065
  },
  anvilWind: {
    windShear: 0.18,
    anvilOutflow: 0.64,
    anvilPersistence: 0.68,
    turbulentEntrainment: 0.42,
    tropopauseHeight: 0.72
  },
  lightingHdr: {
    diffuseWhiteNits: 203,
    sunEdgePeakNits: 1000,
    masterDisplayPeakNits: 1000,
    maxCll: 1000,
    silverLining: 0.77,
    haze: 0.42
  },
  billowMorphology: {
    lobeScale: 0.6,
    lobeSharpness: 0.8,
    microBillowScale: 0.72,
    edgeScallop: 0.46,
    shadowDepth: 0.72,
    baseDeckHeight: 0.54,
    towerCrownHeight: 0.48,
    skyDarkness: 0.58,
    starterBlend: 0.86
  }
};

export const defaultLegacyCloudParams: LegacyCloudParams = {
  seed: defaultCloudParams.seed,
  growth: defaultCloudParams.stormLifecycle.stormAge,
  edgeDrift: defaultCloudParams.anvilWind.windShear,
  towerHeight: defaultCloudParams.humidityUplift.upliftStrength,
  anvilSpread: defaultCloudParams.anvilWind.anvilOutflow,
  silverLining: defaultCloudParams.lightingHdr.silverLining,
  haze: defaultCloudParams.lightingHdr.haze
};

export function cloneCloudParams(params: CloudParams = defaultCloudParams): CloudParams {
  return {
    seed: params.seed,
    stormLifecycle: { ...params.stormLifecycle },
    humidityUplift: { ...params.humidityUplift },
    anvilWind: { ...params.anvilWind },
    lightingHdr: { ...params.lightingHdr },
    billowMorphology: { ...params.billowMorphology }
  };
}

export function paramsFromLegacy(legacy: LegacyCloudParams): CloudParams {
  return {
    seed: legacy.seed,
    stormLifecycle: {
      stormAge: legacy.growth,
      phase: legacy.growth < 0.33 ? "developing" : legacy.growth > 0.78 ? "dissipating" : "mature"
    },
    humidityUplift: {
      humidity: 0.36 + legacy.growth * 0.5,
      upliftStrength: legacy.towerHeight,
      condensationRate: 0.18 + legacy.growth * 0.18,
      evaporationRate: 0.045 + (1 - legacy.growth) * 0.04
    },
      anvilWind: {
      windShear: legacy.edgeDrift,
      anvilOutflow: legacy.anvilSpread,
      anvilPersistence: 0.5 + legacy.anvilSpread * 0.32,
      turbulentEntrainment: 0.24 + legacy.edgeDrift * 0.46,
      tropopauseHeight: legacy.towerHeight
    },
    lightingHdr: {
      diffuseWhiteNits: 203,
      sunEdgePeakNits: 1000,
      masterDisplayPeakNits: 1000,
      maxCll: 1000,
      silverLining: legacy.silverLining,
      haze: legacy.haze
    },
    billowMorphology: {
      lobeScale: 0.6,
      lobeSharpness: 0.8,
      microBillowScale: 0.72,
      edgeScallop: 0.46,
      shadowDepth: 0.72,
      baseDeckHeight: 0.54,
      towerCrownHeight: 0.48,
      skyDarkness: 0.58,
      starterBlend: 0.86
    }
  };
}

export function paramsToLegacy(params: CloudParams): LegacyCloudParams {
  return {
    seed: params.seed,
    growth: params.stormLifecycle.stormAge,
    edgeDrift: params.anvilWind.windShear,
    towerHeight: params.humidityUplift.upliftStrength,
    anvilSpread: params.anvilWind.anvilOutflow,
    silverLining: params.lightingHdr.silverLining,
    haze: params.lightingHdr.haze
  };
}
