import "../styles/app.css";
import type { CloudParams } from "../core/cloud-field.js";
import { createCloudPresetParams, normalizeCloudPresetName } from "../core/presets.js";
import { CpuPreviewRenderer } from "./cpu-preview-renderer.js";
import type { PreviewMetrics, PreviewRenderer } from "./preview-renderer.js";
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

type PreviewViewMode = "field" | "3d";
export type PreviewOrientation = "portrait" | "landscape";
type ViewportFitMode = "best" | "width" | "height";

type PreviewResolution = {
  width: number;
  height: number;
  label: string;
};

const cloudPresetName = normalizeCloudPresetName(query.get("cloudPreset") ?? query.get("preset"));
const viewMode = resolveViewMode();
const orientation = resolvePreviewOrientation();
let viewportFitMode = resolveViewportFitMode();
const threeBubbleLookPreset = resolveThreeBubbleLookPresetName();
const initialThreeBubbleTuning = resolveThreeBubbleTuningFromQuery();
const initialFieldFraming = resolveFieldFramingFromQuery();
const params: CloudParams = createCloudPresetParams(cloudPresetName);

let threeBubbleTuning: ThreeBubbleTuning = { ...initialThreeBubbleTuning };
let fieldFraming: FieldFraming = { ...initialFieldFraming };
let fieldPointerDrag: { pointerId: number; x: number; y: number } | null = null;
let paused = false;
let start = performance.now();
let lastFrameTime = start;
let nextFrameTime = start;
let animationFrame = 0;
let lastMetricsPaintTime = 0;
let renderedFrameCount = 0;
let renderer: PreviewRenderer;
let previewResolution: PreviewResolution = { width: 360, height: 640, label: "auto fallback" };
let controlsMinimized = false;

const PRESET_PREVIEW_RESOLUTIONS = {
  portrait: {
    low: { width: 360, height: 640, label: "low portrait (360x640)" },
    mid: { width: 540, height: 960, label: "mid portrait (540x960)" },
    high: { width: 720, height: 1280, label: "high portrait (720x1280)" },
    live4k: { width: 1080, height: 1920, label: "live4k portrait (1080x1920)" }
  },
  landscape: {
    low: { width: 640, height: 360, label: "low landscape (640x360)" },
    mid: { width: 960, height: 540, label: "mid landscape (960x540)" },
    high: { width: 1280, height: 720, label: "high landscape (1280x720)" },
    live4k: { width: 1920, height: 1080, label: "live4k landscape (1920x1080)" }
  }
} as const;

type PresetResolutionName = keyof (typeof PRESET_PREVIEW_RESOLUTIONS)["portrait"];

const FIELD_SQUARE_PREVIEW_RESOLUTIONS: Record<PresetResolutionName, PreviewResolution> = {
  low: { width: 640, height: 640, label: "low square field (640x640)" },
  mid: { width: 960, height: 960, label: "mid square field (960x960)" },
  high: { width: 1280, height: 1280, label: "high square field (1280x1280)" },
  live4k: { width: 1920, height: 1920, label: "live4k square field (1920x1920)" }
};

type NumericParamId =
  | "seed"
  | "stormAge"
  | "humidity"
  | "upliftStrength"
  | "windShear"
  | "anvilOutflow"
  | "anvilPersistence"
  | "sunEdgePeakNits"
  | "haze"
  | "lobeScale"
  | "microBillowScale"
  | "starterBlend"
  | "shadowDepth";
type VisibleThreeBubbleTuningParamId =
  | "cameraYawDegrees"
  | "cameraPitchDegrees"
  | "cameraDistanceScale"
  | "sunAzimuthDegrees"
  | "sunElevationDegrees"
  | "sunIntensityScale"
  | "lightContrast"
  | "exposureScale";
type FieldFramingParamId = "fieldPanX" | "fieldPanY" | "fieldZoom";

type FieldFraming = {
  panX: number;
  panY: number;
  zoom: number;
};

const FORCE_CPU =
  query.get("renderer") === "cpu" ||
  cloudPresetName === "billow" ||
  cloudPresetName === "billow-v1";
const simFps = resolveSimFps();
const captureFrameLimit = resolveCaptureFrameLimit();

