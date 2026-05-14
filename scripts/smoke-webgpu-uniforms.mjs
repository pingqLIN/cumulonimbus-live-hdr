import assert from "node:assert/strict";
import { defaultCloudParams } from "../dist/core/cloud-field.js";
import { buildWebGpuUniforms } from "../dist/app/webgpu-preview-renderer.js";

const width = 540;
const height = 960;
const time = 12.5;
const uniforms = buildWebGpuUniforms(width, height, time, defaultCloudParams);
const expectedHighlightScale =
  defaultCloudParams.lightingHdr.sunEdgePeakNits /
  Math.max(1, defaultCloudParams.lightingHdr.diffuseWhiteNits);

assert.equal(uniforms.length, 20);
assert.equal(uniforms[0], width);
assert.equal(uniforms[1], height);
assert.equal(uniforms[2], time);
assert.equal(uniforms[3], defaultCloudParams.seed % 10000);
assertClose(uniforms[4], defaultCloudParams.stormLifecycle.stormAge);
assertClose(uniforms[5], defaultCloudParams.humidityUplift.humidity);
assertClose(uniforms[6], defaultCloudParams.humidityUplift.upliftStrength);
assertClose(uniforms[7], defaultCloudParams.anvilWind.windShear);
assertClose(uniforms[8], defaultCloudParams.anvilWind.anvilOutflow);
assertClose(uniforms[9], defaultCloudParams.anvilWind.anvilPersistence);
assertClose(uniforms[10], defaultCloudParams.lightingHdr.silverLining);
assertClose(uniforms[11], defaultCloudParams.lightingHdr.haze);
assertClose(uniforms[12], expectedHighlightScale);
assertClose(uniforms[13], defaultCloudParams.anvilWind.tropopauseHeight);
assertClose(uniforms[14], defaultCloudParams.anvilWind.turbulentEntrainment);
assertClose(uniforms[15], defaultCloudParams.billowMorphology.lobeScale);
assertClose(uniforms[16], defaultCloudParams.billowMorphology.microBillowScale);
assertClose(uniforms[17], defaultCloudParams.billowMorphology.shadowDepth);
assertClose(uniforms[18], defaultCloudParams.billowMorphology.starterBlend);
assert.equal(uniforms[19], 0);
for (const value of uniforms) {
  assert.ok(Number.isFinite(value), `uniform should be finite: ${value}`);
}

console.log(
  JSON.stringify({ ok: true, width, height, time, uniforms: Array.from(uniforms) }, null, 2)
);

function assertClose(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 0.000001,
    `expected ${actual} to be close to ${expected}`
  );
}
