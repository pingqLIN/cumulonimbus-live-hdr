import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolveBrowser, stopProcessTree } from "./lib/headless-browser-runner.mjs";
import { analyzePng } from "./lib/png-analysis.mjs";
import {
  buildPreviewUrl,
  getOrientationDimensions,
  normalizeOrientation,
  previewTuningKeys
} from "./lib/preview-url.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const requestedPort = readIntegerArg(args, "port", 6173);
const port = await resolveCapturePort(requestedPort, Object.hasOwn(args, "port"));
const orientation = normalizeOrientation(args.orientation);
const defaultDimensions = getOrientationDimensions(orientation);
const width = readIntegerArg(args, "width", defaultDimensions.width);
const height = readIntegerArg(args, "height", defaultDimensions.height);
const captureFrames = readIntegerArg(args, "captureFrames", 0);
const waitMs = readIntegerArg(args, "waitMs", captureFrames > 0 ? 1000 : 12000);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(30000, waitMs + 20000));
const view = args.view;
const look = args.look;
const simPreset = args.simPreset;
const outputMode = args.source === "live" ? "live" : args.source === "ui" ? "ui" : "capture";
const defaultOutputPath =
  view === "field" ? "outputs/cumulonimbus-field-still.png" : "outputs/cumulonimbus-3d-still.png";
const outputPath = resolve(projectRoot, args.out ?? defaultOutputPath);
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-headless-"));
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
  orientation,
  width,
  height,
  fps: args.fps,
  preset: args.preset,
  seed: args.seed,
  captureFrames,
  preserveDrawingBuffer: outputMode === "live" ? 1 : undefined,
  outputMode,
  ...readPreviewTuningArgs(args)
});

mkdirSync(join(projectRoot, "outputs"), { recursive: true });
mkdirSync(dirname(outputPath), { recursive: true });
rmSync(outputPath, { force: true });

const server = startVite(port);
let serverExit = null;
let successPayload = null;
let serverCleanup = null;
server.once("exit", (code, signal) => {
  serverExit = { code, signal };
});
try {
  await waitForServer(url.origin, 20000, () => serverExit);
  const browser = resolveBrowser(args.browser);
  const result = await runBrowserCdpScreenshot(
    browser,
    url.toString(),
    outputPath,
    {
      width,
      height,
      waitMs,
      timeoutMs: browserTimeoutMs,
      profileDir: browserProfileDir,
      expectExactCanvasSize: outputMode !== "ui"
    }
  );

  if (result.status !== 0) {
    throw new Error(
      `Browser screenshot failed with exit code ${result.status}.\n${result.stderr || result.stdout}`
    );
  }

  const png = readPngHeader(outputPath);
  const size = statSync(outputPath).size;
  if (outputMode === "ui") {
    if (png.width <= 0 || png.height <= 0 || png.width > width || png.height > height) {
      throw new Error(
        `UI capture output dimensions ${png.width}x${png.height} were outside requested viewport ${width}x${height}`
      );
    }
  } else if (png.width !== width || png.height !== height) {
    throw new Error(
      `Capture output dimensions ${png.width}x${png.height} did not match requested ${width}x${height}`
    );
  }
  const analysis = analyzePng(outputPath);
  validateCaptureAnalysis(analysis);

  successPayload = {
    ok: true,
    outputPath,
    url: url.toString(),
    browser,
    bytes: size,
    png,
    visualThresholds,
    processCleanup: {
      browser: result.processCleanup
    },
    uiState: result.uiState,
    analysis
  };
} finally {
  serverCleanup = stopServer(server);
  rmSync(browserProfileDir, { recursive: true, force: true });
}

if (successPayload) {
  successPayload.processCleanup.server = serverCleanup;
  process.stdout.write(`${JSON.stringify(successPayload, null, 2)}\n`, () => {
    process.exit(0);
  });
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

function readPreviewTuningArgs(parsed) {
  const tuning = {};
  for (const key of previewTuningKeys) {
    const value = parsed[key];
    if (value !== undefined && value !== "") {
      tuning[key] = value;
    }
  }
  return tuning;
}

async function resolveCapturePort(startPort, strictPort) {
  for (let portCandidate = startPort; portCandidate < startPort + 80; portCandidate += 1) {
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
    stdio: "ignore",
    windowsHide: true
  });
}