const numericParamIds: readonly NumericParamId[] = [
  "seed",
  "stormAge",
  "humidity",
  "upliftStrength",
  "windShear",
  "anvilOutflow",
  "anvilPersistence",
  "sunEdgePeakNits",
  "haze",
  "lobeScale",
  "microBillowScale",
  "starterBlend",
  "shadowDepth"
];
const visibleThreeBubbleTuningParamIds: readonly VisibleThreeBubbleTuningParamId[] = [
  "cameraYawDegrees",
  "cameraPitchDegrees",
  "cameraDistanceScale",
  "sunAzimuthDegrees",
  "sunElevationDegrees",
  "sunIntensityScale",
  "lightContrast",
  "exposureScale"
];
const fieldFramingParamIds: readonly FieldFramingParamId[] = ["fieldPanX", "fieldPanY", "fieldZoom"];

document.documentElement.dataset.currentView = viewMode;
document.documentElement.dataset.currentLook = threeBubbleLookPreset;
document.documentElement.dataset.currentOrientation = orientation;
document.documentElement.dataset.viewportFit = viewportFitMode;

void bootstrap();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});

async function bootstrap(): Promise<void> {
  renderer = await createRenderer();
  renderer.setThreeBubbleTuningChangeListener?.((nextTuning) => {
    threeBubbleTuning = normalizeThreeBubbleTuning(nextTuning);
    syncThreeBubbleTuningInputs();
    renderStageReadouts();
  });
  setupControls();
  renderStageReadouts();
  animationFrame = requestAnimationFrame(draw);
}

function setupControls(): void {
  setupNavigationControls();
  for (const id of numericParamIds) {
    bindNumber(id);
  }
  for (const id of visibleThreeBubbleTuningParamIds) {
    bindThreeBubbleTuningNumber(id);
  }
  for (const id of fieldFramingParamIds) {
    bindFieldFramingNumber(id);
  }
  setupViewportFitControls();
  setupFieldCanvasInteraction();
  setupSteppedRangeInputs();

  document.querySelector<HTMLButtonElement>("#pause")?.addEventListener("click", (event) => {
    paused = !paused;
    const button = event.currentTarget as HTMLButtonElement;
    button.textContent = paused ? "Resume motion" : "Pause motion";
    if (!paused) {
      const now = performance.now();
      lastFrameTime = now;
      nextFrameTime = now;
      animationFrame = requestAnimationFrame(draw);
    }
  });

  document.querySelector<HTMLButtonElement>("#toggle-controls")?.addEventListener("click", () => {
    controlsMinimized = !controlsMinimized;
    syncControlDensity();
  });

  document.querySelector<HTMLButtonElement>("#reset-scene")?.addEventListener("click", () => {
    Object.assign(params, createCloudPresetParams(cloudPresetName));
    applyFieldAccumulationRates();
    threeBubbleTuning = { ...initialThreeBubbleTuning };
    fieldFraming = { ...initialFieldFraming };
    syncNumericInputs();
    syncThreeBubbleTuningInputs();
    syncFieldFramingInputs();
    start = performance.now();
    lastFrameTime = start;
    nextFrameTime = start;
    renderedFrameCount = 0;
    renderer.setThreeBubbleTuning?.(threeBubbleTuning);
    renderer.reset();
    renderStageReadouts();
  });

  document.querySelector<HTMLButtonElement>("#reset-camera")?.addEventListener("click", () => {
    if (viewMode === "field") {
      fieldFraming = { ...initialFieldFraming };
      syncFieldFramingInputs();
      renderStageReadouts();
      return;
    }
    threeBubbleTuning = normalizeThreeBubbleTuning({
      ...threeBubbleTuning,
      cameraYawDegrees: initialThreeBubbleTuning.cameraYawDegrees,
      cameraPitchDegrees: initialThreeBubbleTuning.cameraPitchDegrees,
      cameraDistanceScale: initialThreeBubbleTuning.cameraDistanceScale,
      cameraTargetOffsetX: initialThreeBubbleTuning.cameraTargetOffsetX,
      cameraTargetOffsetY: initialThreeBubbleTuning.cameraTargetOffsetY,
      cameraTargetOffsetZ: initialThreeBubbleTuning.cameraTargetOffsetZ
    });
    syncThreeBubbleTuningInputs();
    renderer.setThreeBubbleTuning?.(threeBubbleTuning);
    renderStageReadouts();
  });

  syncNumericInputs();
  syncThreeBubbleTuningInputs();
  syncFieldFramingInputs();
  syncFramingControlMode();
  syncControlDensity();
}

