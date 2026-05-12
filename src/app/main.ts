import "../styles/app.css";
import type { CloudParams } from "../core/cloud-field.js";
import { createCloudPresetParams, normalizeCloudPresetName } from "../core/presets.js";
import { CpuPreviewRenderer } from "./cpu-preview-renderer.js";
import type { PreviewRenderer } from "./preview-renderer.js";
import {
  normalizeThreeBubbleLookPresetName,
  type ThreeBubbleLookPresetName
} from "./three-bubble-look.js";
import {
  DEFAULT_THREE_BUBBLE_TUNING,
  normalizeThreeBubbleTuning,
  type ThreeBubbleTuning
} from "./three-bubble-tuning.js";
import { WebGpuPreviewRenderer } from "./webgpu-preview-renderer.js";

const canvasElement = document.querySelector<HTMLCanvasElement>("#cloud-canvas");
if (!canvasElement) {
  throw new Error("Missing cloud canvas");
}
const canvas: HTMLCanvasElement = canvasElement;

const query = new URLSearchParams(window.location.search);
if (
  query.get("capture") === "1" ||
  query.get("capture") === "canvas" ||
  query.get("live") === "1" ||
  query.get("live") === "canvas"
) {
  document.documentElement.dataset.capture = "canvas";
}
const cloudPresetName = normalizeCloudPresetName(query.get("cloudPreset") ?? query.get("preset"));
const viewMode = resolveViewMode();
const threeBubbleLookPreset = resolveThreeBubbleLookPresetName();
const initialThreeBubbleTuning = resolveThreeBubbleTuningFromQuery();
document.documentElement.dataset.currentView = viewMode;
document.documentElement.dataset.currentLook = threeBubbleLookPreset;
const params: CloudParams = createCloudPresetParams(cloudPresetName);
let threeBubbleTuning: ThreeBubbleTuning = { ...initialThreeBubbleTuning };
let paused = false;
let start = performance.now();
let lastFrameTime = start;
let nextFrameTime = start;
let animationFrame = 0;
let lastMetricsPaintTime = 0;
let renderedFrameCount = 0;
let renderer: PreviewRenderer;

type PreviewResolution = {
  width: number;
  height: number;
  label: string;
};

const PRESET_PREVIEW_RESOLUTIONS = {
  low: { width: 360, height: 640, label: "low (360x640)" },
  mid: { width: 540, height: 960, label: "mid (540x960)" },
  live4k: { width: 1080, height: 1920, label: "live4k preview" },
  high: { width: 720, height: 1280, label: "high (720x1280)" }
} as const;
type PresetResolutionName = keyof typeof PRESET_PREVIEW_RESOLUTIONS;
const FORCE_CPU =
  query.get("renderer") === "cpu" ||
  cloudPresetName === "billow" ||
  cloudPresetName === "billow-v1";
let previewResolution: PreviewResolution = { width: 360, height: 640, label: "auto fallback" };
const simFps = resolveSimFps();
const captureFrameLimit = resolveCaptureFrameLimit();

type NumericParamId =
  | "seed"
  | "stormAge"
  | "humidity"
  | "upliftStrength"
  | "windShear"
  | "anvilOutflow"
  | "anvilPersistence"
  | "sunEdgePeakNits"
  | "haze";

type ThreeBubbleTuningParamId = keyof ThreeBubbleTuning;

function setNumericParam(id: NumericParamId, value: number): void {
  switch (id) {
    case "seed":
      params.seed = value;
      break;
    case "stormAge":
      params.stormLifecycle.stormAge = value;
      params.stormLifecycle.phase =
        value < 0.33 ? "developing" : value > 0.78 ? "dissipating" : "mature";
      break;
    case "humidity":
      params.humidityUplift.humidity = value;
      params.humidityUplift.condensationRate = 0.18 + value * 0.18;
      break;
    case "upliftStrength":
      params.humidityUplift.upliftStrength = value;
      break;
    case "windShear":
      params.anvilWind.windShear = value;
      params.anvilWind.turbulentEntrainment = 0.24 + value * 0.46;
      break;
    case "anvilOutflow":
      params.anvilWind.anvilOutflow = value;
      break;
    case "anvilPersistence":
      params.anvilWind.anvilPersistence = value;
      break;
    case "sunEdgePeakNits":
      params.lightingHdr.sunEdgePeakNits = value;
      params.lightingHdr.maxCll = value;
      break;
    case "haze":
      params.lightingHdr.haze = value;
      break;
  }
}

