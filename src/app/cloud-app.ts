import { RaymarchCloudRenderer, type RaymarchCloudOptions } from "./raymarch-cloud-renderer.js";
import { type BrowserDisplayProfile } from "./display-profile.js";
import { createRuntimeSeed, type Orientation, type RuntimeOptions } from "./runtime-options.js";

declare global {
  interface Window {
    __cumulonimbusRuntime?: {
      displayProfile: BrowserDisplayProfile;
      options: RuntimeOptions;
    };
  }
}

const WEBGL_CONTEXT_RESTORE_TIMEOUT_MS = 1500;

export type RenderStats = {
  readonly frameCount: number;
  readonly lastFrameDurationMs: number | undefined;
  readonly averageFrameDurationMs: number | undefined;
  readonly measuredFps: number | undefined;
  readonly averageFps: number | undefined;
};

type CameraDragMode = "orbit" | "pan" | "dolly";

type CameraDragState = {
  readonly pointerId: number;
  readonly mode: CameraDragMode;
  readonly startX: number;
  readonly startY: number;
  readonly startYaw: number;
  readonly startPitch: number;
  readonly startDistance: number;
  readonly startTargetOffsetX: number;
  readonly startTargetOffsetY: number;
  readonly startTargetOffsetZ: number;
  readonly precisionScale: number;
};

const ORBIT_DEGREES_PER_PIXEL = 0.18;
const DOLLY_PER_PIXEL = 0.0025;
const PAN_DRAG_UNITS_PER_PIXEL_AT_DISTANCE = 0.0018;
const PAN_KEY_UNITS_PER_PIXEL_AT_DISTANCE = 0.0028;
const KEY_ORBIT_DEGREES = 3;
const KEY_PAN_PIXELS = 40;
const KEY_DOLLY_DELTA_PIXELS = 120;
const CAMERA_PITCH_MIN_DEGREES = -55;
const CAMERA_PITCH_MAX_DEGREES = 70;
const CAMERA_DISTANCE_MIN = 8;
const CAMERA_DISTANCE_MAX = 160;
const CAMERA_TARGET_OFFSET_XZ_LIMIT = 24;
const CAMERA_TARGET_OFFSET_Y_LIMIT = 12;
const DEFAULT_CAMERA_DISTANCE = 16;
const MOBILE_CAMERA_DISTANCE = 24;
const STABLE_RANDOM_SEED_LIMIT = 10_000;

