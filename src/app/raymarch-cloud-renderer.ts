import * as THREE from "three";
import { detectBrowserDisplayProfile, type BrowserDisplayProfile } from "./display-profile.js";
import { raymarchCloudLiteFragmentShader } from "./raymarch-cloud-lite-shader.js";
import { raymarchCloudFragmentShader, raymarchCloudVertexShader } from "./raymarch-cloud-shader.js";

export const CLOUD_MORPHOLOGY_STYLES = [
  "seeded",
  "baseline",
  "macro-boundary",
  "flatten",
  "skew-twist",
  "tear-silk",
  "budding",
  "giant-cumulonimbus"
] as const;

export type CloudMorphologyStyle = (typeof CLOUD_MORPHOLOGY_STYLES)[number];

export type RaymarchCloudOptions = {
  seed?: number;
  time?: number;
  fps?: number;
  displayProfile?: BrowserDisplayProfile;
  systems?: number;
  tropopause?: number;
  freezingLevel?: number;
  windShear?: number;
  fbmOctaves?: number;
  cloudCurl?: number;
  horizonStrength?: number;
  stepSize?: number;
  maxSteps?: number;
  earlyExitAlpha?: number;
  shadowSamples?: number;
  shadowStep?: number;
  shadowOcclusion?: number;
  densityMultiplier?: number;
  carvingWeight?: number;
  edgeErosionWeight?: number;
  surfaceShadowSamples?: number;
  surfaceShadowStep?: number;
  surfaceShadowStrength?: number;
  terrainFuzz?: number;
  oceanCrestStrength?: number;
  surfaceRadius?: number;
  sunIntensity?: number;
  ambientIntensity?: number;
  sunElevation?: number;
  sunViewerAngle?: number;
  photographicStyle?: boolean;
  lightPreset?: "daylight" | "golden-side" | "backlit-edge";
  skyMode?: "workbench" | "clear" | "sunset" | "moonlight" | "atmosphere";
  transparentBackground?: boolean;
  hdr10?: boolean;
  dither?: boolean;
  ortho?: boolean;
  showGrid?: boolean;
  surfaceMode?: "none" | "ocean" | "hills";
  morphologyStyle?: CloudMorphologyStyle;
  shaderVariant?: "live-lite" | "full";
  cameraYawDegrees?: number;
  cameraPitchDegrees?: number;
  cameraDistance?: number;
  cameraTargetOffsetX?: number;
  cameraTargetOffsetY?: number;
  cameraTargetOffsetZ?: number;
  maxPixels?: number;
  preserveDrawingBuffer?: boolean;
  staticMaxSteps?: number;
  mobileCumulusMode?: boolean;
  debugShaderDiagnostics?: boolean;
};

const MODEL_BASE_KM = 0.5;
const RESET_TARGET_HEIGHT_RATIO = 0.5;
const RESET_CAMERA_HEIGHT_RATIO = 0.93;
const MOBILE_RESET_TARGET_HEIGHT_RATIO = 0.24;
const MOBILE_RESET_CAMERA_HEIGHT_RATIO = 0.46;
const MODEL_VIEW_OCCUPANCY = 0.44;
const MOBILE_MODEL_VIEW_OCCUPANCY = 0.38;
const MIN_ORTHO_FRUSTUM_SIZE = 24;
const PERSPECTIVE_DISTANCE_SCALE = 0.38;
const FRAME_VERTICAL_PADDING_KM = 2;
const ORTHO_VERTICAL_WORLD_SCALE = 1;
const HDR10_REFERENCE_PEAK_NITS = 1000;
const SAFE_DESKTOP_MAX_PIXELS = 1280 * 720;
const EMPTY_SHADER_LOG = "(empty shader log)";
const STABLE_SHADER_SEED_LIMIT = 10_000;