function setupViewportFitControls(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("button[data-viewport-fit]");
  for (const button of buttons) {
    const targetMode = resolveViewportFitMode(button.dataset.viewportFit ?? null);
    button.setAttribute("aria-pressed", String(targetMode === viewportFitMode));
    button.addEventListener("click", () => {
      viewportFitMode = targetMode;
      document.documentElement.dataset.viewportFit = viewportFitMode;
      for (const peer of buttons) {
        peer.setAttribute("aria-pressed", String(peer === button));
      }
    });
  }
}

function setupSteppedRangeInputs(): void {
  for (const input of document.querySelectorAll<HTMLInputElement>('input[type="range"]')) {
    const step = Number(input.step);
    if (!Number.isFinite(step) || step <= 0 || !Number.isInteger(step)) {
      input.dataset.stepMode = "continuous";
      continue;
    }
    const minimum = Number(input.min);
    const maximum = Number(input.max);
    const stepCount = Math.max(1, Math.round((maximum - minimum) / step));
    input.dataset.stepMode = "stepped";
    input.style.setProperty("--step-count", String(stepCount));
  }
}

function setupFieldCanvasInteraction(): void {
  const frame = document.querySelector<HTMLElement>(".canvas-fit-box");
  if (!frame || viewMode !== "field") {
    return;
  }

  frame.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }
    fieldPointerDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    frame.setPointerCapture(event.pointerId);
    frame.dataset.dragging = "true";
    event.preventDefault();
  });

  frame.addEventListener("pointermove", (event) => {
    if (!fieldPointerDrag || event.pointerId !== fieldPointerDrag.pointerId) {
      return;
    }
    const rect = frame.getBoundingClientRect();
    const nextPanX =
      fieldFraming.panX + ((event.clientX - fieldPointerDrag.x) / Math.max(1, rect.width)) * 100;
    const nextPanY =
      fieldFraming.panY + ((event.clientY - fieldPointerDrag.y) / Math.max(1, rect.height)) * 100;
    fieldPointerDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    updateFieldFraming({
      ...fieldFraming,
      panX: nextPanX,
      panY: nextPanY
    });
  });

  frame.addEventListener("pointerup", (event) => {
    if (!fieldPointerDrag || event.pointerId !== fieldPointerDrag.pointerId) {
      return;
    }
    fieldPointerDrag = null;
    frame.dataset.dragging = "false";
  });

  frame.addEventListener("pointercancel", () => {
    fieldPointerDrag = null;
    frame.dataset.dragging = "false";
  });

  frame.addEventListener(
    "wheel",
    (event) => {
      updateFieldFraming({
        ...fieldFraming,
        zoom: fieldFraming.zoom * Math.exp(-event.deltaY * 0.0012)
      });
      event.preventDefault();
    },
    { passive: false }
  );
}

function draw(now: number): void {
  const fpsThrottleMs = simFps > 0 ? 1000 / simFps : 0;
  if (fpsThrottleMs > 0 && now < nextFrameTime) {
    if (!paused) {
      animationFrame = requestAnimationFrame(draw);
    }
    return;
  }

  renderer.resize(previewResolution.width, previewResolution.height);
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

async function createRenderer(): Promise<PreviewRenderer> {
  const rendererStatus = document.querySelector<HTMLElement>("#renderer-status");
  if (viewMode === "3d") {
    const { ThreeBubblePreviewRenderer } = await import("./three-bubble-preview-renderer.js");
    previewResolution = resolvePreviewResolution("webgpu");
    if (rendererStatus) {
      rendererStatus.textContent =
        `Renderer: Three.js bubble model (${previewResolution.label})` +
        ` · look=${threeBubbleLookPreset}` +
        `${resolvePresetLabel()}` +
        `${resolveFpsLabel()}`;
    }
    return new ThreeBubblePreviewRenderer(canvas, threeBubbleLookPreset, threeBubbleTuning);
  }

  const webGpuRenderer = FORCE_CPU ? null : await WebGpuPreviewRenderer.create(canvas);
  if (webGpuRenderer) {
    previewResolution = resolvePreviewResolution("webgpu");
    if (rendererStatus) {
      rendererStatus.textContent =
        `Renderer: WebGPU field (${previewResolution.label})` +
        `${resolvePresetLabel()}` +
        `${resolveFpsLabel()}`;
    }
    return webGpuRenderer;
  }

  const contextCandidate = canvas.getContext("2d", { alpha: false });
  if (!contextCandidate) {
    throw new Error("Canvas 2D context is unavailable");
  }
  previewResolution = resolvePreviewResolution("cpu");
  if (rendererStatus) {
    rendererStatus.textContent =
      `Renderer: CPU field (${previewResolution.label})` +
      `${resolvePresetLabel()}` +
      `${resolveFpsLabel()}`;
  }
  return new CpuPreviewRenderer(canvas, contextCandidate);
}

function setupNavigationControls(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-view-mode]")) {
    const targetMode: PreviewViewMode = button.dataset.viewMode === "3d" ? "3d" : "field";
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
        searchParams.set("view", "field");
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

  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-orientation-mode]")) {
    const targetOrientation: PreviewOrientation =
      button.dataset.orientationMode === "landscape" ? "landscape" : "portrait";
    button.setAttribute("aria-pressed", String(targetOrientation === orientation));
    button.addEventListener("click", () => {
      if (targetOrientation === orientation) {
        return;
      }
      navigateWithSearch((searchParams) => {
        searchParams.set("orientation", targetOrientation);
      });
    });
  }
}

