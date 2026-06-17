import * as THREE from "three";
import {
  raymarchCloudFragmentShader,
  raymarchCloudVertexShader
} from "./raymarch-cloud-shader.js";

export type RaymarchCloudOptions = {
  seed?: number;
  time?: number;
  fps?: number;
  systems?: number;
  tropopause?: number;
  freezingLevel?: number;
  windShear?: number;
  sunIntensity?: number;
  ambientIntensity?: number;
  sunElevation?: number;
  sunViewerAngle?: number;
  photographicStyle?: boolean;
  lightPreset?: "daylight" | "golden-side" | "backlit-edge";
  skyMode?: "workbench" | "clear" | "sunset" | "moonlight" | "atmosphere";
  transparentBackground?: boolean;
  hdr10?: boolean;
  ortho?: boolean;
  cameraYawDegrees?: number;
  cameraPitchDegrees?: number;
  cameraDistance?: number;
  maxPixels?: number;
};

const MODEL_BASE_KM = 0.5;
const RESET_TARGET_HEIGHT_RATIO = 0.5;
const RESET_CAMERA_HEIGHT_RATIO = 0.93;
const MODEL_VIEW_OCCUPANCY = 0.44;
const MOBILE_MODEL_VIEW_OCCUPANCY = 0.38;
const MIN_ORTHO_FRUSTUM_SIZE = 24;
const PERSPECTIVE_DISTANCE_SCALE = 1.56;
const FRAME_VERTICAL_PADDING_KM = 2;
const ORTHO_VERTICAL_WORLD_SCALE = 1;
const HDR10_REFERENCE_PEAK_NITS = 1000;

