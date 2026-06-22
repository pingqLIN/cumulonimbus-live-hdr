import "../styles/app.css";
import {
  defaultCloudParams,
  sampleCloudPixel,
  tonemapSdr,
  type CloudParams
} from "../core/cloud-field.js";
import {
  RaymarchCloudRenderer,
  detectBrowserDisplayProfile,
  type BrowserDisplayProfile,
  type RaymarchCloudOptions
} from "./raymarch-cloud-renderer.js";

type RuntimeOptions = RaymarchCloudOptions & {
  readonly presetName?: string;
  readonly presetSource: "query" | "browser-profile" | "random-default";
  readonly displayProfile: BrowserDisplayProfile;
};

declare global {
  interface Window {
    __cumulonimbusRuntime?: {
      displayProfile: BrowserDisplayProfile;
      options: RuntimeOptions;
    };
  }
}

const canvasElement = document.querySelector<HTMLCanvasElement>("#cloud-canvas");
if (!canvasElement) {
  throw new Error("Missing cloud canvas");
}
const canvas: HTMLCanvasElement = canvasElement;

const query = new URLSearchParams(window.location.search);
const displayProfile = detectBrowserDisplayProfile();
const options = resolveOptions(query, displayProfile);
if (shouldExposeRuntimeDebug(query)) {
  window.__cumulonimbusRuntime = { displayProfile, options };
}
let fallbackActivated = false;
canvas.addEventListener(
  "webglcontextlost",
  (event) => {
    event.preventDefault();
    activateCpuFallback("context-lost");
  },
  { once: true }
);
const renderer = shouldUseCpuRenderer(query) ? createCpuRenderer(canvas, options) : createRenderer(canvas, options);
const frameIntervalMs = 1000 / readNumber(query, ["fps", "simFps"], 30, 1, 360);
const captureFrameLimit = Math.round(readNumber(query, ["captureFrames"], 0, 0, 600));
let renderedFrameCount = 0;
let startTime = performance.now() - (options.time ?? 0) * 1000;
let nextFrameTime = startTime;
let animationFrame = 0;
let resizeObserver: ResizeObserver | undefined;

document.documentElement.dataset.renderMode =
  query.get("capture") === "1" || query.get("live") === "1" ? "canvas" : "page";
document.documentElement.dataset.orientation = resolveOrientation(query);
document.documentElement.dataset.deviceProfile = displayProfile.mobileWideView ? "mobile" : "desktop";

if (renderer) {
  resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(canvas);
}

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  renderer?.dispose();
});

if (renderer) {
  resize();
  animationFrame = requestAnimationFrame(renderFrame);
}

function createRenderer(
  targetCanvas: HTMLCanvasElement,
  rendererOptions: RaymarchCloudOptions
): RaymarchCloudRenderer | undefined {
  try {
    document.documentElement.dataset.renderStatus = "starting";
    const cloudRenderer = new RaymarchCloudRenderer(targetCanvas, rendererOptions);
    document.documentElement.dataset.renderStatus = "ready";
    return cloudRenderer;
  } catch (error) {
    document.documentElement.dataset.renderStatus = "webgl-unavailable";
    targetCanvas.setAttribute("aria-label", "WebGL renderer unavailable");
    paintCpuFallback(targetCanvas, rendererOptions, "webgl-unavailable", false);
    if (shouldExposeRuntimeDebug(query)) {
      console.warn("Cumulonimbus renderer startup skipped:", error);
    }
    return undefined;
  }
}

function createCpuRenderer(
  targetCanvas: HTMLCanvasElement,
  rendererOptions: RaymarchCloudOptions
): undefined {
  fallbackActivated = true;
  document.documentElement.dataset.renderStatus = "fallback-2d";
  paintCpuFallback(targetCanvas, rendererOptions, "cpu-requested", false);
  return undefined;
}

function activateCpuFallback(reason: string): void {
  if (fallbackActivated) {
    return;
  }
  fallbackActivated = true;
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  document.documentElement.dataset.renderStatus = "fallback-2d";
  paintCpuFallback(canvas, options, reason, true);
}