function getNumericParam(id: NumericParamId): number {
  switch (id) {
    case "seed":
      return params.seed;
    case "stormAge":
      return params.stormLifecycle.stormAge;
    case "humidity":
      return params.humidityUplift.humidity;
    case "upliftStrength":
      return params.humidityUplift.upliftStrength;
    case "windShear":
      return params.anvilWind.windShear;
    case "anvilOutflow":
      return params.anvilWind.anvilOutflow;
    case "anvilPersistence":
      return params.anvilWind.anvilPersistence;
    case "sunEdgePeakNits":
      return params.lightingHdr.sunEdgePeakNits;
    case "haze":
      return params.lightingHdr.haze;
  }
}

function bindNumber(id: NumericParamId): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.value = String(getNumericParam(id));
  input.addEventListener("input", () => {
    setNumericParam(id, Number(input.value));
  });
}

function setThreeBubbleTuningParam(id: ThreeBubbleTuningParamId, value: number): void {
  threeBubbleTuning = normalizeThreeBubbleTuning({
    ...threeBubbleTuning,
    [id]: value
  });
  renderer?.setThreeBubbleTuning?.(threeBubbleTuning);
}

function bindThreeBubbleTuningNumber(id: ThreeBubbleTuningParamId): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.value = String(threeBubbleTuning[id]);
  input.addEventListener("input", () => {
    setThreeBubbleTuningParam(id, Number(input.value));
  });
}

function setupControls(): void {
  setupNavigationControls();
  bindNumber("seed");
  bindNumber("stormAge");
  bindNumber("humidity");
  bindNumber("upliftStrength");
  bindNumber("windShear");
  bindNumber("anvilOutflow");
  bindNumber("anvilPersistence");
  bindNumber("sunEdgePeakNits");
  bindNumber("haze");
  for (const id of threeBubbleTuningParamIds) {
    bindThreeBubbleTuningNumber(id);
  }

  document.querySelector<HTMLButtonElement>("#pause")?.addEventListener("click", (event) => {
    paused = !paused;
    const button = event.currentTarget as HTMLButtonElement;
    button.textContent = paused ? "Resume" : "Pause";
    if (!paused) {
      const now = performance.now();
      lastFrameTime = now;
      nextFrameTime = now;
      animationFrame = requestAnimationFrame(draw);
    }
  });

  document.querySelector<HTMLButtonElement>("#reset")?.addEventListener("click", () => {
    Object.assign(params, createCloudPresetParams(cloudPresetName));
    threeBubbleTuning = { ...initialThreeBubbleTuning };
    for (const id of numericParamIds) {
      const input = document.querySelector<HTMLInputElement>(`#${id}`);
      if (input) {
        input.value = String(getNumericParam(id));
      }
    }
    for (const id of threeBubbleTuningParamIds) {
      const input = document.querySelector<HTMLInputElement>(`#${id}`);
      if (input) {
        input.value = String(threeBubbleTuning[id]);
      }
    }
    start = performance.now();
    lastFrameTime = start;
    nextFrameTime = start;
    renderer.setThreeBubbleTuning?.(threeBubbleTuning);
    renderer.reset();
  });
}

function resizeCanvas(): void {
  renderer.resize(previewResolution.width, previewResolution.height);
}

function draw(now: number): void {
  const fpsThrottleMs = simFps > 0 ? 1000 / simFps : 0;
  if (fpsThrottleMs > 0 && now < nextFrameTime) {
    if (!paused) {
      animationFrame = requestAnimationFrame(draw);
    }
    return;
  }
  resizeCanvas();
  const time = (now - start) / 1000;
  const deltaSeconds = Math.min(0.08, Math.max(1 / 120, (now - lastFrameTime) / 1000));
  lastFrameTime = now;
  renderer.render(time, deltaSeconds, params);
  renderPreviewMetrics(now);
  renderedFrameCount += 1;
  if (captureFrameLimit > 0 && renderedFrameCount >= captureFrameLimit) {
    paused = true;
    return;
  }
  if (fpsThrottleMs > 0) {
    nextFrameTime = now + fpsThrottleMs;
  }
  if (!paused) {
    animationFrame = requestAnimationFrame(draw);
  }
}

const numericParamIds: readonly NumericParamId[] = [
  "seed",
  "stormAge",
  "humidity",
  "upliftStrength",
  "windShear",
  "anvilOutflow",
  "anvilPersistence",
  "sunEdgePeakNits",
  "haze"
];

const threeBubbleTuningParamIds: readonly ThreeBubbleTuningParamId[] = [
  "cameraYawDegrees",
  "cameraPitchDegrees",
  "cameraDistanceScale",
  "sunAzimuthDegrees",
  "sunElevationDegrees",
  "sunIntensityScale",
  "lightContrast",
  "exposureScale"
];