function stopServer(child) {
  return stopProcessTree(child);
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

async function runBrowserCdpScreenshot(browser, targetUrl, targetOutputPath, options) {
  const remoteDebuggingPort = await getFreePort();
  const child = spawn(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--no-sandbox",
      "--no-first-run",
      "--noerrdialogs",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--run-all-compositor-stages-before-draw",
      `--user-data-dir=${options.profileDir}`,
      `--remote-debugging-port=${remoteDebuggingPort}`,
      `--window-size=${options.width},${options.height}`,
      "about:blank"
    ],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"], windowsHide: true }
  );

  let client = null;
  const runtimeErrors = [];
  try {
    const targets = await readJsonEndpoint(`http://127.0.0.1:${remoteDebuggingPort}/json/list`, options.timeoutMs);
    const pageTarget = targets.find((target) => target.type === "page");
    if (!pageTarget?.webSocketDebuggerUrl) {
      throw new Error("No capture page target was exposed by the browser.");
    }

    client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
    client.on("Runtime.exceptionThrown", (params) => {
      runtimeErrors.push(params.exceptionDetails?.text || params.exceptionDetails?.exception?.description || "runtime exception");
    });
    client.on("Runtime.consoleAPICalled", (params) => {
      if (params.type === "error") {
        runtimeErrors.push(
          params.args
            ?.map((arg) => arg.value || arg.description || "")
            .filter(Boolean)
            .join(" ") || "console error"
        );
      }
    });
    client.on("Log.entryAdded", (params) => {
      if (params.entry?.level === "error") {
        runtimeErrors.push(params.entry.text || "log error");
      }
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: options.width,
      height: options.height,
      deviceScaleFactor: 1,
      mobile: options.width < options.height
    });
    await client.send("Page.navigate", { url: targetUrl });
    await waitForCanvasRuntime(
      client,
      options.timeoutMs,
      options.width,
      options.height,
      runtimeErrors,
      options.expectExactCanvasSize ?? true
    );
    await delay(options.waitMs);

    const uiState = await readCaptureUiState(client);

    if (runtimeErrors.length > 0) {
      throw new Error(`Browser runtime errors during capture: ${runtimeErrors.join("\n")}`);
    }

    const screenshot = await client.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const canvas = document.querySelector('#cloud-canvas');
        if (!canvas) {
          throw new Error('Missing #cloud-canvas for capture.');
        }
        return canvas.toDataURL('image/png');
      })()`
    });
    const dataUrl = screenshot.result?.value;
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/png;base64,")) {
      throw new Error("Canvas capture did not return a PNG data URL.");
    }
    writeFileSync(targetOutputPath, Buffer.from(dataUrl.slice("data:image/png;base64,".length), "base64"));

    return {
      status: 0,
      stdout: "",
      stderr: "",
      uiState,
      processCleanup: stopProcessTree(child)
    };
  } catch (error) {
    return {
      status: 1,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
      processCleanup: stopProcessTree(child)
    };
  } finally {
    try {
      await client?.close();
    } catch {
      // Ignore CDP close races while tearing down the browser.
    }
  }
}

async function readCaptureUiState(client) {
  const result = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      href: location.href,
      renderStatus: document.documentElement.dataset.renderStatus || '',
      morphology: document.documentElement.dataset.morphology || '',
      hasMorphSelect: Boolean(document.querySelector('#select-morphology')),
      hasMorphLibrary: Boolean(document.querySelector('#cloud-morphology-library')),
      morphButtonCount: document.querySelectorAll('[data-morphology-style]').length,
      textHasMorphologyDatabase: document.body.innerText.includes('Morphology database'),
      textHasMacroEdge: document.body.innerText.includes('Macro edge')
    }))()`
  });
  return result.result?.value ?? null;
}

