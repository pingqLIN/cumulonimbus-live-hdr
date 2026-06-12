import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");
const runnerArgs = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const renderArgs = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);
const mode = readOption(runnerArgs, "--mode", process.env.COLAB_RENDER_MODE ?? "quick");
const install = hasFlag(runnerArgs, "--install") || process.env.COLAB_INSTALL === "1";
const check = hasFlag(runnerArgs, "--check") || process.env.COLAB_CHECK === "1";
const skipRender = hasFlag(runnerArgs, "--skip-render") || process.env.COLAB_SKIP_RENDER === "1";
const outputDir = readOption(runnerArgs, "--manifest-dir", process.env.COLAB_MANIFEST_DIR ?? "outputs/colab");
const startedAt = new Date().toISOString();
const commands = [];

mkdirSync(outputDir, { recursive: true });

try {
  if (install) {
    runCommand("npm", ["ci"]);
  }

  if (check) {
    runCommand("npm", ["run", "check"]);
  }

  if (!skipRender) {
    runRender(mode, renderArgs);
  }

  writeManifest(0);
}
catch (error) {
  writeManifest(error.exitCode ?? 1, String(error.message ?? error));
  process.exit(error.exitCode ?? 1);
}

function runRender(selectedMode, extraArgs) {
  const scriptByMode = {
    quick: "render:quick",
    test: "render:test",
    demo: "render:demo-loop"
  };
  const script = scriptByMode[selectedMode];
  if (!script) {
    throw new Error(`Unsupported --mode "${selectedMode}". Use quick, test, or demo.`);
  }
  runCommand("npm", ["run", script, "--", ...extraArgs]);
}

function runCommand(command, commandArgs) {
  const started = new Date().toISOString();
  const spawnTarget = resolveSpawnTarget(command, commandArgs);
  console.log(`\n$ ${command} ${commandArgs.join(" ")}`);
  const result = spawnSync(spawnTarget.command, spawnTarget.args, {
    encoding: "utf8",
    stdio: "inherit"
  });
  const entry = {
    command,
    args: commandArgs,
    startedAt: started,
    finishedAt: new Date().toISOString(),
    status: result.status
  };
  commands.push(entry);
  if (result.status !== 0) {
    const error = new Error(`Command failed: ${command} ${commandArgs.join(" ")}`);
    error.exitCode = result.status ?? 1;
    throw error;
  }
}

function writeManifest(status, error = null) {
  const manifest = {
    status,
    error,
    mode,
    renderArgs,
    startedAt,
    finishedAt: new Date().toISOString(),
    git: readGitInfo(),
    node: process.version,
    cwd: process.cwd(),
    commands,
    artifacts: listArtifacts("outputs")
  };
  const manifestPath = join(outputDir, "job-manifest.json");
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${manifestPath}`);
}

function readGitInfo() {
  const commit = capture("git", ["rev-parse", "--short", "HEAD"]);
  const branch = capture("git", ["branch", "--show-current"]);
  return { branch, commit };
}

function capture(command, commandArgs) {
  const spawnTarget = resolveSpawnTarget(command, commandArgs);
  const result = spawnSync(spawnTarget.command, spawnTarget.args, { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "unknown";
}

function resolveSpawnTarget(command, commandArgs) {
  if (process.platform === "win32" && command === "npm") {
    return { command: "cmd.exe", args: ["/d", "/s", "/c", command, ...commandArgs] };
  }
  return { command, args: commandArgs };
}

function listArtifacts(root) {
  if (!existsSync(root)) {
    return [];
  }
  const artifacts = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current)) {
      const path = join(current, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        if (artifacts.length < 200) {
          stack.push(path);
        }
        continue;
      }
      artifacts.push({
        path: relative(process.cwd(), path).replaceAll("\\", "/"),
        bytes: stats.size
      });
      if (artifacts.length >= 200) {
        return artifacts;
      }
    }
  }
  return artifacts.sort((a, b) => a.path.localeCompare(b.path));
}

function readOption(sourceArgs, name, fallback) {
  const index = sourceArgs.indexOf(name);
  if (index === -1) {
    return fallback;
  }
  return sourceArgs[index + 1] ?? fallback;
}

function hasFlag(sourceArgs, name) {
  return sourceArgs.includes(name);
}
