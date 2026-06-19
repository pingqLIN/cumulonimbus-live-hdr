import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const summaryPath = resolve(projectRoot, "outputs", "analysis", "06-visual-freeze-summary.json");

const presets = [
  {
    name: "landscape-persp-front",
    args: {
      out: "outputs/analysis/06-freeze-landscape-persp-front.png",
      width: 900,
      height: 506,
      seed: 574,
      time: 2.2,
      quality: 0.72,
      hud: 0,
      grid: 0,
      ortho: 0,
      systems: 3
    },
    bounds: {
      coverage: [0.08, 0.74],
      brightPixelRatio: [0.08, 0.86],
      lumaStdDev: [16, 84],
      centroidX: [0.24, 0.76],
      centroidY: [0.12, 0.72]
    }
  },
  {
    name: "landscape-persp-side",
    args: {
      out: "outputs/analysis/06-freeze-landscape-persp-side.png",
      width: 900,
      height: 506,
      seed: 574,
      time: 2.2,
      quality: 0.72,
      hud: 0,
      grid: 0,
      ortho: 0,
      cameraYawDegrees: 90,
      cameraPitchDegrees: 24,
      cameraDistance: 42,
      systems: 3
    },
    bounds: {
      coverage: [0.07, 0.74],
      brightPixelRatio: [0.07, 0.86],
      lumaStdDev: [16, 84],
      centroidX: [0.2, 0.78],
      centroidY: [0.12, 0.74]
    }
  },
  {
    name: "landscape-ortho-grid",
    args: {
      out: "outputs/analysis/06-freeze-landscape-ortho-grid.png",
      width: 900,
      height: 506,
      seed: 574,
      time: 2.2,
      quality: 0.72,
      hud: 1,
      grid: 1,
      ortho: 1,
      systems: 3
    },
    bounds: {
      coverage: [0.08, 0.78],
      brightPixelRatio: [0.08, 0.88],
      lumaStdDev: [16, 86],
      centroidX: [0.18, 0.82],
      centroidY: [0.1, 0.82]
    }
  },
  {
    name: "portrait-persp-front",
    args: {
      out: "outputs/analysis/06-freeze-portrait-persp-front.png",
      width: 360,
      height: 640,
      seed: 574,
      time: 2.2,
      quality: 0.72,
      hud: 0,
      grid: 0,
      ortho: 0,
      systems: 3
    },
    bounds: {
      coverage: [0.04, 0.76],
      brightPixelRatio: [0.04, 0.88],
      lumaStdDev: [12, 86],
      centroidX: [0.16, 0.84],
      centroidY: [0.1, 0.84]
    }
  }
];

const systemPresets = [1, 2, 3].map((systems) => ({
  name: `systems-${systems}`,
  args: {
    out: `outputs/analysis/06-freeze-systems-${systems}.png`,
    width: 640,
    height: 360,
    seed: 574,
    time: 2.2,
    quality: 0.72,
    hud: 0,
    grid: 0,
    ortho: 0,
    systems
  },
  bounds: {
    coverage: [0.015, 0.76],
    brightPixelRatio: [0.015, 0.88],
    lumaStdDev: [12, 86],
    centroidX: [0.2, 0.8],
    centroidY: [0.1, 0.76]
  }
}));

const results = presets.map(runPreset);
const systemResults = systemPresets.map(runPreset);
const front = results.find((result) => result.name === "landscape-persp-front");
const side = results.find((result) => result.name === "landscape-persp-side");
if (front && side) {
  const coverageDelta = Math.abs(front.analysis.cloudBounds.coverage - side.analysis.cloudBounds.coverage);
  assert.ok(
    coverageDelta < 0.24,
    `expected side/front coverage to stay in the same visual family, got ${coverageDelta}`
  );
  const sideBounds = side.analysis.cloudBounds;
  const sideHeightRatio = sideBounds.height / Math.max(sideBounds.width, 0.001);
  assert.ok(
    sideBounds.height > 0.4 && sideHeightRatio > 0.72,
    `expected side view to keep vertical volume, got height ${sideBounds.height} and height/width ${sideHeightRatio}`
  );
}

const systemBytes = systemResults.map((result) => result.bytes);
const systemByteSpan = Math.max(...systemBytes) - Math.min(...systemBytes);
assert.ok(
  systemByteSpan > 1500,
  `expected systems=1/2/3 captures to differ visibly, got PNG byte span ${systemByteSpan}`
);
const systemCoverage = systemResults.map((result) => result.analysis.cloudBounds.coverage);
const systemCoverageSpan = Math.max(...systemCoverage) - Math.min(...systemCoverage);
const systemBrightPixelRatios = systemResults.map((result) => result.analysis.brightPixelRatio);
const systemBrightPixelRatioSpan = Math.max(...systemBrightPixelRatios) - Math.min(...systemBrightPixelRatios);
assert.ok(
  systemCoverageSpan > 0.0008 || systemBrightPixelRatioSpan > 0.003,
  `expected systems=1/2/3 cloud coverage or highlight ratio to differ, got coverage span ${systemCoverageSpan} and bright-pixel span ${systemBrightPixelRatioSpan}`
);
for (const result of systemResults) {
  assert.ok(
    result.url.includes(`systems=${result.systems}`),
    `expected ${result.name} capture URL to include systems=${result.systems}, got ${result.url}`
  );
}

mkdirSync(dirname(summaryPath), { recursive: true });
writeFileSync(
  summaryPath,
  `${JSON.stringify({ ok: true, presets: results, systemPresets: systemResults }, null, 2)}\n`
);
console.log(JSON.stringify({ ok: true, summaryPath, presets: results, systemPresets: systemResults }, null, 2));

function runPreset(preset) {
  const args = [join(projectRoot, "scripts", "smoke-06-html.mjs"), "--browserTimeoutMs", "90000"];
  const presetArgs = { controls: 0, sky: "workbench", ...preset.args };
  for (const [key, value] of Object.entries(presetArgs)) {
    args.push(`--${key}`, String(value));
  }

  let result = runSmokeCapture(args);
  if (result.status !== 0) {
    result = runSmokeCapture(args);
  }
  if (result.status !== 0) {
    throw new Error(
      `visual freeze preset ${preset.name} failed with exit code ${result.status}.\n${result.stderr || result.stdout}`
    );
  }

  const parsed = JSON.parse(result.stdout);
  const analysis = parsed.analysis;
  assertBounds(`${preset.name}.coverage`, analysis.cloudBounds.coverage, preset.bounds.coverage);
  assertBounds(`${preset.name}.brightPixelRatio`, analysis.brightPixelRatio, preset.bounds.brightPixelRatio);
  assertBounds(`${preset.name}.lumaStdDev`, analysis.lumaStdDev, preset.bounds.lumaStdDev);
  assertBounds(`${preset.name}.centroidX`, analysis.cloudBounds.centroidX, preset.bounds.centroidX);
  assertBounds(`${preset.name}.centroidY`, analysis.cloudBounds.centroidY, preset.bounds.centroidY);

  return {
    name: preset.name,
    systems: preset.args.systems ?? null,
    url: parsed.url,
    outputPath: parsed.outputPath,
    bytes: parsed.bytes,
    analysis
  };
}

function runSmokeCapture(args) {
  return spawnSync(process.execPath, args, {
    cwd: projectRoot,
    encoding: "utf8",
    timeout: 90000,
    windowsHide: true
  });
}

function assertBounds(label, value, bounds) {
  const [min, max] = bounds;
  assert.ok(
    value >= min && value <= max,
    `${label} expected between ${min} and ${max}, got ${value}`
  );
}