function paintCpuFallback(
  targetCanvas: HTMLCanvasElement,
  rendererOptions: RaymarchCloudOptions,
  reason: string,
  replaceCanvas: boolean
): void {
  const fallbackCanvas = replaceCanvas ? cloneCanvasForFallback(targetCanvas) : targetCanvas;
  const rect = targetCanvas.getBoundingClientRect();
  const cssWidth = Math.max(2, Math.round(rect.width || window.innerWidth || 540));
  const cssHeight = Math.max(2, Math.round(rect.height || window.innerHeight || 960));
  const maxFallbackPixels = rendererOptions.displayProfile?.mobileWideView ? 180_000 : 260_000;
  const scale = Math.min(1, Math.sqrt(maxFallbackPixels / Math.max(1, cssWidth * cssHeight)));
  const width = Math.max(2, Math.floor(cssWidth * scale));
  const height = Math.max(2, Math.floor(cssHeight * scale));
  fallbackCanvas.width = width;
  fallbackCanvas.height = height;
  fallbackCanvas.setAttribute("aria-label", "2D cumulonimbus fallback renderer");
  fallbackCanvas.dataset.fallbackReason = reason;
  const context = fallbackCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const image = context.createImageData(width, height);
  const data = image.data;
  const fallbackParams = createFallbackCloudParams(rendererOptions);
  const fallbackTime = rendererOptions.time ?? 2.2;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = sampleCloudPixel(x / Math.max(1, width - 1), y / Math.max(1, height - 1), fallbackTime, fallbackParams);
      const index = (y * width + x) * 4;
      data[index] = Math.round(tonemapSdr(pixel.r) * 255);
      data[index + 1] = Math.round(tonemapSdr(pixel.g) * 255);
      data[index + 2] = Math.round(tonemapSdr(pixel.b) * 255);
      data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
}

function cloneCanvasForFallback(targetCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const fallbackCanvas = document.createElement("canvas");
  fallbackCanvas.id = targetCanvas.id;
  fallbackCanvas.className = targetCanvas.className;
  fallbackCanvas.setAttribute("role", targetCanvas.getAttribute("role") ?? "img");
  targetCanvas.replaceWith(fallbackCanvas);
  return fallbackCanvas;
}

function createFallbackCloudParams(rendererOptions: RaymarchCloudOptions): CloudParams {
  const params = structuredClone(defaultCloudParams) as CloudParams;
  params.seed = Math.floor(rendererOptions.seed ?? params.seed);
  params.stormLifecycle.stormAge = clamp((rendererOptions.time ?? 2.2) / 5, 0.34, 0.78);
  params.humidityUplift.upliftStrength = clamp((rendererOptions.tropopause ?? 12) / 18, 0.44, 0.82);
  params.humidityUplift.humidity = clamp((rendererOptions.ambientIntensity ?? 0.58) * 0.9, 0.42, 0.78);
  params.anvilWind.windShear = clamp(rendererOptions.windShear ?? params.anvilWind.windShear, 0.12, 0.92);
  params.anvilWind.anvilOutflow = clamp(rendererOptions.cloudCurl ?? 0.72, 0.42, 0.92);
  params.anvilWind.anvilPersistence = clamp(rendererOptions.horizonStrength ?? 0.68, 0.42, 0.86);
  params.anvilWind.tropopauseHeight = clamp((rendererOptions.tropopause ?? 12) / 18, 0.54, 0.86);
  params.lightingHdr.silverLining = clamp((rendererOptions.sunIntensity ?? 5.2) / 8, 0.42, 0.9);
  params.billowMorphology.edgeScallop = clamp(rendererOptions.cloudCurl ?? 0.72, 0.36, 0.9);
  params.billowMorphology.skyDarkness = rendererOptions.skyMode === "moonlight" ? 0.86 : 0.58;
  return params;
}

