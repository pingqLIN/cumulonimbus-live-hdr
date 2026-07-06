import { createReadStream, existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { createServer as createHttpServer, get } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import { basename, dirname, join, normalize, resolve, sep } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolveBrowser, stopProcessTree } from "./lib/headless-browser-runner.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const viewport = {
  width: readIntegerArg(args, "width", 1366),
  height: readIntegerArg(args, "height", 768)
};
const timeoutMs = readIntegerArg(args, "timeoutMs", 30000);
const currentPort = await resolvePort(readIntegerArg(args, "port", 6173));
const referencePort = await resolvePort(readIntegerArg(args, "referencePort", 8096));
const debugPort = await resolvePort(readIntegerArg(args, "debugPort", 9223));
const referenceHtml = resolve(args.reference ?? "Q:/Github/cumulonimbus-live-hdr/06.html");
const browserProfileDir = mkdtempSync(join(tmpdir(), "cumulonimbus-bench-"));

if (!existsSync(referenceHtml)) {
  throw new Error(`Reference HTML not found: ${referenceHtml}`);
}

const viteServer = startVite(currentPort);
const referenceServer = startReferenceServer(dirname(referenceHtml), referencePort);
let browserProcess;

try {
  await Promise.all([
    waitForServer(`http://127.0.0.1:${currentPort}`, timeoutMs),
    waitForServer(`http://127.0.0.1:${referencePort}/${basename(referenceHtml)}`, timeoutMs)
  ]);
  browserProcess = startBrowser(resolveBrowser(args.browser), debugPort, browserProfileDir);
  await waitForCdp(debugPort, timeoutMs);

  const currentUrl = new URL(`http://127.0.0.1:${currentPort}/`);
  currentUrl.searchParams.set("debug", "1");
  currentUrl.searchParams.set("shader", args.shader ?? "live-lite");
  const current = await measurePage(debugPort, currentUrl.toString(), {
    label: "current",
    viewport,
    timeoutMs,
    waitForRenderStatus: true
  });
  const reference = await measurePage(
    debugPort,
    `http://127.0.0.1:${referencePort}/${basename(referenceHtml)}`,
    {
      label: "reference-06",
      viewport,
      timeoutMs,
      settleMs: 1500
    }
  );

  const payload = {
    status: "ok",
    viewport,
    current,
    reference,
    readyRatio:
      current.readyMs !== null && reference.readyMs !== null
        ? Number((current.readyMs / Math.max(1, reference.readyMs)).toFixed(2))
        : null
  };
  console.log(JSON.stringify(payload, null, 2));
} finally {
  if (browserProcess) {
    stopProcessTree(browserProcess);
  }
  stopProcessTree(viteServer);
  await closeReferenceServer(referenceServer);
  rmSync(browserProfileDir, { recursive: true, force: true });
}

function startVite(port) {
  const viteBin = join(projectRoot, "node_modules", "vite", "bin", "vite.js");
  return spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: projectRoot,
    stdio: "ignore",
    windowsHide: true
  });
}

function startReferenceServer(root, port) {
  const normalizedRoot = normalize(root);
  const server = createHttpServer((request, response) => {
    const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "") || basename(referenceHtml);
    const candidate = normalize(join(normalizedRoot, relativePath));
    if (!candidate.startsWith(`${normalizedRoot}${sep}`) && candidate !== normalizedRoot) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (!existsSync(candidate) || !statSync(candidate).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": candidate.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream"
    });
    createReadStream(candidate).pipe(response);
  });
  server.listen(port, "127.0.0.1");
  return server;
}

function startBrowser(browser, port, profileDir) {
  return spawn(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--no-sandbox",
      "--no-first-run",
      "--disable-background-networking",
      "--disable-component-update",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "about:blank"
    ],
    {
      cwd: projectRoot,
      stdio: "ignore",
      windowsHide: true
    }
  );
}

async function measurePage(debugPort, url, options) {
  const target = await createTarget(debugPort);
  const client = await createCdpClient(target.webSocketDebuggerUrl);
  const startedAt = performance.now();
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: options.viewport.width,
      height: options.viewport.height,
      deviceScaleFactor: 1,
      mobile: false
    });
    await client.send("Page.navigate", { url });
    await waitForPageLoad(client, options.timeoutMs);
    if (options.settleMs) {
      await delay(options.settleMs);
    }

    const metrics = await waitForMetrics(client, options);
    return {
      label: options.label,
      url,
      wallMs: Math.round(performance.now() - startedAt),
      readyMs: metrics.readyMs,
      renderStatus: metrics.renderStatus,
      shaderVariant: metrics.shaderVariant,
      canvas: metrics.canvas,
      fpsText: metrics.fpsText,
      navDurationMs: metrics.navDurationMs
    };
  } finally {
    client.close();
    await fetch(`http://127.0.0.1:${debugPort}/json/close/${target.id}`).catch(() => undefined);
  }
}

