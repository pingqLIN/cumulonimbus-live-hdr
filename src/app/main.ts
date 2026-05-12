import "../styles/app.css";
import type { CloudParams } from "../core/cloud-field.js";
import { createCloudPresetParams, normalizeCloudPresetName } from "../core/presets.js";
import { CpuPreviewRenderer } from "./cpu-preview-renderer.js";
import type { PreviewRenderer } from "./preview-renderer.js";
import {
  normalizeThreeBubbleLookPresetName,
  type ThreeBubbleLookPresetName
} from "./three-bubble-look.js";
import { WebGpuPreviewRenderer } from "./webgpu-preview-renderer.js";

const canvasElement = document.querySelector<HTMLCanvasElement>("#cloud-canvas");
if (!canvasElement) {
  throw new Error("Missing cloud canvas");
}
const canvas: HTMLCanvasElement = canvasElement;

const query = new URLSearchParams(window.location.search);
if (query.get("capture") === "1" || query.get("capture") === "canvas") {
  document.documentElement.dataset.capture = "canvas";
}
const cloudPresetName = normalizeCloudPresetName(query.get("cloudPreset") ?? query.get("preset"));
const viewMode = resolveViewMode();
const threeBubbleLookPreset = resolveThreeBubbleLookPresetName();
const params: CloudParams = createCloudPresetParams(cloudPresetName);
let paused = false;
let start = performance.now();
let lastFrameTime = start;
let nextFrameTime = start;
let animationFrame = 0;
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

function setupControls(): void {
  bindNumber("seed");
  bindNumber("stormAge");
  bindNumber("humidity");
  bindNumber("upliftStrength");
  bindNumber("windShear");
  bindNumber("anvilOutflow");
  bindNumber("anvilPersistence");
  bindNumber("sunEdgePeakNits");
  bindNumber("haze");

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
    for (const id of numericParamIds) {
      const input = document.querySelector<HTMLInputElement>(`#${id}`);
      if (input) {
        input.value = String(getNumericParam(id));
      }
    }
    start = performance.now();
    lastFrameTime = start;
    nextFrameTime = start;
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

async function createRenderer(): Promise<PreviewRenderer> {
  const rendererStatus = document.querySelector<HTMLElement>("#renderer-status");
  if (viewMode === "3d") {
    const { ThreeBubblePreviewRenderer } = await import("./three-bubble-preview-renderer.js");
    previewResolution = resolvePreviewResolution("webgpu");
    if (rendererStatus) {
      rendererStatus.textContent = `Renderer: Three.js bubble model (${previewResolution.label}) · look=${threeBubbleLookPreset}${resolvePresetLabel()}${resolveFpsLabel()}`;
    }
    return new ThreeBubblePreviewRenderer(canvas, threeBubbleLookPreset);
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
  return normalizeThreeBubbleLookPresetName(query.get("look") ?? query.get("lookPreset"));
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