function renderFrame(now: number): void {
  if (!renderer) {
    return;
  }
  if (now < nextFrameTime) {
    animationFrame = requestAnimationFrame(renderFrame);
    return;
  }

  resize();
  try {
    renderer.render((now - startTime) / 1000);
  } catch (error) {
    activateCpuFallback("render-error");
    if (shouldExposeRuntimeDebug(query)) {
      console.warn("Cumulonimbus renderer render failed:", error);
    }
    return;
  }
  renderedFrameCount += 1;
  if (captureFrameLimit > 0 && renderedFrameCount >= captureFrameLimit) {
    return;
  }

  nextFrameTime = now + frameIntervalMs;
  animationFrame = requestAnimationFrame(renderFrame);
}

function resize(): void {
  if (!renderer) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const orientation = resolveOrientation(query);
  const fallback =
    orientation === "landscape" ? { width: 960, height: 540 } : { width: 540, height: 960 };
  const width = readNumber(
    query,
    ["simWidth", "width"],
    Math.round(rect.width || fallback.width),
    2,
    7680
  );
  const height = readNumber(
    query,
    ["simHeight", "height"],
    Math.round(rect.height || fallback.height),
    2,
    4320
  );
  renderer.resize(Math.round(width), Math.round(height));
}

function resolveOptions(
  params: URLSearchParams,
  displayProfile: BrowserDisplayProfile
): RuntimeOptions {
  const presetSelection = resolvePresetSelection(params, displayProfile);
  const preset = presetSelection.presetName ? resolvePreset(presetSelection.presetName) : {};
  const seed = Math.floor(
    readNumber(params, ["seed"], preset.seed ?? createRuntimeSeed(), 1, Number.MAX_SAFE_INTEGER)
  );
  const randomAtmosphere = shouldUseRandomAtmosphere(preset)
    ? createRandomAtmosphere(createSeededRandom(seed))
    : {};

  return {
    ...preset,
    ...randomAtmosphere,
    ...presetSelection,
    displayProfile,
    seed,
    time: readNumber(params, ["time"], randomAtmosphere.time ?? preset.time ?? 0, 0, 1_000_000),
    fps: readNumber(params, ["fps", "simFps"], 30, 1, 360),
    systems: readNumber(params, ["systems", "systemCount"], preset.systems ?? 3, 1, 10),
    tropopause: readNumber(params, ["tropopause", "tropo"], preset.tropopause ?? 12, 4, 20),
    freezingLevel: readNumber(
      params,
      ["freezingLevel", "freezing"],
      preset.freezingLevel ?? 5,
      0,
      16
    ),
    windShear: readNumber(
      params,
      ["windShear", "shear"],
      randomAtmosphere.windShear ?? preset.windShear ?? 0.82,
      0,
      1
    ),
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
      preset.cloudCurl ?? 0.8,
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
    sunIntensity: readNumber(
      params,
      ["sun", "sunIntensity"],
      randomAtmosphere.sunIntensity ?? preset.sunIntensity ?? 5.2,
      0,
      10
    ),
    ambientIntensity: readNumber(
      params,
      ["ambient", "amb", "ambientIntensity"],
      randomAtmosphere.ambientIntensity ?? preset.ambientIntensity ?? 0.58,
      0,
      2
    ),
    sunElevation: readNumber(
      params,
      ["sunElevation", "sunElev", "elevation"],
      randomAtmosphere.sunElevation ?? preset.sunElevation ?? 18,
      -20,
      90
    ),
    sunViewerAngle: readNumber(
      params,
      ["sunAngle", "sunViewerAngle", "viewerSunAngle"],
      randomAtmosphere.sunViewerAngle ?? preset.sunViewerAngle ?? 25,
      -180,
      180
    ),
    photographicStyle: readBoolean(
      params,
      ["photographic", "photo"],
      randomAtmosphere.photographicStyle ?? preset.photographicStyle ?? true
    ),
    lightPreset:
      resolveLightPreset(params.get("light") ?? params.get("lighting")) ??
      randomAtmosphere.lightPreset ??
      preset.lightPreset,
    skyMode:
      resolveSkyMode(params.get("sky") ?? params.get("background") ?? params.get("bg")) ??
      randomAtmosphere.skyMode ??
      preset.skyMode ??
      "atmosphere",
    transparentBackground: readTransparentBackground(params),
    hdr10: readBoolean(params, ["hdr10", "hdr", "hdrMode"], preset.hdr10 ?? false),
    ortho: readBoolean(params, ["ortho"], false),
    cameraYawDegrees: readOptionalNumber(params, ["cameraYawDegrees", "yawDegrees", "yaw"]),
    cameraPitchDegrees: readOptionalNumber(params, ["cameraPitchDegrees", "pitchDegrees", "pitch"]),
    cameraDistance: readOptionalNumber(params, ["cameraDistance", "distance"]),
    maxPixels: readOptionalClampedNumber(params, ["maxPixels"], 128 * 128, 3840 * 2160),
    preserveDrawingBuffer: shouldPreserveDrawingBuffer(params),
    debugShaderDiagnostics: readBoolean(params, ["debugShaders", "shaderDiagnostics"], false)
  };
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
    return { presetName: "mobile-horizon", presetSource: "browser-profile" };
  }
  return { presetSource: "random-default" };
}

