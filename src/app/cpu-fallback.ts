import { type RaymarchCloudOptions } from "./raymarch-cloud-renderer.js";
import { clamp } from "./runtime-options.js";

export function paintCpuFallback(
  targetCanvas: HTMLCanvasElement,
  rendererOptions: RaymarchCloudOptions,
  reason: string,
  replaceCanvas: boolean
): HTMLCanvasElement {
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
    return fallbackCanvas;
  }

  const image = context.createImageData(width, height);
  const data = image.data;
  const fallbackSeed = Math.floor(rendererOptions.seed ?? 574);
  const fallbackTime = rendererOptions.time ?? 2.2;
  const densityField = createSingleCumulusDensity(rendererOptions, fallbackSeed, fallbackTime);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / Math.max(1, width - 1);
      const v = y / Math.max(1, height - 1);
      const pixel = shadeSingleCumulusPixel(u, v, densityField, rendererOptions);
      const index = (y * width + x) * 4;
      data[index] = Math.round(pixel.r * 255);
      data[index + 1] = Math.round(pixel.g * 255);
      data[index + 2] = Math.round(pixel.b * 255);
      data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return fallbackCanvas;
}

function cloneCanvasForFallback(targetCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const fallbackCanvas = document.createElement("canvas");
  fallbackCanvas.id = targetCanvas.id;
  fallbackCanvas.className = targetCanvas.className;
  fallbackCanvas.setAttribute("role", targetCanvas.getAttribute("role") ?? "img");
  targetCanvas.replaceWith(fallbackCanvas);
  return fallbackCanvas;
}

type Rgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

type DensityField = (u: number, v: number) => number;

function createSingleCumulusDensity(
  rendererOptions: RaymarchCloudOptions,
  seed: number,
  time: number
): DensityField {
  const curl = clamp(rendererOptions.cloudCurl ?? 0.78, 0, 1.2);
  const shear = clamp(rendererOptions.windShear ?? 0.42, 0, 1);
  const spread = 1 + curl * 0.22;
  const drift = Math.sin(time * 0.04 + seed * 0.01) * 0.015;
  const lobes = [
    { x: -0.78, y: 0.28, rx: 0.66, ry: 0.24, weight: 0.76 },
    { x: -0.24, y: 0.32, rx: 0.84, ry: 0.26, weight: 0.88 },
    { x: 0.34, y: 0.3, rx: 0.82, ry: 0.25, weight: 0.88 },
    { x: 0.86, y: 0.26, rx: 0.54, ry: 0.21, weight: 0.66 },
    { x: -0.36, y: -0.04, rx: 0.5, ry: 0.34, weight: 0.84 },
    { x: 0.12, y: -0.24, rx: 0.56, ry: 0.4, weight: 0.94 },
    { x: 0.52, y: -0.06, rx: 0.48, ry: 0.32, weight: 0.78 },
    { x: -0.06, y: -0.5, rx: 0.38, ry: 0.25, weight: 0.56 }
  ];

  return (u, v) => {
    const px = (u - 0.5) * 3.4;
    const py = (v - 0.57) * 2.45;
    let mass = 0;

    for (const lobe of lobes) {
      const shearOffset = (0.58 - v) * shear * 0.26;
      const dx = (px - lobe.x * spread - shearOffset - drift) / (lobe.rx * spread);
      const dy = (py - lobe.y + drift * 0.8) / lobe.ry;
      mass += Math.exp(-(dx * dx + dy * dy) * 1.55) * lobe.weight;
    }

    const capSoftener = 1 - smoothstepNumber(0.12, 0.42, Math.abs(py - 0.2));
    const underside = smoothstepNumber(1.05, 0.38, py + noise2(px * 2.4, seed * 0.07) * 0.08);
    const texture =
      fbm2(px * 1.2 + seed * 0.01, py * 1.35 - time * 0.02, seed, 4) * 0.2 +
      fbm2(px * 4.4, py * 4.1 + seed * 0.013, seed + 31, 3) * 0.11;
    const erosion = fbm2(px * 8.2 + time * 0.04, py * 8.6, seed + 71, 3);
    const edgeBreak = smoothstepNumber(0.48, 0.92, erosion) * smoothstepNumber(0.44, 0.78, mass) * 0.22;
    return clamp((mass + texture + capSoftener * 0.06) * underside - 0.52 - edgeBreak, 0, 1);
  };
}

