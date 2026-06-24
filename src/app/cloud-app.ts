import {
  RaymarchCloudRenderer,
  type RaymarchCloudOptions
} from "./raymarch-cloud-renderer.js";
import { type BrowserDisplayProfile } from "./display-profile.js";
import { paintCpuFallback } from "./cpu-fallback.js";
import {
  createRuntimeSeed,
  type Orientation,
  type RuntimeOptions
} from "./runtime-options.js";

declare global {
  interface Window {
    __cumulonimbusRuntime?: {
      displayProfile: BrowserDisplayProfile;
      options: RuntimeOptions;
    };
  }
}

export class CloudApp {
  private renderer: RaymarchCloudRenderer | undefined;
  private fallbackActivated = false;
  private frameIntervalMs: number;
  private renderedFrameCount = 0;
  private startTime: number;
  private nextFrameTime: number;
  private animationFrame: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private paused: boolean;
  private playbackTimeSeconds: number;
  private hasRenderedFrame = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private options: RuntimeOptions
  ) {
    this.frameIntervalMs = 1000 / (options.fps ?? 30);
    this.playbackTimeSeconds = options.time ?? 0;
    this.paused = options.renderMode === "page";
    this.startTime = performance.now();
    this.nextFrameTime = this.startTime;
    this.resetStartTime(this.startTime);
  }

  start(): void {
    this.applyDocumentState();
    this.applyPlaybackState();
    this.exposeRuntimeDebug();
    this.canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        this.activateCpuFallback("context-lost");
      },
      { once: true }
    );

    this.renderer = this.options.useCpuRenderer
      ? this.createCpuRenderer(this.canvas, this.options)
      : this.createRenderer(this.canvas, this.options);
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
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
  }

  getOptions(): RuntimeOptions {
    return this.options;
  }

  isPaused(): boolean {
    return this.paused;
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

    if (this.options.useCpuRenderer) {
      this.cancelPendingFrame();
      this.renderer?.dispose();
      this.renderer = undefined;
      paintCpuFallback(this.canvas, this.options, "cpu-requested", false);
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
    const seed = createRuntimeSeed();
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
      cameraDistance: this.options.displayProfile.mobileWideView ? 27 : 28
    });
  }

  private createRenderer(
    targetCanvas: HTMLCanvasElement,
    rendererOptions: RuntimeOptions
  ): RaymarchCloudRenderer | undefined {
    try {
      document.documentElement.dataset.renderStatus = "starting";
      const cloudRenderer = new RaymarchCloudRenderer(targetCanvas, rendererOptions);
      return cloudRenderer;
    } catch (error) {
      document.documentElement.dataset.renderStatus = "webgl-unavailable";
      targetCanvas.setAttribute("aria-label", "WebGL renderer unavailable");
      paintCpuFallback(targetCanvas, rendererOptions, "webgl-unavailable", false);
      if (rendererOptions.exposeRuntimeDebug) {
        console.warn("Cumulonimbus renderer startup skipped:", error);
      }
      return undefined;
    }
  }

  private createCpuRenderer(
    targetCanvas: HTMLCanvasElement,
    rendererOptions: RuntimeOptions
  ): undefined {
    this.fallbackActivated = true;
    document.documentElement.dataset.renderStatus = "fallback-2d";
    paintCpuFallback(targetCanvas, rendererOptions, "cpu-requested", false);
    return undefined;
  }

  private activateCpuFallback(reason: string): void {
    if (this.fallbackActivated) {
      return;
    }
    this.fallbackActivated = true;
    this.cancelPendingFrame();
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    this.renderer = undefined;
    document.documentElement.dataset.renderStatus = "fallback-2d";
    this.canvas = paintCpuFallback(this.canvas, this.options, reason, true);
  }

  private renderFrame(now: number): void {
    this.animationFrame = undefined;
    if (!this.renderer || this.paused) {
      return;
    }
    if (now < this.nextFrameTime) {
      this.scheduleNextFrame();
      return;
    }

    if (!this.renderCurrentFrame(now)) {
      return;
    }
    if (this.options.captureFrameLimit > 0 && this.renderedFrameCount >= this.options.captureFrameLimit) {
      return;
    }

    this.nextFrameTime = now + this.frameIntervalMs;
    this.scheduleNextFrame();
  }

  private renderCurrentFrame(now: number): boolean {
    if (!this.renderer) {
      return false;
    }
    this.resize();
    try {
      const elapsedSeconds = this.paused ? this.playbackTimeSeconds : this.getPlaybackTime(now);
      this.renderer.render(elapsedSeconds);
      this.playbackTimeSeconds = elapsedSeconds;
    } catch (error) {
      this.activateCpuFallback("render-error");
      if (this.options.exposeRuntimeDebug) {
        console.warn("Cumulonimbus renderer render failed:", error);
      }
      return false;
    }
    this.renderedFrameCount += 1;
    if (!this.hasRenderedFrame) {
      this.hasRenderedFrame = true;
      document.documentElement.dataset.renderStatus = "ready";
    }
    return true;
  }

  private scheduleNextFrame(): void {
    if (
      this.animationFrame !== undefined ||
      !this.renderer ||
      this.paused ||
      (this.options.captureFrameLimit > 0 && this.renderedFrameCount >= this.options.captureFrameLimit)
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

  private resize(): void {
    if (!this.renderer) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const fallback =
      this.options.orientation === "landscape" ? { width: 960, height: 540 } : { width: 540, height: 960 };
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
    document.documentElement.dataset.deviceProfile = this.options.displayProfile.mobileWideView ? "mobile" : "desktop";
    document.documentElement.dataset.preset = this.options.presetName ?? "";
    document.body.dataset.background = this.options.transparentBackground ? "transparent" : "sky";

    const renderContainer = document.querySelector<HTMLElement>("#render-container");
    renderContainer?.classList.toggle("viewport-landscape", this.options.orientation === "landscape");
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
  | "recenter"
>;
