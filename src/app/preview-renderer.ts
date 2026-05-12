import type { CloudParams } from "../core/cloud-field.js";

export interface PreviewRenderer {
  readonly mode: "cpu" | "webgpu" | "three-bubble";
  reset(): void;
  resize(width: number, height: number): void;
  render(time: number, deltaSeconds: number, params: CloudParams): void;
}
