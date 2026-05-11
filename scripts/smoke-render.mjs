import assert from "node:assert/strict";
import { join } from "node:path";
import { defaultCloudParams, sampleCloudPixel } from "../dist/core/cloud-field.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";
import {
  assertRenderMetrics,
  createMetricsAccumulator,
  finalizeRenderMetrics,
  sampleFrameMetrics,
  writeMetricsJson
} from "../dist/core/metrics.js";
import { readFileSync } from "node:fs";

const width = 90;
const height = 160;
const field = new IterativeCloudField(width, height);
let metrics = { averageDensity: 0, activeEdgeRatio: 0 };
const startedAt = performance.now();
const accumulator = createMetricsAccumulator();

for (let frame = 0; frame < 90; frame += 1) {
  metrics = field.step(frame / 30, 1 / 30, defaultCloudParams);
}

const center = field.samplePixel(Math.floor(width * 0.5), Math.floor(height * 0.42), defaultCloudParams);
const direct = sampleCloudPixel(0.5, 0.42, 1, defaultCloudParams);
sampleFrameMetrics(field, defaultCloudParams, accumulator, metrics);
const renderMetrics = finalizeRenderMetrics(
  {
    mode: "smoke",
    width,
    height,
    fps: 30,
    seconds: 3,
    frames: 90,
    seed: defaultCloudParams.seed,
    backend: "cpu"
  },
  defaultCloudParams,
  accumulator,
  performance.now() - startedAt,
  {
    source: "smoke-render",
    projectVersion: readProjectVersion()
  }
);

assert.ok(metrics.averageDensity > 0.008, `expected visible cloud density, got ${metrics.averageDensity}`);
assert.ok(metrics.activeEdgeRatio > 0.04, `expected active evolving edge, got ${metrics.activeEdgeRatio}`);
for (const [label, pixel] of Object.entries({ center, direct })) {
  assert.ok(Number.isFinite(pixel.r), `${label}.r should be finite`);
  assert.ok(Number.isFinite(pixel.g), `${label}.g should be finite`);
  assert.ok(Number.isFinite(pixel.b), `${label}.b should be finite`);
  assert.ok(pixel.r >= 0 && pixel.g >= 0 && pixel.b >= 0, `${label} should be non-negative`);
}
assertRenderMetrics(renderMetrics);
writeMetricsJson(join("outputs", "metrics", "smoke-render.json"), renderMetrics);

console.log(JSON.stringify({ ok: true, metrics, center, renderMetrics }, null, 2));

function readProjectVersion() {
  try {
    const packageData = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    return typeof packageData.version === "string" ? packageData.version : "0.0.0";
  }
  catch {
    return "0.0.0";
  }
}