function shadeSingleCumulusPixel(
  u: number,
  v: number,
  densityField: DensityField,
  rendererOptions: RaymarchCloudOptions
): Rgb {
  const sky = sampleFallbackSky(u, v, rendererOptions);
  const density = densityField(u, v);
  const edge =
    Math.abs(densityField(u + 0.0025, v) - densityField(u - 0.0025, v)) +
    Math.abs(densityField(u, v + 0.0025) - densityField(u, v - 0.0025));
  const sunLift = clamp((rendererOptions.sunElevation ?? 58) / 90, 0, 1);
  const sideLight = smoothstepNumber(0.0, 1.0, 1 - u * 0.62 - v * 0.12);
  const interior = smoothstepNumber(0.08, 0.82, density);
  const silver = smoothstepNumber(0.04, 0.42, edge) * (0.18 + sunLift * 0.42);
  const shade = smoothstepNumber(0.46, 0.92, v) * (0.24 + interior * 0.32);
  const cloud: Rgb = {
    r: clamp01(0.58 + interior * 0.24 + sideLight * 0.08 + silver * 0.24 - shade * 0.3),
    g: clamp01(0.61 + interior * 0.22 + sideLight * 0.07 + silver * 0.22 - shade * 0.27),
    b: clamp01(0.65 + interior * 0.2 + sideLight * 0.05 + silver * 0.16 - shade * 0.22)
  };
  const opacity = smoothstepNumber(0.04, 0.72, density + edge * 0.12);
  return mixRgb(sky, cloud, opacity);
}

function sampleFallbackSky(u: number, v: number, rendererOptions: RaymarchCloudOptions): Rgb {
  if (rendererOptions.skyMode === "moonlight") {
    return mixRgb({ r: 0.025, g: 0.034, b: 0.056 }, { r: 0.16, g: 0.18, b: 0.22 }, v);
  }
  const top = { r: 0.18, g: 0.31, b: 0.5 };
  const horizon = { r: 0.58, g: 0.65, b: 0.68 };
  const lower = { r: 0.43, g: 0.5, b: 0.51 };
  const vertical = v < 0.55 ? mixRgb(top, horizon, smoothstepNumber(0, 0.55, v)) : mixRgb(horizon, lower, smoothstepNumber(0.55, 1, v));
  const sunWarmth = clamp((rendererOptions.sunIntensity ?? 7.2) / 10, 0, 1) * 0.035;
  return {
    r: clamp01(vertical.r + sunWarmth * (1 - u) * 0.5),
    g: clamp01(vertical.g + sunWarmth * 0.28),
    b: clamp01(vertical.b)
  };
}

function fbm2(x: number, y: number, seed: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;
  for (let octave = 0; octave < octaves; octave += 1) {
    value += noise2(x * frequency + seed * 0.011, y * frequency - seed * 0.007) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return normalizer > 0 ? value / normalizer : 0;
}

function noise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return mixNumber(mixNumber(a, b, sx), mixNumber(c, d, sx), sy);
}

function hash2(x: number, y: number): number {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function smoothstepNumber(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixNumber(left: number, right: number, amount: number): number {
  return left + (right - left) * amount;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function mixRgb(left: Rgb, right: Rgb, amount: number): Rgb {
  return {
    r: mixNumber(left.r, right.r, amount),
    g: mixNumber(left.g, right.g, amount),
    b: mixNumber(left.b, right.b, amount)
  };
}