export class RaymarchCloudRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly material: THREE.ShaderMaterial;
  private readonly cameraPosition = new THREE.Vector3();
  private readonly cameraTarget = new THREE.Vector3();
  private readonly resolution = new THREE.Vector2();
  private width = 0;
  private height = 0;
  private tropopause: number;
  private orthoFrustumSize: number;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: RaymarchCloudOptions = {}
  ) {
    this.tropopause = clampFinite(options.tropopause, 12, 4, 20);
    this.orthoFrustumSize = this.defaultOrthoFrustumSize();
    this.updateCameraFromOptions();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: options.transparentBackground ?? false,
      premultipliedAlpha: !(options.transparentBackground ?? false),
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0x000000, options.transparentBackground ? 0 : 1);
    this.renderer.setPixelRatio(1);

    this.material = new THREE.ShaderMaterial({
      vertexShader: raymarchCloudVertexShader,
      fragmentShader: raymarchCloudFragmentShader,
      uniforms: {
        uTime: { value: clampFinite(options.time, 0, 0, 1_000_000) },
        uResolution: { value: this.resolution },
        uCameraPos: { value: this.cameraPosition },
        uCameraTarget: { value: this.cameraTarget },
        uAspect: { value: 1 },
        uTropopause: { value: this.tropopause },
        uShowGrid: { value: 0 },
        uSurfaceVisible: { value: 0 },
        uSurfaceMode: { value: 0 },
        uSeed: { value: Math.floor(clampFinite(options.seed, 574, 1, Number.MAX_SAFE_INTEGER)) },
        uSystemCount: { value: Math.round(clampFinite(options.systems, 3, 1, 10)) },
        uIsOrtho: { value: options.ortho ? 1 : 0 },
        uOrthoSize: { value: this.orthoFrustumSize },
        uOrthoVerticalScale: { value: ORTHO_VERTICAL_WORLD_SCALE },
        uStepSize: { value: 0.2 },
        uMaxSteps: { value: 126 },
        uSunIntensity: { value: clampFinite(options.sunIntensity, 4.6, 0, 10) },
        uAmbientIntensity: { value: clampFinite(options.ambientIntensity, 0.75, 0, 2) },
        uSunElevation: { value: clampFinite(options.sunElevation, 35, -20, 90) },
        uSunViewerAngle: { value: clampFinite(options.sunViewerAngle, 25, -180, 180) },
        uFreezingLevel: { value: clampFinite(options.freezingLevel, 5, 0, 16) },
        uWindShear: { value: clampFinite(options.windShear, 0.7, 0, 1) },
        uPhotographicStyle: { value: options.photographicStyle ? 1 : 0 },
        uLightPreset: { value: resolveLightPresetValue(options.lightPreset) },
        uSkyMode: { value: resolveSkyModeValue(options.skyMode, options.photographicStyle) },
        uTransparentBackground: { value: options.transparentBackground ? 1 : 0 },
        uHdr10Mode: { value: options.hdr10 ? 1 : 0 },
        uHdrReferencePeakNits: { value: HDR10_REFERENCE_PEAK_NITS }
      }
    });

    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
  }

  resize(width: number, height: number): void {
    const target = this.enforcePixelBudget(width, height);
    if (target.width === this.width && target.height === this.height) {
      return;
    }

    this.width = target.width;
    this.height = target.height;
    this.renderer.setSize(target.width, target.height, false);
    this.resolution.set(target.width, target.height);
    this.material.uniforms.uAspect!.value = target.width / target.height;
  }

  render(time: number): void {
    this.material.uniforms.uTime!.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.material.dispose();
    this.renderer.dispose();
  }

  private updateCameraFromOptions(): void {
    const distance = clampFinite(
      this.options.cameraDistance,
      this.resetCameraDistance(),
      8,
      160
    );
    const yaw = THREE.MathUtils.degToRad(clampFinite(this.options.cameraYawDegrees, 0, -180, 180));
    const pitch = THREE.MathUtils.degToRad(clampFinite(this.options.cameraPitchDegrees, 0, -55, 70));
    const horizontal = Math.cos(pitch) * distance;
    this.cameraTarget.set(0, this.heightAtCloudRatio(RESET_TARGET_HEIGHT_RATIO), 0);
    this.cameraPosition.set(
      this.cameraTarget.x + Math.sin(yaw) * horizontal,
      this.cameraTarget.y + Math.sin(pitch) * distance,
      this.cameraTarget.z - Math.cos(yaw) * horizontal
    );
    if (this.options.cameraYawDegrees === undefined && this.options.cameraPitchDegrees === undefined) {
      this.cameraPosition.set(0, this.heightAtCloudRatio(RESET_CAMERA_HEIGHT_RATIO), -distance);
    }
  }

  private heightAtCloudRatio(ratio: number): number {
    return MODEL_BASE_KM + (this.tropopause - MODEL_BASE_KM) * ratio;
  }

  private defaultOrthoFrustumSize(): number {
    const baseSize = this.tropopause + FRAME_VERTICAL_PADDING_KM * 2;
    const occupancy = isMobileWideView() ? MOBILE_MODEL_VIEW_OCCUPANCY : MODEL_VIEW_OCCUPANCY;
    return Math.max(MIN_ORTHO_FRUSTUM_SIZE, baseSize / occupancy);
  }

  private resetCameraDistance(): number {
    const fovRadians = THREE.MathUtils.degToRad(45);
    return (this.defaultOrthoFrustumSize() / (2 * Math.tan(fovRadians / 2))) * PERSPECTIVE_DISTANCE_SCALE;
  }

  private enforcePixelBudget(width: number, height: number): { width: number; height: number } {
    const maxPixels = clampFinite(this.options.maxPixels, 1920 * 1080, 128 * 128, 3840 * 2160);
    const pixels = Math.max(1, width * height);
    const scale = pixels > maxPixels ? Math.sqrt(maxPixels / pixels) : 1;
    return {
      width: Math.max(2, Math.floor((width * scale) / 2) * 2),
      height: Math.max(2, Math.floor((height * scale) / 2) * 2)
    };
  }
}

function resolveLightPresetValue(name: RaymarchCloudOptions["lightPreset"]): number {
  if (name === "golden-side") {
    return 1;
  }
  if (name === "backlit-edge") {
    return 2;
  }
  return 0;
}

function resolveSkyModeValue(
  name: RaymarchCloudOptions["skyMode"],
  photographicStyle = false
): number {
  if (name === "clear") {
    return 4;
  }
  if (name === "sunset") {
    return 2;
  }
  if (name === "moonlight") {
    return 3;
  }
  if (name === "atmosphere" || photographicStyle) {
    return 4;
  }
  return 0;
}

function isMobileWideView(): boolean {
  return window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
}

function clampFinite(value: number | undefined, fallback: number, minimum: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, value));
}
