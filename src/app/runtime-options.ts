import { type BrowserDisplayProfile } from "./display-profile.js";
import { type RaymarchCloudOptions } from "./raymarch-cloud-renderer.js";

export const SAFE_LIVE_MAX_PIXELS = 1280 * 720;

export type Orientation = "portrait" | "landscape";
export type RenderMode = "canvas" | "page";
export type PresetSource = "query" | "browser-profile" | "default";

export type RuntimeOptions = RaymarchCloudOptions & {
  readonly presetName?: string;
  readonly presetSource: PresetSource;
  readonly displayProfile: BrowserDisplayProfile;
  readonly orientation: Orientation;
  readonly renderMode: RenderMode;
  readonly simWidth?: number;
  readonly simHeight?: number;
  readonly timeScale: number;
  readonly captureFrameLimit: number;
  readonly exposeRuntimeDebug: boolean;
  readonly useCpuRenderer: boolean;
};

export const presetOptions = [
  { value: "single-cumulus-day", label: "Single day" },
  { value: "mobile-cumulus", label: "Mobile cloud" },
  { value: "broadcast-landscape", label: "Broadcast" },
  { value: "night-cumulus", label: "Night" }
] as const;

export function resolveRuntimeOptions(
  params: URLSearchParams,
  displayProfile: BrowserDisplayProfile
): RuntimeOptions {
  const orientation = resolveOrientation(params, displayProfile);
  const renderMode = resolveRenderMode(params);
  const presetSelection = resolvePresetSelection(params, displayProfile);
  const preset = resolvePreset(presetSelection.presetName);
  const seed = Math.floor(
    readNumber(params, ["seed"], preset.seed ?? createRuntimeSeed(), 1, Number.MAX_SAFE_INTEGER)
  );

  return {
    ...preset,
    ...presetSelection,
    displayProfile,
    orientation,
    renderMode,
    seed,
    time: readNumber(params, ["time"], preset.time ?? 2.2, 0, 1_000_000),
    timeScale: readNumber(params, ["timeScale", "speed"], 1, 0, 12),
    fps: readNumber(params, ["fps", "simFps"], 30, 1, 360),
    systems: readNumber(params, ["systems", "systemCount"], preset.systems ?? 1, 1, 10),
    tropopause: readNumber(params, ["tropopause", "tropo"], preset.tropopause ?? 11.2, 4, 20),
    freezingLevel: readNumber(
      params,
      ["freezingLevel", "freezing"],
      preset.freezingLevel ?? 4.4,
      0,
      16
    ),
    windShear: readNumber(params, ["windShear", "shear"], preset.windShear ?? 0.42, 0, 1),
    fbmOctaves: readNumber(
      params,
      ["fbmOctaves", "octaves", "cloudOctaves"],
      preset.fbmOctaves ?? 5,
      4,
      6
    ),
    cloudCurl: readNumber(
      params,
      ["cloudCurl", "curl", "curliness"],
      preset.cloudCurl ?? 0.78,
      0,
      1.2
    ),
    horizonStrength: readNumber(
      params,
      ["horizon", "horizonStrength", "horizonFog"],
      preset.horizonStrength ?? 1,
      0,
      1
    ),
    stepSize: readOptionalNumberWithFallback(params, ["stepSize", "rayStep"], preset.stepSize, 0.08, 0.6),
    maxSteps: readOptionalNumberWithFallback(params, ["maxSteps", "steps"], preset.maxSteps, 24, 144),
    staticMaxSteps: readOptionalNumberWithFallback(
      params,
      ["staticMaxSteps", "compileSteps", "shaderSteps"],
      preset.staticMaxSteps,
      24,
      96
    ),
    sunIntensity: readNumber(params, ["sun", "sunIntensity"], preset.sunIntensity ?? 7.2, 0, 10),
    ambientIntensity: readNumber(
      params,
      ["ambient", "amb", "ambientIntensity"],
      preset.ambientIntensity ?? 0.62,
      0,
      2
    ),
    sunElevation: readNumber(
      params,
      ["sunElevation", "sunElev", "elevation"],
      preset.sunElevation ?? 58,
      -20,
      90
    ),
    sunViewerAngle: readNumber(
      params,
      ["sunAngle", "sunViewerAngle", "viewerSunAngle"],
      preset.sunViewerAngle ?? 18,
      -180,
      180
    ),
    photographicStyle: readBoolean(params, ["photographic", "photo"], preset.photographicStyle ?? true),
    lightPreset:
      resolveLightPreset(params.get("light") ?? params.get("lighting")) ?? preset.lightPreset ?? "daylight",
    skyMode:
      resolveSkyMode(params.get("sky") ?? params.get("background") ?? params.get("bg")) ??
      preset.skyMode ??
      "atmosphere",
    transparentBackground: readTransparentBackground(params),
    hdr10: readBoolean(params, ["hdr10", "hdr", "hdrMode"], preset.hdr10 ?? false),
    ortho: readBoolean(params, ["ortho"], preset.ortho ?? false),
    showGrid: readBoolean(params, ["grid", "showGrid"], preset.showGrid ?? false),
    surfaceMode: resolveSurfaceMode(params.get("surface")) ?? preset.surfaceMode ?? "none",
    cameraYawDegrees: readOptionalNumber(params, ["cameraYawDegrees", "yawDegrees", "yaw"]) ?? preset.cameraYawDegrees,
    cameraPitchDegrees:
      readOptionalNumber(params, ["cameraPitchDegrees", "pitchDegrees", "pitch"]) ??
      preset.cameraPitchDegrees,
    cameraDistance: readOptionalNumber(params, ["cameraDistance", "distance"]) ?? preset.cameraDistance,
    maxPixels: readOptionalClampedNumber(params, ["maxPixels"], 128 * 128, 3840 * 2160) ?? preset.maxPixels,
    simWidth: readOptionalNumber(params, ["simWidth", "width"]),
    simHeight: readOptionalNumber(params, ["simHeight", "height"]),
    preserveDrawingBuffer: shouldPreserveDrawingBuffer(params),
    debugShaderDiagnostics: readBoolean(params, ["debugShaders", "shaderDiagnostics"], false),
    captureFrameLimit: Math.round(readNumber(params, ["captureFrames"], 0, 0, 600)),
    exposeRuntimeDebug: shouldExposeRuntimeDebug(params),
    useCpuRenderer: shouldUseCpuRenderer(params)
  };
}

