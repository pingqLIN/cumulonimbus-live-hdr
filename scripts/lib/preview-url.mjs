export function buildPreviewUrl(options = {}) {
  const origin = options.origin ?? "http://127.0.0.1:5173";
  const url = new URL("/", origin);
  const orientation = normalizeOrientation(options.orientation);
  const defaultDimensions = getOrientationDimensions(orientation);
  url.searchParams.set("view", options.view ?? "3d");
  url.searchParams.set("look", options.look ?? "demo-like");
  url.searchParams.set("simPreset", options.simPreset ?? "mid");
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("simWidth", String(options.width ?? defaultDimensions.width));
  url.searchParams.set("simHeight", String(options.height ?? defaultDimensions.height));
  url.searchParams.set("fps", String(options.fps ?? 30));
  if (options.renderer) {
    url.searchParams.set("renderer", options.renderer);
  }
  if (options.preset) {
    url.searchParams.set("preset", options.preset);
  }
  if (options.captureFrames) {
    url.searchParams.set("captureFrames", String(options.captureFrames));
  }
  for (const key of threeBubbleTuningKeys) {
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

export function normalizeOrientation(value) {
  return value === "landscape" ? "landscape" : "portrait";
}

export function getOrientationDimensions(orientation) {
  return normalizeOrientation(orientation) === "landscape"
    ? { width: 960, height: 540 }
    : { width: 540, height: 960 };
}
