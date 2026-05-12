import assert from "node:assert/strict";
import { defaultCloudParams } from "../dist/core/cloud-field.js";
import {
  describeHdrEncoding,
  hdrSettingsFromParams,
  nitsToPq,
  sceneLinearToNits,
  sceneLinearToPq16
} from "../dist/core/hdr.js";

const settings = hdrSettingsFromParams(defaultCloudParams);
const summary = describeHdrEncoding(settings);
const pqSamples = [0, 100, settings.diffuseWhiteNits, settings.sunEdgePeakNits, 10000].map(
  (nits) => ({
    nits,
    pq: nitsToPq(nits)
  })
);

assert.equal(nitsToPq(0), 0);
assert.equal(nitsToPq(10000), 1);
assert.ok(nitsToPq(100) > 0.5 && nitsToPq(100) < 0.51, "100 nit PQ should be near 0.508");
for (let index = 1; index < pqSamples.length; index += 1) {
  assert.ok(pqSamples[index].pq >= pqSamples[index - 1].pq, "PQ samples should be monotonic");
}

assert.equal(sceneLinearToNits(0, settings), 0);
assert.equal(sceneLinearToNits(1, settings), settings.diffuseWhiteNits);
assert.ok(sceneLinearToNits(8, settings) <= summary.encodingPeakNits);
assert.equal(sceneLinearToPq16(1, settings), summary.diffuseWhitePq16);
assert.ok(summary.maxCllPq16 >= summary.diffuseWhitePq16);
assert.ok(summary.sunEdgePeakPq16 >= summary.diffuseWhitePq16);

console.log(JSON.stringify({ ok: true, summary, pqSamples }, null, 2));