function resolveOrientation(params: URLSearchParams): "landscape" | "portrait" {
  return params.get("orientation") === "landscape" ? "landscape" : "portrait";
}

function shouldExposeRuntimeDebug(params: URLSearchParams): boolean {
  return (
    readBoolean(params, ["debug", "debugRuntime"], false) ||
    params.has("captureFrames") ||
    params.get("capture") === "1"
  );
}

function shouldPreserveDrawingBuffer(params: URLSearchParams): boolean {
  return params.has("captureFrames") || params.get("capture") === "1";
}

function shouldUseCpuRenderer(params: URLSearchParams): boolean {
  const rendererName = params.get("renderer") ?? params.get("render");
  return rendererName === "cpu" || rendererName === "2d" || params.get("webgl") === "0";
}

function shouldUseRandomAtmosphere(preset: RaymarchCloudOptions): boolean {
  return Object.keys(preset).length === 0;
}

function createRandomAtmosphere(random: () => number): RaymarchCloudOptions {
  const bucket = random();
  if (bucket < 0.8) {
    return {
      time: mix(0.8, 9.5, random()),
      windShear: mix(0.6, 0.86, random()),
      sunIntensity: mix(7.4, 9.2, random()),
      ambientIntensity: mix(0.62, 0.82, random()),
      sunElevation: mix(66, 82, random()),
      sunViewerAngle: mix(-18, 28, random()),
      skyMode: "atmosphere",
      lightPreset: "daylight",
      photographicStyle: true
    };
  }
  if (bucket < 0.88) {
    return {
      time: mix(1.4, 8.4, random()),
      windShear: mix(0.72, 0.92, random()),
      sunIntensity: mix(4.2, 5.6, random()),
      ambientIntensity: mix(0.44, 0.58, random()),
      sunElevation: mix(7, 14, random()),
      sunViewerAngle: mix(-42, -18, random()),
      skyMode: "atmosphere",
      lightPreset: "golden-side",
      photographicStyle: true
    };
  }
  if (bucket < 0.96) {
    return {
      time: mix(1.8, 9.0, random()),
      windShear: mix(0.76, 0.96, random()),
      sunIntensity: mix(3.4, 4.8, random()),
      ambientIntensity: mix(0.38, 0.5, random()),
      sunElevation: mix(-3, 4, random()),
      sunViewerAngle: mix(-64, -28, random()),
      skyMode: "atmosphere",
      lightPreset: "golden-side",
      photographicStyle: true
    };
  }
  return {
    time: mix(2.0, 9.5, random()),
    windShear: mix(0.62, 0.88, random()),
    sunIntensity: mix(1.0, 1.8, random()),
    ambientIntensity: mix(0.44, 0.58, random()),
    sunElevation: mix(-9, -3, random()),
    sunViewerAngle: mix(48, 108, random()),
    skyMode: "moonlight",
    lightPreset: "backlit-edge",
    photographicStyle: true
  };
}

function createSeededRandom(seed: number): () => number {
  let state = Math.floor(seed) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createRuntimeSeed(): number {
  const cryptoApi = window.crypto;
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);
    return Math.max(1, values[0] ?? 1);
  }
  return Math.max(1, Math.floor((Date.now() + performance.now()) % Number.MAX_SAFE_INTEGER));
}

