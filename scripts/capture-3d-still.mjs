import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { get } from "node:http";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { analyzePng } from "./lib/png-analysis.mjs";
import { buildPreviewUrl } from "./lib/preview-url.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const requestedPort = readIntegerArg(args, "port", 5183);
const port = await resolveCapturePort(requestedPort, Object.hasOwn(args, "port"));
const width = readIntegerArg(args, "width", 540);
const height = readIntegerArg(args, "height", 960);
const waitMs = readIntegerArg(args, "waitMs", 12000);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(30000, waitMs + 20000));
const view = args.view ?? "3d";
const look = args.look ?? "demo-like";
const simPreset = args.simPreset ?? "mid";
const captureFrames = readIntegerArg(args, "captureFrames", 0);
const outputMode = args.source === "live" ? "live" : "capture";
const defaultOutputPath =
  view === "field" ? "outputs/cumulonimbus-field-still.png" : "outputs/cumulonimbus-3d-still.png";
const outputPath = resolve(projectRoot, args.out ?? defaultOutputPath);
const visualThresholds = {
  minMaxLuma: 42,
  minLumaStdDev: 4,
  minBrightPixelRatio: 0.001
};
const url = buildPreviewUrl({
  origin: `http://127.0.0.1:${port}`,
  view,
  look,
  simPreset,
  width,
  height,
  fps: 30,
  renderer: args.renderer,
  preset: args.preset,
  captureFrames,
  outputMode
});

mkdirSync(join(projectRoot, "outputs"), { recursive: true });
mkdirSync(dirname(outputPath), { recursive: true });

const server = startVite(port);
let serverExit = null;
server.once("exit", (code, signal) => {
  serverExit = { code, signal };
});
try {
  await waitForServer(url.origin, 20000, () => serverExit);
  const browser = resolveBrowser(args.browser);
  const result = await runBrowserScreenshot(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--run-all-compositor-stages-before-draw",
      `--window-size=${width},${height}`,
      `--virtual-time-budget=${waitMs}`,
      `--screenshot=${outputPath}`,
      url.toString()
    ],
    browserTimeoutMs
  );

  if (result.status !== 0) {
    throw new Error(
      `Browser screenshot failed with exit code ${result.status}.\n${result.stderr || result.stdout}`
    );
  }

  const png = readPngHeader(outputPath);
  const size = statSync(outputPath).size;
  if (png.width !== width || png.height !== height) {
    throw new Error(
      `Capture output dimensions ${png.width}x${png.height} did not match requested ${width}x${height}`
    );
  }
  const analysis = analyzePng(outputPath);
  validateCaptureAnalysis(analysis);

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath,
        url: url.toString(),
        browser,
        bytes: size,
        png,
        visualThresholds,
        analysis
      },
      null,
      2
    )
  );
} finally {
  stopServer(server);
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

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}

async function resolveCapturePort(startPort, strictPort) {
  for (let portCandidate = startPort; portCandidate < startPort + 20; portCandidate += 1) {
    if (await isPortAvailable(portCandidate)) {
      return portCandidate;
    }
    if (strictPort) {
      throw new Error(`Port ${portCandidate} is already in use. Choose another --port.`);
    }
  }
  throw new Error(`Could not find an available capture port near ${startPort}.`);
}

function isPortAvailable(portCandidate) {
  return new Promise((resolveAvailable) => {
    const probe = createServer();
    probe.once("error", () => {
      resolveAvailable(false);
    });
    probe.listen(portCandidate, "127.0.0.1", () => {
      probe.close(() => resolveAvailable(true));
    });
  });
}

function startVite(targetPort) {
  const viteBin = join(projectRoot, "node_modules", "vite", "bin", "vite.js");
  const args = ["--host", "127.0.0.1", "--port", String(targetPort), "--strictPort"];
  return spawn(process.execPath, [viteBin, ...args], {
    cwd: projectRoot,
    stdio: "ignore"
  });
}

function stopServer(child) {
  if (!child.pid) {
    return;
  }
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  child.kill();
}

function runBrowserScreenshot(browser, browserArgs, timeoutMs) {
  return new Promise((resolveRun) => {
    const child = spawn(browser, browserArgs, {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      stopServer(child);
      resolveRun({
        status: 124,
        stdout,
        stderr: `${stderr}\nBrowser screenshot timed out after ${timeoutMs}ms`.trim()
      });
    }, timeoutMs);

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.once("error", (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolveRun({ status: 1, stdout, stderr: `${stderr}\n${error.message}`.trim() });
    });
    child.once("exit", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolveRun({ status: code ?? 1, stdout, stderr });
    });
  });
}

function waitForServer(origin, timeoutMs, readServerExit) {
  const startedAt = performance.now();
  return new Promise((resolveServer, rejectServer) => {
    const tick = () => {
      const exit = readServerExit();
      if (exit) {
        rejectServer(
          new Error(`Vite exited before capture server became ready: ${JSON.stringify(exit)}`)
        );
        return;
      }

      const request = get(origin, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolveServer();
          return;
        }
        retry();
      });
      request.setTimeout(1000, () => {
        request.destroy();
        retry();
      });
      request.on("error", retry);
    };

    const retry = () => {
      if (performance.now() - startedAt > timeoutMs) {
        rejectServer(new Error(`Timed out waiting for Vite at ${origin}`));
        return;
      }
      setTimeout(tick, 250);
    };

    tick();
  });
}

function resolveBrowser(explicitBrowser) {
  const candidates = [
    explicitBrowser,
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "google-chrome",
    "chromium",
    "msedge"
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes("\\") && !existsSync(candidate)) {
      continue;
    }
    const probe = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 5000 });
    if (probe.status === 0) {
      return candidate;
    }
  }

  throw new Error("No compatible Chrome or Edge executable found. Set CHROME_PATH or EDGE_PATH.");
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

function validateCaptureAnalysis(analysis) {
  const failures = [];
  if (analysis.maxLuma <= visualThresholds.minMaxLuma) {
    failures.push(`max luma ${analysis.maxLuma} <= ${visualThresholds.minMaxLuma}`);
  }
  if (analysis.lumaStdDev <= visualThresholds.minLumaStdDev) {
    failures.push(`luma stddev ${analysis.lumaStdDev} <= ${visualThresholds.minLumaStdDev}`);
  }
  if (analysis.brightPixelRatio <= visualThresholds.minBrightPixelRatio) {
    failures.push(
      `bright pixel ratio ${analysis.brightPixelRatio} <= ${visualThresholds.minBrightPixelRatio}`
    );
  }
  if (failures.length > 0) {
    throw new Error(`Capture output failed visual smoke thresholds: ${failures.join("; ")}`);
  }
}
