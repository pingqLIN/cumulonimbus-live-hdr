import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { get } from "node:http";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveBrowser, stopProcessTree } from "./lib/headless-browser-runner.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 390);
const height = readIntegerArg(args, "height", 844);
const waitMs = readIntegerArg(args, "waitMs", 2200);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(60000, waitMs + 25000));
const appPort = readIntegerArg(args, "appPort", 0) || await getFreePort();
const remoteDebuggingPort = readIntegerArg(args, "port", 0) || await getFreePort();
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-mobile-console-"));
const origin = `http://127.0.0.1:${appPort}`;
const url = new URL("/", origin);

url.searchParams.set("live", "1");
url.searchParams.set("orientation", "portrait");
url.searchParams.set("simWidth", String(width));
url.searchParams.set("simHeight", String(height));
url.searchParams.set("captureFrames", args.captureFrames ?? "1");
url.searchParams.set("seed", args.seed ?? "574");
url.searchParams.set("time", args.time ?? "2.2");

if (args.preset !== undefined && args.preset !== "") {
  url.searchParams.set("preset", args.preset);
}
if (args.maxPixels !== undefined && args.maxPixels !== "") {
  url.searchParams.set("maxPixels", args.maxPixels);
}

for (const key of [
  "systems",
  "windShear",
  "sunElevation",
  "sunViewerAngle",
  "sunAngle",
  "fbmOctaves",
  "octaves",
  "cloudCurl",
  "curl",
  "horizon",
  "horizonStrength",
  "stepSize",
  "maxSteps",
  "sky",
  "light"
]) {
  if (args[key] !== undefined && args[key] !== "") {
    url.searchParams.set(key, String(args[key]));
  }
}

const server = startVite(appPort);
let browserProcess = null;
let client = null;
let cleanupWarning = null;
let serverExit = null;
server.once("exit", (code, signal) => {
  serverExit = { code, signal };
});

try {
  await waitForServer(origin, 20000, () => serverExit);
  const browser = resolveBrowser(args.browser);
  browserProcess = spawn(
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
      `--user-data-dir=${browserProfileDir}`,
      `--remote-debugging-port=${remoteDebuggingPort}`,
      `--window-size=${width},${height}`,
      "about:blank"
    ],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"], windowsHide: true }
  );

  const version = await readJsonEndpoint(`http://127.0.0.1:${remoteDebuggingPort}/json/version`, browserTimeoutMs);
  const targets = await readJsonEndpoint(`http://127.0.0.1:${remoteDebuggingPort}/json/list`, browserTimeoutMs);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("No mobile canvas page target was exposed by the browser.");
  }

  client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
  const runtimeErrors = [];
  client.on("Runtime.exceptionThrown", (params) => {
    runtimeErrors.push(params.exceptionDetails?.text || params.exceptionDetails?.exception?.description || "runtime exception");
  });
  client.on("Log.entryAdded", (params) => {
    if (params.entry?.level === "error") {
      runtimeErrors.push(params.entry.text || "log error");
    }
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

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true
  });
  await client.send("Page.navigate", { url: url.toString() });
  await waitForRuntimeCondition(client, browserTimeoutMs, width, height);
  await delay(waitMs);

  const metricsResult = await client.send("Runtime.evaluate", {
    expression: `(${collectMobileCanvasMetrics.toString()})()`,
    returnByValue: true
  });
  const metrics = metricsResult.result?.value;

  assert.notEqual(metrics?.readyState, "loading");
  assert.equal(metrics.title, "Cumulonimbus Live HDR");
  assert.equal(metrics.renderMode, "canvas");
  assert.equal(metrics.orientation, "portrait");
  assert.equal(metrics.deviceProfile, "mobile");
  assert.equal(metrics.viewport.width, width);
  assert.equal(metrics.viewport.height, height);
  assert.equal(metrics.webglAvailable, true);
  assert.equal(metrics.canvasPixels.width, width);
  assert.equal(metrics.canvasPixels.height, height);
  assert.ok(metrics.canvasRect.width >= width - 2, `expected full-width canvas, got ${metrics.canvasRect.width}`);
  assert.ok(metrics.canvasRect.height >= height - 2, `expected full-height canvas, got ${metrics.canvasRect.height}`);
  assert.ok(metrics.bodyOverflow.x <= 1, `expected no document horizontal overflow, got ${metrics.bodyOverflow.x}`);
  assert.ok(metrics.bodyOverflow.y <= 1, `expected no document vertical overflow, got ${metrics.bodyOverflow.y}`);
  assert.equal(metrics.runtime.displayProfile.mobileWideView, true);
  assert.equal(metrics.runtime.displayProfile.narrowViewport, true);
  assert.equal(metrics.runtime.options.presetName, args.preset ?? "mobile-horizon");
  assert.equal(metrics.runtime.options.presetSource, args.preset === undefined ? "browser-profile" : "query");
  assert.equal(metrics.runtime.options.systems, 5);
  assert.equal(metrics.runtime.options.maxSteps, 108);
  assert.equal(metrics.runtime.options.cloudCurl, 1);
  assert.deepEqual(runtimeErrors, []);

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: url.toString(),
        browserProtocol: version.Protocol_Version,
        runtimeErrors,
        metrics
      },
      null,
      2
    )
  );
} finally {
  try {
    await client?.close();
  } catch {
    // Ignore close races while tearing down the temporary browser.
  }
  const browserCleanup = browserProcess ? stopProcessTree(browserProcess) : null;
  const serverCleanup = stopProcessTree(server);
  await delay(600);
  try {
    rmSync(browserProfileDir, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
  } catch (error) {
    cleanupWarning = error instanceof Error ? error.message : String(error);
  }
  if (cleanupWarning) {
    console.warn(`Temporary browser profile cleanup warning: ${cleanupWarning}`);
  }
  if (browserCleanup && !browserCleanup.stopped) {
    console.warn(`Temporary browser process cleanup warning: ${JSON.stringify(browserCleanup)}`);
  }
  if (!serverCleanup.stopped) {
    console.warn(`Temporary Vite process cleanup warning: ${JSON.stringify(serverCleanup)}`);
  }
}

function collectMobileCanvasMetrics() {
  const canvas = document.querySelector("#cloud-canvas");
  const rect = canvas.getBoundingClientRect();
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  const rectData = (box) => ({
    left: Math.round(box.left),
    top: Math.round(box.top),
    right: Math.round(box.right),
    bottom: Math.round(box.bottom),
    width: Math.round(box.width),
    height: Math.round(box.height)
  });
  return {
    readyState: document.readyState,
    title: document.title,
    renderMode: document.documentElement.dataset.renderMode || "",
    orientation: document.documentElement.dataset.orientation || "",
    deviceProfile: document.documentElement.dataset.deviceProfile || "",
    runtime: window.__cumulonimbusRuntime || null,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    canvasRect: rectData(rect),
    canvasPixels: { width: canvas.width, height: canvas.height },
    webglAvailable: Boolean(gl),
    bodyOverflow: {
      x: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      y: Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    }
  };
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) continue;
    const [key, inlineValue] = arg.slice(2).split("=", 2);
    const value = inlineValue ?? rawArgs[index + 1];
    if (inlineValue === undefined) index += 1;
    parsed[key] = value;
  }
  return parsed;
}

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.round(value);
}

