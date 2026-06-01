import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveBrowser, runBrowserScreenshot } from "./lib/headless-browser-runner.mjs";
import { analyzePng } from "./lib/png-analysis.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 900);
const height = readIntegerArg(args, "height", 506);
const waitMs = readIntegerArg(args, "waitMs", 7000);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(30000, waitMs + 20000));
const outputPath = resolve(
  projectRoot,
  args.out ?? join("outputs", "analysis", "06-html-smoke.png")
);
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-06-headless-"));
const url = pathToFileURL(join(projectRoot, "06.html"));
url.searchParams.set("seed", args.seed ?? "574");
url.searchParams.set("time", args.time ?? "2.2");
url.searchParams.set("timeSpeed", "0");
url.searchParams.set("quality", args.quality ?? "0.72");
url.searchParams.set("hud", args.hud ?? "1");
url.searchParams.set("grid", args.grid ?? "1");
url.searchParams.set("ortho", args.ortho ?? "1");

for (const key of ["cameraYawDegrees", "cameraPitchDegrees", "cameraDistance"]) {
  if (args[key] !== undefined && args[key] !== "") {
    url.searchParams.set(key, args[key]);
  }
}

for (const key of ["systems", "controls", "lang"]) {
  if (args[key] !== undefined && args[key] !== "") {
    url.searchParams.set(key, args[key]);
  }
}

mkdirSync(dirname(outputPath), { recursive: true });

let result = null;
let cleanupWarning = null;
try {
  const browser = resolveBrowser(args.browser);
  result = await runBrowserScreenshot(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-first-run",
      "--noerrdialogs",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--allow-file-access-from-files",
      "--run-all-compositor-stages-before-draw",
      `--user-data-dir=${browserProfileDir}`,
      `--window-size=${width},${height}`,
      `--timeout=${waitMs}`,
      `--screenshot=${outputPath}`,
      url.toString()
    ],
    { cwd: projectRoot, timeoutMs: browserTimeoutMs }
  );

  if (result.status !== 0) {
    throw new Error(
      `06.html smoke screenshot failed with exit code ${result.status}.\n${result.stderr || result.stdout}`
    );
  }
} finally {
  try {
    rmSync(browserProfileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (error) {
    cleanupWarning = error instanceof Error ? error.message : String(error);
  }
}

const png = readPngHeader(outputPath);
const analysis = analyzePng(outputPath, { brightThreshold: 80 });
assert.equal(png.width, width);
assert.equal(png.height, height);
assert.equal(analysis.width, width);
assert.equal(analysis.height, height);
assert.ok(analysis.maxLuma > 42, `expected visible 06.html highlights, got ${analysis.maxLuma}`);
assert.ok(analysis.lumaStdDev > 4, `expected non-flat 06.html output, got ${analysis.lumaStdDev}`);
assert.ok(
  analysis.cloudBounds.coverage > 0.01,
  `expected visible 06.html cloud coverage, got ${analysis.cloudBounds.coverage}`
);

console.log(
  JSON.stringify(
    {
      ok: true,
      outputPath,
      url: url.toString(),
      bytes: statSync(outputPath).size,
      processCleanup: { browser: result?.processCleanup ?? null },
      cleanupWarning,
      analysis
    },
    null,
    2
  )
);

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

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

function readPngHeader(path) {
  const buffer = readFileSync(path);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`Capture output is not a PNG: ${path}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}
