import { tonemapSdr, type CloudParams } from "../core/cloud-field.js";
import { IterativeCloudField } from "../core/iterative-cloud-field.js";
import type { PreviewRenderer } from "./preview-renderer.js";

export class CpuPreviewRenderer implements PreviewRenderer {
  readonly mode = "cpu";
  private field: IterativeCloudField;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: CanvasRenderingContext2D
  ) {
    this.field = new IterativeCloudField(canvas.width, canvas.height);
  }

  reset(): void {
    this.field.reset();
  }

  resize(width: number, height: number): void {
    if (this.canvas.width === width && this.canvas.height === height) {
      return;
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.field = new IterativeCloudField(width, height);
    this.field.reset();
  }

  render(time: number, deltaSeconds: number, params: CloudParams): void {
    this.field.step(time, deltaSeconds, params);
    const image = this.context.createImageData(this.canvas.width, this.canvas.height);
    const data = image.data;

    for (let y = 0; y < this.canvas.height; y += 1) {
      for (let x = 0; x < this.canvas.width; x += 1) {
        const pixel = this.field.samplePixel(x, y, params);
        const index = (y * this.canvas.width + x) * 4;
        data[index] = Math.round(tonemapSdr(pixel.r) * 255);
        data[index + 1] = Math.round(tonemapSdr(pixel.g) * 255);
        data[index + 2] = Math.round(tonemapSdr(pixel.b) * 255);
        data[index + 3] = 255;
      }
    }

    this.context.putImageData(image, 0, 0);
  }
}