async function waitForMetrics(client, options) {
  const startedAt = performance.now();
  let lastMetrics = null;
  while (performance.now() - startedAt < options.timeoutMs) {
    lastMetrics = await readPageMetrics(client);
    const canvasReady = lastMetrics.canvas.width > 0 && lastMetrics.canvas.height > 0;
    const renderReady = options.waitForRenderStatus ? lastMetrics.renderStatus === "ready" : canvasReady;
    if (canvasReady && renderReady) {
      return lastMetrics;
    }
    if (
      ["app-error", "webgl-unavailable", "render-error", "context-lost-timeout", "context-restore-failed"].includes(
        lastMetrics.renderStatus
      )
    ) {
      throw new Error(`Benchmark page failed before readiness: ${JSON.stringify(lastMetrics)}`);
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for benchmark metrics: ${JSON.stringify(lastMetrics)}`);
}

async function readPageMetrics(client) {
  const result = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const nav = performance.getEntriesByType('navigation')[0];
      const runtime = window.__cumulonimbusRuntime;
      const readyNow = performance.now();
      return {
        readyMs: Math.round(readyNow),
        renderStatus: document.documentElement.dataset.renderStatus || '',
        shaderVariant: document.documentElement.dataset.shaderVariant || runtime?.options?.shaderVariant || '',
        canvas: {
          width: canvas?.width || 0,
          height: canvas?.height || 0,
          pixels: (canvas?.width || 0) * (canvas?.height || 0)
        },
        fpsText: document.querySelector('#fps-counter')?.textContent || '',
        navDurationMs: nav ? Math.round(nav.duration) : null
      };
    })()`
  });
  return result.result?.value;
}

async function createTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: "PUT"
  });
  if (!response.ok) {
    throw new Error(`Could not create CDP target: ${response.status}`);
  }
  return response.json();
}

function createCdpClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const eventResolvers = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve: resolvePending, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolvePending(message.result ?? {});
      }
      return;
    }
    const resolvers = eventResolvers.get(message.method);
    if (resolvers?.length) {
      const resolveEvent = resolvers.shift();
      resolveEvent(message.params ?? {});
    }
  });

  return new Promise((resolveClient, rejectClient) => {
    socket.addEventListener("open", () => {
      resolveClient({
        send(method, params = {}) {
          const id = nextId++;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((resolvePending, reject) => {
            pending.set(id, { resolve: resolvePending, reject });
          });
        },
        once(method) {
          return new Promise((resolveEvent) => {
            const resolvers = eventResolvers.get(method) ?? [];
            resolvers.push(resolveEvent);
            eventResolvers.set(method, resolvers);
          });
        },
        close() {
          socket.close();
        }
      });
    });
    socket.addEventListener("error", () => rejectClient(new Error(`Could not connect CDP socket ${wsUrl}`)));
  });
}

async function waitForPageLoad(client, timeoutMs) {
  await Promise.race([
    client.once("Page.loadEventFired"),
    delay(timeoutMs).then(() => {
      throw new Error("Timed out waiting for Page.loadEventFired");
    })
  ]);
}

async function waitForCdp(port, timeoutMs) {
  const startedAt = performance.now();
  while (performance.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling while the browser starts.
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for browser CDP on ${port}`);
}

function waitForServer(origin, timeoutMs) {
  const startedAt = performance.now();
  return new Promise((resolveServer, rejectServer) => {
    const tick = () => {
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
        rejectServer(new Error(`Timed out waiting for ${origin}`));
        return;
      }
      setTimeout(tick, 250);
    };

    tick();
  });
}

async function resolvePort(startPort) {
  for (let candidate = startPort; candidate < startPort + 50; candidate += 1) {
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }
  throw new Error(`Could not find an available port near ${startPort}.`);
}

function isPortAvailable(port) {
  return new Promise((resolveAvailable) => {
    const server = createNetServer();
    server.once("error", () => resolveAvailable(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolveAvailable(true));
    });
  });
}

function closeReferenceServer(server) {
  return new Promise((resolveClose) => server.close(resolveClose));
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }
    const [key, inlineValue] = token.slice(2).split("=", 2);
    parsed[key] = inlineValue ?? argv[index + 1] ?? "";
    if (inlineValue === undefined && argv[index + 1] && !argv[index + 1].startsWith("--")) {
      index += 1;
    }
  }
  return parsed;
}

function readIntegerArg(parsed, name, fallback) {
  const value = Number.parseInt(parsed[name] ?? "", 10);
  return Number.isFinite(value) ? value : fallback;
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}
