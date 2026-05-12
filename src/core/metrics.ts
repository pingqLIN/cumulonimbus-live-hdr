import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  describeHdrEncoding,
  hdrSettingsFromParams,
  maxSceneChannel,
  sceneLinearToNits,
  type HdrEncodingSummary
} from "./hdr.js";
import type { CloudParams } from "./parameters.js";
import type { IterativeCloudField, FieldMetrics } from "./iterative-cloud-field.js";

const METRICS_SCHEMA_VERSION = "2.2.0";

function hashValue(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function canonicalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJson(item));
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, child]) => [key, canonicalizeJson(child)] as const)
    .sort(([left], [right]) => left.localeCompare(right));

  const result: Record<string, unknown> = {};
  for (const [key, child] of entries) {
    result[key] = child;
  }
  return result;
}

function nowIsoString(): string {
  return new Date().toISOString();
}

function randomSuffix(length = 4): string {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");
}

function runId(): string {
  return `run-${nowIsoString().replace(/[:.]/g, "-")}-${randomSuffix(4)}`;
}

function canonicalParamsHash(params: CloudParams): string {
  return hashValue(JSON.stringify(canonicalizeJson(params)));
}

function fingerprintKey(params: CloudParams): string {
  return `${params.seed}-${params.stormLifecycle.stormAge}-${params.stormLifecycle.phase}-${canonicalParamsHash(params)}`;
}

export type RenderBackend = "cpu" | "webgpu" | "web";

export interface RenderMetadata {
  runId: string;
  schemaVersion: string;
  projectVersion: string;
  source: string;
  paramsFingerprint: string;
  paramsFingerprintKey: string;
}

export interface RenderConfigMetrics {
  mode: string;
  width: number;
  height: number;
  fps: number;
  seconds: number;
  frames: number;
  seed: number;
  backend: RenderBackend;
}

export interface RenderMetrics {
  metadata: RenderMetadata;
  ok: boolean;
  generatedAt: string;
  renderConfig: RenderConfigMetrics;
  averageDensity: number;
  activeEdgeRatio: number;
  peakSceneValue: number;
  peakNits: number;
  hdrEncoding: HdrEncodingSummary;
  maxChannel: "r" | "g" | "b";
  renderDurationMs: number;
  comparison?: RenderMetricsComparison;
}

export interface MetricsAccumulator {
  metrics: FieldMetrics;
  peakSceneValue: number;
  maxChannel: "r" | "g" | "b";
}

export interface RenderMetricsComparison {
  sourceRunId: string;
  sourcePath: string;
  sourceGeneratedAt: string;
  deltas: {
    averageDensity: number;
    activeEdgeRatio: number;
    peakSceneValue: number;
    peakNits: number;
  };
  ratios: {
    averageDensity: number;
    activeEdgeRatio: number;
    peakSceneValue: number;
    peakNits: number;
  };
}

export function createMetricsAccumulator(): MetricsAccumulator {
  return {
    metrics: {
      averageDensity: 0,
      activeEdgeRatio: 0
    },
    peakSceneValue: 0,
    maxChannel: "r"
  };
}

export function sampleFrameMetrics(
  field: IterativeCloudField,
  params: CloudParams,
  accumulator: MetricsAccumulator,
  metrics: FieldMetrics
): void {
  accumulator.metrics = metrics;

  for (let y = 0; y < field.height; y += 1) {
    for (let x = 0; x < field.width; x += 1) {
      const pixel = field.samplePixel(x, y, params);
      const frameMax = maxSceneChannel(pixel);
      if (frameMax > accumulator.peakSceneValue) {
        accumulator.peakSceneValue = frameMax;
        accumulator.maxChannel =
          pixel.r >= pixel.g && pixel.r >= pixel.b ? "r" : pixel.g >= pixel.b ? "g" : "b";
      }
    }
  }
}

export function createRunMetadata(
  source = "script",
  projectVersion = "0.0.0",
  params: CloudParams
): RenderMetadata {
  const paramsFingerprint = canonicalParamsHash(params);
  return {
    runId: runId(),
    schemaVersion: METRICS_SCHEMA_VERSION,
    projectVersion,
    source,
    paramsFingerprint,
    paramsFingerprintKey: fingerprintKey(params)
  };
}