function startVite(targetPort) {
  const viteBin = join(projectRoot, "node_modules", "vite", "bin", "vite.js");
  return spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(targetPort), "--strictPort"], {
    cwd: projectRoot,
    stdio: "ignore",
    windowsHide: true
  });
}

function waitForServer(serverOrigin, timeoutMs, readServerExit) {
  const startedAt = performance.now();
  return new Promise((resolveServer, rejectServer) => {
    const tick = () => {
      const exit = readServerExit();
      if (exit) {
        rejectServer(new Error(`Vite exited before mobile server became ready: ${JSON.stringify(exit)}`));
        return;
      }

      const request = get(serverOrigin, (response) => {
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
        rejectServer(new Error(`Timed out waiting for Vite at ${serverOrigin}`));
        return;
      }
      setTimeout(tick, 250);
    };

    tick();
  });
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

async function waitForRuntimeCondition(client, timeoutMs, width, height) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const result = await client.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const canvas = document.querySelector('#cloud-canvas');
          return document.readyState !== 'loading'
            && document.documentElement.dataset.renderMode === 'canvas'
            && Boolean(canvas)
            && canvas.width === ${JSON.stringify(width)}
            && canvas.height === ${JSON.stringify(height)};
        })()`
      });
      if (result.result?.value) {
        return;
      }
    } catch {
      // Keep polling while Vite serves and the module graph evaluates.
    }
    await delay(250);
  }
  throw new Error("Timed out waiting for mobile canvas runtime readiness.");
}

function createCdpClient(webSocketUrl) {
  return new Promise((resolveClient, rejectClient) => {
    const socket = new WebSocket(webSocketUrl);
    let nextId = 1;
    const pending = new Map();
    const eventWaiters = new Map();
    const eventHandlers = new Map();

    const client = {
      send(method, params = {}) {
        const id = nextId++;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveSend, rejectSend) => {
          pending.set(id, { resolve: resolveSend, reject: rejectSend });
        });
      },
      waitForEvent(method, timeoutMs) {
        return new Promise((resolveEvent, rejectEvent) => {
          const timer = setTimeout(() => {
            rejectEvent(new Error(`Timed out waiting for CDP event ${method}`));
          }, timeoutMs);
          const waiters = eventWaiters.get(method) ?? [];
          waiters.push((params) => {
            clearTimeout(timer);
            resolveEvent(params);
          });
          eventWaiters.set(method, waiters);
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
      if (message.method && eventWaiters.has(message.method)) {
        const waiters = eventWaiters.get(message.method);
        eventWaiters.delete(message.method);
        for (const waiter of waiters) {
          waiter(message.params ?? {});
        }
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

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
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