export class RaymarchCloudRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly material: THREE.ShaderMaterial;
  private readonly cameraPosition = new THREE.Vector3();
  private readonly cameraTarget = new THREE.Vector3();
  private readonly resolution = new THREE.Vector2();
  private shaderVariant: NonNullable<RaymarchCloudOptions["shaderVariant"]>;
  private width = 0;
  private height = 0;
  private readonly displayProfile: BrowserDisplayProfile;
  private tropopause: number;
  private orthoFrustumSize: number;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private options: RaymarchCloudOptions = {}
  ) {
    this.displayProfile = options.displayProfile ?? detectBrowserDisplayProfile();
    this.shaderVariant = resolveShaderVariant(options);
    this.tropopause = clampFinite(options.tropopause, 12, 4, 20);
    this.orthoFrustumSize = this.defaultOrthoFrustumSize();
    this.updateCameraFromOptions();

    const rendererAttributes = {
      antialias: false,
      alpha: options.transparentBackground ?? false,
      premultipliedAlpha: !(options.transparentBackground ?? false),
      powerPreference: "default",
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false
    } satisfies WebGLContextAttributes;
    const context = createWebGLContext(canvas, rendererAttributes);
    if (!context) {
      throw new Error("WebGL is unavailable in this browser context.");
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context
    });
    this.renderer.debug.checkShaderErrors = true;
    this.renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
      throw new Error(
        [
          "Cumulonimbus shader program failed to link.",
          `Program: ${readShaderLog(gl.getProgramInfoLog(program))}`,
          `Vertex: ${readShaderLog(gl.getShaderInfoLog(vertexShader))}`,
          `Fragment: ${readShaderLog(gl.getShaderInfoLog(fragmentShader))}`
        ].join(" ")
      );
    };
    this.renderer.setClearColor(0x000000, options.transparentBackground ? 0 : 1);
    this.renderer.setPixelRatio(1);

    this.material = new THREE.ShaderMaterial({
      defines: {
        CUMULONIMBUS_MAX_RAY_STEPS: this.staticRayStepLimit(),
        CUMULONIMBUS_FBM_OCTAVES: this.staticFbmOctaves(this.shaderVariant),
        CUMULONIMBUS_SHADOW_SAMPLES: this.staticShadowSamples(this.shaderVariant),
        CUMULONIMBUS_SINGLE_CLOUD: usesSingleCloudModel(options) ? 1 : 0,
        CUMULONIMBUS_MORPHOLOGY_STYLE: resolveMorphologyStyleValue(options.morphologyStyle)
      },
      vertexShader: raymarchCloudVertexShader,
      fragmentShader: resolveFragmentShader(this.shaderVariant),
      uniforms: {
        uTime: { value: clampFinite(options.time, 0, 0, 1_000_000) },
        uResolution: { value: this.resolution },
        uCameraPos: { value: this.cameraPosition },
        uCameraTarget: { value: this.cameraTarget },
        uAspect: { value: 1 },
        uTropopause: { value: this.tropopause },
        uShowGrid: { value: options.showGrid ? 1 : 0 },
        uSurfaceVisible: { value: options.surfaceMode && options.surfaceMode !== "none" ? 1 : 0 },
        uSurfaceMode: { value: resolveSurfaceModeValue(options.surfaceMode) },
        uSeed: { value: normalizeShaderSeed(options.seed, 574) },
        uCloudCurl: {
          value: clampFinite(
            options.cloudCurl,
            this.displayProfile.mobileWideView ? 0.86 : 0.78,
            0,
            1.2
          )
        },
        uMorphologyStyle: { value: resolveMorphologyStyleValue(options.morphologyStyle) },
        uSystemCount: { value: resolveSystemCount(options.systems) },
        uIsOrtho: { value: options.ortho ? 1 : 0 },
        uOrthoSize: { value: this.orthoFrustumSize },
        uOrthoVerticalScale: { value: ORTHO_VERTICAL_WORLD_SCALE },
        uStepSize: { value: clampFinite(options.stepSize, this.defaultStepSize(), 0.08, 0.6) },
        uMaxSteps: { value: clampFinite(options.maxSteps, this.defaultMaxSteps(), 24, 144) },
        uEarlyExitAlpha: { value: clampFinite(options.earlyExitAlpha, 0.955, 0.88, 0.985) },
        uShadowStep: { value: clampFinite(options.shadowStep, 0.34, 0.18, 0.9) },
        uShadowOcclusion: { value: clampFinite(options.shadowOcclusion, 1, 0.25, 1.6) },
        uDensityMultiplier: { value: clampFinite(options.densityMultiplier, 12.8, 6, 18) },
        uCarvingWeight: { value: clampFinite(options.carvingWeight, 1, 0.35, 1.8) },
        uEdgeErosionWeight: { value: clampFinite(options.edgeErosionWeight, 1, 0.25, 1.8) },
        uSurfaceShadowSamples: { value: clampFinite(options.surfaceShadowSamples, 3, 0, 5) },
        uSurfaceShadowStep: { value: clampFinite(options.surfaceShadowStep, 1.15, 0.3, 2.4) },
        uSurfaceShadowStrength: {
          value: clampFinite(options.surfaceShadowStrength, 0.38, 0, 0.85)
        },
        uTerrainFuzz: { value: clampFinite(options.terrainFuzz, 0.52, 0, 1) },
        uOceanCrestStrength: { value: clampFinite(options.oceanCrestStrength, 0.72, 0, 1.4) },
        uSurfaceRadius: { value: clampFinite(options.surfaceRadius, 12, 8, 32) },
        uSunIntensity: { value: clampFinite(options.sunIntensity, 4.6, 0, 10) },
        uAmbientIntensity: { value: clampFinite(options.ambientIntensity, 0.75, 0, 2) },
        uSunElevation: { value: clampFinite(options.sunElevation, 35, -20, 90) },
        uSunViewerAngle: { value: clampFinite(options.sunViewerAngle, 25, -180, 180) },
        uFreezingLevel: { value: clampFinite(options.freezingLevel, 5, 0, 16) },
        uWindShear: {
          value: clampFinite(
            options.windShear,
            this.displayProfile.mobileWideView ? 0.9 : 0.82,
            0,
            1
          )
        },
        uPhotographicStyle: { value: options.photographicStyle ? 1 : 0 },
        uLightPreset: { value: resolveLightPresetValue(options.lightPreset) },
        uSkyMode: { value: resolveSkyModeValue(options.skyMode, options.photographicStyle) },
        uHorizonStrength: { value: clampFinite(options.horizonStrength, 1, 0, 1) },
        uTransparentBackground: { value: options.transparentBackground ? 1 : 0 },
        uHdr10Mode: { value: options.hdr10 ? 1 : 0 },
        uDitherEnabled: { value: options.dither ? 1 : 0 },
        uHdrReferencePeakNits: { value: HDR10_REFERENCE_PEAK_NITS },
        uMobileCumulusMode: { value: resolveMobileCumulusMode(options, this.displayProfile) }
      }
    });

    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
  }

  updateOptions(nextOptions: RaymarchCloudOptions): void {
    this.options = { ...this.options, ...nextOptions };
    this.tropopause = clampFinite(this.options.tropopause, 12, 4, 20);
    this.orthoFrustumSize = this.defaultOrthoFrustumSize();
    this.updateCameraFromOptions();

    const shaderVariant = resolveShaderVariant(this.options);
    if (this.shaderVariant !== shaderVariant) {
      this.shaderVariant = shaderVariant;
      this.material.fragmentShader = resolveFragmentShader(shaderVariant);
      this.material.needsUpdate = true;
    }
    const staticStepLimit = this.staticRayStepLimit();
    const staticFbmOctaves = this.staticFbmOctaves(shaderVariant);
    const staticShadowSamples = this.staticShadowSamples(shaderVariant);
    const singleCloudDefine = usesSingleCloudModel(this.options) ? 1 : 0;
    const morphologyStyleDefine = resolveMorphologyStyleValue(this.options.morphologyStyle);
    if (this.material.defines.CUMULONIMBUS_MAX_RAY_STEPS !== staticStepLimit) {
      this.material.defines.CUMULONIMBUS_MAX_RAY_STEPS = staticStepLimit;
      this.material.needsUpdate = true;
    }
    if (this.material.defines.CUMULONIMBUS_FBM_OCTAVES !== staticFbmOctaves) {
      this.material.defines.CUMULONIMBUS_FBM_OCTAVES = staticFbmOctaves;
      this.material.needsUpdate = true;
    }
    if (this.material.defines.CUMULONIMBUS_SHADOW_SAMPLES !== staticShadowSamples) {
      this.material.defines.CUMULONIMBUS_SHADOW_SAMPLES = staticShadowSamples;
      this.material.needsUpdate = true;
    }
    if (this.material.defines.CUMULONIMBUS_SINGLE_CLOUD !== singleCloudDefine) {
      this.material.defines.CUMULONIMBUS_SINGLE_CLOUD = singleCloudDefine;
      this.material.needsUpdate = true;
    }
    if (this.material.defines.CUMULONIMBUS_MORPHOLOGY_STYLE !== morphologyStyleDefine) {
      this.material.defines.CUMULONIMBUS_MORPHOLOGY_STYLE = morphologyStyleDefine;
      this.material.needsUpdate = true;
    }

    this.material.uniforms.uCameraPos!.value = this.cameraPosition;
    this.material.uniforms.uCameraTarget!.value = this.cameraTarget;
    this.material.uniforms.uTropopause!.value = this.tropopause;
    this.material.uniforms.uShowGrid!.value = this.options.showGrid ? 1 : 0;
    this.material.uniforms.uSurfaceVisible!.value =
      this.options.surfaceMode && this.options.surfaceMode !== "none" ? 1 : 0;
    this.material.uniforms.uSurfaceMode!.value = resolveSurfaceModeValue(this.options.surfaceMode);
    this.material.uniforms.uSeed!.value = normalizeShaderSeed(this.options.seed, 574);
    this.material.uniforms.uCloudCurl!.value = clampFinite(
      this.options.cloudCurl,
      this.displayProfile.mobileWideView ? 0.86 : 0.78,
      0,
      1.2
    );
    this.material.uniforms.uMorphologyStyle!.value = resolveMorphologyStyleValue(
      this.options.morphologyStyle
    );
    this.material.uniforms.uSystemCount!.value = resolveSystemCount(this.options.systems);
    this.material.uniforms.uIsOrtho!.value = this.options.ortho ? 1 : 0;
    this.material.uniforms.uOrthoSize!.value = this.orthoFrustumSize;
    this.material.uniforms.uStepSize!.value = clampFinite(
      this.options.stepSize,
      this.defaultStepSize(),
      0.08,
      0.6
    );
    this.material.uniforms.uMaxSteps!.value = clampFinite(
      this.options.maxSteps,
      this.defaultMaxSteps(),
      24,
      144
    );
    this.material.uniforms.uEarlyExitAlpha!.value = clampFinite(
      this.options.earlyExitAlpha,
      0.955,
      0.88,
      0.985
    );
    this.material.uniforms.uShadowStep!.value = clampFinite(
      this.options.shadowStep,
      0.34,
      0.18,
      0.9
    );
    this.material.uniforms.uShadowOcclusion!.value = clampFinite(
      this.options.shadowOcclusion,
      1,
      0.25,
      1.6
    );
    this.material.uniforms.uDensityMultiplier!.value = clampFinite(
      this.options.densityMultiplier,
      12.8,
      6,
      18
    );
    this.material.uniforms.uCarvingWeight!.value = clampFinite(
      this.options.carvingWeight,
      1,
      0.35,
      1.8
    );
    this.material.uniforms.uEdgeErosionWeight!.value = clampFinite(
      this.options.edgeErosionWeight,
      1,
      0.25,
      1.8
    );
    this.material.uniforms.uSurfaceShadowSamples!.value = clampFinite(
      this.options.surfaceShadowSamples,
      3,
      0,
      5
    );
    this.material.uniforms.uSurfaceShadowStep!.value = clampFinite(
      this.options.surfaceShadowStep,
      1.15,
      0.3,
      2.4
    );
    this.material.uniforms.uSurfaceShadowStrength!.value = clampFinite(
      this.options.surfaceShadowStrength,
      0.38,
      0,
      0.85
    );
    this.material.uniforms.uTerrainFuzz!.value = clampFinite(this.options.terrainFuzz, 0.52, 0, 1);
    this.material.uniforms.uOceanCrestStrength!.value = clampFinite(
      this.options.oceanCrestStrength,
      0.72,
      0,
      1.4
    );
    this.material.uniforms.uSurfaceRadius!.value = clampFinite(
      this.options.surfaceRadius,
      12,
      8,
      32
    );
    this.material.uniforms.uSunIntensity!.value = clampFinite(
      this.options.sunIntensity,
      4.6,
      0,
      10
    );
    this.material.uniforms.uAmbientIntensity!.value = clampFinite(
      this.options.ambientIntensity,
      0.75,
      0,
      2
    );
    this.material.uniforms.uSunElevation!.value = clampFinite(
      this.options.sunElevation,
      35,
      -20,
      90
    );
    this.material.uniforms.uSunViewerAngle!.value = clampFinite(
      this.options.sunViewerAngle,
      25,
      -180,
      180
    );
    this.material.uniforms.uFreezingLevel!.value = clampFinite(
      this.options.freezingLevel,
      5,
      0,
      16
    );
    this.material.uniforms.uWindShear!.value = clampFinite(
      this.options.windShear,
      this.displayProfile.mobileWideView ? 0.9 : 0.82,
      0,
      1
    );
    this.material.uniforms.uPhotographicStyle!.value = this.options.photographicStyle ? 1 : 0;
    this.material.uniforms.uLightPreset!.value = resolveLightPresetValue(this.options.lightPreset);
    this.material.uniforms.uSkyMode!.value = resolveSkyModeValue(
      this.options.skyMode,
      this.options.photographicStyle
    );
    this.material.uniforms.uHorizonStrength!.value = clampFinite(
      this.options.horizonStrength,
      1,
      0,
      1
    );
    this.material.uniforms.uTransparentBackground!.value = this.options.transparentBackground
      ? 1
      : 0;
    this.material.uniforms.uHdr10Mode!.value = this.options.hdr10 ? 1 : 0;
    this.material.uniforms.uDitherEnabled!.value = this.options.dither ? 1 : 0;
    this.material.uniforms.uMobileCumulusMode!.value = resolveMobileCumulusMode(
      this.options,
      this.displayProfile
    );
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
    const distance = clampFinite(this.options.cameraDistance, this.resetCameraDistance(), 8, 160);
    const yaw = THREE.MathUtils.degToRad(clampFinite(this.options.cameraYawDegrees, 0, -180, 180));
    const pitch = THREE.MathUtils.degToRad(
      clampFinite(this.options.cameraPitchDegrees, 0, -55, 70)
    );
    const horizontal = Math.cos(pitch) * distance;
    const targetRatio = this.displayProfile.mobileWideView
      ? MOBILE_RESET_TARGET_HEIGHT_RATIO
      : RESET_TARGET_HEIGHT_RATIO;
    const cameraRatio = this.displayProfile.mobileWideView
      ? MOBILE_RESET_CAMERA_HEIGHT_RATIO
      : RESET_CAMERA_HEIGHT_RATIO;
    this.cameraTarget.set(
      clampFinite(this.options.cameraTargetOffsetX, 0, -24, 24),
      this.heightAtCloudRatio(targetRatio) +
        clampFinite(this.options.cameraTargetOffsetY, 0, -12, 12),
      clampFinite(this.options.cameraTargetOffsetZ, 0, -24, 24)
    );
    this.cameraPosition.set(
      this.cameraTarget.x + Math.sin(yaw) * horizontal,
      this.cameraTarget.y + Math.sin(pitch) * distance,
      this.cameraTarget.z - Math.cos(yaw) * horizontal
    );
    if (
      this.options.cameraYawDegrees === undefined &&
      this.options.cameraPitchDegrees === undefined
    ) {
      this.cameraPosition.set(0, this.heightAtCloudRatio(cameraRatio), -distance);
    }
  }

  private heightAtCloudRatio(ratio: number): number {
    return MODEL_BASE_KM + (this.tropopause - MODEL_BASE_KM) * ratio;
  }

  private defaultOrthoFrustumSize(): number {
    const baseSize = this.tropopause + FRAME_VERTICAL_PADDING_KM * 2;
    const occupancy = this.displayProfile.mobileWideView
      ? MOBILE_MODEL_VIEW_OCCUPANCY
      : MODEL_VIEW_OCCUPANCY;
    return Math.max(MIN_ORTHO_FRUSTUM_SIZE, baseSize / occupancy);
  }

  private resetCameraDistance(): number {
    const fovRadians = THREE.MathUtils.degToRad(45);
    return (
      (this.defaultOrthoFrustumSize() / (2 * Math.tan(fovRadians / 2))) * PERSPECTIVE_DISTANCE_SCALE
    );
  }

  private enforcePixelBudget(width: number, height: number): { width: number; height: number } {
    const maxPixels = clampFinite(
      this.options.maxPixels,
      this.defaultMaxPixels(),
      128 * 128,
      3840 * 2160
    );
    const pixels = Math.max(1, width * height);
    const scale = pixels > maxPixels ? Math.sqrt(maxPixels / pixels) : 1;
    return {
      width: Math.max(2, Math.floor((width * scale) / 2) * 2),
      height: Math.max(2, Math.floor((height * scale) / 2) * 2)
    };
  }

  private defaultMaxPixels(): number {
    if (this.displayProfile.iosChrome) {
      return 960 * 540;
    }
    if (this.displayProfile.mobileWideView) {
      return 1280 * 720;
    }
    return SAFE_DESKTOP_MAX_PIXELS;
  }

  private defaultStepSize(): number {
    if (this.displayProfile.iosChrome) {
      return 0.34;
    }
    if (this.displayProfile.mobileWideView) {
      return 0.28;
    }
    return 0.24;
  }

  private defaultMaxSteps(): number {
    if (this.displayProfile.iosChrome) {
      return 36;
    }
    if (this.displayProfile.mobileWideView) {
      return 44;
    }
    return 40;
  }

  private staticRayStepLimit(): number {
    const fallback = this.displayProfile.iosChrome
      ? 40
      : this.displayProfile.mobileWideView
        ? 48
        : 40;
    return Math.round(clampFinite(this.options.staticMaxSteps, fallback, 24, 96));
  }

  private staticFbmOctaves(
    shaderVariant: NonNullable<RaymarchCloudOptions["shaderVariant"]>
  ): number {
    const octaves = Math.round(clampFinite(this.options.fbmOctaves, 5, 4, 6));
    return shaderVariant === "live-lite" ? Math.min(octaves, 4) : octaves;
  }

  private staticShadowSamples(
    shaderVariant: NonNullable<RaymarchCloudOptions["shaderVariant"]>
  ): number {
    const samples = Math.round(clampFinite(this.options.shadowSamples, 3, 0, 5));
    return shaderVariant === "live-lite" ? Math.min(samples, 3) : samples;
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

function resolveSurfaceModeValue(name: RaymarchCloudOptions["surfaceMode"]): number {
  if (name === "hills") {
    return 1;
  }
  if (name === "ocean") {
    return 0;
  }
  return 0;
}

function resolveMorphologyStyleValue(name: RaymarchCloudOptions["morphologyStyle"]): number {
  switch (name) {
    case "baseline":
      return 1;
    case "macro-boundary":
      return 2;
    case "flatten":
      return 3;
    case "skew-twist":
      return 4;
    case "tear-silk":
      return 5;
    case "budding":
      return 6;
    case "giant-cumulonimbus":
      return 7;
    default:
      return 0;
  }
}

function resolveShaderVariant(
  options: RaymarchCloudOptions
): NonNullable<RaymarchCloudOptions["shaderVariant"]> {
  if (options.shaderVariant === "full") {
    return "full";
  }
  if (requiresFullShader(options)) {
    return "full";
  }
  return "live-lite";
}

function resolveFragmentShader(
  variant: NonNullable<RaymarchCloudOptions["shaderVariant"]>
): string {
  return variant === "live-lite" ? raymarchCloudLiteFragmentShader : raymarchCloudFragmentShader;
}

function requiresFullShader(options: RaymarchCloudOptions): boolean {
  return Boolean(
    options.hdr10 ||
    options.dither ||
    options.photographicStyle ||
    (options.surfaceMode && options.surfaceMode !== "none") ||
    (options.skyMode && options.skyMode !== "clear" && options.skyMode !== "workbench") ||
    (options.morphologyStyle && options.morphologyStyle !== "giant-cumulonimbus")
  );
}

function resolveSystemCount(value: number | undefined): number {
  return Math.round(clampFinite(value, 1, 1, 10));
}

function normalizeShaderSeed(value: number | undefined, fallback: number): number {
  const seed = Math.floor(clampFinite(value, fallback, 1, Number.MAX_SAFE_INTEGER));
  return 1 + ((seed - 1) % STABLE_SHADER_SEED_LIMIT);
}

function usesSingleCloudModel(options: RaymarchCloudOptions): boolean {
  return resolveSystemCount(options.systems) < 2;
}

function resolveMobileCumulusMode(
  options: RaymarchCloudOptions,
  _displayProfile: BrowserDisplayProfile
): number {
  return options.mobileCumulusMode ? 1 : 0;
}

function createWebGLContext(
  canvas: HTMLCanvasElement,
  attributes: WebGLContextAttributes
): WebGLRenderingContext | WebGL2RenderingContext | null {
  const fallbacks: WebGLContextAttributes[] = [
    attributes,
    { ...attributes, powerPreference: "default" },
    { ...attributes, powerPreference: "low-power" },
    {
      alpha: attributes.alpha,
      premultipliedAlpha: attributes.premultipliedAlpha,
      preserveDrawingBuffer: attributes.preserveDrawingBuffer
    }
  ];

  for (const candidate of fallbacks) {
    const context =
      canvas.getContext("webgl2", candidate) ??
      canvas.getContext("webgl", candidate) ??
      (canvas.getContext("experimental-webgl", candidate) as WebGLRenderingContext | null);
    if (context) {
      return context;
    }
  }

  return null;
}

function readShaderLog(value: string | null): string {
  const log = value?.trim();
  return log && log.length > 0 ? log : EMPTY_SHADER_LOG;
}

function clampFinite(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, value));
}
