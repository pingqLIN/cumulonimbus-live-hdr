export function renderMainPanel(): string {
  return `
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
        </section>`;
}

export function renderTimePanel(hidden: boolean): string {
  const hiddenAttribute = hidden ? " hidden" : "";

  return `
        <section id="panel-time" class="control-panel control-panel--time" data-panel-key="timePanel" aria-label="Time controls"${hiddenAttribute}>
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
                <input id="slider-time" type="range" min="0" max="5" step="0.1" value="1">
                <span id="time-readout" class="readout">1.0x</span>
              </div>
              <button id="btn-time-toggle" class="btn-toggle icon-play-toggle" type="button" aria-label="Resume" title="Resume">Resume</button>
              <button id="btn-sync-system-time" class="btn-toggle" type="button">System time</button>
              <button id="btn-sync-location" class="btn-toggle" type="button" disabled title="Location sync is not connected">Location off</button>
              <button id="btn-time-reset" class="btn-toggle" type="button">Reset time</button>
              <div id="sync-status" class="sync-status" role="status" aria-live="polite" hidden></div>
            </div>
          </div>
        </section>`;
}

export function renderCloudPanel(hidden: boolean): string {
  const hiddenAttribute = hidden ? " hidden" : "";

  return `
        <section id="panel-cloud" class="control-panel control-panel--cloud" data-panel-key="cloudPanel" aria-label="Cloud controls"${hiddenAttribute}>
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
                <button id="btn-random-seed" class="btn-action icon-reset-toggle" type="button" aria-label="Randomize seed" title="Randomize seed">New</button>
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
                <input id="slider-quality" type="range" min="0.45" max="1" step="0.01" value="1">
                <span id="quality-readout" class="readout">1.00x</span>
              </div>
              <button id="btn-auto-quality" class="btn-toggle quality-auto" type="button">Auto power</button>
              <button id="btn-hdr10" class="btn-toggle" type="button">HDR10</button>
              <button id="btn-dither" class="btn-toggle" type="button">Dither</button>
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
        </section>`;
}