function setupNavigationControls(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-view-mode]")) {
    const targetMode = button.dataset.viewMode === "3d" ? "3d" : "field";
    button.setAttribute("aria-pressed", String(targetMode === viewMode));
    button.addEventListener("click", () => {
      if (targetMode === viewMode) {
        return;
      }
      navigateWithSearch((searchParams) => {
        if (targetMode === "3d") {
          searchParams.set("view", "3d");
          return;
        }
        searchParams.delete("view");
        searchParams.delete("model");
      });
    });
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-look-preset]")) {
    const targetPreset = normalizeThreeBubbleLookPresetName(button.dataset.lookPreset ?? null);
    button.setAttribute(
      "aria-pressed",
      String(viewMode === "3d" && targetPreset === threeBubbleLookPreset)
    );
    button.addEventListener("click", () => {
      navigateWithSearch((searchParams) => {
        searchParams.set("view", "3d");
        searchParams.set("look", targetPreset);
      });
    });
  }
}

async function createRenderer(): Promise<PreviewRenderer> {
  const rendererStatus = document.querySelector<HTMLElement>("#renderer-status");
  if (viewMode === "3d") {
    const { ThreeBubblePreviewRenderer } = await import("./three-bubble-preview-renderer.js");
    previewResolution = resolvePreviewResolution("webgpu");
    if (rendererStatus) {
      rendererStatus.textContent = `Renderer: Three.js bubble model (${previewResolution.label}) · look=${threeBubbleLookPreset}${resolvePresetLabel()}${resolveFpsLabel()}`;
    }
    return new ThreeBubblePreviewRenderer(canvas, threeBubbleLookPreset, threeBubbleTuning);
  }

  const webGpuRenderer = FORCE_CPU ? null : await WebGpuPreviewRenderer.create(canvas);
  if (webGpuRenderer) {
    previewResolution = resolvePreviewResolution("webgpu");
    if (rendererStatus) {
      rendererStatus.textContent = `Renderer: WebGPU field (${previewResolution.label})${resolvePresetLabel()}${resolveFpsLabel()}`;
    }
    return webGpuRenderer;
  }

  const contextCandidate = canvas.getContext("2d", { alpha: false });
  if (!contextCandidate) {
    throw new Error("Canvas 2D context is unavailable");
  }
  previewResolution = resolvePreviewResolution("cpu");
  if (rendererStatus) {
    rendererStatus.textContent = `Renderer: CPU field (${previewResolution.label})${resolvePresetLabel()}${resolveFpsLabel()}`;
  }
  return new CpuPreviewRenderer(canvas, contextCandidate);
}

async function bootstrap(): Promise<void> {
  renderer = await createRenderer();
  setupControls();
  animationFrame = requestAnimationFrame(draw);
}

void bootstrap();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});

function readNumberFromQuery(name: string, fallback: number): number {
  const raw = query.get(name);
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return value;
}

function resolveSimFps(): number {
  const aliases = ["simFps", "fps", "maxFps"];
  for (const alias of aliases) {
    const value = Math.round(readNumberFromQuery(alias, 0));
    if (value > 0) {
      return Math.min(360, value);
    }
  }
  return 0;
}

function resolveCaptureFrameLimit(): number {
  const value = Math.round(readNumberFromQuery("captureFrames", 0));
  if (value <= 0) {
    return 0;
  }
  return Math.min(600, value);
}

function resolveFpsLabel(): string {
  if (simFps <= 0) {
    return "";
  }
  return ` · simFps=${simFps}`;
}

function resolvePresetLabel(): string {
  if (cloudPresetName === "default") {
    return "";
  }
  return ` · preset=${cloudPresetName}`;
}

function resolveViewMode(): "field" | "3d" {
  const raw = (query.get("view") ?? query.get("model") ?? "field").toLowerCase();
  if (raw === "3d" || raw === "bubble" || raw === "3d-billow") {
    return "3d";
  }
  return "field";
}

function resolveThreeBubbleLookPresetName(): ThreeBubbleLookPresetName {
  const rawLook = query.get("look") ?? query.get("lookPreset");
  return rawLook ? normalizeThreeBubbleLookPresetName(rawLook) : "demo-like";
}

