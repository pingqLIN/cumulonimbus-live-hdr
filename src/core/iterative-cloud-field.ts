import {
  sampleCloudDensity,
  shadeCloudPixel,
  type CloudParams,
  type Rgb
} from "./cloud-field.js";
import { clamp, fbm3, mix } from "./noise.js";

export interface FieldMetrics {
  averageDensity: number;
  activeEdgeRatio: number;
}

export class IterativeCloudField {
  readonly width: number;
  readonly height: number;
  private readonly density: Float32Array;
  private readonly nextDensity: Float32Array;
  private readonly edge: Float32Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.density = new Float32Array(width * height);
    this.nextDensity = new Float32Array(width * height);
    this.edge = new Float32Array(width * height);
  }

  reset(): void {
    this.density.fill(0);
    this.nextDensity.fill(0);
    this.edge.fill(0);
  }

  step(time: number, deltaSeconds: number, params: CloudParams): FieldMetrics {
    const condensationRate = 0.18 + params.growth * 0.18;
    const evaporationRate = 0.045 + (1 - params.growth) * 0.04;
    const memory = Math.exp(-Math.max(0.001, deltaSeconds) * 0.18);
    let total = 0;
    let activeEdges = 0;

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const index = y * this.width + x;
        const u = x / (this.width - 1);
        const v = y / (this.height - 1);
        const wind = this.windOffset(u, v, time, params);
        const carried = this.sampleDensity(u - wind.x, v - wind.y);
        const target = sampleCloudDensity(u, v, time, params);
        const rate = target > carried ? condensationRate : evaporationRate;
        const assimilated = mix(carried, target, 1 - Math.exp(-deltaSeconds * rate));
        const next = clamp(mix(assimilated, carried, memory * 0.18));
        this.nextDensity[index] = next;
        total += next;
      }
    }

    this.density.set(this.nextDensity);
    this.rebuildEdges();

    for (let index = 0; index < this.edge.length; index += 1) {
      if ((this.edge[index] ?? 0) > 0.08) {
        activeEdges += 1;
      }
    }

    return {
      averageDensity: total / this.density.length,
      activeEdgeRatio: activeEdges / this.edge.length
    };
  }

  samplePixel(x: number, y: number, params: CloudParams): Rgb {
    const u = x / (this.width - 1);
    const v = y / (this.height - 1);
    const index = y * this.width + x;
    return shadeCloudPixel(u, v, this.density[index] ?? 0, this.edge[index] ?? 0, params);
  }

  private windOffset(x: number, y: number, time: number, params: CloudParams): { x: number; y: number } {
    const scale = 0.0015 + params.edgeDrift * 0.006;
    const slowTime = time * 0.025;
    const shear = fbm3(x * 1.7, y * 1.2, slowTime, params.seed + 811, 3) - 0.5;
    const verticalLift = (0.35 + params.towerHeight * 0.5) * scale;
    return {
      x: shear * scale,
      y: -verticalLift + (fbm3(x * 2.3 + 4, y * 2.0, slowTime, params.seed + 977, 3) - 0.5) * scale
    };
  }

  private sampleDensity(x: number, y: number): number {
    const px = clamp(x) * (this.width - 1);
    const py = clamp(y) * (this.height - 1);
    const x0 = Math.floor(px);
    const y0 = Math.floor(py);
    const x1 = Math.min(this.width - 1, x0 + 1);
    const y1 = Math.min(this.height - 1, y0 + 1);
    const tx = px - x0;
    const ty = py - y0;
    const a = this.density[y0 * this.width + x0] ?? 0;
    const b = this.density[y0 * this.width + x1] ?? 0;
    const c = this.density[y1 * this.width + x0] ?? 0;
    const d = this.density[y1 * this.width + x1] ?? 0;
    return mix(mix(a, b, tx), mix(c, d, tx), ty);
  }

  private rebuildEdges(): void {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const index = y * this.width + x;
        const left = this.density[y * this.width + Math.max(0, x - 1)] ?? 0;
        const right = this.density[y * this.width + Math.min(this.width - 1, x + 1)] ?? 0;
        const up = this.density[Math.max(0, y - 1) * this.width + x] ?? 0;
        const down = this.density[Math.min(this.height - 1, y + 1) * this.width + x] ?? 0;
        this.edge[index] = clamp(Math.hypot(right - left, down - up) * 5.8);
      }
    }
  }
}
