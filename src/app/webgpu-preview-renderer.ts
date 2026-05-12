import type { CloudParams } from "../core/cloud-field.js";
import type { PreviewRenderer } from "./preview-renderer.js";

interface GpuNavigator extends Navigator {
  gpu?: {
    getPreferredCanvasFormat(): string;
    requestAdapter(): Promise<GpuAdapter | null>;
  };
}

interface GpuAdapter {
  requestDevice(): Promise<GpuDevice>;
}

interface GpuDevice {
  queue: {
    writeBuffer(buffer: GpuBuffer, bufferOffset: number, data: Float32Array): void;
    submit(commandBuffers: readonly unknown[]): void;
  };
  createBuffer(descriptor: Record<string, unknown>): GpuBuffer;
  createCommandEncoder(): GpuCommandEncoder;
  createRenderPipeline(descriptor: Record<string, unknown>): GpuRenderPipeline;
  createShaderModule(descriptor: Record<string, unknown>): unknown;
  createBindGroup(descriptor: Record<string, unknown>): GpuBindGroup;
}

interface GpuBuffer {
  destroy(): void;
}

interface GpuCommandEncoder {
  beginRenderPass(descriptor: Record<string, unknown>): GpuRenderPassEncoder;
  finish(): unknown;
}

interface GpuRenderPassEncoder {
  setPipeline(pipeline: GpuRenderPipeline): void;
  setBindGroup(index: number, bindGroup: GpuBindGroup): void;
  draw(vertexCount: number): void;
  end(): void;
}

interface GpuRenderPipeline {
  getBindGroupLayout(index: number): unknown;
}

interface GpuBindGroup {}

interface WebGpuCanvasContext {
  configure(descriptor: Record<string, unknown>): void;
  getCurrentTexture(): {
    createView(): unknown;
  };
}

const gpuBufferUsage = {
  uniform: 0x0040,
  copyDst: 0x0008
};

export class WebGpuPreviewRenderer implements PreviewRenderer {
  readonly mode = "webgpu";
  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: WebGpuCanvasContext,
    private readonly device: GpuDevice,
    private readonly pipeline: GpuRenderPipeline,
    private readonly uniformBuffer: GpuBuffer,
    private readonly bindGroup: GpuBindGroup,
    private readonly format: string
  ) {}

  static async create(canvas: HTMLCanvasElement): Promise<WebGpuPreviewRenderer | null> {
    const gpu = (navigator as GpuNavigator).gpu;
    if (!gpu) {
      return null;
    }

    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      return null;
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu") as unknown as WebGpuCanvasContext | null;
    if (!context) {
      return null;
    }

    const format = gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });
    const module = device.createShaderModule({ code: shaderSource });
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vertexMain"
      },
      fragment: {
        module,
        entryPoint: "fragmentMain",
        targets: [{ format }]
      },
      primitive: {
        topology: "triangle-list"
      }
    });
    const uniformBuffer = device.createBuffer({
      size: 64,
      usage: gpuBufferUsage.uniform | gpuBufferUsage.copyDst
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
    });

    return new WebGpuPreviewRenderer(
      canvas,
      context,
      device,
      pipeline,
      uniformBuffer,
      bindGroup,
      format
    );
  }

  reset(): void {}

  resize(width: number, height: number): void {
    if (this.canvas.width === width && this.canvas.height === height) {
      return;
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.configure({ device: this.device, format: this.format, alphaMode: "opaque" });
  }

  render(time: number, _deltaSeconds: number, params: CloudParams): void {
    const uniforms = buildWebGpuUniforms(this.canvas.width, this.canvas.height, time, params);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniforms);

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0.01, g: 0.02, b: 0.04, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(6);
    pass.end();
    this.device.queue.submit([encoder.finish()]);
  }
}

export function buildWebGpuUniforms(
  width: number,
  height: number,
  time: number,
  params: CloudParams
): Float32Array {
  return new Float32Array([
    width,
    height,
    time,
    params.seed % 10000,
    params.stormLifecycle.stormAge,
    params.humidityUplift.humidity,
    params.humidityUplift.upliftStrength,
    params.anvilWind.windShear,
    params.anvilWind.anvilOutflow,
    params.anvilWind.anvilPersistence,
    params.lightingHdr.silverLining,
    params.lightingHdr.haze,
    params.lightingHdr.sunEdgePeakNits / Math.max(1, params.lightingHdr.diffuseWhiteNits),
    params.anvilWind.tropopauseHeight,
    params.anvilWind.turbulentEntrainment,
    0
  ]);
}

