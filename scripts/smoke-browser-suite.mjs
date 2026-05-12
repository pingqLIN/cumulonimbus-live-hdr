import { spawn, spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const timeoutMs = readNumberArg("--timeoutMs", 120000);
const cases = [
  {
    name: "field-capture",
    script: "smoke-field-capture.mjs"
  },
  {
    name: "3d-capture",
    script: "smoke-3d-capture.mjs"
  },
  {
    name: "ui-capture",
    script: "smoke-ui-capture.mjs"
  },
  {
    name: "live-entry",
    script: "smoke-live-entry.mjs"
  }
];
const startedAt = performance.now();
const results = [];

for (const testCase of cases) {
  const result = await runCase(testCase);
  results.push(result);
  if (!result.ok) {
    console.error(JSON.stringify({ ok: false, failed: result, results }, null, 2));
    process.exit(result.status || 1);
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      renderSurface: "browser",
      durationMs: Math.round(performance.now() - startedAt),
      results
    },
    null,
    2
  )
);

function runCase(testCase) {
  const started = performance.now();
  const scriptPath = join(projectRoot, "scripts", testCase.script);
  return new Promise((resolveRun) => {
    const child = spawn(process.execPath, [scriptPath], {
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
      stopTree(child);
      resolveRun({
        name: testCase.name,
        ok: false,
        status: 124,
        durationMs: Math.round(performance.now() - started),
        stdout: tail(stdout),
        stderr: tail(`${stderr}\nTimed out after ${timeoutMs}ms`)
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
      resolveRun({
        name: testCase.name,
        ok: false,
        status: 1,
        durationMs: Math.round(performance.now() - started),
        stdout: tail(stdout),
        stderr: tail(`${stderr}\n${error.message}`)
      });
    });
    child.once("exit", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolveRun({
        name: testCase.name,
        ok: code === 0,
        status: code ?? 1,
        durationMs: Math.round(performance.now() - started),
        stdout: tail(stdout),
        stderr: tail(stderr)
      });
    });
  });
}

function stopTree(child) {
  if (!child.pid) {
    return;
  }
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  child.kill("SIGKILL");
}

function tail(value, maxLength = 4000) {
  if (value.length <= maxLength) {
    return value.trim();
  }
  return value.slice(value.length - maxLength).trim();
}

function readNumberArg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) {
    return fallback;
  }
  const value = Number(process.argv[index + 1]);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}