function resolveThreeBubbleTuningFromQuery(): ThreeBubbleTuning {
  return normalizeThreeBubbleTuning({
    cameraYawDegrees: readNumberFromQuery(
      "cameraYawDegrees",
      DEFAULT_THREE_BUBBLE_TUNING.cameraYawDegrees
    ),
    cameraPitchDegrees: readNumberFromQuery(
      "cameraPitchDegrees",
      DEFAULT_THREE_BUBBLE_TUNING.cameraPitchDegrees
    ),
    cameraDistanceScale: readNumberFromQuery(
      "cameraDistanceScale",
      DEFAULT_THREE_BUBBLE_TUNING.cameraDistanceScale
    ),
    sunAzimuthDegrees: readNumberFromQuery(
      "sunAzimuthDegrees",
      DEFAULT_THREE_BUBBLE_TUNING.sunAzimuthDegrees
    ),
    sunElevationDegrees: readNumberFromQuery(
      "sunElevationDegrees",
      DEFAULT_THREE_BUBBLE_TUNING.sunElevationDegrees
    ),
    sunIntensityScale: readNumberFromQuery(
      "sunIntensityScale",
      DEFAULT_THREE_BUBBLE_TUNING.sunIntensityScale
    ),
    lightContrast: readNumberFromQuery("lightContrast", DEFAULT_THREE_BUBBLE_TUNING.lightContrast),
    exposureScale: readNumberFromQuery("exposureScale", DEFAULT_THREE_BUBBLE_TUNING.exposureScale)
  });
}

function renderPreviewMetrics(now: number): void {
  if (now - lastMetricsPaintTime < 250) {
    return;
  }
  lastMetricsPaintTime = now;

  const panel = document.querySelector<HTMLElement>("#metrics-panel");
  const grid = document.querySelector<HTMLElement>("[data-metric-grid]");
  if (!panel || !grid) {
    return;
  }

  const metrics = renderer.getMetrics?.() ?? null;
  if (!metrics) {
    grid.replaceChildren(createMetricRow("Mode", renderer.mode));
    return;
  }

  const rows = [
    createMetricTitle(metrics.title),
    createMetricRow("Mode", renderer.mode),
    ...metrics.items.map((item) => createMetricRow(item.label, item.value))
  ];
  grid.replaceChildren(...rows);
}

function createMetricTitle(title: string): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "metric-title";
  row.textContent = title;
  return row;
}

function createMetricRow(label: string, value: string): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "metric-row";

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = value;

  row.append(labelElement, valueElement);
  return row;
}

function navigateWithSearch(update: (searchParams: URLSearchParams) => void): void {
  const url = new URL(window.location.href);
  update(url.searchParams);
  window.location.assign(url.toString());
}

function resolvePreviewResolution(rendererHint: "cpu" | "webgpu"): PreviewResolution {
  const width = readNumberFromQuery("simWidth", 0);
  const height = readNumberFromQuery("simHeight", 0);
  if (width > 0 && height > 0) {
    const targetWidth = previewDimension(width);
    const targetHeight = previewDimension(height);
    const target = {
      width: targetWidth,
      height: targetHeight,
      label: `custom (${targetWidth}x${targetHeight})`
    };
    return enforceRendererBudget(target, rendererHint);
  }

  const preset = query.get("simPreset")?.toLowerCase();
  if (preset && isPresetResolution(preset)) {
    const selected = PRESET_PREVIEW_RESOLUTIONS[preset];
    const capped = enforceRendererBudget(selected, rendererHint);
    return { ...capped };
  }

  const fallback =
    rendererHint === "webgpu" ? PRESET_PREVIEW_RESOLUTIONS.mid : PRESET_PREVIEW_RESOLUTIONS.low;
  return enforceRendererBudget(fallback, rendererHint);
}

function isPresetResolution(name: string): name is PresetResolutionName {
  return Object.prototype.hasOwnProperty.call(PRESET_PREVIEW_RESOLUTIONS, name);
}

function enforceRendererBudget(
  target: PreviewResolution,
  rendererHint: "cpu" | "webgpu"
): PreviewResolution {
  const maxPixels = rendererHint === "cpu" ? 360 * 640 : 1080 * 1920;
  const currentPixels = target.width * target.height;
  if (currentPixels <= maxPixels) {
    return { ...target };
  }
  const scale = Math.sqrt(maxPixels / currentPixels);
  const scaledWidth = even(Math.max(128, Math.round(target.width * scale)));
  const scaledHeight = even(Math.max(128, Math.round(target.height * scale)));
  return {
    width: scaledWidth,
    height: scaledHeight,
    label: `scaled ${target.label} (${scaledWidth}x${scaledHeight})`
  };
}

function even(value: number): number {
  return Math.max(2, Math.floor(value / 2) * 2);
}

function previewDimension(value: number): number {
  return Math.max(2, Math.floor(value));
}
