import assert from "node:assert/strict";
import { BubbleModel, normalizeBubbleParams } from "../dist/core/bubble-model.js";
import {
  defaultBubbleModelParams,
  mapCloudParamsToBubbleParams
} from "../dist/core/bubble-params.js";
import { defaultCloudParams } from "../dist/core/cloud-field.js";

function runModel(cloudParams = defaultCloudParams) {
  const params = mapCloudParamsToBubbleParams(cloudParams);
  const model = new BubbleModel(params);
  let metrics = model.getMetrics();

  for (let frame = 0; frame < 180; frame += 1) {
    metrics = model.step(1 / 30);
  }

  return {
    metrics,
    nodes: model.getNodes().map((node) => ({
      id: node.id,
      parentId: node.parentId,
      generation: node.generation,
      layer: node.layer,
      x: Number(node.x.toFixed(6)),
      y: Number(node.y.toFixed(6)),
      z: Number(node.z.toFixed(6)),
      radius: Number(node.radius.toFixed(6)),
      maxRadius: Number(node.maxRadius.toFixed(6)),
      active: node.active,
      spawned: node.spawned
    }))
  };
}

const first = runModel();
const second = runModel();

assert.deepEqual(second, first, "expected same seed to produce deterministic bubble model output");
assert.ok(
  first.metrics.totalNodes > 1,
  `expected more than one bubble node, got ${first.metrics.totalNodes}`
);
assert.ok(first.metrics.activeNodes >= 0, "expected active node count to stay non-negative");
assert.ok(
  first.metrics.maxGeneration >= 1,
  `expected branch generation >= 1, got ${first.metrics.maxGeneration}`
);
assert.ok(
  first.metrics.totalNodes <= mapCloudParamsToBubbleParams(defaultCloudParams).maxInstances
);
assert.ok(first.metrics.averageRadius > 0, "expected positive average radius");

const layers = new Set(first.nodes.map((node) => node.layer));
for (const expectedLayer of ["base", "tower", "anvil", "veil"]) {
  assert.ok(layers.has(expectedLayer), `expected seeded model to include ${expectedLayer} layer`);
}

const strongerUplift = cloneCloudParams(defaultCloudParams);
strongerUplift.humidityUplift.upliftStrength = Math.min(
  1,
  defaultCloudParams.humidityUplift.upliftStrength + 0.18
);
const strongerUpliftResult = runModel(strongerUplift);
assert.notDeepEqual(
  strongerUpliftResult.metrics,
  first.metrics,
  "expected morphology metrics to change when structural cloud params change"
);

const persistentAnvil = cloneCloudParams(defaultCloudParams);
persistentAnvil.anvilWind.anvilPersistence = Math.min(
  1,
  defaultCloudParams.anvilWind.anvilPersistence + 0.22
);
const persistentAnvilParams = mapCloudParamsToBubbleParams(persistentAnvil);
const defaultBubbleParams = mapCloudParamsToBubbleParams(defaultCloudParams);
assert.notEqual(
  persistentAnvilParams.anvilSpread,
  defaultBubbleParams.anvilSpread,
  "expected anvilPersistence to affect 3D anvil spread"
);
assert.notEqual(
  persistentAnvilParams.spawnThreshold,
  defaultBubbleParams.spawnThreshold,
  "expected anvilPersistence to affect 3D lifecycle persistence"
);

const brighterEdge = cloneCloudParams(defaultCloudParams);
brighterEdge.lightingHdr.sunEdgePeakNits = defaultCloudParams.lightingHdr.sunEdgePeakNits + 500;
assert.notEqual(
  mapCloudParamsToBubbleParams(brighterEdge).lightWrap,
  defaultBubbleParams.lightWrap,
  "expected sunEdgePeakNits to affect 3D light wrap"
);

const cappedModel = new BubbleModel({ ...defaultBubbleModelParams, maxInstances: 1 });
assert.ok(
  cappedModel.getMetrics().totalNodes <= 1,
  `expected seed structure to honor maxInstances=1, got ${cappedModel.getMetrics().totalNodes}`
);

const cappedLifecycleModel = new BubbleModel({ ...defaultBubbleModelParams, maxInstances: 100 });
for (let frame = 0; frame < 2000; frame += 1) {
  cappedLifecycleModel.step(1 / 30);
}
const stalledActiveNodes = cappedLifecycleModel
  .getNodes()
  .filter((node) => node.active && node.radius >= node.maxRadius);
assert.equal(
  stalledActiveNodes.length,
  0,
  `expected capped mature nodes to deactivate, got ${stalledActiveNodes.length} stalled active nodes`
);

const normalizedMalformed = normalizeBubbleParams({
  ...defaultBubbleModelParams,
  childCountMin: -2,
  childCountMax: -1,
  childRadiusMin: -0.4,
  childRadiusMax: -0.2
});
assert.ok(
  normalizedMalformed.childCountMax >= normalizedMalformed.childCountMin,
  "expected child count max to stay above normalized child count min"
);
assert.ok(
  normalizedMalformed.childRadiusMax >= normalizedMalformed.childRadiusMin,
  "expected child radius max to stay above normalized child radius min"
);

console.log(JSON.stringify({ ok: true, metrics: first.metrics }, null, 2));

function cloneCloudParams(params) {
  return {
    ...params,
    stormLifecycle: { ...params.stormLifecycle },
    humidityUplift: { ...params.humidityUplift },
    anvilWind: { ...params.anvilWind },
    lightingHdr: { ...params.lightingHdr },
    billowMorphology: { ...params.billowMorphology }
  };
}