function bindNumber(id: NumericParamId): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    setNumericParam(id, Number(input.value));
    renderStageReadouts();
  });
}

function bindThreeBubbleTuningNumber(id: VisibleThreeBubbleTuningParamId): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    setThreeBubbleTuningParam(id, Number(input.value));
  });
}

function bindFieldFramingNumber(id: FieldFramingParamId): void {
  const input = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    setFieldFramingParam(id, Number(input.value));
  });
}

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
      applyFieldAccumulationRates();
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
    case "lobeScale":
      params.billowMorphology.lobeScale = value;
      break;
    case "microBillowScale":
      params.billowMorphology.microBillowScale = value;
      break;
    case "starterBlend":
      params.billowMorphology.starterBlend = value;
      applyFieldAccumulationRates();
      break;
    case "shadowDepth":
      params.billowMorphology.shadowDepth = value;
      break;
  }
}

function applyFieldAccumulationRates(): void {
  const accumulation = params.billowMorphology.starterBlend;
  const humidity = params.humidityUplift.humidity;
  params.humidityUplift.condensationRate = 0.09 + humidity * 0.16 + accumulation * 0.1;
  params.humidityUplift.evaporationRate = Math.max(0.025, 0.105 - accumulation * 0.046);
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
    case "lobeScale":
      return params.billowMorphology.lobeScale;
    case "microBillowScale":
      return params.billowMorphology.microBillowScale;
    case "starterBlend":
      return params.billowMorphology.starterBlend;
    case "shadowDepth":
      return params.billowMorphology.shadowDepth;
  }
}

function setThreeBubbleTuningParam(id: VisibleThreeBubbleTuningParamId, value: number): void {
  threeBubbleTuning = normalizeThreeBubbleTuning({
    ...threeBubbleTuning,
    [id]: value
  });
  renderer.setThreeBubbleTuning?.(threeBubbleTuning);
  syncThreeBubbleTuningInputs();
  renderStageReadouts();
}

function setFieldFramingParam(id: FieldFramingParamId, value: number): void {
  const next = { ...fieldFraming };
  switch (id) {
    case "fieldPanX":
      next.panX = value;
      break;
    case "fieldPanY":
      next.panY = value;
      break;
    case "fieldZoom":
      next.zoom = value;
      break;
  }
  updateFieldFraming(next);
}

function updateFieldFraming(next: FieldFraming): void {
  fieldFraming = normalizeFieldFraming(next);
  syncFieldFramingInputs();
  renderStageReadouts();
}

function syncNumericInputs(): void {
  for (const id of numericParamIds) {
    const input = document.querySelector<HTMLInputElement>(`#${id}`);
    if (input) {
      input.value = String(getNumericParam(id));
    }
  }
}

