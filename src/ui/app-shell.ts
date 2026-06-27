import {
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
  root.innerHTML = buildShellMarkup(options.orientation, options.renderMode, compactControls, options.controlsVisible);
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
  compactControls: boolean,
  controlsVisible: boolean
): string {
  const controlsHidden = !controlsVisible || renderMode === "canvas";
  const hudHidden = controlsHidden ? " hidden" : "";
  const uiHidden = controlsHidden ? " hidden" : "";
  const cloudHidden = controlsHidden || compactControls ? " hidden" : "";
  const timeHidden = controlsHidden || compactControls ? " hidden" : "";
  const atmosphereHidden = controlsHidden || compactControls ? " hidden" : "";
  const restoreSuppressed = compactControls ? ' data-restore-suppressed="true"' : "";
  const hiddenControlsState = controlsHidden ? "true" : "false";

  return `
    <div id="cumulonimbus-app" class="cloud-app-shell" data-render-mode="${renderMode}" data-controls-hidden="${hiddenControlsState}">
      <div id="stage-edge-fill" class="stage-edge-fill" aria-hidden="true"></div>
      <main id="render-container" class="render-stage viewport-fullscreen viewport-${orientation}" aria-label="Cumulonimbus cloud render">
        <canvas id="cloud-canvas" tabindex="0" aria-label="Live cumulonimbus cloud renderer. Left drag or arrow keys orbit, wheel or plus/minus zoom, right drag or shift plus drag pans."></canvas>
        <section id="cloud-hud" class="hud-panel" aria-label="Renderer status"${hudHidden}>
          <button id="btn-hud-close" class="panel-button hud-close-button" type="button" title="Close HUD">x</button>
          <div class="project-kicker">Operational volumetric study</div>
          <h1 class="project-title">Cumulonimbus Live HDR Observatory</h1>
          <p class="hud-line" id="target-label">Target: ${orientation === "landscape" ? "16:9 Broadcast" : "9:16 Mobile"}</p>
          <div class="hud-line hud-list">
            <span>Cloud form: Cb tower, convective cells, and tropopause anvil.</span>
            <span>Scale: sea level 0 km plane, 1 grid = 1 km, bold/ring = 5 km.</span>
            <span>Framing: camera center tracks the cloud-layer midpoint.</span>
            <span>Left drag / arrows: orbit | Wheel / +/- / Ctrl-drag: zoom | Right/Middle/Shift-drag or Shift+arrows: pan | Alt: precision</span>
          </div>
          <p class="hud-line muted" id="fps-counter">FPS: -- | AVG: -- | RES: -- | Time: paused</p>
        </section>
      </main>

      <div id="ui-bar" class="control-surface" aria-label="Control panels"${uiHidden}>
        <section id="panel-main" class="control-panel control-panel--main" data-panel-key="mainPanel" aria-label="Display and framing controls">
          <div class="control-panel__chrome">
            <span class="control-panel__title">MAIN PANEL // DISPLAY + FRAMING</span>
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
              <label class="select-group lang-select">
                <span>Language</span>
                <select id="select-language" class="tp-select">
                  <option value="zh-TW">Traditional Chinese</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>

            <div class="control-group control-group--framing" aria-label="Framing">
              <span class="control-group__label">Framing</span>
              <div class="framing-controls">
                <button id="btn-grid" class="btn-toggle" type="button">Scale ruler</button>
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
            <span class="control-panel__title">TIME // CLOCK + LOCATION</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-close="timePanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--time">
              <span class="control-group__label">Time</span>
              <div class="slider-group">
                <label for="slider-time">Speed</label>
                <input id="slider-time" type="range" min="0" max="5" step="0.25" value="1">
                <span id="time-readout" class="readout">1.0x</span>
              </div>
              <button id="btn-time-toggle" class="btn-toggle" type="button" aria-label="Resume">Resume</button>
              <button id="btn-sync-system-time" class="btn-toggle" type="button">System time</button>
              <button id="btn-sync-location" class="btn-toggle" type="button" disabled title="Location sync is not connected">Location off</button>
              <button id="btn-time-reset" class="btn-toggle" type="button">Reset time</button>
              <div id="sync-status" class="sync-status" role="status" aria-live="polite" hidden></div>
            </div>
          </div>
        </section>

        <section id="panel-cloud" class="control-panel control-panel--cloud" data-panel-key="cloudPanel" aria-label="Cloud controls"${cloudHidden}>
          <div class="control-panel__chrome">
          <span class="control-panel__title">CLOUD BODY // SYSTEM + POWER + STRUCTURE</span>
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
                <label for="slider-systems">Convective cells</label>
                <input id="slider-systems" type="range" min="1" max="10" step="1" value="1">
                <span id="systems-readout" class="readout">1</span>
              </div>
            </div>

            <div class="control-group control-group--render">
              <span class="control-group__label">Render</span>
              <div class="slider-group">
                <label for="slider-quality">Power</label>
                <input id="slider-quality" type="range" min="0.45" max="1" step="0.01" value="0.80">
                <span id="quality-readout" class="readout">0.80x</span>
              </div>
              <button id="btn-auto-quality" class="btn-toggle quality-auto" type="button">Auto power</button>
              <button id="btn-hdr10" class="btn-toggle" type="button">HDR10</button>
            </div>

            <div class="control-group control-group--cloud-structure">
              <span class="control-group__label">Cloud structure</span>
              <div class="slider-group accent-red">
                <label for="slider-tropo">Top</label>
                <input id="slider-tropo" type="range" min="8" max="18" step="0.5" value="8">
                <span id="tropo-readout" class="readout">8km</span>
              </div>
              <div class="slider-group">
                <label for="slider-freezing">Freezing</label>
                <input id="slider-freezing" type="range" min="3" max="6" step="0.25" value="3">
                <span id="freezing-readout" class="readout">3km</span>
              </div>
              <div class="slider-group">
                <label for="slider-shear">Shear</label>
                <input id="slider-shear" type="range" min="0" max="1" step="0.05" value="0.3">
                <span id="shear-readout" class="readout">0.30</span>
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
              <div class="slider-group slider-group--sun">
                <span class="slider-label">
                  <span>Sun</span>
                  <button id="btn-link-sun-elevation" class="link-chip enabled" type="button" title="Unlink sun intensity from elevation"></button>
                </span>
                <input id="slider-sun" type="range" min="0" max="8" step="0.1" value="4">
                <span id="sun-readout" class="readout">4.0</span>
              </div>
              <div class="slider-group slider-group--elevation">
                <span class="slider-label">
                  <span>Elev</span>
                  <button id="btn-link-elevation-sun" class="link-chip enabled" type="button" title="Unlink sun intensity from elevation"></button>
                </span>
                <input id="slider-sun-elevation" type="range" min="-18" max="82" step="1" value="32">
                <span id="sun-elevation-readout" class="readout">32deg</span>
              </div>
              <div class="slider-group slider-group--ambient">
                <label for="slider-ambient">Ambient</label>
                <input id="slider-ambient" type="range" min="0.2" max="1.2" step="0.05" value="0.68">
                <span id="ambient-readout" class="readout">0.68</span>
              </div>
              <div class="slider-group slider-group--angle">
                <label for="slider-sun-angle">Angle</label>
                <input id="slider-sun-angle" type="range" min="-180" max="180" step="5" value="-50">
                <span id="sun-angle-readout" class="readout">-50deg</span>
              </div>
              <div id="solar-orbit-widget" class="solar-orbit-widget" aria-label="Sun and Earth relation">
                <canvas id="atm-canvas" aria-label="Atmospheric scattering model"></canvas>
                <div class="atm-dashboard">
                  <div class="atm-meter"><span>Elev <strong id="dash-elev-val">0deg</strong></span><i><b id="dash-elev-fill"></b></i></div>
                  <div class="atm-meter"><span>Direct <strong id="dash-dir-val">0%</strong></span><i><b id="dash-dir-fill"></b></i></div>
                  <div class="atm-meter"><span>Diffuse <strong id="dash-dif-val">0%</strong></span><i><b id="dash-dif-fill"></b></i></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="panel-restore-dock" class="panel-restore-dock" hidden${restoreSuppressed} aria-label="Closed panels">
        <button type="button" data-hud-restore hidden>HUD</button>
        <button type="button" data-panel-restore="mainPanel" hidden>Main</button>
        <button type="button" data-panel-restore="timePanel" hidden>Time</button>
        <button id="dock-time-toggle" class="dock-time-toggle" type="button" hidden>PAUSE</button>
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
