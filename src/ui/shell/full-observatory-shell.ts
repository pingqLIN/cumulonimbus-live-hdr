import { type Orientation, type RenderMode } from "../../app/runtime-options.js";
import {
  renderAdvancedPanel,
  renderAtmospherePanel,
  renderCloudPanel,
  renderMainPanel,
  renderTimePanel
} from "./control-panels.js";
import { renderHudPanel } from "./hud-panel.js";
import { renderRestoreDock } from "./restore-dock.js";

export type ShellRenderOptions = {
  readonly orientation: Orientation;
  readonly renderMode: RenderMode;
  readonly compactControls: boolean;
  readonly controlsVisible: boolean;
  readonly showAdvancedPanel: boolean;
  readonly degradedPreview: boolean;
};

export function buildFullObservatoryShell(options: ShellRenderOptions): string {
  const controlsHidden =
    options.degradedPreview || !options.controlsVisible || options.renderMode === "canvas";
  const uiHiddenAttribute = controlsHidden ? " hidden" : "";
  const cloudPanelHidden = controlsHidden || options.compactControls;
  const timePanelHidden = controlsHidden || options.compactControls;
  const atmospherePanelHidden = controlsHidden || options.compactControls;
  const advancedPanelHidden =
    controlsHidden || options.compactControls || !options.showAdvancedPanel;
  const hiddenControlsState = controlsHidden ? "true" : "false";

  return `
    <div id="cumulonimbus-app" class="cloud-app-shell" data-render-mode="${options.renderMode}" data-controls-hidden="${hiddenControlsState}" data-preview-mode="${options.degradedPreview ? "degraded" : "standard"}">
      <div id="stage-edge-fill" class="stage-edge-fill" aria-hidden="true"></div>
      <main id="render-container" class="render-stage viewport-fullscreen viewport-${options.orientation}" aria-label="Cumulonimbus cloud render">
        <canvas id="cloud-canvas" tabindex="0" aria-label="Live cumulonimbus cloud renderer. Left drag, one-finger touch, or arrow keys orbit; wheel, pinch, or plus/minus zoom; right drag, shift plus drag, or two-finger touch pans."></canvas>
${options.degradedPreview ? renderDegradedPreviewNotice() : renderHudPanel(options.orientation, controlsHidden)}
      </main>

      ${
        options.degradedPreview
          ? ""
          : `
      <div id="ui-bar" class="control-surface" aria-label="Control panels"${uiHiddenAttribute}>
${renderMainPanel()}
${renderTimePanel(timePanelHidden)}
${renderCloudPanel(cloudPanelHidden)}
${renderAtmospherePanel(atmospherePanelHidden)}
${options.showAdvancedPanel ? renderAdvancedPanel(advancedPanelHidden) : ""}
      </div>
${renderRestoreDock(options.compactControls, options.showAdvancedPanel)}
`
      }
    </div>
  `;
}

function renderDegradedPreviewNotice(): string {
  return `
        <aside id="degraded-preview-notice" class="degraded-preview-notice" role="status" aria-live="polite">
          <span>由於硬體、瀏覽器或目前系統資源限制，目前顯示降級預覽圖。</span>
          <button id="btn-degraded-refresh" class="degraded-preview-notice__button" type="button">重新整理</button>
          <span>建議關閉其他應用程式或分頁後再試。</span>
        </aside>`;
}
