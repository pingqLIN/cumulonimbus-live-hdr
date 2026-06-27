import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const seeds = readSeedList(args.seeds ?? args.seedList, [101, 2027, 777777, 987654321, 574, 12345]);
const width = readIntegerArg(args, "width", 900);
const height = readIntegerArg(args, "height", 506);
const basePort = readOptionalIntegerArg(args, "port");
const preset = args.preset ?? "mobile-cumulus";
const outputDir = resolve(projectRoot, args.outDir ?? join("outputs", "analysis", "seed-sweep"));
const reportPath = resolve(projectRoot, args.report ?? join("outputs", "analysis", "seed-sweep-report.json"));
const results = [];

mkdirSync(outputDir, { recursive: true });
mkdirSync(dirname(reportPath), { recursive: true });

for (let index = 0; index < seeds.length; index += 1) {
  const seed = seeds[index];
  const outputPath = join(outputDir, `seed-${seed}.png`);
  const result = runSmoke(seed, outputPath, basePort === undefined ? undefined : basePort + index);
  results.push(result);
  if (!result.ok) {
    writeReport(false);
    console.error(JSON.stringify({ ok: false, failedSeed: seed, results }, null, 2));
    process.exit(result.status || 1);
  }
  assertSeedShape(result);
}

writeReport(true);
console.log(JSON.stringify({ ok: true, seeds, reportPath, results }, null, 2));

function runSmoke(seed, outputPath, port) {
  const smokeArgs = [
    join(projectRoot, "scripts", "smoke-06-html.mjs"),
    "--seed",
    String(seed),
    "--width",
    String(width),
    "--height",
    String(height),
    "--preset",
    preset,
    "--captureFrames",
    "1",
    "--debugShaders",
    "true",
    "--out",
    outputPath
  ];
  if (port !== undefined) {
    smokeArgs.push("--port", String(port));
  }

  const smoke = spawnSync(
    process.execPath,
    smokeArgs,
    {
      cwd: projectRoot,
      encoding: "utf8",
      timeout: 180000,
      windowsHide: true
    }
  );

  if (smoke.status !== 0) {
    return {
      ok: false,
      seed,
      status: smoke.status ?? 1,
      stdout: tail(smoke.stdout),
      stderr: tail(smoke.stderr)
    };
  }

  const payload = JSON.parse(smoke.stdout);
  return {
    ok: true,
    seed,
    outputPath: payload.outputPath,
    url: payload.url,
    bytes: payload.bytes,
    processCleanup: payload.processCleanup,
    analysis: payload.analysis
  };
}

function assertSeedShape(result) {
  const analysis = result.analysis;
  const bounds = analysis.cloudBounds;
  assert.ok(analysis.maxLuma > 42, `seed ${result.seed} lost visible highlights`);
  assert.ok(analysis.lumaStdDev > 4, `seed ${result.seed} became visually flat`);
  assert.ok(bounds.coverage > 0.08, `seed ${result.seed} lost cloud coverage: ${bounds.coverage}`);
  assert.ok(bounds.coverage < 0.86, `seed ${result.seed} overfilled frame: ${bounds.coverage}`);
  assert.ok(bounds.height > 0.22, `seed ${result.seed} lost vertical body: ${bounds.height}`);
  assert.ok(bounds.width > 0.24, `seed ${result.seed} lost horizontal body: ${bounds.width}`);
  assert.ok(
    analysis.morphology.anvilSpreadRatio > 0.55 && analysis.morphology.anvilSpreadRatio < 5.2,
    `seed ${result.seed} anvil/body ratio collapsed: ${analysis.morphology.anvilSpreadRatio}`
  );
}

function writeReport(ok) {
  writeFileSync(
    reportPath,
    `${JSON.stringify(
      {
        ok,
        seeds,
        width,
        height,
        preset,
        results
      },
      null,
      2
    )}\n`
  );
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=", 2);
    const value = inlineValue ?? rawArgs[index + 1];
    if (inlineValue === undefined) {
      index += 1;
    }
    parsed[key] = value;
  }
  return parsed;
}

function readSeedList(value, fallback) {
  if (!value) {
    return fallback;
  }
  const seeds = String(value)
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0)
    .map((item) => Math.floor(item));
  return seeds.length > 0 ? seeds : fallback;
}

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

function readOptionalIntegerArg(parsed, name) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return Math.round(value);
}

function tail(value, maxLength = 4000) {
  if (!value || value.length <= maxLength) {
    return value?.trim() ?? "";
  }
  return value.slice(value.length - maxLength).trim();
}