function syncFieldFramingInputs(): void {
  document.documentElement.style.setProperty("--field-pan-x", `${fieldFraming.panX.toFixed(2)}%`);
  document.documentElement.style.setProperty("--field-pan-y", `${fieldFraming.panY.toFixed(2)}%`);
  document.documentElement.style.setProperty("--field-zoom", fieldFraming.zoom.toFixed(3));
  const values: Record<FieldFramingParamId, number> = {
    fieldPanX: fieldFraming.panX,
    fieldPanY: fieldFraming.panY,
    fieldZoom: fieldFraming.zoom
  };
  for (const id of fieldFramingParamIds) {
    const input = document.querySelector<HTMLInputElement>(`#${id}`);
    if (input) {
      input.value = String(Number(values[id].toFixed(id === "fieldZoom" ? 2 : 0)));
    }
  }
}

function syncThreeBubbleTuningInputs(): void {
  for (const id of visibleThreeBubbleTuningParamIds) {
    const input = document.querySelector<HTMLInputElement>(`#${id}`);
    if (input) {
      input.value = String(threeBubbleTuning[id]);
    }
  }
}

function syncControlDensity(): void {
  document.documentElement.dataset.controlsMinimized = String(controlsMinimized);
  const button = document.querySelector<HTMLButtonElement>("#toggle-controls");
  if (!button) {
    return;
  }
  button.setAttribute("aria-pressed", String(controlsMinimized));
  button.textContent = controlsMinimized ? "Show controls" : "Hide controls";
}

function syncFramingControlMode(): void {
  document.querySelector<HTMLElement>("#framing-control-label")!.textContent =
    viewMode === "3d" ? "Camera" : "Viewport";
  document.querySelector<HTMLElement>("#framing-control-title")!.textContent =
    viewMode === "3d" ? "Framing and orbit" : "Framing and zoom";
  document.querySelector<HTMLElement>("#framing-control-hint")!.textContent =
    viewMode === "3d"
      ? "Mouse orbit/pan/zoom updates these sliders live."
      : "Drag the 2D viewport to pan. Wheel zooms in and out.";
  const resetButton = document.querySelector<HTMLButtonElement>("#reset-camera");
  if (resetButton) {
    resetButton.textContent = viewMode === "3d" ? "Reset camera" : "Reset framing";
  }
}

function renderPreviewMetrics(now: number): void {
  if (now - lastMetricsPaintTime < 250) {
    return;
  }
  lastMetricsPaintTime = now;

  const grid = document.querySelector<HTMLElement>("[data-metric-grid]");
  if (!grid) {
    return;
  }

  const metrics = renderer.getMetrics?.() ?? null;
  const rows =
    metrics === null
      ? [createMetricRow("Mode", renderer.mode)]
      : [
          createMetricTitle(metrics.title),
          createMetricRow("Mode", renderer.mode),
          ...metrics.items.map((item) => createMetricRow(item.label, item.value))
        ];
  grid.replaceChildren(...rows);
  renderStageReadouts(metrics);
}

function renderStageReadouts(metrics: PreviewMetrics | null = renderer?.getMetrics?.() ?? null): void {
  document.querySelector<HTMLElement>("#hud-view-mode")!.textContent =
    viewMode === "3d" ? "3D bubble preview" : "Field density preview";
  document.querySelector<HTMLElement>("#hud-mode-detail")!.textContent =
    `Mode ${viewMode} · ${renderer.mode}`;
  document.querySelector<HTMLElement>("#hud-resolution")!.textContent =
    `${orientation} · ${previewResolution.label}`;
  document.querySelector<HTMLElement>("#stage-orientation")!.textContent =
    orientation === "portrait" ? "Portrait viewport" : "Landscape viewport";
  document.querySelector<HTMLElement>("#stage-camera-summary")!.textContent =
    viewMode === "3d"
      ? `Yaw ${threeBubbleTuning.cameraYawDegrees.toFixed(0)} deg · Pitch ${threeBubbleTuning.cameraPitchDegrees.toFixed(0)} deg · Zoom ${threeBubbleTuning.cameraDistanceScale.toFixed(2)}x`
      : `Pan ${fieldFraming.panX.toFixed(0)}, ${fieldFraming.panY.toFixed(0)} · Zoom ${fieldFraming.zoom.toFixed(2)}x · Scale ${params.billowMorphology.lobeScale.toFixed(2)}`;
  document.querySelector<HTMLElement>("#stage-gesture-summary")!.textContent =
    viewMode === "3d"
      ? "Left drag orbit, right drag pan, wheel zoom, Ctrl/Cmd plus left drag pans."
      : "Drag pans the square field behind the window; wheel changes viewport zoom.";
  document.querySelector<HTMLElement>("#hud-quick-metric")!.textContent = summarizeMetrics(metrics);
}