export function compareRenderMetrics(
  current: RenderMetrics,
  baseline: RenderMetrics
): RenderMetricsComparison {
  return {
    sourceRunId: baseline.metadata.runId,
    sourcePath: "baseline",
    sourceGeneratedAt: baseline.generatedAt,
    deltas: {
      averageDensity: current.averageDensity - baseline.averageDensity,
      activeEdgeRatio: current.activeEdgeRatio - baseline.activeEdgeRatio,
      peakSceneValue: current.peakSceneValue - baseline.peakSceneValue,
      peakNits: current.peakNits - baseline.peakNits
    },
    ratios: {
      averageDensity:
        baseline.averageDensity === 0
          ? 0
          : (current.averageDensity - baseline.averageDensity) / baseline.averageDensity,
      activeEdgeRatio:
        baseline.activeEdgeRatio === 0
          ? 0
          : (current.activeEdgeRatio - baseline.activeEdgeRatio) / baseline.activeEdgeRatio,
      peakSceneValue:
        baseline.peakSceneValue === 0
          ? 0
          : (current.peakSceneValue - baseline.peakSceneValue) / baseline.peakSceneValue,
      peakNits:
        baseline.peakNits === 0 ? 0 : (current.peakNits - baseline.peakNits) / baseline.peakNits
    }
  };
}

export function finalizeRenderMetrics(
  config: RenderConfigMetrics,
  params: CloudParams,
  accumulator: MetricsAccumulator,
  renderDurationMs: number,
  metadata?: Partial<RenderMetadata>
): RenderMetrics {
  const settings = hdrSettingsFromParams(params);
  const baseMetadata = createRunMetadata(metadata?.source, metadata?.projectVersion, params);
  const canonicalMetadata: RenderMetadata = {
    ...baseMetadata,
    ...metadata,
    schemaVersion: metadata?.schemaVersion ?? baseMetadata.schemaVersion,
    paramsFingerprint: metadata?.paramsFingerprint ?? baseMetadata.paramsFingerprint,
    paramsFingerprintKey: metadata?.paramsFingerprintKey ?? baseMetadata.paramsFingerprintKey
  };
  return {
    metadata: canonicalMetadata,
    ok: true,
    generatedAt: nowIsoString(),
    renderConfig: config,
    averageDensity: accumulator.metrics.averageDensity,
    activeEdgeRatio: accumulator.metrics.activeEdgeRatio,
    peakSceneValue: accumulator.peakSceneValue,
    peakNits: sceneLinearToNits(accumulator.peakSceneValue, settings),
    hdrEncoding: describeHdrEncoding(settings),
    maxChannel: accumulator.maxChannel,
    renderDurationMs
  };
}

export function assertRenderMetrics(metrics: RenderMetrics): void {
  const checks = [
    metrics.metadata.schemaVersion === METRICS_SCHEMA_VERSION,
    metrics.metadata.projectVersion.length > 0,
    metrics.metadata.source.length > 0,
    metrics.metadata.paramsFingerprint.length > 0,
    metrics.renderConfig.width > 0,
    metrics.renderConfig.height > 0,
    metrics.ok,
    Number.isFinite(metrics.averageDensity),
    Number.isFinite(metrics.activeEdgeRatio),
    Number.isFinite(metrics.peakSceneValue),
    Number.isFinite(metrics.peakNits),
    Number.isFinite(metrics.hdrEncoding.encodingPeakNits),
    metrics.hdrEncoding.diffuseWhitePq16 > 0,
    metrics.hdrEncoding.maxCllPq16 >= metrics.hdrEncoding.diffuseWhitePq16,
    metrics.renderDurationMs >= 0,
    metrics.averageDensity > 0.008,
    metrics.activeEdgeRatio > 0.04,
    metrics.peakSceneValue > 0,
    metrics.peakNits > 0
  ];
  if (checks.some((check) => !check)) {
    throw new Error(`Invalid render metrics: ${JSON.stringify(metrics)}`);
  }
}

export function writeMetricsJson(path: string, metrics: RenderMetrics): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(metrics, null, 2)}\n`, "utf8");
}
