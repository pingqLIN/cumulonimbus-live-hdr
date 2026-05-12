import type { CloudParams } from "../core/cloud-field.js";
import type { ThreeBubbleTuning } from "./three-bubble-tuning.js";

export interface PreviewMetricItem {
  label: string;
  value: string;
}

export interface PreviewMetrics {
  title: string;
  items: readonly PreviewMetricItem[];
}

export interface PreviewRenderer {
  readonly mode: "cpu" | "webgpu" | "three-bubble";
  reset(): void;
  resize(width: number, height: number): void;
  render(time: number, deltaSeconds: number, params: CloudParams): void;
  getMetrics?(): PreviewMetrics | null;
  setThreeBubbleTuning?(tuning: Partial<ThreeBubbleTuning>): void;
}
