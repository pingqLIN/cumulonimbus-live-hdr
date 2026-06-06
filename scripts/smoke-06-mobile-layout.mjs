import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveBrowser, stopProcessTree } from "./lib/headless-browser-runner.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 390);
const height = readIntegerArg(args, "height", 844);
const waitMs = readIntegerArg(args, "waitMs", 1800);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(45000, waitMs + 15000));
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-mainline-mobile-layout-"));
const remoteDebuggingPort = readIntegerArg(args, "remoteDebuggingPort", 0) || await getFreePort();
const url = pathToFileURL(join(projectRoot, "cumulonimbus-live-hdr-mainline.html"));

url.searchParams.set("background", args.background ?? "1");
url.searchParams.set("sky", args.sky ?? "transparent");
url.searchParams.set("controls", args.controls ?? "1");
url.searchParams.set("hud", args.hud ?? "1");
url.searchParams.set("grid", args.grid ?? "0");
url.searchParams.set("ortho", args.ortho ?? "1");
url.searchParams.set("autoQuality", args.autoQuality ?? "1");
url.searchParams.set("quality", args.quality ?? "0.72");
url.searchParams.set("timeSpeed", args.timeSpeed ?? "0");
url.searchParams.set("viewport", args.viewport ?? "background");
url.searchParams.set("ui", args.ui ?? "tracing-paper");

for (const key of ["seed", "time", "systems", "lang", "preset", "capturePreset"]) {
  if (args[key] !== undefined && args[key] !== "") {
    url.searchParams.set(key, args[key]);
  }
}

mkdirSync(join(projectRoot, "outputs", "analysis"), { recursive: true });

const browser = resolveBrowser(args.browser);
const child = spawn(
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
    `--remote-debugging-port=${remoteDebuggingPort}`,
    `--user-data-dir=${browserProfileDir}`,
    `--window-size=${width},${height}`,
    "about:blank"
  ],
  { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"], windowsHide: true }
);

let stdout = "";
let stderr = "";
child.stdout?.on("data", (chunk) => {
  stdout += chunk.toString();
});
child.stderr?.on("data", (chunk) => {
  stderr += chunk.toString();
});