export function renderAdvancedPanel(hidden: boolean): string {
  const hiddenAttribute = hidden ? " hidden" : "";

  return `
        <section id="panel-advanced" class="control-panel control-panel--advanced" data-panel-key="advancedPanel" aria-label="Advanced render controls"${hiddenAttribute}>
          <div class="control-panel__chrome">
            <span class="control-panel__title">FULL CONSOLE // RAYMARCH + SHADOW + SURFACE</span>
            <div class="control-panel__actions">
              <button type="button" class="panel-button" data-panel-minimize="advancedPanel" title="Minimize">-</button>
              <button type="button" class="panel-button" data-panel-close="advancedPanel" title="Close">x</button>
            </div>
          </div>
          <div class="control-panel__body">
            <div class="control-group control-group--advanced">
              <span class="control-group__label">Raymarch performance</span>
              ${renderExplainedSlider({
                id: "slider-advanced-quality",
                label: "Render Power",
                min: "0.45",
                max: "1",
                step: "0.01",
                value: "1",
                readoutId: "advanced-quality-readout",
                readout: "1.00x",
                hint: "同主面板 Power；實際控制 maxPixels / render buffer 像素預算。"
              })}
              ${renderExplainedSlider({
                id: "slider-step-size",
                label: "Step Size",
                min: "0.08",
                max: "0.6",
                step: "0.01",
                value: "0.18",
                readoutId: "step-size-readout",
                readout: "0.18",
                hint: "主光線每次前進距離；建議 live 0.24-0.36，高細節 0.18。"
              })}
              ${renderExplainedSlider({
                id: "slider-max-steps",
                label: "Max Steps",
                min: "24",
                max: "144",
                step: "1",
                value: "142",
                readoutId: "max-steps-readout",
                readout: "142",
                hint: "主 raymarch 最大採樣數；建議 desktop 40-72，精細截圖可提高。"
              })}
              ${renderExplainedSlider({
                id: "slider-static-max-steps",
                label: "Compile cap",
                min: "24",
                max: "96",
                step: "1",
                value: "96",
                readoutId: "static-max-steps-readout",
                readout: "96",
                hint: "shader 編譯安全上限；調整會重新編譯，建議 live 40-72。"
              })}
              ${renderExplainedSlider({
                id: "slider-early-exit",
                label: "Early Exit",
                min: "0.88",
                max: "0.985",
                step: "0.005",
                value: "0.955",
                readoutId: "early-exit-readout",
                readout: "0.955",
                hint: "雲體累積 alpha 達此值即提早停止；建議 0.92-0.97。"
              })}
            </div>

            <div class="control-group control-group--advanced">
              <span class="control-group__label">Shadow Marching</span>
              ${renderExplainedSlider({
                id: "slider-shadow-samples",
                label: "Samples",
                min: "0",
                max: "5",
                step: "1",
                value: "3",
                readoutId: "shadow-samples-readout",
                readout: "3",
                hint: "雲內朝光源採樣次數；建議 1-3，越低越省。"
              })}
              ${renderExplainedSlider({
                id: "slider-shadow-step",
                label: "lStep",
                min: "0.18",
                max: "0.9",
                step: "0.01",
                value: "0.34",
                readoutId: "shadow-step-readout",
                readout: "0.34",
                hint: "陰影採樣步長；建議 0.34-0.62，較大會更快更粗。"
              })}
              ${renderExplainedSlider({
                id: "slider-shadow-occlusion",
                label: "Occlusion",
                min: "0.25",
                max: "1.6",
                step: "0.01",
                value: "1.00",
                readoutId: "shadow-occlusion-readout",
                readout: "1.00",
                hint: "Transmittance 遮蔽係數；建議 0.45-1.10。"
              })}
            </div>

            <div class="control-group control-group--advanced">
              <span class="control-group__label">Density + carving</span>
              ${renderExplainedSlider({
                id: "slider-density-multiplier",
                label: "Density Mult",
                min: "6",
                max: "18",
                step: "0.1",
                value: "12.8",
                readoutId: "density-multiplier-readout",
                readout: "12.8",
                hint: "alpha 計算中的密度乘數；建議 8-14，越高越厚。"
              })}
              ${renderExplainedSlider({
                id: "slider-carving-weight",
                label: "Carving",
                min: "0.35",
                max: "1.8",
                step: "0.01",
                value: "1.00",
                readoutId: "carving-weight-readout",
                readout: "1.00",
                hint: "Noise 對雲體邊緣侵蝕權重；建議 0.70-1.35。"
              })}
              ${renderExplainedSlider({
                id: "slider-edge-erosion",
                label: "Edge erosion",
                min: "0.25",
                max: "1.8",
                step: "0.01",
                value: "1.00",
                readoutId: "edge-erosion-readout",
                readout: "1.00",
                hint: "外緣破碎切削權重；建議 0.70-1.45。"
              })}
              ${renderExplainedSlider({
                id: "slider-fbm-octaves",
                label: "FBM Octaves",
                min: "4",
                max: "6",
                step: "1",
                value: "5",
                readoutId: "fbm-octaves-readout",
                readout: "5",
                hint: "雲體細節層數；建議 live 4-5，最高 6。"
              })}
              ${renderExplainedSlider({
                id: "slider-cloud-curl",
                label: "Cloud Curl",
                min: "0",
                max: "1.2",
                step: "0.01",
                value: "0.78",
                readoutId: "cloud-curl-readout",
                readout: "0.78",
                hint: "雲體捲曲與邊緣變形強度；建議 0.65-0.95。"
              })}
            </div>

            <div class="control-group control-group--advanced">
              <span class="control-group__label">Surface + cloud shadow</span>
              ${renderExplainedSlider({
                id: "slider-surface-shadow-samples",
                label: "Ground samples",
                min: "0",
                max: "5",
                step: "1",
                value: "3",
                readoutId: "surface-shadow-samples-readout",
                readout: "3",
                hint: "地面朝光源的雲影取樣次數；建議 2-5。"
              })}
              ${renderExplainedSlider({
                id: "slider-surface-shadow-step",
                label: "Ground step",
                min: "0.3",
                max: "2.4",
                step: "0.05",
                value: "1.15",
                readoutId: "surface-shadow-step-readout",
                readout: "1.15",
                hint: "地面雲影步長；建議 0.8-1.8。"
              })}
              ${renderExplainedSlider({
                id: "slider-surface-shadow-strength",
                label: "Shadow strength",
                min: "0",
                max: "0.85",
                step: "0.01",
                value: "0.38",
                readoutId: "surface-shadow-strength-readout",
                readout: "0.38",
                hint: "投射在地景上的雲影濃度；建議 0.20-0.55。"
              })}
              ${renderExplainedSlider({
                id: "slider-terrain-fuzz",
                label: "Felt fuzz",
                min: "0",
                max: "1",
                step: "0.01",
                value: "0.52",
                readoutId: "terrain-fuzz-readout",
                readout: "0.52",
                hint: "羊毛氈表面的微細絨毛雜訊；建議 0.35-0.70。"
              })}
              ${renderExplainedSlider({
                id: "slider-surface-radius",
                label: "Model radius",
                min: "8",
                max: "32",
                step: "0.5",
                value: "12",
                readoutId: "surface-radius-readout",
                readout: "12km",
                hint: "地景模型的實際半徑；建議 10-16km，可讓完整模型範圍進入畫面。"
              })}
              ${renderExplainedSlider({
                id: "slider-ocean-crest",
                label: "Ocean sheen",
                min: "0",
                max: "1.4",
                step: "0.01",
                value: "0.72",
                readoutId: "ocean-crest-readout",
                readout: "0.72",
                hint: "平滑深色海面的微光強度，不再產生海浪幾何；建議 0.35-0.75。"
              })}
            </div>

            <div class="control-group control-group--advanced">
              <span class="control-group__label">Camera + framing</span>
              ${renderExplainedSlider({
                id: "slider-camera-yaw",
                label: "Yaw",
                min: "-180",
                max: "180",
                step: "1",
                value: "0",
                readoutId: "camera-yaw-readout",
                readout: "0deg",
                hint: "模型水平觀看角；建議 -35 到 35 度微調。"
              })}
              ${renderExplainedSlider({
                id: "slider-camera-pitch",
                label: "Pitch",
                min: "-55",
                max: "70",
                step: "1",
                value: "-1",
                readoutId: "camera-pitch-readout",
                readout: "-1deg",
                hint: "模型俯仰角；微縮地景建議 -8 到 12 度。"
              })}
              ${renderExplainedSlider({
                id: "slider-camera-distance",
                label: "Distance",
                min: "8",
                max: "80",
                step: "1",
                value: "16",
                readoutId: "camera-distance-readout",
                readout: "16",
                hint: "相機距離；建議 16-32，越大越像桌上模型。"
              })}
            </div>
          </div>
        </section>`;
}

