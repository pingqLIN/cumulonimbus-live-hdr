import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { resolveBrowser, stopProcessTree } from "./lib/headless-browser-runner.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 390);
const height = readIntegerArg(args, "height", 844);
const waitMs = readIntegerArg(args, "waitMs", 2200);
const browserTimeoutMs = readIntegerArg(args, "browserTimeoutMs", Math.max(60000, waitMs + 25000));
const remoteDebuggingPort = readIntegerArg(args, "port", 9300 + Math.floor(Math.random() * 400));
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-mobile-console-"));
const url = pathToFileURL(join(projectRoot, "cumulonimbus-live-hdr-mainline.html"));
url.searchParams.set("seed", args.seed ?? "574");
url.searchParams.set("time", args.time ?? "2.2");
url.searchParams.set("timeSpeed", args.timeSpeed ?? "0");
url.searchParams.set("quality", args.quality ?? "0.72");
url.searchParams.set("grid", args.grid ?? "0");
url.searchParams.set("ortho", args.ortho ?? "0");

let browserProcess = null;
let webSocket = null;
let cleanupWarning = null;

try {
  const browser = resolveBrowser(args.browser);
  browserProcess = spawn(
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
      `--remote-debugging-port=${remoteDebuggingPort}`,
      `--window-size=${width},${height}`,
      url.toString()
    ],
    { cwd: projectRoot, stdio: ["ignore", "pipe", "pipe"], windowsHide: true }
  );

  const version = await readJsonEndpoint(`http://127.0.0.1:${remoteDebuggingPort}/json/version`, browserTimeoutMs);
  const targets = await readJsonEndpoint(`http://127.0.0.1:${remoteDebuggingPort}/json/list`, browserTimeoutMs);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("No mobile console page target was exposed by the browser.");
  }

  webSocket = await openWebSocket(pageTarget.webSocketDebuggerUrl);
  const send = createCdpSender(webSocket);
  await send("Runtime.enable");
  await waitForRuntimeCondition(send, waitMs, browserTimeoutMs);
  const geometry = await evaluateGeometry(send);

  assert.ok(
    geometry.viewport.width <= 760,
    `expected mobile media-query width, got ${geometry.viewport.width}`
  );
  assert.ok(geometry.ui.fitsViewport, `mobile console exceeded viewport: ${JSON.stringify(geometry.ui.rect)}`);
  assert.equal(geometry.bodyOverflow.x, 0, `expected no document horizontal overflow, got ${geometry.bodyOverflow.x}`);
  assert.equal(geometry.bodyOverflow.y, 0, `expected no document vertical overflow, got ${geometry.bodyOverflow.y}`);
  assert.ok(geometry.scroll.x, "expected mobile console modules to be horizontally scrollable");
  assert.equal(geometry.scroll.y, false, "expected the console shell itself not to vertically scroll");
  assert.ok(geometry.minControlHeight >= 44, `expected >=44px touch targets, got ${geometry.minControlHeight}`);
  assert.ok(
    geometry.consoleLabel.includes("MOBILE CONTROL"),
    `expected tracing-paper mobile label, got ${geometry.consoleLabel}`
  );
  assert.ok(
    geometry.mobileWideView.resetCameraDistance >= 68,
    `expected mobile camera distance >=68, got ${geometry.mobileWideView.resetCameraDistance}`
  );
  assert.ok(
    geometry.mobileWideView.orthoFrustumSize >= 28,
    `expected widened mobile ortho frame, got ${geometry.mobileWideView.orthoFrustumSize}`
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: url.toString(),
        browserProtocol: version.Protocol_Version,
        processCleanup: null,
        cleanupWarning,
        geometry
      },
      null,
      2
    )
  );
} finally {
  try {
    webSocket?.close();
  } catch {
    // Ignore close races while tearing down the temporary browser.
  }
  const processCleanup = browserProcess ? stopProcessTree(browserProcess) : null;
  await delay(600);
  try {
    rmSync(browserProfileDir, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
  } catch (error) {
    cleanupWarning = error instanceof Error ? error.message : String(error);
  }
  if (cleanupWarning) {
    console.warn(`Temporary browser profile cleanup warning: ${cleanupWarning}`);
  }
  if (processCleanup && !processCleanup.stopped) {
    console.warn(`Temporary browser process cleanup warning: ${JSON.stringify(processCleanup)}`);
  }
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

async function openWebSocket(url) {
  const socket = new WebSocket(url);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });
  return socket;
}

function createCdpSender(socket) {
  let id = 0;
  return (method, params = {}) =>
    new Promise((resolveSend, rejectSend) => {
      const messageId = ++id;
      const onMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id !== messageId) return;
        socket.removeEventListener("message", onMessage);
        if (message.error) {
          rejectSend(new Error(JSON.stringify(message.error)));
        } else {
          resolveSend(message.result);
        }
      };
      socket.addEventListener("message", onMessage);
      socket.send(JSON.stringify({ id: messageId, method, params }));
    });
}

async function waitForRuntimeCondition(send, waitMs, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const canvas = document.querySelector('#render-container canvas');
        return document.readyState !== 'loading'
          && typeof resetCameraDistance === 'function'
          && typeof defaultOrthoFrustumSize === 'function'
          && canvas
          && canvas.width > 0
          && canvas.height > 0;
      })()`
    });
    if (result.result.value) {
      await delay(waitMs);
      return;
    }
    await delay(250);
  }
  throw new Error("Timed out waiting for mobile console runtime readiness.");
}

async function evaluateGeometry(send) {
  const result = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const rect = (element) => {
        const r = element.getBoundingClientRect();
        return {
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          width: r.width,
          height: r.height
        };
      };
      const ui = document.querySelector('#ui-bar');
      const render = document.querySelector('#render-container');
      const controls = [...document.querySelectorAll('#ui-bar button, #ui-bar input')];
      const uiRect = rect(ui);
      return {
        viewport: { width: innerWidth, height: innerHeight },
        ui: {
          rect: uiRect,
          fitsViewport: uiRect.left >= 0 && uiRect.right <= innerWidth && uiRect.bottom <= innerHeight && uiRect.top >= 0
        },
        render: rect(render),
        scroll: {
          x: ui.scrollWidth > ui.clientWidth,
          y: ui.scrollHeight > ui.clientHeight,
          scrollWidth: ui.scrollWidth,
          clientWidth: ui.clientWidth,
          scrollHeight: ui.scrollHeight,
          clientHeight: ui.clientHeight
        },
        minControlHeight: Math.min(...controls.map((element) => element.getBoundingClientRect().height)),
        bodyOverflow: {
          x: document.documentElement.scrollWidth - innerWidth,
          y: document.documentElement.scrollHeight - innerHeight
        },
        consoleLabel: getComputedStyle(ui, '::before').content,
        mobileWideView: {
          resetCameraDistance: resetCameraDistance(),
          orthoFrustumSize: defaultOrthoFrustumSize()
        }
      };
    })()`
  });
  return result.result.value;
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}
