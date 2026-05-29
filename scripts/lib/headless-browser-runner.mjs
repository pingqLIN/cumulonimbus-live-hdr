import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

export function resolveBrowser(explicitBrowser) {
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
    if (process.platform === "win32" && candidate.includes("\\") && candidate.toLowerCase().endsWith(".exe")) {
      return candidate;
    }
    const probe = spawnSync(candidate, ["--version"], {
      encoding: "utf8",
      timeout: 5000,
      windowsHide: true
    });
    if (probe.status === 0) {
      return candidate;
    }
  }

  throw new Error("No compatible Chrome or Edge executable found. Set CHROME_PATH or EDGE_PATH.");
}

export function runBrowserScreenshot(browser, browserArgs, options) {
  const cwd = options.cwd;
  const timeoutMs = options.timeoutMs;
  return new Promise((resolveRun) => {
    const child = spawn(browser, browserArgs, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    let visibleWindowTimer = null;
    if (process.platform === "win32") {
      visibleWindowTimer = setInterval(() => {
        if (settled || !child.pid) {
          return;
        }
        const visibleWindows = findVisibleProcessWindows(child.pid);
        if (visibleWindows.length === 0) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        clearInterval(visibleWindowTimer);
        const processCleanup = stopProcessTree(child);
        resolveRun({
          status: 125,
          stdout,
          stderr: `${stderr}\nHeadless browser opened visible windows; killed process tree. ${JSON.stringify(visibleWindows)}`.trim(),
          processCleanup
        });
      }, 250);
    }
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      if (visibleWindowTimer) {
        clearInterval(visibleWindowTimer);
      }
      const processCleanup = stopProcessTree(child);
      resolveRun({
        status: 124,
        stdout,
        stderr: `${stderr}\nBrowser screenshot timed out after ${timeoutMs}ms`.trim(),
        processCleanup
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
      if (visibleWindowTimer) {
        clearInterval(visibleWindowTimer);
      }
      const processCleanup = stopProcessTree(child);
      resolveRun({
        status: 1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        processCleanup
      });
    });
    child.once("exit", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      if (visibleWindowTimer) {
        clearInterval(visibleWindowTimer);
      }
      const processCleanup = stopProcessTree(child);
      resolveRun({ status: code ?? 1, stdout, stderr, processCleanup });
    });
  });
}

export function stopProcessTree(child) {
  const pid = child.pid ?? null;
  if (!pid) {
    return { pid, stopped: true };
  }
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return { pid, stopped: !isPidRunning(pid) };
  }
  child.kill();
  return { pid, stopped: !isPidRunning(pid) };
}

function isPidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function findVisibleProcessWindows(rootPid) {
  const script = `
$rootPid = ${rootPid}
Add-Type -Namespace Win32 -Name User32 -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool IsWindowVisible(System.IntPtr hWnd);
'@
$all = Get-CimInstance Win32_Process
$ids = New-Object System.Collections.Generic.HashSet[int]
[void]$ids.Add($rootPid)
$changed = $true
while ($changed) {
  $changed = $false
  foreach ($process in $all) {
    if ($ids.Contains([int]$process.ParentProcessId) -and -not $ids.Contains([int]$process.ProcessId)) {
      [void]$ids.Add([int]$process.ProcessId)
      $changed = $true
    }
  }
}
Get-Process -Id ([int[]]$ids) -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and [Win32.User32]::IsWindowVisible($_.MainWindowHandle) } |
  Select-Object Id, ProcessName, MainWindowTitle |
  ConvertTo-Json -Compress
`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    timeout: 2000,
    windowsHide: true
  });
  if (result.status !== 0 || !result.stdout.trim()) {
    return [];
  }
  try {
    const parsed = JSON.parse(result.stdout);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}