export function resolveOrientation(
  params: URLSearchParams,
  displayProfile: BrowserDisplayProfile
): Orientation {
  const requested = params.get("orientation");
  if (requested === "landscape" || requested === "portrait") {
    return requested;
  }
  return displayProfile.mobileWideView ? "portrait" : "landscape";
}

export function resolvePreset(name: string | undefined): RaymarchCloudOptions {
  switch (name?.toLowerCase()) {
    case "mobile":
    case "mobile-horizon":
    case "portrait-horizon":
    case "mobile-cumulus":
      return {
        seed: 574,
        time: 2.2,
        systems: 1,
        tropopause: 10.8,
        freezingLevel: 4.2,
        windShear: 0.38,
        fbmOctaves: 5,
        cloudCurl: 0.82,
        horizonStrength: 1,
        stepSize: 0.3,
        maxSteps: 54,
        staticMaxSteps: 56,
        sunIntensity: 7.1,
        ambientIntensity: 0.64,
        sunElevation: 60,
        sunViewerAngle: 16,
        skyMode: "atmosphere",
        lightPreset: "daylight",
        photographicStyle: true,
        cameraPitchDegrees: -1,
        cameraDistance: 27,
        maxPixels: 1280 * 720
      };
    case "broadcast-landscape":
      return {
        seed: 574,
        time: 2.2,
        systems: 1,
        tropopause: 11.4,
        freezingLevel: 4.4,
        windShear: 0.46,
        fbmOctaves: 5,
        cloudCurl: 0.76,
        horizonStrength: 1,
        stepSize: 0.32,
        maxSteps: 40,
        staticMaxSteps: 40,
        sunIntensity: 7.3,
        ambientIntensity: 0.66,
        sunElevation: 58,
        sunViewerAngle: 18,
        skyMode: "atmosphere",
        lightPreset: "daylight",
        photographicStyle: true,
        cameraPitchDegrees: -1,
        cameraDistance: 30,
        maxPixels: SAFE_LIVE_MAX_PIXELS
      };
    case "night-cumulus":
    case "moonlight-night":
      return {
        seed: 574,
        time: 2.2,
        systems: 1,
        tropopause: 10.8,
        freezingLevel: 4.2,
        windShear: 0.36,
        fbmOctaves: 5,
        cloudCurl: 0.84,
        horizonStrength: 1,
        stepSize: 0.3,
        maxSteps: 54,
        staticMaxSteps: 56,
        sunIntensity: 1.5,
        ambientIntensity: 0.54,
        sunElevation: -4,
        sunViewerAngle: 70,
        skyMode: "moonlight",
        lightPreset: "backlit-edge",
        photographicStyle: true,
        cameraPitchDegrees: -1,
        cameraDistance: 26,
        maxPixels: 1280 * 720
      };
    case "single-cumulus-day":
    case "noon-blue":
    case undefined:
      return {
        seed: 574,
        time: 2.2,
        systems: 1,
        tropopause: 10.8,
        freezingLevel: 4.2,
        windShear: 0.38,
        fbmOctaves: 5,
        cloudCurl: 0.82,
        horizonStrength: 1,
        stepSize: 0.3,
        maxSteps: 54,
        staticMaxSteps: 56,
        sunIntensity: 7.1,
        ambientIntensity: 0.64,
        sunElevation: 60,
        sunViewerAngle: 16,
        skyMode: "atmosphere",
        lightPreset: "daylight",
        photographicStyle: true,
        cameraPitchDegrees: -1,
        cameraDistance: 27,
        maxPixels: 1280 * 720
      };
    default:
      return resolvePreset("single-cumulus-day");
  }
}

