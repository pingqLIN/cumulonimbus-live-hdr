import "../styles/app.css";
import { detectBrowserDisplayProfile } from "./display-profile.js";
import { resolveRuntimeOptions } from "./runtime-options.js";
import { createAppShell } from "../ui/app-shell.js";
import { bindControls } from "../ui/controls.js";
import { bindPanels } from "../ui/panels.js";
import { bindStageEdgeFill } from "../ui/stage-edge-fill.js";

const query = new URLSearchParams(window.location.search);
const displayProfile = detectBrowserDisplayProfile();
const options = resolveRuntimeOptions(query, displayProfile);
const shell = createAppShell(options);
const cleanupStageEdgeFill = bindStageEdgeFill(shell.renderContainer);
let disposeApp: (() => void) | undefined;

document.documentElement.dataset.renderStatus = "shell-ready";
document.documentElement.dataset.appModuleStatus = "loading";
document.body.dataset.ui = "tracing-paper";
document.body.dataset.viewportMode = "background";
document.body.dataset.controlsHidden = options.controlsVisible ? "false" : "true";

window.addEventListener("beforeunload", () => {
  cleanupStageEdgeFill();
  disposeApp?.();
});

void import("./cloud-app.js")
  .then(({ CloudApp }) => {
    document.documentElement.dataset.appModuleStatus = "loaded";
    const app = new CloudApp(shell.canvas, options);
    disposeApp = () => app.dispose();
    bindControls(shell.root, app);
    bindPanels(shell.root);
    app.start();
  })
  .catch((error: unknown) => {
    document.documentElement.dataset.appModuleStatus = "error";
    document.documentElement.dataset.renderStatus = "app-error";
    shell.canvas.setAttribute("aria-label", "Cloud renderer failed to load");
    console.error("Cumulonimbus app startup failed:", error);
  });
