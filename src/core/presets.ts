import {
  cloneCloudParams,
  defaultCloudParams,
  type CloudParams
} from "./parameters.js";

export type CloudPresetName = "default" | "demo" | "raw" | "billow" | "billow-v1";

export function createCloudPresetParams(name = "default", seed = defaultCloudParams.seed): CloudParams {
  const preset = normalizeCloudPresetName(name);
  const params = cloneCloudParams(defaultCloudParams);
  params.seed = seed;

  if (preset !== "billow" && preset !== "billow-v1") {
    return params;
  }

  if (preset === "billow") {
    params.stormLifecycle.stormAge = 0.78;
    params.stormLifecycle.phase = "mature";
    params.humidityUplift.humidity = 0.86;
    params.humidityUplift.upliftStrength = 0.9;
    params.humidityUplift.condensationRate = 0.3948;
    params.humidityUplift.evaporationRate = 0.0334;
    params.anvilWind.windShear = 0.08;
    params.anvilWind.anvilOutflow = 0.14;
    params.anvilWind.anvilPersistence = 0.8;
    params.anvilWind.turbulentEntrainment = 0.58;
    params.anvilWind.tropopauseHeight = 0.48;
    params.lightingHdr.sunEdgePeakNits = 900;
    params.lightingHdr.maxCll = 900;
    params.lightingHdr.silverLining = 0.68;
    params.lightingHdr.haze = 0.42;
    params.billowMorphology = {
      ...params.billowMorphology,
      lobeScale: 0.72,
      lobeSharpness: 0.78,
      microBillowScale: 0.72,
      edgeScallop: 0.46,
      shadowDepth: 0.72,
      baseDeckHeight: 0.54,
      towerCrownHeight: 0.48,
      skyDarkness: 0.58,
      starterBlend: 0.86
    };
    return params;
  }

  const billowV1TopCandidates: Array<{
  rank: number;
  label: string;
  score: number;
  stormLifecycle: {
    stormAge: number;
    phase: "developing" | "mature" | "dissipating";
  };
  humidityUplift: {
    humidity: number;
    upliftStrength: number;
    condensationRate: number;
    evaporationRate: number;
  };
  anvilWind: {
    windShear: number;
    anvilOutflow: number;
    anvilPersistence: number;
    turbulentEntrainment: number;
    tropopauseHeight: number;
  };
  lightingHdr: {
    silverLining: number;
    haze: number;
  };
  billowMorphology: {
    lobeScale: number;
    lobeSharpness: number;
    microBillowScale: number;
    edgeScallop: number;
    shadowDepth: number;
    baseDeckHeight: number;
    towerCrownHeight: number;
    skyDarkness: number;
    starterBlend: number;
  };
}> = [
  {
    rank: 1,
    label: "local-58",
    score: 1.9760945792765707,
    stormLifecycle: { stormAge: 0.9159391413095731, phase: "dissipating" },
    humidityUplift: {
      humidity: 0.8692146785874886,
      upliftStrength: 0.740899332269863,
      condensationRate: 0.39645864214574794,
      evaporationRate: 0.03284711928475069
    },
    anvilWind: {
      windShear: 0.16326003519621665,
      anvilOutflow: 0.3482194578875675,
      anvilPersistence: 0.8455825850628974,
      turbulentEntrainment: 0.399818023082851,
      tropopauseHeight: 0.7574897312101418
    },
    lightingHdr: {
      silverLining: 0.7876954907802854,
      haze: 0.509915140527956
    },
    billowMorphology: {
      lobeScale: 0.5036355674724643,
      lobeSharpness: 0.5914641860404435,
      microBillowScale: 0.6279496877498343,
      edgeScallop: 0.36509014803352535,
      shadowDepth: 0.9440820710577145,
      baseDeckHeight: 0.3813026053711778,
      towerCrownHeight: 0.5079082307450492,
      skyDarkness: 0.39647789402182165,
      starterBlend: 0.7231252428472799
    }
  },
  {
    rank: 2,
    label: "local-03",
    score: 1.979615150019381,
    stormLifecycle: { stormAge: 0.92, phase: "dissipating" },
    humidityUplift: {
      humidity: 0.8689430099409406,
      upliftStrength: 0.739618647567839,
      condensationRate: 0.3964097417893693,
      evaporationRate: 0.032863419403543565
    },
    anvilWind: {
      windShear: 0.16399127505987202,
      anvilOutflow: 0.3518493301288182,
      anvilPersistence: 0.8396791304962196,
      turbulentEntrainment: 0.3943698246343923,
      tropopauseHeight: 0.7606907590995521
    },
    lightingHdr: {
      silverLining: 0.7829966652749797,
      haze: 0.5129927425339103
    },
    billowMorphology: {
      lobeScale: 0.4935630913461938,
      lobeSharpness: 0.5878640387417665,
      microBillowScale: 0.6397325657924481,
      edgeScallop: 0.3525904861502094,
      shadowDepth: 0.9422884241774534,
      baseDeckHeight: 0.38669108592187784,
      towerCrownHeight: 0.5042009458180752,
      skyDarkness: 0.3892453939027724,
      starterBlend: 0.7221576602105418
    }
  },
  {
    rank: 3,
    label: "local-146",
    score: 1.9803675799616458,
    stormLifecycle: { stormAge: 0.9171952793030523, phase: "dissipating" },
    humidityUplift: {
      humidity: 0.8670044735028885,
      upliftStrength: 0.7396729512329383,
      condensationRate: 0.3960608052305199,
      evaporationRate: 0.03297973158982669
    },
    anvilWind: {
      windShear: 0.16466336060524053,
      anvilOutflow: 0.34533656421654596,
      anvilPersistence: 0.8496318374886018,
      turbulentEntrainment: 0.400597932194592,
      tropopauseHeight: 0.7596655794268393
    },
    lightingHdr: {
      silverLining: 0.7809712094606066,
      haze: 0.5139541081416547
    },
    billowMorphology: {
      lobeScale: 0.5072429063525616,
      lobeSharpness: 0.6012541827021061,
      microBillowScale: 0.6389770394931494,
      edgeScallop: 0.36572454048107017,
      shadowDepth: 0.9519418590312572,
      baseDeckHeight: 0.37818770991305073,
      towerCrownHeight: 0.5109647959913743,
      skyDarkness: 0.39705417131596576,
      starterBlend: 0.7227889442846153
    }
  },
  {
    rank: 4,
    label: "local-71",
    score: 1.9803813094732443,
    stormLifecycle: { stormAge: 0.9149298365693376, phase: "dissipating" },
    humidityUplift: {
      humidity: 0.8650635267915818,
      upliftStrength: 0.7409871229323062,
      condensationRate: 0.3957114348224847,
      evaporationRate: 0.03309618839250509
    },
    anvilWind: {
      windShear: 0.1622949480437195,
      anvilOutflow: 0.35521973636722004,
      anvilPersistence: 0.8450443636857775,
      turbulentEntrainment: 0.3893373700881697,
      tropopauseHeight: 0.7603986058108738
    },
    lightingHdr: {
      silverLining: 0.7843096360616408,
      haze: 0.507290900814438
    },
    billowMorphology: {
      lobeScale: 0.5054510546122796,
      lobeSharpness: 0.6012397673269128,
      microBillowScale: 0.6272741740169643,
      edgeScallop: 0.36171073585381047,
      shadowDepth: 0.9518037579546341,
      baseDeckHeight: 0.38301088050601795,
      towerCrownHeight: 0.5135094832082766,
      skyDarkness: 0.3862687870819282,
      starterBlend: 0.7233366508319361
    }
  },
  {
    rank: 5,
    label: "local-125",
    score: 1.9821181198316893,
    stormLifecycle: { stormAge: 0.919943451626446, phase: "dissipating" },
    humidityUplift: {
      humidity: 0.8674958436780367,
      upliftStrength: 0.7353838484552185,
      condensationRate: 0.3961492518620466,
      evaporationRate: 0.0329502493793178
    },
    anvilWind: {
      windShear: 0.16439707945713228,
      anvilOutflow: 0.3459411427159033,
      anvilPersistence: 0.8460993212668689,
      turbulentEntrainment: 0.4012808542695085,
      tropopauseHeight: 0.7658850795610772
    },
    lightingHdr: {
      silverLining: 0.7829972513312234,
      haze: 0.5086980114582456
    },
    billowMorphology: {
      lobeScale: 0.49689953961314154,
      lobeSharpness: 0.5941559122006074,
      microBillowScale: 0.6345325321628555,
      edgeScallop: 0.3545477133603412,
      shadowDepth: 0.9417395488694286,
      baseDeckHeight: 0.3910802882592148,
      towerCrownHeight: 0.510096783880516,
      skyDarkness: 0.3989627076426434,
      starterBlend: 0.7160415777289405
    }
  }
];

const best = billowV1TopCandidates[0];
  if (!best) {
    return params;
  }

  params.stormLifecycle.stormAge = best.stormLifecycle.stormAge;
  params.stormLifecycle.phase = best.stormLifecycle.phase;
  params.humidityUplift.humidity = best.humidityUplift.humidity;
  params.humidityUplift.upliftStrength = best.humidityUplift.upliftStrength;
  params.humidityUplift.condensationRate = best.humidityUplift.condensationRate;
  params.humidityUplift.evaporationRate = best.humidityUplift.evaporationRate;
  params.anvilWind.windShear = best.anvilWind.windShear;
  params.anvilWind.anvilOutflow = best.anvilWind.anvilOutflow;
  params.anvilWind.anvilPersistence = best.anvilWind.anvilPersistence;
  params.anvilWind.turbulentEntrainment = best.anvilWind.turbulentEntrainment;
  params.anvilWind.tropopauseHeight = best.anvilWind.tropopauseHeight;
  params.lightingHdr.sunEdgePeakNits = 900;
  params.lightingHdr.maxCll = 900;
  params.lightingHdr.silverLining = best.lightingHdr.silverLining;
  params.lightingHdr.haze = best.lightingHdr.haze;
  params.billowMorphology = {
    ...params.billowMorphology,
    ...best.billowMorphology
  };

  // Keep billow-v1 candidate traceability for future refinement.
  return params;
}

export function normalizeCloudPresetName(name: string | null | undefined): CloudPresetName {
  switch (name?.toLowerCase()) {
    case "billow":
    case "cumulonimbus":
    case "demo-billow":
      return "billow";
    case "billow-v1":
    case "billowv1":
      return "billow-v1";
    case "raw":
      return "raw";
    case "demo":
      return "demo";
    default:
      return "default";
  }
}
