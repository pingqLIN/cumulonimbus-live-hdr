import assert from "node:assert/strict";
import { createCloudPresetParams } from "../dist/core/presets.js";
import { sampleCloudShapeMetrics } from "../dist/core/cloud-shape-metrics.js";
import { IterativeCloudField } from "../dist/core/iterative-cloud-field.js";

const width = readNumberArg("--width", 96);
const height = readNumberArg("--height", 170);
const fps = readNumberArg("--fps", 15);
const seconds = readNumberArg("--seconds", 24);
const frames = Math.max(1, Math.round(fps * seconds));
const preset = readStringArg("--preset", "demo");
const threshold = readNumberArg("--threshold", 0.08);
const params = createCloudPresetParams(preset);
const field = new IterativeCloudField(width, height);
let fieldMetrics = { averageDensity: 0, activeEdgeRatio: 0 };

for (let frame = 0; frame < frames; frame += 1) {
  fieldMetrics = field.step(frame / fps, 1 / fps, params);
}

const shape = sampleCloudShapeMetrics(field, threshold);
assert.ok(shape.coverage > 0.06, `expected sustained cloud coverage, got ${shape.coverage}`);
assert.ok(
  shape.verticalExtent > 0.46,
  `expected tall cumulonimbus vertical extent, got ${shape.verticalExtent}`
);
assert.ok(shape.upperCoverage > 0.02, `expected upper anvil coverage, got ${shape.upperCoverage}`);
assert.ok(shape.lowerCoverage > 0.04, `expected lower tower coverage, got ${shape.lowerCoverage}`);
assert.ok(
  shape.anvilToTowerWidthRatio > 1.02,
  `expected upper anvil wider than lower tower, got ${shape.anvilToTowerWidthRatio}`
);
assert.ok(
  shape.centroidY > 0.44 && shape.centroidY < 0.78,
  `expected cloud mass to remain in portrait cumulonimbus frame, got centroidY ${shape.centroidY}`
);

console.log(
  JSON.stringify(
    {
      ok: true,
      preset,
      width,
      height,
      fps,
      seconds,
      frames,
      fieldMetrics,
      shape
    },
    null,
    2
  )
);

function readNumberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readStringArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  return process.argv[index + 1] ?? fallback;
}