function summarizeMetrics(metrics: PreviewMetrics | null): string {
  if (!metrics || metrics.items.length === 0) {
    return `Renderer ${renderer.mode}`;
  }
  return metrics.items
    .slice(0, 2)
    .map((item) => `${item.label}: ${item.value}`)
    .join(" · ");
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

function resolveViewMode(): PreviewViewMode {
  const raw = (query.get("view") ?? query.get("model") ?? "field").toLowerCase();
  if (raw === "3d" || raw === "bubble" || raw === "3d-billow") {
    return "3d";
  }
  return "field";
}

function resolvePreviewOrientation(): PreviewOrientation {
  return query.get("orientation")?.toLowerCase() === "landscape" ? "landscape" : "portrait";
}

function resolveViewportFitMode(rawValue: string | null = query.get("viewportFit")): ViewportFitMode {
  if (rawValue === "width" || rawValue === "height") {
    return rawValue;
  }
  return "best";
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
    cameraTargetOffsetX: readNumberFromQuery(
      "cameraTargetOffsetX",
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetX
    ),
    cameraTargetOffsetY: readNumberFromQuery(
      "cameraTargetOffsetY",
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetY
    ),
    cameraTargetOffsetZ: readNumberFromQuery(
      "cameraTargetOffsetZ",
      DEFAULT_THREE_BUBBLE_TUNING.cameraTargetOffsetZ
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

function resolveFieldFramingFromQuery(): FieldFraming {
  return normalizeFieldFraming({
    panX: readNumberFromQuery("fieldPanX", 0),
    panY: readNumberFromQuery("fieldPanY", 0),
    zoom: readNumberFromQuery("fieldZoom", 1)
  });
}

function normalizeFieldFraming(framing: FieldFraming): FieldFraming {
  return {
    panX: clampFinite(framing.panX, 0, -42, 42),
    panY: clampFinite(framing.panY, 0, -42, 42),
    zoom: clampFinite(framing.zoom, 1, 0.75, 2.25)
  };
}

function clampFinite(value: number, fallback: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function resolvePreviewResolution(rendererHint: "cpu" | "webgpu"): PreviewResolution {
  const width = readNumberFromQuery("simWidth", 0);
  const height = readNumberFromQuery("simHeight", 0);
  if (width > 0 && height > 0) {
    const targetWidth = previewDimension(width);
    const targetHeight = previewDimension(height);
    if (viewMode === "field") {
      const side = Math.max(targetWidth, targetHeight);
      return enforceRendererBudget(
        {
          width: side,
          height: side,
          label: `custom square field (${side}x${side})`
        },
        rendererHint
      );
    }
    return enforceRendererBudget(
      {
        width: targetWidth,
        height: targetHeight,
        label: `custom (${targetWidth}x${targetHeight})`
      },
      rendererHint
    );
  }

  const preset = query.get("simPreset")?.toLowerCase();
  if (viewMode === "field") {
    const squarePreset = preset && isPresetResolution(preset) ? preset : rendererHint === "webgpu" ? "mid" : "low";
    return enforceRendererBudget(FIELD_SQUARE_PREVIEW_RESOLUTIONS[squarePreset], rendererHint);
  }

  const orientationResolutions = PRESET_PREVIEW_RESOLUTIONS[orientation];
  if (preset && isPresetResolution(preset)) {
    return enforceRendererBudget(orientationResolutions[preset], rendererHint);
  }

  const fallback = rendererHint === "webgpu" ? orientationResolutions.mid : orientationResolutions.low;
  return enforceRendererBudget(fallback, rendererHint);
}

function isPresetResolution(name: string): name is PresetResolutionName {
  return Object.prototype.hasOwnProperty.call(PRESET_PREVIEW_RESOLUTIONS.portrait, name);
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

function resolveFpsLabel(): string {
  return simFps <= 0 ? "" : ` · simFps=${simFps}`;
}

function resolvePresetLabel(): string {
  return cloudPresetName === "default" ? "" : ` · preset=${cloudPresetName}`;
}

function even(value: number): number {
  return Math.max(2, Math.floor(value / 2) * 2);
}

function previewDimension(value: number): number {
  return Math.max(2, Math.floor(value));
}