function mix(left: number, right: number, amount: number): number {
  return left + (right - left) * amount;
}

function resolvePreset(name: string | null): RaymarchCloudOptions {
  switch (name?.toLowerCase()) {
    case "mobile":
    case "mobile-horizon":
    case "portrait-horizon":
      return {
        seed: 574,
        time: 2.2,
        systems: 5,
        tropopause: 13.2,
        freezingLevel: 4.4,
        windShear: 0.92,
        fbmOctaves: 5,
        cloudCurl: 1,
        horizonStrength: 1,
        stepSize: 0.34,
        maxSteps: 48,
        staticMaxSteps: 48,
        sunIntensity: 4.9,
        ambientIntensity: 0.52,
        sunElevation: 8,
        sunViewerAngle: -32,
        skyMode: "atmosphere",
        lightPreset: "golden-side",
        photographicStyle: true,
        cameraPitchDegrees: 4,
        cameraDistance: 30
      };
    case "sunrise-horizon":
      return {
        seed: 574,
        time: 2.2,
        systems: 5,
        tropopause: 13.2,
        freezingLevel: 4.4,
        windShear: 0.92,
        fbmOctaves: 5,
        cloudCurl: 1,
        horizonStrength: 1,
        sunIntensity: 4.7,
        ambientIntensity: 0.5,
        sunElevation: 5,
        sunViewerAngle: -35,
        skyMode: "atmosphere",
        lightPreset: "golden-side",
        photographicStyle: true,
        cameraPitchDegrees: 4,
        cameraDistance: 30
      };
    case "noon-blue":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13.5,
        freezingLevel: 4.4,
        windShear: 0.82,
        fbmOctaves: 5,
        cloudCurl: 0.72,
        horizonStrength: 0.72,
        sunIntensity: 7.8,
        ambientIntensity: 0.72,
        sunElevation: 70,
        sunViewerAngle: 18,
        skyMode: "atmosphere",
        lightPreset: "daylight",
        photographicStyle: true
      };
    case "model-landscape":
    case "model-portrait":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 12,
        freezingLevel: 5,
        windShear: 0.82,
        fbmOctaves: 5,
        cloudCurl: 0.78,
        horizonStrength: 0.82,
        skyMode: "atmosphere",
        photographicStyle: true
      };
    case "high-sun-daylight":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13.5,
        freezingLevel: 4.4,
        windShear: 0.76,
        sunIntensity: 7.4,
        ambientIntensity: 0.55,
        sunElevation: 58,
        sunViewerAngle: 20,
        skyMode: "atmosphere",
        lightPreset: "daylight",
        photographicStyle: true
      };
    case "warm-low-angle":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13,
        freezingLevel: 4.5,
        windShear: 0.84,
        sunIntensity: 5,
        ambientIntensity: 0.48,
        sunElevation: 12,
        sunViewerAngle: -35,
        skyMode: "atmosphere",
        photographicStyle: true
      };
    case "photographic-mature":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13.5,
        freezingLevel: 4.35,
        windShear: 0.82,
        sunIntensity: 7.15,
        ambientIntensity: 0.52,
        sunElevation: 42,
        sunViewerAngle: 25,
        skyMode: "atmosphere",
        photographicStyle: true
      };
    case "sunset-anvil":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13.5,
        freezingLevel: 4.35,
        windShear: 0.88,
        sunIntensity: 4.4,
        ambientIntensity: 0.46,
        sunElevation: 5,
        sunViewerAngle: -25,
        skyMode: "atmosphere",
        photographicStyle: true
      };
    case "moonlight-night":
      return {
        seed: 574,
        time: 2.2,
        systems: 3,
        tropopause: 13.5,
        freezingLevel: 4.2,
        windShear: 0.78,
        sunIntensity: 1.6,
        ambientIntensity: 0.5,
        sunElevation: -4,
        sunViewerAngle: 70,
        skyMode: "moonlight",
        lightPreset: "backlit-edge",
        photographicStyle: true
      };
    default:
      return {};
  }
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

function readBoolean(
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

function isTruthy(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "" ||
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

function readOptionalNumber(params: URLSearchParams, names: readonly string[]): number | undefined {
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

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
