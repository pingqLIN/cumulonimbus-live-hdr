import assert from "node:assert/strict";
import { defaultCloudParams, sampleCloudPixel } from "../dist/core/cloud-field.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";

const width = 90;
const height = 160;
const field = new IterativeCloudField(width, height);
let metrics = { averageDensity: 0, activeEdgeRatio: 0 };

for (let frame = 0; frame < 90; frame += 1) {
  metrics = field.step(frame / 30, 1 / 30, defaultCloudParams);
}

const center = field.samplePixel(Math.floor(width * 0.5), Math.floor(height * 0.42), defaultCloudParams);
const direct = sampleCloudPixel(0.5, 0.42, 1, defaultCloudParams);

assert.ok(metrics.averageDensity > 0.008, `expected visible cloud density, got ${metrics.averageDensity}`);
assert.ok(metrics.activeEdgeRatio > 0.04, `expected active evolving edge, got ${metrics.activeEdgeRatio}`);
for (const [label, pixel] of Object.entries({ center, direct })) {
  assert.ok(Number.isFinite(pixel.r), `${label}.r should be finite`);
  assert.ok(Number.isFinite(pixel.g), `${label}.g should be finite`);
  assert.ok(Number.isFinite(pixel.b), `${label}.b should be finite`);
  assert.ok(pixel.r >= 0 && pixel.g >= 0 && pixel.b >= 0, `${label} should be non-negative`);
}

console.log(JSON.stringify({ ok: true, metrics, center }, null, 2));