try {
  const targets = await waitForJson(`http://127.0.0.1:${remoteDebuggingPort}/json/list`, browserTimeoutMs);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("No mobile layout page target was exposed by the browser.");
  }
  const client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true
  });
  const loadEvent = client.waitForEvent("Page.loadEventFired", browserTimeoutMs);
  await client.send("Page.navigate", { url: url.toString() });
  await loadEvent;
  await delay(waitMs);
  const metricsResult = await client.send("Runtime.evaluate", {
    expression: `(${collectMobileLayoutMetrics.toString()})()`,
    returnByValue: true
  });
  await client.close();

  const metrics = metricsResult.result?.value;
  assert.equal(metrics?.readyState, "complete");
  assert.equal(metrics.bodyViewportMode, "background");
  assert.equal(metrics.bodyUiMode, "tracing-paper");
  assert.equal(metrics.mobileWideView, true);
  assert.equal(metrics.renderClassIncludesFullscreen, true);
  assert.equal(metrics.uiPosition, "fixed");
  assert.equal(metrics.uiOverflowX, "auto");
  assert.equal(metrics.uiOverflowY, "hidden");
  assert.ok(metrics.uiRect.height >= 190, `expected usable mobile console height, got ${metrics.uiRect.height}`);
  assert.ok(metrics.uiRect.height <= height * 0.42, `expected mobile console not to dominate viewport, got ${metrics.uiRect.height}`);
  assert.ok(metrics.uiRect.left >= 0 && metrics.uiRect.right <= width, `expected console inside viewport, got ${JSON.stringify(metrics.uiRect)}`);
  assert.ok(metrics.uiRect.bottom <= height, `expected console bottom inside viewport, got ${metrics.uiRect.bottom}`);
  assert.ok(metrics.uiRect.top >= height * 0.5, `expected console docked near bottom, got top ${metrics.uiRect.top}`);
  assert.ok(
    metrics.uiScrollWidth > metrics.uiClientWidth * 1.5,
    `expected horizontal card strip, got scrollWidth ${metrics.uiScrollWidth} and clientWidth ${metrics.uiClientWidth}`
  );
  assert.ok(metrics.visibleControlGroups >= 4, `expected multiple visible control groups, got ${metrics.visibleControlGroups}`);
  assert.ok(metrics.firstGroupColumnCount >= 2, `expected two-column mobile group layout, got ${metrics.firstGroupGridTemplateColumns}`);
  assert.ok(metrics.containerRect.width >= width - 2, `expected full-width background container, got ${metrics.containerRect.width}`);
  assert.ok(metrics.containerRect.height >= height - 2, `expected full-height background container, got ${metrics.containerRect.height}`);
  assert.ok(metrics.canvasRect.width >= width - 2, `expected full-width canvas, got ${metrics.canvasRect.width}`);
  assert.ok(metrics.canvasRect.height >= height - 2, `expected full-height canvas, got ${metrics.canvasRect.height}`);
  assert.match(metrics.targetLabel, /fullscreen|全螢幕/i);

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: url.toString(),
        viewport: { width, height },
        metrics
      },
      null,
      2
    )
  );
} finally {
  stopProcessTree(child);
  try {
    rmSync(browserProfileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Best-effort cleanup for transient browser profile files.
  }
}

function collectMobileLayoutMetrics() {
  const renderContainer = document.getElementById("render-container");
  const canvas = renderContainer?.querySelector("canvas");
  const uiBar = document.getElementById("ui-bar");
  const firstGroup = uiBar?.querySelector(".control-group");
  const groupRects = [...document.querySelectorAll(".control-group")].map((group) => group.getBoundingClientRect());
  const uiStyle = getComputedStyle(uiBar);
  const firstGroupStyle = firstGroup ? getComputedStyle(firstGroup) : null;
  const rectData = (rect) => ({
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    right: Math.round(rect.right),
    bottom: Math.round(rect.bottom),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  });
  return {
    readyState: document.readyState,
    bodyViewportMode: document.body.dataset.viewportMode || "",
    bodyUiMode: document.body.dataset.ui || "",
    mobileWideView: matchMedia("(max-width: 760px), (pointer: coarse)").matches,
    renderClassName: renderContainer?.className || "",
    renderClassIncludesFullscreen: renderContainer?.classList.contains("viewport-fullscreen") ?? false,
    targetLabel: document.getElementById("target-label")?.innerText || "",
    containerRect: rectData(renderContainer.getBoundingClientRect()),
    canvasRect: rectData(canvas.getBoundingClientRect()),
    uiRect: rectData(uiBar.getBoundingClientRect()),
    uiPosition: uiStyle.position,
    uiOverflowX: uiStyle.overflowX,
    uiOverflowY: uiStyle.overflowY,
    uiClientWidth: uiBar.clientWidth,
    uiScrollWidth: uiBar.scrollWidth,
    visibleControlGroups: groupRects.filter((rect) => rect.width > 0 && rect.height > 0).length,
    firstGroupGridTemplateColumns: firstGroupStyle?.gridTemplateColumns || "",
    firstGroupColumnCount: (firstGroupStyle?.gridTemplateColumns || "").split(" ").filter(Boolean).length
  };
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
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }
  return Math.round(value);
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function getFreePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = globalThis.__nonexistentServer;
    import("node:net")
      .then(({ createServer }) => {
        const probe = createServer();
        probe.once("error", rejectPort);
        probe.listen(0, "127.0.0.1", () => {
          const address = probe.address();
          probe.close(() => resolvePort(address.port));
        });
      })
      .catch(rejectPort);
    void server;
  });
}

async function waitForJson(urlString, timeoutMs) {
  const startedAt = Date.now();
  let lastError = null;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(urlString);
      if (response.ok) {
        return await response.json();
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${urlString}: ${lastError?.message || "unknown error"}`);
}

function createCdpClient(webSocketUrl) {
  return new Promise((resolveClient, rejectClient) => {
    const socket = new WebSocket(webSocketUrl);
    let nextId = 1;
    const pending = new Map();
    const eventWaiters = new Map();

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
      close() {
        socket.close();
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
