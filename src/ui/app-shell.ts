import {
  presetOptions,
  type Orientation,
  type RenderMode,
  type RuntimeOptions
} from "../app/runtime-options.js";

export type AppShell = {
  readonly root: HTMLElement;
  readonly renderContainer: HTMLElement;
  readonly canvas: HTMLCanvasElement;
};

export function createAppShell(options: RuntimeOptions): AppShell {
  const root = document.querySelector<HTMLElement>("#app") ?? document.body;
  const compactControls = options.displayProfile.mobileWideView;
  root.innerHTML = buildShellMarkup(options.orientation, options.renderMode, compactControls);
  const renderContainer = requireElement<HTMLElement>("#render-container");
  const canvas = requireElement<HTMLCanvasElement>("#cloud-canvas");
  const canvasSize = resolveInitialCanvasSize(options);
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  return { root, renderContainer, canvas };
}

function buildShellMarkup(
  orientation: Orientation,
  renderMode: RenderMode,
  compactControls: boolean
): string {
  const cloudHidden = compactControls ? " hidden" : "";
  const timeHidden = compactControls ? " hidden" : "";
  const atmosphereHidden = compactControls ? " hidden" : "";
  const restoreSuppressed = compactControls ? ' data-restore-suppressed="true"' : "";
  const presetOptionsMarkup = presetOptions
    .map((preset) => `<option value="${preset.value}">${preset.label}</option>`)
    .join("");

  return `
    <div id="cumulonimbus-app" class="cloud-app-shell" data-render-mode="${renderMode}">
      <div id="stage-edge-fill" class="stage-edge-fill" aria-hidden="true"></div>
      <main id="render-container" class="render-stage viewport-${orientation}" aria-label="Cumulonimbus render stage">
        <canvas id="cloud-canvas" aria-label="Live cumulonimbus cloud renderer"></canvas>
        <section id="cloud-hud" class="hud-panel" aria-label="Renderer status">
          <button id="btn-hud-close" class="panel-button hud-close-button" type="button" title="Close HUD">x</button>
          <div class="project-kicker">Volumetric study</div>
          <h1 class="project-title">Cumulonimbus Live HDR</h1>
          <p class="hud-line" id="target-label">Target: ${orientation === "landscape" ? "16:9 broadcast" : "9:16 mobile"}</p>
          <p class="hud-line hud-list">Single cloud body, clean sky field, soft raymarched edge.</p>
          <p class="hud-line muted" id="fps-counter">Preset: reference cloud</p>
        </section>
      </main>

      <div id="ui-bar" class="control-surface" aria-label="Control panels">
        <section id="panel-main" class="control-panel control-panel--main" data-panel-key="mainPanel" aria-label="Display and framing controls">
          <div class="control-panel__chrome">
            <span class="control-panel__title">MAIN // DISPLAY + FRAMING</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-minimize="mainPanel" title="Minimize">-</button>
              <button type="button" class="panel-button" data-panel-close="mainPanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--display" aria-label="Display">
              <span class="control-group__label">Display</span>
              <div class="segmented-controls">
                <button id="btn-landscape" type="button" class="segment-button">16:9</button>
                <button id="btn-portrait" type="button" class="segment-button">9:16</button>
              </div>
              <button id="btn-fullscreen" class="btn-toggle" type="button">Fullscreen</button>
              <button id="btn-toggle-other-panels" class="btn-toggle" type="button">Panels</button>
              <label class="select-group">
                <span>Preset</span>
                <select id="select-preset" class="tp-select">${presetOptionsMarkup}</select>
              </label>
            </div>

            <div class="control-group control-group--framing" aria-label="Framing">
              <span class="control-group__label">Framing</span>
              <div class="framing-controls">
                <button id="btn-grid" class="btn-toggle" type="button">Scale</button>
                <button id="btn-cam-mode" class="btn-toggle" type="button">Perspective</button>
                <button id="btn-reset-cam" class="btn-action" type="button">Recenter</button>
              </div>
              <label class="select-group">
                <span>Surface</span>
                <select id="select-surface" class="tp-select">
                  <option value="none">None</option>
                  <option value="ocean">Ocean</option>
                  <option value="hills">Hills</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section id="panel-time" class="control-panel control-panel--time" data-panel-key="timePanel" aria-label="Time controls"${timeHidden}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">TIME // PLAYBACK</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="timePanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--time">
              <span class="control-group__label">Time</span>
              <div class="slider-group">
                <label for="slider-time">Speed</label>
                <input id="slider-time" type="range" min="0.25" max="4" step="0.25" value="1">
                <span id="time-readout" class="readout">1.0x</span>
              </div>
              <button id="btn-time-toggle" class="btn-toggle" type="button">Pause</button>
              <button id="btn-time-reset" class="btn-toggle" type="button">Reset</button>
            </div>
          </div>
        </section>

        <section id="panel-cloud" class="control-panel control-panel--cloud" data-panel-key="cloudPanel" aria-label="Cloud controls"${cloudHidden}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">CLOUD // BODY + STRUCTURE</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="cloudPanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--storm">
              <span class="control-group__label">Storm</span>
              <div class="slider-group">
                <label for="input-seed">Seed</label>
                <input id="input-seed" class="seed-input" type="number" min="1" step="1">
                <button id="btn-random-seed" class="btn-action" type="button">New</button>
              </div>
              <div class="slider-group">
                <label for="slider-systems">Cells</label>
                <input id="slider-systems" type="range" min="1" max="10" step="1" value="1">
                <span id="systems-readout" class="readout">1</span>
              </div>
            </div>

            <div class="control-group control-group--render">
              <span class="control-group__label">Render</span>
              <div class="slider-group">
                <label for="slider-quality">Power</label>
                <input id="slider-quality" type="range" min="0.45" max="1" step="0.01" value="0.72">
                <span id="quality-readout" class="readout">0.72x</span>
              </div>
              <button id="btn-hdr10" class="btn-toggle" type="button">HDR10</button>
            </div>

            <div class="control-group control-group--cloud-structure">
              <span class="control-group__label">Structure</span>
              <div class="slider-group accent-red">
                <label for="slider-tropo">Top</label>
                <input id="slider-tropo" type="range" min="8" max="18" step="0.5" value="11">
                <span id="tropo-readout" class="readout">11km</span>
              </div>
              <div class="slider-group">
                <label for="slider-freezing">Freezing</label>
                <input id="slider-freezing" type="range" min="3" max="6" step="0.25" value="4.5">
                <span id="freezing-readout" class="readout">4.5km</span>
              </div>
              <div class="slider-group">
                <label for="slider-shear">Shear</label>
                <input id="slider-shear" type="range" min="0" max="1" step="0.05" value="0.4">
                <span id="shear-readout" class="readout">0.40</span>
              </div>
            </div>
          </div>
        </section>

        <section id="panel-atmosphere" class="control-panel control-panel--atmosphere" data-panel-key="atmospherePanel" aria-label="Atmosphere controls"${atmosphereHidden}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">ATMOSPHERE // SUN GEOMETRY</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="atmospherePanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--atmosphere">
              <span class="control-group__label">Atmosphere</span>
              <div class="slider-group">
                <label for="slider-sun">Sun</label>
                <input id="slider-sun" type="range" min="0" max="10" step="0.1" value="7.4">
                <span id="sun-readout" class="readout">7.4</span>
              </div>
              <div class="slider-group">
                <label for="slider-sun-elevation">Elev</label>
                <input id="slider-sun-elevation" type="range" min="-18" max="82" step="1" value="62">
                <span id="sun-elevation-readout" class="readout">62deg</span>
              </div>
              <div class="slider-group">
                <label for="slider-ambient">Ambient</label>
                <input id="slider-ambient" type="range" min="0.2" max="1.2" step="0.05" value="0.66">
                <span id="ambient-readout" class="readout">0.66</span>
              </div>
              <div class="slider-group">
                <label for="slider-sun-angle">Angle</label>
                <input id="slider-sun-angle" type="range" min="-180" max="180" step="5" value="18">
                <span id="sun-angle-readout" class="readout">18deg</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="panel-restore-dock" class="panel-restore-dock" hidden${restoreSuppressed} aria-label="Closed panels">
        <button type="button" data-hud-restore hidden>HUD</button>
        <button type="button" data-panel-restore="mainPanel" hidden>Main</button>
        <button type="button" data-panel-restore="timePanel" hidden>Time</button>
        <button type="button" data-panel-restore="cloudPanel" hidden>Cloud</button>
        <button type="button" data-panel-restore="atmospherePanel" hidden>Atmosphere</button>
      </div>
    </div>
  `;
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing app shell element: ${selector}`);
  }
  return element;
}

function resolveInitialCanvasSize(options: RuntimeOptions): { width: number; height: number } {
  const fallback = options.orientation === "landscape" ? { width: 960, height: 540 } : { width: 540, height: 960 };
  return {
    width: Math.round(options.simWidth ?? fallback.width),
    height: Math.round(options.simHeight ?? fallback.height)
  };
}