export function renderAtmospherePanel(hidden: boolean): string {
  const hiddenAttribute = hidden ? " hidden" : "";

  return `
        <section id="panel-atmosphere" class="control-panel control-panel--atmosphere" data-panel-key="atmospherePanel" aria-label="Atmosphere controls"${hiddenAttribute}>
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
        </section>`;
}

function renderExplainedSlider(options: {
  readonly id: string;
  readonly label: string;
  readonly min: string;
  readonly max: string;
  readonly step: string;
  readonly value: string;
  readonly readoutId: string;
  readonly readout: string;
  readonly hint: string;
}): string {
  return `
              <div class="slider-group slider-group--explained">
                <label for="${options.id}">${options.label}</label>
                <input id="${options.id}" type="range" min="${options.min}" max="${options.max}" step="${options.step}" value="${options.value}">
                <span class="range-stepper" data-stepper-for="${options.id}">
                  <input class="range-stepper__input" type="number" min="${options.min}" max="${options.max}" step="${options.step}" value="${options.value}" aria-label="${options.label} value">
                  <span class="range-stepper__buttons">
                    <button class="range-stepper__button range-stepper__button--up" type="button" tabindex="-1" data-stepper-delta="1" aria-label="Increase ${options.label}" title="Increase ${options.label}"></button>
                    <button class="range-stepper__button range-stepper__button--down" type="button" tabindex="-1" data-stepper-delta="-1" aria-label="Decrease ${options.label}" title="Decrease ${options.label}"></button>
                  </span>
                </span>
                <span id="${options.readoutId}" class="readout">${options.readout}</span>
                <small class="control-hint">${options.hint}</small>
              </div>`;
}