async function waitForCanvasRuntime(client, timeoutMs, width, height, runtimeErrors, expectExactCanvasSize) {
  const started = Date.now();
  let lastMetrics = null;
  while (Date.now() - started < timeoutMs) {
    if (runtimeErrors.length > 0) {
      throw new Error(`Browser runtime errors before capture readiness: ${runtimeErrors.join("\n")}`);
    }
    try {
      const result = await client.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const canvas = document.querySelector('#cloud-canvas');
          const metrics = {
            readyState: document.readyState,
            href: location.href,
            renderMode: document.documentElement.dataset.renderMode || '',
            orientation: document.documentElement.dataset.orientation || '',
            renderStatus: document.documentElement.dataset.renderStatus || '',
            appModuleStatus: document.documentElement.dataset.appModuleStatus || '',
            hasCanvas: Boolean(canvas),
            canvasWidth: canvas?.width || 0,
            canvasHeight: canvas?.height || 0,
            renderError: canvas?.dataset.renderError || '',
            innerWidth,
            innerHeight,
            scripts: Array.from(document.scripts).map((script) => ({
              src: script.src,
              type: script.type
            })),
            resources: performance.getEntriesByType('resource').slice(-8).map((entry) => ({
              name: entry.name,
              initiatorType: entry.initiatorType,
              duration: Math.round(entry.duration)
            }))
          };
          const canvasSizeReady = ${JSON.stringify(expectExactCanvasSize)}
            ? metrics.canvasWidth === ${JSON.stringify(width)} && metrics.canvasHeight === ${JSON.stringify(height)}
            : metrics.canvasWidth > 0
              && metrics.canvasHeight > 0
              && metrics.canvasWidth <= ${JSON.stringify(width)}
              && metrics.canvasHeight <= ${JSON.stringify(height)};
          metrics.ready = metrics.readyState !== 'loading'
            && metrics.hasCanvas
            && canvasSizeReady
            && metrics.renderStatus === 'ready';
          return metrics;
        })()`
      });
      lastMetrics = result.result?.value ?? null;
    } catch {
      // Keep polling while Vite serves and the module graph evaluates.
    }
    if (
      lastMetrics?.renderStatus === "app-error" ||
      lastMetrics?.renderStatus === "webgl-unavailable" ||
      lastMetrics?.renderStatus === "render-error" ||
      lastMetrics?.renderStatus === "context-lost-timeout" ||
      lastMetrics?.renderStatus === "context-restore-failed"
    ) {
      throw new Error(`Capture app startup failed before readiness: ${JSON.stringify(lastMetrics)}`);
    }
    if (lastMetrics?.ready) {
      return;
    }
    await delay(250);
  }
  throw new Error(
    `Timed out waiting for capture canvas runtime readiness: ${JSON.stringify({
      lastMetrics,
      runtimeErrors
    })}`
  );
}

async function readJsonEndpoint(endpoint, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return await response.json();
    } catch {
      // Keep polling while Chrome starts its debugging endpoint.
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${endpoint}`);
}

function createCdpClient(webSocketUrl) {
  return new Promise((resolveClient, rejectClient) => {
    const socket = new WebSocket(webSocketUrl);
    let nextId = 1;
    const pending = new Map();
    const eventHandlers = new Map();

    const client = {
      send(method, params = {}) {
        const id = nextId++;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveSend, rejectSend) => {
          const timer = setTimeout(() => {
            pending.delete(id);
            rejectSend(new Error(`Timed out waiting for CDP response ${method}`));
          }, 30000);
          pending.set(id, {
            resolve: (value) => {
              clearTimeout(timer);
              resolveSend(value);
            },
            reject: (error) => {
              clearTimeout(timer);
              rejectSend(error);
            }
          });
        });
      },
      on(method, handler) {
        const handlers = eventHandlers.get(method) ?? [];
        handlers.push(handler);
        eventHandlers.set(method, handlers);
      },
      close() {
        try {
          socket.close();
        } catch {
          // Ignore close races during browser teardown.
        }
      }
    };

    socket.addEventListener("open", () => resolveClient(client), { once: true });
    socket.addEventListener("error", () => rejectClient(new Error(`Unable to connect to ${webSocketUrl}`)), {
      once: true
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const entry = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) {
          entry.reject(new Error(`${message.error.message}: ${message.error.data || ""}`.trim()));
        } else {
          entry.resolve(message.result ?? {});
        }
        return;
      }
      if (message.method && eventHandlers.has(message.method)) {
        for (const handler of eventHandlers.get(message.method)) {
          handler(message.params ?? {});
        }
      }
    });
    socket.addEventListener(
      "close",
      () => {
        for (const { reject } of pending.values()) {
          reject(new Error("CDP WebSocket closed"));
        }
        pending.clear();
      },
      { once: true }
    );
  });
}

function getFreePort() {
  return new Promise((resolvePort, rejectPort) => {
    const probe = createServer();
    probe.once("error", rejectPort);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      probe.close(() => resolvePort(address.port));
    });
  });
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
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