function resolveRenderMode(params: URLSearchParams): RenderMode {
  return params.get("capture") === "1" || params.get("live") === "1" ? "canvas" : "page";
}

function resolvePresetSelection(
  params: URLSearchParams,
  displayProfile: BrowserDisplayProfile
): Pick<RuntimeOptions, "presetName" | "presetSource"> {
  const requestedPreset = params.get("preset") ?? params.get("capturePreset");
  if (requestedPreset !== null && requestedPreset !== "") {
    return { presetName: requestedPreset, presetSource: "query" };
  }
  if (displayProfile.narrowViewport) {
    return { presetName: "mobile-cumulus", presetSource: "browser-profile" };
  }
  return { presetName: "broadcast-landscape", presetSource: "default" };
}

function shouldExposeRuntimeDebug(params: URLSearchParams): boolean {
  return (
    readBoolean(params, ["debug", "debugRuntime"], false) ||
    params.has("captureFrames") ||
    params.get("capture") === "1" ||
    params.get("live") === "1"
  );
}

function shouldPreserveDrawingBuffer(params: URLSearchParams): boolean {
  return params.has("captureFrames") || params.get("capture") === "1" || params.get("live") === "1";
}

function shouldUseCpuRenderer(params: URLSearchParams): boolean {
  const rendererName = params.get("renderer") ?? params.get("render");
  return rendererName === "cpu" || rendererName === "2d" || params.get("webgl") === "0";
}

function resolveLightPreset(value: string | null): RaymarchCloudOptions["lightPreset"] | undefined {
  if (value === "golden-side" || value === "warm-low-angle") {
    return "golden-side";
  }
  if (value === "backlit-edge" || value === "backlit") {
    return "backlit-edge";
  }
  if (value === "daylight") {
    return "daylight";
  }
  return undefined;
}

function resolveSkyMode(value: string | null): RaymarchCloudOptions["skyMode"] | undefined {
  switch (value?.toLowerCase()) {
    case "clear":
    case "blue":
    case "photographic-blue":
      return "clear";
    case "sunset":
    case "evening":
    case "golden":
      return "sunset";
    case "moonlight":
    case "night":
    case "lunar":
      return "moonlight";
    case "demo3":
    case "atmosphere":
    case "sky-dome":
    case "skydome":
      return "atmosphere";
    case "workbench":
    case "dark":
      return "workbench";
    default:
      return undefined;
  }
}

function resolveSurfaceMode(value: string | null): RaymarchCloudOptions["surfaceMode"] | undefined {
  if (value === "ocean" || value === "hills" || value === "none") {
    return value;
  }
  return undefined;
}

function readTransparentBackground(params: URLSearchParams): boolean {
  const transparentValue = params.get("transparent");
  if (transparentValue !== null) {
    return isTruthy(transparentValue);
  }
  const background = params.get("background") ?? params.get("bg");
  return (
    background === "0" ||
    background === "false" ||
    background === "none" ||
    background === "transparent"
  );
}

export function readBoolean(
  params: URLSearchParams,
  names: readonly string[],
  fallback: boolean
): boolean {
  for (const name of names) {
    const value = params.get(name);
    if (value !== null) {
      return isTruthy(value);
    }
  }
  return fallback;
}

export function isTruthy(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "" ||
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

export function readOptionalNumber(
  params: URLSearchParams,
  names: readonly string[]
): number | undefined {
  for (const name of names) {
    const raw = params.get(name);
    const value = Number(raw);
    if (raw !== null && raw !== "" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function readOptionalClampedNumber(
  params: URLSearchParams,
  names: readonly string[],
  minimum: number,
  maximum: number
): number | undefined {
  const value = readOptionalNumber(params, names);
  return value === undefined ? undefined : clamp(value, minimum, maximum);
}

function readOptionalNumberWithFallback(
  params: URLSearchParams,
  names: readonly string[],
  fallback: number | undefined,
  minimum: number,
  maximum: number
): number | undefined {
  const value = readOptionalNumber(params, names) ?? fallback;
  return value === undefined ? undefined : clamp(value, minimum, maximum);
}

function readNumber(
  params: URLSearchParams,
  names: readonly string[],
  fallback: number,
  minimum: number,
  maximum: number
): number {
  return clamp(readOptionalNumber(params, names) ?? fallback, minimum, maximum);
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function createRuntimeSeed(): number {
  const cryptoApi = window.crypto;
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);
    return Math.max(1, values[0] ?? 1);
  }
  return Math.max(1, Math.floor((Date.now() + performance.now()) % Number.MAX_SAFE_INTEGER));
}
