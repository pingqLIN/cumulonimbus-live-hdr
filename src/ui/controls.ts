import { type CloudAppController } from "../app/cloud-app.js";
import {
  SAFE_LIVE_MAX_PIXELS,
  resolvePreset,
  type RuntimeOptions
} from "../app/runtime-options.js";

const QUALITY_MAX_PIXELS = SAFE_LIVE_MAX_PIXELS;

export function bindControls(root: ParentNode, app: CloudAppController): void {
  const elements = collectControls(root);
  syncControls(elements, app.getOptions(), app.isPaused());

  elements.landscapeButton?.addEventListener("click", () => {
    app.setOrientation("landscape");
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  elements.portraitButton?.addEventListener("click", () => {
    app.setOrientation("portrait");
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  elements.fullscreenButton?.addEventListener("click", () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void document.documentElement.requestFullscreen();
  });
  elements.toggleOtherPanelsButton?.addEventListener("click", () => toggleSecondaryPanels(root));
  elements.gridButton?.addEventListener("click", () => {
    const next = !app.getOptions().showGrid;
    app.setOptions({ showGrid: next });
    elements.gridButton?.classList.toggle("enabled", next);
  });
  elements.cameraModeButton?.addEventListener("click", () => {
    const next = !app.getOptions().ortho;
    app.setOptions({ ortho: next });
    if (elements.cameraModeButton) {
      elements.cameraModeButton.textContent = next ? "Ortho" : "Perspective";
      elements.cameraModeButton.classList.toggle("enabled", next);
    }
  });
  elements.resetCameraButton?.addEventListener("click", () => app.recenter());
  elements.randomSeedButton?.addEventListener("click", () => {
    const seed = app.randomizeSeed();
    if (elements.seedInput) {
      elements.seedInput.value = String(seed);
    }
  });
  elements.hdr10Button?.addEventListener("click", () => {
    const next = !app.getOptions().hdr10;
    app.setOptions({ hdr10: next });
    elements.hdr10Button?.classList.toggle("enabled", next);
  });
  elements.timeToggleButton?.addEventListener("click", () => {
    const paused = app.togglePaused();
    setPlaybackButton(elements.timeToggleButton, paused);
  });
  elements.timeResetButton?.addEventListener("click", () => app.setOptions({ time: 2.2 }));
  elements.presetSelect?.addEventListener("change", () => {
    const presetName = elements.presetSelect?.value ?? "single-cumulus-day";
    app.setOptions({
      ...resolvePreset(presetName),
      presetName,
      presetSource: "query"
    });
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  elements.surfaceSelect?.addEventListener("change", () => {
    const value = elements.surfaceSelect?.value;
    app.setOptions({ surfaceMode: value === "ocean" || value === "hills" ? value : "none" });
  });

  bindNumberInput(elements.seedInput, (value) => app.setOptions({ seed: Math.max(1, Math.round(value)) }));
  bindSlider(elements.systemsSlider, elements.systemsReadout, (value) => value.toFixed(0), (value) =>
    app.setOptions({ systems: Math.round(value) })
  );
  bindSlider(elements.qualitySlider, elements.qualityReadout, (value) => `${value.toFixed(2)}x`, (value) =>
    app.setOptions({ maxPixels: Math.round(QUALITY_MAX_PIXELS * value * value) })
  );
  bindSlider(elements.tropoSlider, elements.tropoReadout, (value) => `${value.toFixed(1)}km`, (value) =>
    app.setOptions({ tropopause: value })
  );
  bindSlider(elements.freezingSlider, elements.freezingReadout, (value) => `${value.toFixed(1)}km`, (value) =>
    app.setOptions({ freezingLevel: value })
  );
  bindSlider(elements.shearSlider, elements.shearReadout, (value) => value.toFixed(2), (value) =>
    app.setOptions({ windShear: value })
  );
  bindSlider(elements.sunSlider, elements.sunReadout, (value) => value.toFixed(1), (value) =>
    app.setOptions({ sunIntensity: value })
  );
  bindSlider(elements.sunElevationSlider, elements.sunElevationReadout, (value) => `${value.toFixed(0)}deg`, (value) =>
    app.setOptions({ sunElevation: value })
  );
  bindSlider(elements.ambientSlider, elements.ambientReadout, (value) => value.toFixed(2), (value) =>
    app.setOptions({ ambientIntensity: value })
  );
  bindSlider(elements.sunAngleSlider, elements.sunAngleReadout, (value) => `${value.toFixed(0)}deg`, (value) =>
    app.setOptions({ sunViewerAngle: value })
  );
  bindSlider(elements.timeSlider, elements.timeReadout, (value) => `${value.toFixed(1)}x`, (value) =>
    app.setOptions({ timeScale: value })
  );
}

function collectControls(root: ParentNode) {
  return {
    landscapeButton: root.querySelector<HTMLButtonElement>("#btn-landscape"),
    portraitButton: root.querySelector<HTMLButtonElement>("#btn-portrait"),
    fullscreenButton: root.querySelector<HTMLButtonElement>("#btn-fullscreen"),
    toggleOtherPanelsButton: root.querySelector<HTMLButtonElement>("#btn-toggle-other-panels"),
    gridButton: root.querySelector<HTMLButtonElement>("#btn-grid"),
    cameraModeButton: root.querySelector<HTMLButtonElement>("#btn-cam-mode"),
    resetCameraButton: root.querySelector<HTMLButtonElement>("#btn-reset-cam"),
    presetSelect: root.querySelector<HTMLSelectElement>("#select-preset"),
    surfaceSelect: root.querySelector<HTMLSelectElement>("#select-surface"),
    seedInput: root.querySelector<HTMLInputElement>("#input-seed"),
    randomSeedButton: root.querySelector<HTMLButtonElement>("#btn-random-seed"),
    systemsSlider: root.querySelector<HTMLInputElement>("#slider-systems"),
    systemsReadout: root.querySelector<HTMLElement>("#systems-readout"),
    qualitySlider: root.querySelector<HTMLInputElement>("#slider-quality"),
    qualityReadout: root.querySelector<HTMLElement>("#quality-readout"),
    hdr10Button: root.querySelector<HTMLButtonElement>("#btn-hdr10"),
    tropoSlider: root.querySelector<HTMLInputElement>("#slider-tropo"),
    tropoReadout: root.querySelector<HTMLElement>("#tropo-readout"),
    freezingSlider: root.querySelector<HTMLInputElement>("#slider-freezing"),
    freezingReadout: root.querySelector<HTMLElement>("#freezing-readout"),
    shearSlider: root.querySelector<HTMLInputElement>("#slider-shear"),
    shearReadout: root.querySelector<HTMLElement>("#shear-readout"),
    sunSlider: root.querySelector<HTMLInputElement>("#slider-sun"),
    sunReadout: root.querySelector<HTMLElement>("#sun-readout"),
    sunElevationSlider: root.querySelector<HTMLInputElement>("#slider-sun-elevation"),
    sunElevationReadout: root.querySelector<HTMLElement>("#sun-elevation-readout"),
    ambientSlider: root.querySelector<HTMLInputElement>("#slider-ambient"),
    ambientReadout: root.querySelector<HTMLElement>("#ambient-readout"),
    sunAngleSlider: root.querySelector<HTMLInputElement>("#slider-sun-angle"),
    sunAngleReadout: root.querySelector<HTMLElement>("#sun-angle-readout"),
    timeSlider: root.querySelector<HTMLInputElement>("#slider-time"),
    timeReadout: root.querySelector<HTMLElement>("#time-readout"),
    timeToggleButton: root.querySelector<HTMLButtonElement>("#btn-time-toggle"),
    timeResetButton: root.querySelector<HTMLButtonElement>("#btn-time-reset")
  };
}

function syncControls(
  elements: ReturnType<typeof collectControls>,
  options: RuntimeOptions,
  paused: boolean
): void {
  setActive(elements.landscapeButton, options.orientation === "landscape");
  setActive(elements.portraitButton, options.orientation === "portrait");
  setValue(elements.presetSelect, options.presetName ?? "single-cumulus-day");
  setValue(elements.surfaceSelect, options.surfaceMode ?? "none");
  setValue(elements.seedInput, String(options.seed ?? 574));
  setValue(elements.systemsSlider, String(options.systems ?? 1));
  setValue(elements.tropoSlider, String(options.tropopause ?? 11.2));
  setValue(elements.freezingSlider, String(options.freezingLevel ?? 4.4));
  setValue(elements.shearSlider, String(options.windShear ?? 0.42));
  setValue(elements.sunSlider, String(options.sunIntensity ?? 7.4));
  setValue(elements.sunElevationSlider, String(options.sunElevation ?? 62));
  setValue(elements.ambientSlider, String(options.ambientIntensity ?? 0.66));
  setValue(elements.sunAngleSlider, String(options.sunViewerAngle ?? 18));
  setValue(elements.timeSlider, String(options.timeScale ?? 1));
  setValue(
    elements.qualitySlider,
    String(Math.sqrt((options.maxPixels ?? QUALITY_MAX_PIXELS) / QUALITY_MAX_PIXELS).toFixed(2))
  );
  updateText(elements.systemsReadout, String(options.systems ?? 1));
  updateText(elements.tropoReadout, `${(options.tropopause ?? 11.2).toFixed(1)}km`);
  updateText(elements.freezingReadout, `${(options.freezingLevel ?? 4.4).toFixed(1)}km`);
  updateText(elements.shearReadout, (options.windShear ?? 0.42).toFixed(2));
  updateText(elements.sunReadout, (options.sunIntensity ?? 7.4).toFixed(1));
  updateText(elements.sunElevationReadout, `${(options.sunElevation ?? 62).toFixed(0)}deg`);
  updateText(elements.ambientReadout, (options.ambientIntensity ?? 0.66).toFixed(2));
  updateText(elements.sunAngleReadout, `${(options.sunViewerAngle ?? 18).toFixed(0)}deg`);
  updateText(elements.timeReadout, `${(options.timeScale ?? 1).toFixed(1)}x`);
  updateText(
    elements.qualityReadout,
    `${Math.sqrt((options.maxPixels ?? QUALITY_MAX_PIXELS) / QUALITY_MAX_PIXELS).toFixed(2)}x`
  );
  setPlaybackButton(elements.timeToggleButton, paused);
  if (elements.cameraModeButton) {
    elements.cameraModeButton.textContent = options.ortho ? "Ortho" : "Perspective";
    elements.cameraModeButton.classList.toggle("enabled", options.ortho ?? false);
  }
  elements.gridButton?.classList.toggle("enabled", options.showGrid ?? false);
  elements.hdr10Button?.classList.toggle("enabled", options.hdr10 ?? false);
}

function toggleSecondaryPanels(root: ParentNode): void {
  const panels = ["timePanel", "cloudPanel", "atmospherePanel"]
    .map((key) => root.querySelector<HTMLElement>(`[data-panel-key="${key}"]`))
    .filter((panel): panel is HTMLElement => Boolean(panel));
  const shouldShow = panels.some((panel) => panel.hidden);
  for (const panel of panels) {
    panel.hidden = !shouldShow;
  }
  enableRestoreDock(root);
  updateRestoreDock(root);
}

export function enableRestoreDock(root: ParentNode): void {
  const dock = root.querySelector<HTMLElement>("#panel-restore-dock");
  if (dock) {
    delete dock.dataset.restoreSuppressed;
  }
}

export function updateRestoreDock(root: ParentNode): void {
  const dock = root.querySelector<HTMLElement>("#panel-restore-dock");
  if (!dock) {
    return;
  }
  if (dock.dataset.restoreSuppressed === "true") {
    dock.hidden = true;
    return;
  }
  let hasHiddenItem = false;
  for (const button of dock.querySelectorAll<HTMLButtonElement>("[data-panel-restore]")) {
    const panel = root.querySelector<HTMLElement>(`[data-panel-key="${button.dataset.panelRestore}"]`);
    const isHidden = Boolean(panel?.hidden);
    button.hidden = !isHidden;
    hasHiddenItem ||= isHidden;
  }
  const hudButton = dock.querySelector<HTMLButtonElement>("[data-hud-restore]");
  const hudHidden = root.querySelector<HTMLElement>("#cloud-hud")?.hidden ?? false;
  if (hudButton) {
    hudButton.hidden = !hudHidden;
    hasHiddenItem ||= hudHidden;
  }
  dock.hidden = !hasHiddenItem;
}

function bindSlider(
  slider: HTMLInputElement | null,
  readout: HTMLElement | null,
  format: (value: number) => string,
  onValue: (value: number) => void
): void {
  slider?.addEventListener("input", () => {
    const value = Number(slider.value);
    if (!Number.isFinite(value)) {
      return;
    }
    updateText(readout, format(value));
    onValue(value);
  });
}

function bindNumberInput(
  input: HTMLInputElement | null,
  onValue: (value: number) => void
): void {
  input?.addEventListener("change", () => {
    const value = Number(input.value);
    if (Number.isFinite(value)) {
      onValue(value);
    }
  });
}

function setValue(element: HTMLInputElement | HTMLSelectElement | null, value: string): void {
  if (element) {
    element.value = value;
  }
}

function setActive(element: HTMLElement | null, active: boolean): void {
  element?.classList.toggle("active", active);
  element?.setAttribute("aria-pressed", active ? "true" : "false");
}

function setPlaybackButton(element: HTMLElement | null, paused: boolean): void {
  updateText(element, paused ? "Resume" : "Pause");
  element?.classList.toggle("enabled", paused);
  element?.setAttribute("aria-pressed", paused ? "true" : "false");
}

function updateText(element: HTMLElement | null, value: string): void {
  if (element) {
    element.textContent = value;
  }
}