export class CloudApp {
  private renderer: RaymarchCloudRenderer | undefined;
  private frameIntervalMs: number;
  private renderedFrameCount = 0;
  private startTime: number;
  private nextFrameTime: number;
  private animationFrame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private paused: boolean;
  private playbackTimeSeconds: number;
  private hasRenderedFrame = false;
  private contextLost = false;
  private contextRestoreTimer: number | undefined;
  private firstRenderTimestamp: number | undefined;
  private lastRenderTimestamp: number | undefined;
  private lastFrameIntervalMs: number | undefined;
  private lastFrameDurationMs: number | undefined;
  private totalFrameDurationMs = 0;
  private cameraDrag: CameraDragState | undefined;
  private readonly handleWebGlContextLost = (event: Event): void => {
    event.preventDefault();
    this.clearContextRestoreTimer();
    this.contextLost = true;
    this.cancelPendingFrame();
    document.documentElement.dataset.renderStatus = "context-lost";
    this.contextRestoreTimer = window.setTimeout(() => {
      this.contextRestoreTimer = undefined;
      if (this.contextLost) {
        this.markRenderFailure("context-lost-timeout");
      }
    }, WEBGL_CONTEXT_RESTORE_TIMEOUT_MS);
  };
  private readonly handleWebGlContextRestored = (): void => {
    this.contextLost = false;
    document.documentElement.dataset.renderStatus = "starting";
    this.clearContextRestoreTimer();
    this.contextRestoreTimer = window.setTimeout(() => this.recoverWebGlContext(), 0);
  };
  private recoverWebGlContext(): void {
    this.contextRestoreTimer = undefined;
    if (this.contextLost) {
      return;
    }
    this.disposeRenderer();
    this.renderer = this.createRenderer(this.canvas, this.options);
    if (!this.renderer) {
      this.markRenderFailure("context-restore-failed");
      return;
    }
    const rendered = this.renderCurrentFrame(performance.now());
    if (!rendered) {
      return;
    }
    if (!this.paused) {
      this.scheduleNextFrame();
    }
  }
  private readonly handleCanvasPointerDown = (event: PointerEvent): void => {
    if (!this.renderer || this.contextLost || event.isPrimary === false) {
      return;
    }
    const mode = resolveCameraDragMode(event);
    event.preventDefault();
    this.cameraDrag = {
      pointerId: event.pointerId,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startYaw: this.options.cameraYawDegrees ?? 0,
      startPitch:
        this.options.cameraPitchDegrees ?? (this.options.displayProfile.mobileWideView ? -1 : -1),
      startDistance: this.options.cameraDistance ?? this.defaultCameraDistance(),
      startTargetOffsetX: this.options.cameraTargetOffsetX ?? 0,
      startTargetOffsetY: this.options.cameraTargetOffsetY ?? 0,
      startTargetOffsetZ: this.options.cameraTargetOffsetZ ?? 0,
      precisionScale: event.altKey ? 0.35 : 1
    };
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail during browser teardown; dragging still works via document listeners.
    }
  };
  private readonly handleCanvasPointerMove = (event: PointerEvent): void => {
    const drag = this.cameraDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    event.preventDefault();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.mode === "orbit") {
      this.setOptions({
        cameraYawDegrees: normalizeDegrees(
          drag.startYaw + dx * ORBIT_DEGREES_PER_PIXEL * drag.precisionScale
        ),
        cameraPitchDegrees: clampNumber(
          drag.startPitch + dy * ORBIT_DEGREES_PER_PIXEL * drag.precisionScale,
          CAMERA_PITCH_MIN_DEGREES,
          CAMERA_PITCH_MAX_DEGREES
        )
      });
      return;
    }
    if (drag.mode === "dolly") {
      this.setOptions({
        cameraDistance: clampNumber(
          drag.startDistance * Math.exp(dy * DOLLY_PER_PIXEL * drag.precisionScale),
          CAMERA_DISTANCE_MIN,
          CAMERA_DISTANCE_MAX
        )
      });
      return;
    }
    this.panCameraFromDrag(drag, dx, dy);
  };
  private readonly handleCanvasPointerEnd = (event: PointerEvent): void => {
    if (!this.cameraDrag || event.pointerId !== this.cameraDrag.pointerId) {
      return;
    }
    this.cameraDrag = undefined;
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore release races after a pointer is already gone.
    }
  };
  private readonly handleCanvasWheel = (event: WheelEvent): void => {
    if (!this.renderer || this.contextLost) {
      return;
    }
    event.preventDefault();
    const precisionScale = event.altKey ? 0.35 : 1;
    const distance = this.options.cameraDistance ?? this.defaultCameraDistance();
    this.setOptions({
      cameraDistance: clampNumber(
        distance * Math.exp(event.deltaY * DOLLY_PER_PIXEL * precisionScale),
        CAMERA_DISTANCE_MIN,
        CAMERA_DISTANCE_MAX
      )
    });
  };
  private readonly handleCanvasContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };
  private readonly handleCanvasKeyDown = (event: KeyboardEvent): void => {
    if (!this.renderer || this.contextLost || event.repeat) {
      return;
    }
    const precisionScale = event.altKey ? 0.35 : 1;
    const yaw = this.options.cameraYawDegrees ?? 0;
    const pitch =
      this.options.cameraPitchDegrees ?? (this.options.displayProfile.mobileWideView ? -1 : -1);
    const distance = this.options.cameraDistance ?? this.defaultCameraDistance();
    const key = event.key;

    if (event.shiftKey && isArrowKey(key)) {
      event.preventDefault();
      this.panCameraByScreenPixels(
        key === "ArrowLeft" ? -KEY_PAN_PIXELS : key === "ArrowRight" ? KEY_PAN_PIXELS : 0,
        key === "ArrowUp" ? -KEY_PAN_PIXELS : key === "ArrowDown" ? KEY_PAN_PIXELS : 0,
        precisionScale
      );
      return;
    }

    if ((event.ctrlKey || event.metaKey) && (key === "ArrowUp" || key === "ArrowDown")) {
      event.preventDefault();
      this.setOptions({
        cameraDistance: clampNumber(
          distance *
            Math.exp(
              (key === "ArrowUp" ? -KEY_DOLLY_DELTA_PIXELS : KEY_DOLLY_DELTA_PIXELS) *
                DOLLY_PER_PIXEL *
                precisionScale
            ),
          CAMERA_DISTANCE_MIN,
          CAMERA_DISTANCE_MAX
        )
      });
      return;
    }

    if (key === "+" || key === "=" || key === "-" || key === "_") {
      event.preventDefault();
      this.setOptions({
        cameraDistance: clampNumber(
          distance *
            Math.exp(
              (key === "+" || key === "=" ? -KEY_DOLLY_DELTA_PIXELS : KEY_DOLLY_DELTA_PIXELS) *
                DOLLY_PER_PIXEL *
                precisionScale
            ),
          CAMERA_DISTANCE_MIN,
          CAMERA_DISTANCE_MAX
        )
      });
      return;
    }

    if (isArrowKey(key)) {
      event.preventDefault();
      this.setOptions({
        cameraYawDegrees: normalizeDegrees(
          yaw +
            (key === "ArrowLeft"
              ? -KEY_ORBIT_DEGREES
              : key === "ArrowRight"
                ? KEY_ORBIT_DEGREES
                : 0) *
              precisionScale
        ),
        cameraPitchDegrees: clampNumber(
          pitch +
            (key === "ArrowUp" ? KEY_ORBIT_DEGREES : key === "ArrowDown" ? -KEY_ORBIT_DEGREES : 0) *
              precisionScale,
          CAMERA_PITCH_MIN_DEGREES,
          CAMERA_PITCH_MAX_DEGREES
        )
      });
    }
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private options: RuntimeOptions
  ) {
    this.frameIntervalMs = 1000 / (options.fps ?? 30);
    this.playbackTimeSeconds = options.time ?? 0;
    this.paused =
      (options.renderMode === "page" && !options.displayProfile.mobileWideView) ||
      options.timeScale <= 0;
    this.startTime = performance.now();
    this.nextFrameTime = this.startTime;
    this.resetStartTime(this.startTime);
  }

  start(): void {
    this.applyDocumentState();
    this.applyPlaybackState();
    this.exposeRuntimeDebug();
    this.canvas.addEventListener("webglcontextlost", this.handleWebGlContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.handleWebGlContextRestored);
    this.bindCameraInput();

    this.renderer = this.createRenderer(this.canvas, this.options);
    if (this.renderer) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.paused) {
          this.renderCurrentFrame(performance.now());
          return;
        }
        this.resize();
      });
      this.resizeObserver.observe(this.canvas);
      this.renderCurrentFrame(performance.now());
      if (!this.paused) {
        this.scheduleNextFrame();
      }
    }
  }

  dispose(): void {
    this.cancelPendingFrame();
    this.clearContextRestoreTimer();
    this.resizeObserver?.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.handleWebGlContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.handleWebGlContextRestored);
    this.unbindCameraInput();
    this.disposeRenderer();
  }

  getOptions(): RuntimeOptions {
    return this.options;
  }

  isPaused(): boolean {
    return this.paused;
  }

  getRenderStats(): RenderStats {
    const totalElapsedMs =
      this.firstRenderTimestamp !== undefined && this.lastRenderTimestamp !== undefined
        ? this.lastRenderTimestamp - this.firstRenderTimestamp
        : undefined;
    return {
      frameCount: this.renderedFrameCount,
      lastFrameDurationMs: this.lastFrameDurationMs,
      averageFrameDurationMs:
        this.renderedFrameCount > 0
          ? this.totalFrameDurationMs / this.renderedFrameCount
          : undefined,
      measuredFps:
        this.lastFrameIntervalMs !== undefined && this.lastFrameIntervalMs > 0
          ? 1000 / this.lastFrameIntervalMs
          : undefined,
      averageFps:
        totalElapsedMs !== undefined && totalElapsedMs > 0 && this.renderedFrameCount > 1
          ? ((this.renderedFrameCount - 1) * 1000) / totalElapsedMs
          : undefined
    };
  }

  setOptions(patch: Partial<RuntimeOptions>): void {
    const now = performance.now();
    if (!this.paused) {
      this.playbackTimeSeconds = this.getPlaybackTime(now);
    }
    this.options = { ...this.options, ...patch };
    this.frameIntervalMs = 1000 / (this.options.fps ?? 30);
    this.applyDocumentState();
    this.exposeRuntimeDebug();

    if (patch.time !== undefined) {
      this.playbackTimeSeconds = patch.time;
    }
    this.resetStartTime(now);

    if (this.contextLost) {
      return;
    }

    if (!this.renderer) {
      this.renderer = this.createRenderer(this.canvas, this.options);
    } else {
      this.renderer.updateOptions(this.options);
    }
    if (this.paused) {
      this.renderCurrentFrame(performance.now());
    } else {
      this.resize();
      this.scheduleNextFrame();
    }
  }

  setOrientation(orientation: Orientation): void {
    this.setOptions({ orientation, simWidth: undefined, simHeight: undefined });
  }

  randomizeSeed(): number {
    const seed = 1 + (createRuntimeSeed() % STABLE_RANDOM_SEED_LIMIT);
    this.setOptions({ seed });
    return seed;
  }

  togglePaused(force?: boolean): boolean {
    const nextPaused = force ?? !this.paused;
    if (nextPaused === this.paused) {
      return this.paused;
    }

    const now = performance.now();
    if (nextPaused) {
      this.playbackTimeSeconds = this.getPlaybackTime(now);
    }
    this.paused = nextPaused;
    this.applyPlaybackState();
    if (this.paused) {
      this.cancelPendingFrame();
    } else {
      this.resetStartTime(now);
      this.scheduleNextFrame();
    }
    return this.paused;
  }

  recenter(): void {
    this.setOptions({
      cameraYawDegrees: undefined,
      cameraPitchDegrees: this.options.displayProfile.mobileWideView ? -1 : -1,
      cameraDistance: this.defaultCameraDistance(),
      cameraTargetOffsetX: 0,
      cameraTargetOffsetY: 0,
      cameraTargetOffsetZ: 0
    });
  }

  private bindCameraInput(): void {
    this.canvas.addEventListener("pointerdown", this.handleCanvasPointerDown);
    this.canvas.addEventListener("pointermove", this.handleCanvasPointerMove);
    this.canvas.addEventListener("pointerup", this.handleCanvasPointerEnd);
    this.canvas.addEventListener("pointercancel", this.handleCanvasPointerEnd);
    this.canvas.addEventListener("wheel", this.handleCanvasWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", this.handleCanvasContextMenu);
    this.canvas.addEventListener("keydown", this.handleCanvasKeyDown);
  }

  private unbindCameraInput(): void {
    this.cameraDrag = undefined;
    this.canvas.removeEventListener("pointerdown", this.handleCanvasPointerDown);
    this.canvas.removeEventListener("pointermove", this.handleCanvasPointerMove);
    this.canvas.removeEventListener("pointerup", this.handleCanvasPointerEnd);
    this.canvas.removeEventListener("pointercancel", this.handleCanvasPointerEnd);
    this.canvas.removeEventListener("wheel", this.handleCanvasWheel);
    this.canvas.removeEventListener("contextmenu", this.handleCanvasContextMenu);
    this.canvas.removeEventListener("keydown", this.handleCanvasKeyDown);
  }

  private panCameraFromDrag(drag: CameraDragState, dx: number, dy: number): void {
    const yaw = degreesToRadians(drag.startYaw);
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);
    const panScale =
      drag.startDistance * PAN_DRAG_UNITS_PER_PIXEL_AT_DISTANCE * drag.precisionScale;
    const panRight = dx * panScale;
    const panUp = dy * panScale;
    this.setOptions({
      cameraTargetOffsetX: clampNumber(
        drag.startTargetOffsetX + rightX * panRight,
        -CAMERA_TARGET_OFFSET_XZ_LIMIT,
        CAMERA_TARGET_OFFSET_XZ_LIMIT
      ),
      cameraTargetOffsetY: clampNumber(
        drag.startTargetOffsetY + panUp,
        -CAMERA_TARGET_OFFSET_Y_LIMIT,
        CAMERA_TARGET_OFFSET_Y_LIMIT
      ),
      cameraTargetOffsetZ: clampNumber(
        drag.startTargetOffsetZ + rightZ * panRight,
        -CAMERA_TARGET_OFFSET_XZ_LIMIT,
        CAMERA_TARGET_OFFSET_XZ_LIMIT
      )
    });
  }

  private panCameraByScreenPixels(dx: number, dy: number, precisionScale: number): void {
    const yaw = degreesToRadians(this.options.cameraYawDegrees ?? 0);
    const distance = this.options.cameraDistance ?? this.defaultCameraDistance();
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);
    const panScale = distance * PAN_KEY_UNITS_PER_PIXEL_AT_DISTANCE * precisionScale;
    const panRight = dx * panScale;
    const panUp = dy * panScale;
    this.setOptions({
      cameraTargetOffsetX: clampNumber(
        (this.options.cameraTargetOffsetX ?? 0) + rightX * panRight,
        -CAMERA_TARGET_OFFSET_XZ_LIMIT,
        CAMERA_TARGET_OFFSET_XZ_LIMIT
      ),
      cameraTargetOffsetY: clampNumber(
        (this.options.cameraTargetOffsetY ?? 0) + panUp,
        -CAMERA_TARGET_OFFSET_Y_LIMIT,
        CAMERA_TARGET_OFFSET_Y_LIMIT
      ),
      cameraTargetOffsetZ: clampNumber(
        (this.options.cameraTargetOffsetZ ?? 0) + rightZ * panRight,
        -CAMERA_TARGET_OFFSET_XZ_LIMIT,
        CAMERA_TARGET_OFFSET_XZ_LIMIT
      )
    });
  }

  private createRenderer(
    targetCanvas: HTMLCanvasElement,
    rendererOptions: RuntimeOptions
  ): RaymarchCloudRenderer | undefined {
    try {
      document.documentElement.dataset.renderStatus = "starting";
      targetCanvas.removeAttribute("data-render-error");
      const cloudRenderer = new RaymarchCloudRenderer(targetCanvas, rendererOptions);
      return cloudRenderer;
    } catch (error) {
      this.markRenderFailure("webgl-unavailable", error);
      if (rendererOptions.exposeRuntimeDebug) {
        console.warn("Cumulonimbus renderer startup skipped:", error);
      }
      return undefined;
    }
  }

  private markRenderFailure(reason: string, error?: unknown): void {
    document.documentElement.dataset.renderStatus = reason;
    this.canvas.setAttribute("aria-label", "WebGL renderer unavailable");
    this.canvas.dataset.renderError = formatRenderError(error ?? reason);
  }

  private renderFrame(now: number): void {
    this.animationFrame = undefined;
    if (!this.renderer || this.paused || this.contextLost) {
      return;
    }
    if (now < this.nextFrameTime) {
      this.scheduleNextFrame();
      return;
    }

    if (!this.renderCurrentFrame(now)) {
      return;
    }
    if (
      this.options.captureFrameLimit > 0 &&
      this.renderedFrameCount >= this.options.captureFrameLimit
    ) {
      return;
    }

    this.nextFrameTime = now + this.frameIntervalMs;
    this.scheduleNextFrame();
  }

  private renderCurrentFrame(now: number): boolean {
    if (!this.renderer || this.contextLost) {
      return false;
    }
    this.resize();
    const renderStart = performance.now();
    try {
      const elapsedSeconds = this.paused ? this.playbackTimeSeconds : this.getPlaybackTime(now);
      this.renderer.render(elapsedSeconds);
      this.playbackTimeSeconds = elapsedSeconds;
    } catch (error) {
      if (this.contextLost) {
        return false;
      }
      this.markRenderFailure("render-error", error);
      this.cancelPendingFrame();
      this.disposeRenderer();
      if (this.options.exposeRuntimeDebug) {
        console.warn("Cumulonimbus renderer render failed:", error);
      }
      return false;
    }
    this.renderedFrameCount += 1;
    this.recordRenderStats(renderStart, performance.now());
    this.hasRenderedFrame = true;
    document.documentElement.dataset.renderStatus = "ready";
    return true;
  }

  private scheduleNextFrame(): void {
    if (
      this.animationFrame !== undefined ||
      !this.renderer ||
      this.contextLost ||
      this.paused ||
      (this.options.captureFrameLimit > 0 &&
        this.renderedFrameCount >= this.options.captureFrameLimit)
    ) {
      return;
    }
    this.animationFrame = requestAnimationFrame((nextNow) => this.renderFrame(nextNow));
  }

  private cancelPendingFrame(): void {
    if (this.animationFrame === undefined) {
      return;
    }
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = undefined;
  }

  private clearContextRestoreTimer(): void {
    if (this.contextRestoreTimer === undefined) {
      return;
    }
    window.clearTimeout(this.contextRestoreTimer);
    this.contextRestoreTimer = undefined;
  }

  private disposeRenderer(): void {
    try {
      this.renderer?.dispose();
    } catch (error) {
      if (this.options.exposeRuntimeDebug) {
        console.warn("Cumulonimbus renderer disposal failed:", error);
      }
    } finally {
      this.renderer = undefined;
    }
  }

  private recordRenderStats(renderStart: number, renderEnd: number): void {
    if (this.firstRenderTimestamp === undefined) {
      this.firstRenderTimestamp = renderEnd;
    }
    if (this.lastRenderTimestamp !== undefined) {
      this.lastFrameIntervalMs = renderEnd - this.lastRenderTimestamp;
    }
    this.lastRenderTimestamp = renderEnd;
    this.lastFrameDurationMs = Math.max(0, renderEnd - renderStart);
    this.totalFrameDurationMs += this.lastFrameDurationMs;
  }

  private resize(): void {
    if (!this.renderer) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const fallback =
      this.options.orientation === "landscape"
        ? { width: 960, height: 540 }
        : { width: 540, height: 960 };
    const width = Math.round(this.options.simWidth ?? (rect.width || fallback.width));
    const height = Math.round(this.options.simHeight ?? (rect.height || fallback.height));
    this.renderer.resize(width, height);
  }

  private getPlaybackTime(now: number): number {
    if (this.options.timeScale <= 0) {
      return this.playbackTimeSeconds;
    }
    return ((now - this.startTime) / 1000) * this.options.timeScale;
  }

  private resetStartTime(now = performance.now()): void {
    if (this.options.timeScale <= 0) {
      this.startTime = now;
    } else {
      this.startTime = now - (this.playbackTimeSeconds * 1000) / this.options.timeScale;
    }
    this.nextFrameTime = now;
  }

  private applyDocumentState(): void {
    document.documentElement.dataset.renderMode = this.options.renderMode;
    document.documentElement.dataset.orientation = this.options.orientation;
    document.documentElement.dataset.deviceProfile = this.options.displayProfile.mobileWideView
      ? "mobile"
      : "desktop";
    document.documentElement.dataset.preset = this.options.presetName ?? "";
    document.documentElement.dataset.morphology = this.options.morphologyStyle ?? "";
    document.documentElement.dataset.qualityTier = this.options.qualityTier ?? "";
    document.documentElement.dataset.autoQuality = this.options.autoQuality ? "true" : "false";
    document.body.dataset.background = this.options.transparentBackground ? "transparent" : "sky";
    document.body.dataset.ui = "tracing-paper";
    document.body.dataset.viewportMode = "background";
    document.body.dataset.controlsHidden = this.options.controlsVisible ? "false" : "true";

    const renderContainer = document.querySelector<HTMLElement>("#render-container");
    renderContainer?.classList.toggle(
      "viewport-landscape",
      this.options.orientation === "landscape"
    );
    renderContainer?.classList.toggle("viewport-portrait", this.options.orientation === "portrait");

    const targetLabel = document.querySelector<HTMLElement>("#target-label");
    if (targetLabel) {
      targetLabel.textContent =
        this.options.orientation === "landscape" ? "Target: 16:9 broadcast" : "Target: 9:16 mobile";
    }
  }

  private applyPlaybackState(): void {
    document.documentElement.dataset.playbackStatus = this.paused ? "paused" : "playing";
  }

  private defaultCameraDistance(): number {
    return this.options.displayProfile.mobileWideView
      ? MOBILE_CAMERA_DISTANCE
      : DEFAULT_CAMERA_DISTANCE;
  }

  private exposeRuntimeDebug(): void {
    if (this.options.exposeRuntimeDebug) {
      window.__cumulonimbusRuntime = {
        displayProfile: this.options.displayProfile,
        options: this.options
      };
    }
  }
}

export type CloudAppController = Pick<
  CloudApp,
  | "getOptions"
  | "isPaused"
  | "setOptions"
  | "setOrientation"
  | "randomizeSeed"
  | "togglePaused"
  | "getRenderStats"
  | "recenter"
>;

function resolveCameraDragMode(event: PointerEvent): CameraDragMode {
  if (event.button === 1 || event.button === 2 || event.shiftKey) {
    return "pan";
  }
  if (event.ctrlKey || event.metaKey) {
    return "dolly";
  }
  return "orbit";
}

function isArrowKey(key: string): boolean {
  return key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown";
}

function normalizeDegrees(value: number): number {
  const wrapped = ((((value + 180) % 360) + 360) % 360) - 180;
  return Object.is(wrapped, -0) ? 0 : wrapped;
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function clampNumber(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatRenderError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
