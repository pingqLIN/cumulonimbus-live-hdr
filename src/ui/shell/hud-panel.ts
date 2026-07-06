import { type Orientation } from "../../app/runtime-options.js";

export function renderHudPanel(orientation: Orientation, hidden: boolean): string {
  const hiddenAttribute = hidden ? " hidden" : "";
  const targetLabel = orientation === "landscape" ? "16:9 Broadcast" : "9:16 Mobile";

  return `
        <section id="cloud-hud" class="hud-panel" aria-label="Renderer status"${hiddenAttribute}>
          <button id="btn-hud-close" class="panel-button hud-close-button" type="button" title="Close HUD">x</button>
          <div class="project-kicker">Operational volumetric study</div>
          <h1 class="project-title">Cumulonimbus Live HDR Observatory</h1>
          <p class="hud-line" id="target-label">Target: ${targetLabel}</p>
          <div class="hud-line hud-list">
            <span>Cloud form: Cb tower, convective cells, and tropopause anvil.</span>
            <span>Scale: sea level 0 km plane, 1 grid = 1 km, bold/ring = 5 km.</span>
            <span>Framing: camera center tracks the cloud-layer midpoint.</span>
            <span>Left drag / arrows: orbit | Wheel / +/- / Ctrl-drag: zoom | Right/Middle/Shift-drag or Shift+arrows: pan | Alt: precision</span>
          </div>
          <p class="hud-line muted" id="fps-counter">FPS: -- | AVG: -- | RES: -- | Time: paused</p>
        </section>`;
}