const shaderSource = `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  seed: f32,
  stormAge: f32,
  humidity: f32,
  uplift: f32,
  windShear: f32,
  anvilOutflow: f32,
  anvilPersistence: f32,
  silverLining: f32,
  haze: f32,
  highlightScale: f32,
  tropopauseHeight: f32,
  turbulentEntrainment: f32,
  pad0: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
  var positions = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0),
    vec2f(1.0, -1.0),
    vec2f(1.0, 1.0)
  );
  let position = positions[vertexIndex];
  return vec4f(position, 0.0, 1.0);
}

fn hash(p: vec2f) -> f32 {
  let h = dot(p, vec2f(127.1, 311.7)) + uniforms.seed * 0.013;
  return fract(sin(h) * 43758.5453123);
}

fn valueNoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var sum = 0.0;
  var amp = 0.5;
  var freq = 1.0;
  for (var i = 0; i < 5; i = i + 1) {
    sum = sum + valueNoise(p * freq) * amp;
    amp = amp * 0.55;
    freq = freq * 2.03;
  }
  return sum;
}

@fragment
fn fragmentMain(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let uv = position.xy / uniforms.resolution;
  let centeredX = (uv.x - 0.5) * 2.0;
  let altitude = 1.0 - uv.y;
  let slowTime = uniforms.time * (0.012 + uniforms.windShear * 0.032 + uniforms.stormAge * 0.014);
  let warp = fbm(vec2f(centeredX * 1.8 + slowTime, uv.y * 2.1 - slowTime));
  let wx = centeredX + (warp - 0.5) * (0.28 + uniforms.turbulentEntrainment * 0.32);
  let tropopause = mix(0.58, 0.9, uniforms.tropopauseHeight);
  let towerWidth = mix(0.18, 0.42, smoothstep(0.02, 0.86, uv.y));
  let anvil = smoothstep(tropopause - 0.08, 0.98, altitude) * uniforms.anvilOutflow;
  let silhouette = 1.0 - smoothstep(towerWidth + anvil * 0.42, towerWidth + anvil * 0.92, abs(wx));
  let baseLift = smoothstep(0.98, 0.24, uv.y);
  let cap = smoothstep(0.04, 0.34 + uniforms.uplift * 0.34, altitude);
  let mass = silhouette * baseLift * cap;
  let bodyNoise = fbm(vec2f(wx * 5.0 + slowTime, uv.y * 6.4 - slowTime * 0.7));
  let threshold = mix(0.54, 0.32, uniforms.humidity) - uniforms.stormAge * 0.09;
  let density = clamp(mass * smoothstep(threshold, threshold + 0.28, bodyNoise), 0.0, 1.0);
  let edge = smoothstep(0.18, 0.68, density) * (1.0 - smoothstep(0.68, 1.0, density));
  let sky = mix(vec3f(0.32, 0.50, 0.66), vec3f(0.022, 0.06, 0.13), altitude) + uniforms.haze * (1.0 - altitude) * vec3f(0.34, 0.29, 0.19);
  let sun = clamp(1.0 - distance(uv, vec2f(0.24, 0.14)) * 1.55, 0.0, 1.0);
  let silver = edge * uniforms.silverLining * (0.75 + sun * 1.2);
  let bloom = pow(clamp(sun + silver * 0.58, 0.0, 1.0), 2.4) * mix(0.8, 1.24, clamp(uniforms.highlightScale / 6.0, 0.0, 1.0));
  let cloud = vec3f(0.64, 0.68, 0.74) + density * vec3f(0.55, 0.52, 0.48) + silver * vec3f(1.7, 1.55, 1.25) + bloom * vec3f(1.2, 1.0, 0.72);
  let color = mix(sky, cloud, smoothstep(0.015, 0.66, density + edge * 0.4));
  let mapped = pow(clamp(1.0 - exp(-color * 1.05), vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
  return vec4f(mapped, 1.0);
}
`;
