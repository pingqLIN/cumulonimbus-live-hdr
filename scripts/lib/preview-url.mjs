export function buildPreviewUrl(options = {}) {
  const origin = options.origin ?? "http://127.0.0.1:5173";
  const url = new URL("/", origin);
  const orientation = normalizeOrientation(options.orientation);
  const defaultDimensions = getOrientationDimensions(orientation);
  if (options.view) {
    url.searchParams.set("view", options.view);
  }
  if (options.look) {
    url.searchParams.set("look", options.look);
  }
  if (options.simPreset) {
    url.searchParams.set("simPreset", options.simPreset);
  }
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("simWidth", String(options.width ?? defaultDimensions.width));
  url.searchParams.set("simHeight", String(options.height ?? defaultDimensions.height));
  if (options.fps) {
    url.searchParams.set("fps", String(options.fps));
  }
  if (options.seed) {
    url.searchParams.set("seed", String(options.seed));
  }
  if (options.preset) {
    url.searchParams.set("preset", options.preset);
  }
  if (options.captureFrames) {
    url.searchParams.set("captureFrames", String(options.captureFrames));
  }
  for (const key of previewTuningKeys) {
    if (options[key] !== undefined && options[key] !== null && options[key] !== "") {
      url.searchParams.set(key, String(options[key]));
    }
  }

  const outputMode = options.outputMode ?? "live";
  if (outputMode === "capture") {
    url.searchParams.set("capture", "1");
  } else if (outputMode === "live") {
    url.searchParams.set("live", "1");
  }

  return url;
}

export const threeBubbleTuningKeys = [
  "cameraYawDegrees",
  "cameraPitchDegrees",
  "cameraDistance",
  "cameraDistanceScale",
  "cameraTargetOffsetX",
  "cameraTargetOffsetY",
  "cameraTargetOffsetZ",
  "sunAzimuthDegrees",
  "sunElevationDegrees",
  "sunIntensityScale",
  "lightContrast",
  "exposureScale"
];

export const raymarchTuningKeys = [
  "time",
  "systems",
  "tropopause",
  "freezingLevel",
  "windShear",
  "sun",
  "sunIntensity",
  "ambient",
  "ambientIntensity",
  "sunElevation",
  "sunViewerAngle",
  "sunAngle",
  "fbmOctaves",
  "octaves",
  "cloudCurl",
  "curl",
  "horizon",
  "horizonStrength",
  "stepSize",
  "maxSteps",
  "staticMaxSteps",
  "compileSteps",
  "shaderSteps",
  "earlyExitAlpha",
  "earlyExit",
  "shadowSamples",
  "shadowMarchSamples",
  "shadowStep",
  "lStep",
  "lightStep",
  "shadowOcclusion",
  "transmittanceScale",
  "shadowBlock",
  "densityMultiplier",
  "densityScale",
  "alphaDensity",
  "carvingWeight",
  "carving",
  "noiseCarving",
  "edgeErosionWeight",
  "edgeErosion",
  "erosionWeight",
  "surfaceShadowSamples",
  "groundShadowSamples",
  "cloudShadowSamples",
  "surfaceShadowStep",
  "groundShadowStep",
  "cloudShadowStep",
  "surfaceShadowStrength",
  "groundShadowStrength",
  "cloudShadowStrength",
  "terrainFuzz",
  "feltFuzz",
  "fuzz",
  "oceanCrestStrength",
  "crestStrength",
  "waveCrest",
  "surfaceRadius",
  "terrainRadius",
  "modelRadius",
  "groundRadius",
  "sky",
  "light",
  "photographic",
  "photo",
  "dither",
  "displayDither",
  "ortho",
  "surface",
  "morphologyStyle",
  "morphology",
  "shapeStyle",
  "shape",
  "shaderVariant",
  "shader",
  "cloudShader",
  "maxPixels",
  "preserveDrawingBuffer",
  "preserveDrawing",
  "preserveBuffer",
  "debugShaders",
  "shaderDiagnostics"
];

export const previewTuningKeys = [...threeBubbleTuningKeys, ...raymarchTuningKeys];

export function normalizeOrientation(value) {
  return value === "landscape" ? "landscape" : "portrait";
}

export function getOrientationDimensions(orientation) {
  return normalizeOrientation(orientation) === "landscape"
    ? { width: 960, height: 540 }
    : { width: 540, height: 960 };
}
