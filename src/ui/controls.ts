import { type CloudAppController, type RenderStats } from "../app/cloud-app.js";
import {
  createMobileQualityPatch,
  getMobileQualitySettings,
  getNextMobileQualityTier,
  SAFE_LIVE_MAX_PIXELS,
  type RuntimeOptions
} from "../app/runtime-options.js";

const QUALITY_MAX_PIXELS = SAFE_LIVE_MAX_PIXELS;
const MOBILE_AUTO_INITIAL_DELAY_MS = 900;
const MOBILE_AUTO_STEP_DELAY_MS = 1400;
const MOBILE_AUTO_RECHECK_DELAY_MS = 2600;
const MOBILE_AUTO_READY_SETTLE_MS = 3000;
const MOBILE_AUTO_STABLE_FRAME_COUNT = 4;
let uiLanguage = "zh-TW";
let renderTelemetryFrame: number | undefined;

export function bindControls(root: ParentNode, app: CloudAppController): void {
  const elements = collectControls(root);
  configureLocationSync(elements);
  syncControls(elements, app.getOptions(), app.isPaused());
  startRenderTelemetry(elements, app);
  const restartMobileAutoQuality = bindMobileAutoQuality(elements, app);

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
  elements.ditherButton?.addEventListener("click", () => {
    const next = !app.getOptions().dither;
    app.setOptions({ dither: next });
    elements.ditherButton?.classList.toggle("enabled", next);
  });
  elements.autoQualityButton?.addEventListener("click", () => {
    const enabled = !elements.autoQualityButton?.classList.contains("enabled");
    app.setOptions({
      ...(enabled ? createMobileQualityPatch("low") : {}),
      autoQuality: enabled
    });
    syncControls(elements, app.getOptions(), app.isPaused());
    restartMobileAutoQuality();
  });
  elements.timeToggleButton?.addEventListener("click", () => {
    const paused = app.togglePaused();
    setPlaybackButton(elements.timeToggleButton, paused);
    setDockPlaybackButton(elements.dockTimeToggleButton, paused);
    updateFpsLine(elements.fpsCounter, app.getOptions(), paused, elements, app.getRenderStats());
  });
  elements.dockTimeToggleButton?.addEventListener("click", () => {
    const paused = app.togglePaused();
    setPlaybackButton(elements.timeToggleButton, paused);
    setDockPlaybackButton(elements.dockTimeToggleButton, paused);
    updateFpsLine(elements.fpsCounter, app.getOptions(), paused, elements, app.getRenderStats());
  });
  elements.timeResetButton?.addEventListener("click", () => app.setOptions({ time: 2.2 }));
  elements.syncSystemTimeButton?.addEventListener("click", () => {
    const now = syncAtmosphereToSystemTime(elements, app);
    elements.syncSystemTimeButton?.classList.add("enabled");
    updateText(elements.syncStatus, `System time ${now.toLocaleTimeString()}`);
    if (elements.syncStatus) {
      elements.syncStatus.hidden = false;
    }
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  elements.syncTimeCheckbox?.addEventListener("change", () => {
    if (!elements.syncTimeCheckbox?.checked) {
      if (elements.syncStatus) {
        elements.syncStatus.hidden = true;
      }
      return;
    }
    syncAtmosphereToSystemTime(elements, app);
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  elements.linkSunElevationButton?.addEventListener("click", () =>
    toggleSunElevationLink(elements)
  );
  elements.linkElevationSunButton?.addEventListener("click", () =>
    toggleSunElevationLink(elements)
  );
  elements.languageSelect?.addEventListener("change", () => {
    uiLanguage = elements.languageSelect?.value ?? "zh-TW";
    document.documentElement.lang = uiLanguage;
  });
  elements.surfaceSelect?.addEventListener("change", () => {
    const value = elements.surfaceSelect?.value;
    app.setOptions({ surfaceMode: value === "ocean" || value === "hills" ? value : "none" });
  });

  bindNumberInput(elements.seedInput, (value) =>
    app.setOptions({ seed: Math.max(1, Math.round(value)) })
  );
  bindSlider(
    elements.systemsSlider,
    elements.systemsReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ systems: Math.round(value) })
  );
  bindSlider(
    elements.qualitySlider,
    elements.qualityReadout,
    (value) => `${value.toFixed(2)}x`,
    (value) => applyRenderPowerScale(elements, app, value),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.advancedQualitySlider,
    elements.advancedQualityReadout,
    (value) => `${value.toFixed(2)}x`,
    (value) => applyRenderPowerScale(elements, app, value),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.tropoSlider,
    elements.tropoReadout,
    (value) => `${value.toFixed(1)}km`,
    (value) => app.setOptions({ tropopause: value }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.freezingSlider,
    elements.freezingReadout,
    (value) => `${value.toFixed(1)}km`,
    (value) => app.setOptions({ freezingLevel: value }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.shearSlider,
    elements.shearReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ windShear: value }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.sunSlider,
    elements.sunReadout,
    (value) => value.toFixed(1),
    (value) => app.setOptions({ sunIntensity: value }),
    () => updateAtmosphereWidget(elements, app.getOptions())
  );
  bindSlider(
    elements.sunElevationSlider,
    elements.sunElevationReadout,
    (value) => `${value.toFixed(0)}deg`,
    (value) => app.setOptions(resolveLinkedSunPatch(elements, value)),
    () => updateAtmosphereWidget(elements, app.getOptions())
  );
  bindSlider(
    elements.ambientSlider,
    elements.ambientReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ ambientIntensity: value }),
    () => updateAtmosphereWidget(elements, app.getOptions())
  );
  bindSlider(
    elements.sunAngleSlider,
    elements.sunAngleReadout,
    (value) => `${value.toFixed(0)}deg`,
    (value) => app.setOptions({ sunViewerAngle: value }),
    () => updateAtmosphereWidget(elements, app.getOptions())
  );
  bindAtmosphereTimeInput(elements.atmosphereTimeInput, (value) => {
    app.setOptions(resolveAtmosphereTimePatch(value));
    syncControls(elements, app.getOptions(), app.isPaused());
  });
  bindAtmosphereSunDrag(elements, app);
  bindSlider(
    elements.timeSlider,
    elements.timeReadout,
    (value) => `${value.toFixed(1)}x`,
    (value) => app.setOptions({ timeScale: value }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.stepSizeSlider,
    elements.stepSizeReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ stepSize: value }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.maxStepsSlider,
    elements.maxStepsReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ maxSteps: Math.round(value) }),
    () => updateFpsLine(elements.fpsCounter, app.getOptions(), app.isPaused(), elements)
  );
  bindSlider(
    elements.staticMaxStepsSlider,
    elements.staticMaxStepsReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ staticMaxSteps: Math.round(value) }),
    undefined,
    "change"
  );
  bindSlider(
    elements.earlyExitSlider,
    elements.earlyExitReadout,
    (value) => value.toFixed(3),
    (value) => app.setOptions({ earlyExitAlpha: value })
  );
  bindSlider(
    elements.shadowSamplesSlider,
    elements.shadowSamplesReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ shadowSamples: Math.round(value) })
  );
  bindSlider(
    elements.shadowStepSlider,
    elements.shadowStepReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ shadowStep: value })
  );
  bindSlider(
    elements.shadowOcclusionSlider,
    elements.shadowOcclusionReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ shadowOcclusion: value })
  );
  bindSlider(
    elements.densityMultiplierSlider,
    elements.densityMultiplierReadout,
    (value) => value.toFixed(1),
    (value) => app.setOptions({ densityMultiplier: value })
  );
  bindSlider(
    elements.carvingWeightSlider,
    elements.carvingWeightReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ carvingWeight: value })
  );
  bindSlider(
    elements.edgeErosionSlider,
    elements.edgeErosionReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ edgeErosionWeight: value })
  );
  bindSlider(
    elements.fbmOctavesSlider,
    elements.fbmOctavesReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ fbmOctaves: Math.round(value) })
  );
  bindSlider(
    elements.cloudCurlSlider,
    elements.cloudCurlReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ cloudCurl: value })
  );
  bindSlider(
    elements.surfaceShadowSamplesSlider,
    elements.surfaceShadowSamplesReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ surfaceShadowSamples: Math.round(value) })
  );
  bindSlider(
    elements.surfaceShadowStepSlider,
    elements.surfaceShadowStepReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ surfaceShadowStep: value })
  );
  bindSlider(
    elements.surfaceShadowStrengthSlider,
    elements.surfaceShadowStrengthReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ surfaceShadowStrength: value })
  );
  bindSlider(
    elements.terrainFuzzSlider,
    elements.terrainFuzzReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ terrainFuzz: value })
  );
  bindSlider(
    elements.surfaceRadiusSlider,
    elements.surfaceRadiusReadout,
    (value) => `${value.toFixed(1)}km`,
    (value) => app.setOptions({ surfaceRadius: value })
  );
  bindSlider(
    elements.oceanCrestSlider,
    elements.oceanCrestReadout,
    (value) => value.toFixed(2),
    (value) => app.setOptions({ oceanCrestStrength: value })
  );
  bindSlider(
    elements.cameraYawSlider,
    elements.cameraYawReadout,
    (value) => `${value.toFixed(0)}deg`,
    (value) => app.setOptions({ cameraYawDegrees: value })
  );
  bindSlider(
    elements.cameraPitchSlider,
    elements.cameraPitchReadout,
    (value) => `${value.toFixed(0)}deg`,
    (value) => app.setOptions({ cameraPitchDegrees: value })
  );
  bindSlider(
    elements.cameraDistanceSlider,
    elements.cameraDistanceReadout,
    (value) => value.toFixed(0),
    (value) => app.setOptions({ cameraDistance: value })
  );

  restartMobileAutoQuality();
}

function collectControls(root: ParentNode) {
  return {
    landscapeButton: root.querySelector<HTMLButtonElement>("#btn-landscape"),
    portraitButton: root.querySelector<HTMLButtonElement>("#btn-portrait"),
    fullscreenButton: root.querySelector<HTMLButtonElement>("#btn-fullscreen"),
    toggleOtherPanelsButton: root.querySelector<HTMLButtonElement>("#btn-toggle-other-panels"),
    gridButton: root.querySelector<HTMLButtonElement>("#btn-grid"),
    languageSelect: root.querySelector<HTMLSelectElement>("#select-language"),
    surfaceSelect: root.querySelector<HTMLSelectElement>("#select-surface"),
    seedInput: root.querySelector<HTMLInputElement>("#input-seed"),
    randomSeedButton: root.querySelector<HTMLButtonElement>("#btn-random-seed"),
    systemsSlider: root.querySelector<HTMLInputElement>("#slider-systems"),
    systemsReadout: root.querySelector<HTMLElement>("#systems-readout"),
    qualitySlider: root.querySelector<HTMLInputElement>("#slider-quality"),
    qualityReadout: root.querySelector<HTMLElement>("#quality-readout"),
    hdr10Button: root.querySelector<HTMLButtonElement>("#btn-hdr10"),
    ditherButton: root.querySelector<HTMLButtonElement>("#btn-dither"),
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
    atmosphereTimeInput: root.querySelector<HTMLInputElement>("#input-atmosphere-time"),
    timeSlider: root.querySelector<HTMLInputElement>("#slider-time"),
    timeReadout: root.querySelector<HTMLElement>("#time-readout"),
    timeToggleButton: root.querySelector<HTMLButtonElement>("#btn-time-toggle"),
    timeResetButton: root.querySelector<HTMLButtonElement>("#btn-time-reset"),
    syncSystemTimeButton: root.querySelector<HTMLButtonElement>("#btn-sync-system-time"),
    syncLocationButton: root.querySelector<HTMLButtonElement>("#btn-sync-location"),
    syncTimeCheckbox: root.querySelector<HTMLInputElement>("#checkbox-sync-time"),
    syncStatus: root.querySelector<HTMLElement>("#sync-status"),
    dockTimeToggleButton: root.querySelector<HTMLButtonElement>("#dock-time-toggle"),
    autoQualityButton: root.querySelector<HTMLButtonElement>("#btn-auto-quality"),
    linkSunElevationButton: root.querySelector<HTMLButtonElement>("#btn-link-sun-elevation"),
    linkElevationSunButton: root.querySelector<HTMLButtonElement>("#btn-link-elevation-sun"),
    atmosphereCanvas: root.querySelector<HTMLCanvasElement>("#atm-canvas"),
    advancedQualitySlider: root.querySelector<HTMLInputElement>("#slider-advanced-quality"),
    advancedQualityReadout: root.querySelector<HTMLElement>("#advanced-quality-readout"),
    stepSizeSlider: root.querySelector<HTMLInputElement>("#slider-step-size"),
    stepSizeReadout: root.querySelector<HTMLElement>("#step-size-readout"),
    maxStepsSlider: root.querySelector<HTMLInputElement>("#slider-max-steps"),
    maxStepsReadout: root.querySelector<HTMLElement>("#max-steps-readout"),
    staticMaxStepsSlider: root.querySelector<HTMLInputElement>("#slider-static-max-steps"),
    staticMaxStepsReadout: root.querySelector<HTMLElement>("#static-max-steps-readout"),
    earlyExitSlider: root.querySelector<HTMLInputElement>("#slider-early-exit"),
    earlyExitReadout: root.querySelector<HTMLElement>("#early-exit-readout"),
    shadowSamplesSlider: root.querySelector<HTMLInputElement>("#slider-shadow-samples"),
    shadowSamplesReadout: root.querySelector<HTMLElement>("#shadow-samples-readout"),
    shadowStepSlider: root.querySelector<HTMLInputElement>("#slider-shadow-step"),
    shadowStepReadout: root.querySelector<HTMLElement>("#shadow-step-readout"),
    shadowOcclusionSlider: root.querySelector<HTMLInputElement>("#slider-shadow-occlusion"),
    shadowOcclusionReadout: root.querySelector<HTMLElement>("#shadow-occlusion-readout"),
    densityMultiplierSlider: root.querySelector<HTMLInputElement>("#slider-density-multiplier"),
    densityMultiplierReadout: root.querySelector<HTMLElement>("#density-multiplier-readout"),
    carvingWeightSlider: root.querySelector<HTMLInputElement>("#slider-carving-weight"),
    carvingWeightReadout: root.querySelector<HTMLElement>("#carving-weight-readout"),
    edgeErosionSlider: root.querySelector<HTMLInputElement>("#slider-edge-erosion"),
    edgeErosionReadout: root.querySelector<HTMLElement>("#edge-erosion-readout"),
    fbmOctavesSlider: root.querySelector<HTMLInputElement>("#slider-fbm-octaves"),
    fbmOctavesReadout: root.querySelector<HTMLElement>("#fbm-octaves-readout"),
    cloudCurlSlider: root.querySelector<HTMLInputElement>("#slider-cloud-curl"),
    cloudCurlReadout: root.querySelector<HTMLElement>("#cloud-curl-readout"),
    surfaceShadowSamplesSlider: root.querySelector<HTMLInputElement>(
      "#slider-surface-shadow-samples"
    ),
    surfaceShadowSamplesReadout: root.querySelector<HTMLElement>("#surface-shadow-samples-readout"),
    surfaceShadowStepSlider: root.querySelector<HTMLInputElement>("#slider-surface-shadow-step"),
    surfaceShadowStepReadout: root.querySelector<HTMLElement>("#surface-shadow-step-readout"),
    surfaceShadowStrengthSlider: root.querySelector<HTMLInputElement>(
      "#slider-surface-shadow-strength"
    ),
    surfaceShadowStrengthReadout: root.querySelector<HTMLElement>(
      "#surface-shadow-strength-readout"
    ),
    terrainFuzzSlider: root.querySelector<HTMLInputElement>("#slider-terrain-fuzz"),
    terrainFuzzReadout: root.querySelector<HTMLElement>("#terrain-fuzz-readout"),
    surfaceRadiusSlider: root.querySelector<HTMLInputElement>("#slider-surface-radius"),
    surfaceRadiusReadout: root.querySelector<HTMLElement>("#surface-radius-readout"),
    oceanCrestSlider: root.querySelector<HTMLInputElement>("#slider-ocean-crest"),
    oceanCrestReadout: root.querySelector<HTMLElement>("#ocean-crest-readout"),
    cameraYawSlider: root.querySelector<HTMLInputElement>("#slider-camera-yaw"),
    cameraYawReadout: root.querySelector<HTMLElement>("#camera-yaw-readout"),
    cameraPitchSlider: root.querySelector<HTMLInputElement>("#slider-camera-pitch"),
    cameraPitchReadout: root.querySelector<HTMLElement>("#camera-pitch-readout"),
    cameraDistanceSlider: root.querySelector<HTMLInputElement>("#slider-camera-distance"),
    cameraDistanceReadout: root.querySelector<HTMLElement>("#camera-distance-readout"),
    elevationValue: root.querySelector<HTMLElement>("#dash-elev-val"),
    elevationFill: root.querySelector<HTMLElement>("#dash-elev-fill"),
    directValue: root.querySelector<HTMLElement>("#dash-dir-val"),
    directFill: root.querySelector<HTMLElement>("#dash-dir-fill"),
    diffuseValue: root.querySelector<HTMLElement>("#dash-dif-val"),
    diffuseFill: root.querySelector<HTMLElement>("#dash-dif-fill"),
    fpsCounter: root.querySelector<HTMLElement>("#fps-counter"),
    cloudCanvas: root.querySelector<HTMLCanvasElement>("#cloud-canvas")
  };
}

function configureLocationSync(elements: ReturnType<typeof collectControls>): void {
  if (!elements.syncLocationButton) {
    return;
  }
  elements.syncLocationButton.disabled = true;
  elements.syncLocationButton.classList.remove("enabled");
  elements.syncLocationButton.setAttribute("aria-disabled", "true");
  elements.syncLocationButton.title = "Location sync is not connected";
}

function startRenderTelemetry(
  elements: ReturnType<typeof collectControls>,
  app: CloudAppController
): void {
  if (renderTelemetryFrame !== undefined) {
    cancelAnimationFrame(renderTelemetryFrame);
  }
  let lastUpdate = 0;
  const tick = (now: number): void => {
    if (now - lastUpdate >= 500) {
      lastUpdate = now;
      updateFpsLine(
        elements.fpsCounter,
        app.getOptions(),
        app.isPaused(),
        elements,
        app.getRenderStats()
      );
    }
    renderTelemetryFrame = requestAnimationFrame(tick);
  };
  renderTelemetryFrame = requestAnimationFrame(tick);
}

function bindMobileAutoQuality(
  elements: ReturnType<typeof collectControls>,
  app: CloudAppController
): () => void {
  let timer: number | undefined;
  let readySince: number | undefined;
  let lastUpgradeFrameCount = 0;

  const clearTimer = (): void => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  const shouldRun = (): boolean => {
    const options = app.getOptions();
    return options.displayProfile.mobileWideView && options.autoQuality;
  };

  const schedule = (delayMs = MOBILE_AUTO_INITIAL_DELAY_MS): void => {
    clearTimer();
    if (!shouldRun()) {
      return;
    }
    timer = window.setTimeout(evaluate, delayMs);
  };

  const evaluate = (): void => {
    timer = undefined;
    const options = app.getOptions();
    if (!shouldRun()) {
      return;
    }
    if (document.documentElement.dataset.renderStatus !== "ready") {
      readySince = undefined;
      schedule(500);
      return;
    }

    const currentTier = options.qualityTier ?? "low";
    const currentSettings = getMobileQualitySettings(currentTier);
    const nextTier = getNextMobileQualityTier(currentTier);
    if (!nextTier) {
      syncControls(elements, options, app.isPaused());
      return;
    }

    const stats = app.getRenderStats();
    const now = performance.now();
    readySince ??= now;
    if (
      now - readySince < MOBILE_AUTO_READY_SETTLE_MS ||
      stats.frameCount - lastUpgradeFrameCount < MOBILE_AUTO_STABLE_FRAME_COUNT
    ) {
      schedule(MOBILE_AUTO_RECHECK_DELAY_MS);
      return;
    }

    const frameMs = stats.averageFrameDurationMs ?? stats.lastFrameDurationMs;
    if (frameMs === undefined || !Number.isFinite(frameMs)) {
      schedule(MOBILE_AUTO_RECHECK_DELAY_MS);
      return;
    }

    if (frameMs <= currentSettings.upgradeFrameBudgetMs) {
      app.setOptions({
        ...createRuntimeMobileQualityPatch(nextTier),
        autoQuality: true
      });
      lastUpgradeFrameCount = app.getRenderStats().frameCount;
      syncControls(elements, app.getOptions(), app.isPaused());
      schedule(MOBILE_AUTO_STEP_DELAY_MS);
      return;
    }

    schedule(MOBILE_AUTO_RECHECK_DELAY_MS);
  };

  return schedule;
}

function createRuntimeMobileQualityPatch(
  tier: Parameters<typeof createMobileQualityPatch>[0]
): Partial<RuntimeOptions> {
  const { staticMaxSteps, ...runtimePatch } = createMobileQualityPatch(tier);
  void staticMaxSteps;
  return runtimePatch;
}

function syncControls(
  elements: ReturnType<typeof collectControls>,
  options: RuntimeOptions,
  paused: boolean
): void {
  const qualityScale = resolveQualityScale(options);
  document.documentElement.lang = uiLanguage;
  setActive(elements.landscapeButton, options.orientation === "landscape");
  setActive(elements.portraitButton, options.orientation === "portrait");
  setValue(elements.languageSelect, uiLanguage);
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
  setValue(elements.atmosphereTimeInput, formatAtmosphereTime(estimateAtmosphereTime(options)));
  setValue(elements.timeSlider, String(options.timeScale ?? 1));
  setValue(elements.qualitySlider, qualityScale.toFixed(2));
  setValue(elements.advancedQualitySlider, qualityScale.toFixed(2));
  setValue(elements.stepSizeSlider, String(options.stepSize ?? 0.24));
  setValue(elements.maxStepsSlider, String(options.maxSteps ?? 40));
  setValue(elements.staticMaxStepsSlider, String(options.staticMaxSteps ?? 40));
  setValue(elements.earlyExitSlider, String(options.earlyExitAlpha ?? 0.955));
  setValue(elements.shadowSamplesSlider, String(options.shadowSamples ?? 3));
  setValue(elements.shadowStepSlider, String(options.shadowStep ?? 0.34));
  setValue(elements.shadowOcclusionSlider, String(options.shadowOcclusion ?? 1));
  setValue(elements.densityMultiplierSlider, String(options.densityMultiplier ?? 12.8));
  setValue(elements.carvingWeightSlider, String(options.carvingWeight ?? 1));
  setValue(elements.edgeErosionSlider, String(options.edgeErosionWeight ?? 1));
  setValue(elements.fbmOctavesSlider, String(options.fbmOctaves ?? 5));
  setValue(elements.cloudCurlSlider, String(options.cloudCurl ?? 0.78));
  setValue(elements.surfaceShadowSamplesSlider, String(options.surfaceShadowSamples ?? 3));
  setValue(elements.surfaceShadowStepSlider, String(options.surfaceShadowStep ?? 1.15));
  setValue(elements.surfaceShadowStrengthSlider, String(options.surfaceShadowStrength ?? 0.38));
  setValue(elements.terrainFuzzSlider, String(options.terrainFuzz ?? 0.52));
  setValue(elements.surfaceRadiusSlider, String(options.surfaceRadius ?? 12));
  setValue(elements.oceanCrestSlider, String(options.oceanCrestStrength ?? 0.72));
  setValue(elements.cameraYawSlider, String(options.cameraYawDegrees ?? 0));
  setValue(elements.cameraPitchSlider, String(options.cameraPitchDegrees ?? -1));
  setValue(
    elements.cameraDistanceSlider,
    String(options.cameraDistance ?? defaultCameraDistanceForOptions(options))
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
  updateText(elements.qualityReadout, `${qualityScale.toFixed(2)}x`);
  updateText(elements.advancedQualityReadout, `${qualityScale.toFixed(2)}x`);
  updateText(elements.stepSizeReadout, (options.stepSize ?? 0.24).toFixed(2));
  updateText(elements.maxStepsReadout, String(Math.round(options.maxSteps ?? 40)));
  updateText(elements.staticMaxStepsReadout, String(Math.round(options.staticMaxSteps ?? 40)));
  updateText(elements.earlyExitReadout, (options.earlyExitAlpha ?? 0.955).toFixed(3));
  updateText(elements.shadowSamplesReadout, String(Math.round(options.shadowSamples ?? 3)));
  updateText(elements.shadowStepReadout, (options.shadowStep ?? 0.34).toFixed(2));
  updateText(elements.shadowOcclusionReadout, (options.shadowOcclusion ?? 1).toFixed(2));
  updateText(elements.densityMultiplierReadout, (options.densityMultiplier ?? 12.8).toFixed(1));
  updateText(elements.carvingWeightReadout, (options.carvingWeight ?? 1).toFixed(2));
  updateText(elements.edgeErosionReadout, (options.edgeErosionWeight ?? 1).toFixed(2));
  updateText(elements.fbmOctavesReadout, String(Math.round(options.fbmOctaves ?? 5)));
  updateText(elements.cloudCurlReadout, (options.cloudCurl ?? 0.78).toFixed(2));
  updateText(
    elements.surfaceShadowSamplesReadout,
    String(Math.round(options.surfaceShadowSamples ?? 3))
  );
  updateText(elements.surfaceShadowStepReadout, (options.surfaceShadowStep ?? 1.15).toFixed(2));
  updateText(
    elements.surfaceShadowStrengthReadout,
    (options.surfaceShadowStrength ?? 0.38).toFixed(2)
  );
  updateText(elements.terrainFuzzReadout, (options.terrainFuzz ?? 0.52).toFixed(2));
  updateText(elements.surfaceRadiusReadout, `${(options.surfaceRadius ?? 12).toFixed(1)}km`);
  updateText(elements.oceanCrestReadout, (options.oceanCrestStrength ?? 0.72).toFixed(2));
  updateText(elements.cameraYawReadout, `${(options.cameraYawDegrees ?? 0).toFixed(0)}deg`);
  updateText(elements.cameraPitchReadout, `${(options.cameraPitchDegrees ?? -1).toFixed(0)}deg`);
  updateText(
    elements.cameraDistanceReadout,
    (options.cameraDistance ?? defaultCameraDistanceForOptions(options)).toFixed(0)
  );
  elements.autoQualityButton?.classList.toggle("enabled", options.autoQuality);
  setPlaybackButton(elements.timeToggleButton, paused);
  setDockPlaybackButton(elements.dockTimeToggleButton, paused);
  updateAtmosphereWidget(elements, options);
  updateFpsLine(elements.fpsCounter, options, paused, elements);
  elements.gridButton?.classList.toggle("enabled", options.showGrid ?? false);
  elements.hdr10Button?.classList.toggle("enabled", options.hdr10 ?? false);
  elements.ditherButton?.classList.toggle("enabled", options.dither ?? false);
}

function toggleSecondaryPanels(root: ParentNode): void {
  const panels = ["timePanel", "cloudPanel", "atmospherePanel", "advancedPanel"]
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
    const panel = root.querySelector<HTMLElement>(
      `[data-panel-key="${button.dataset.panelRestore}"]`
    );
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

function applyRenderPowerScale(
  elements: ReturnType<typeof collectControls>,
  app: CloudAppController,
  value: number
): void {
  const scale = clampNumber(value, 0.45, 1);
  elements.autoQualityButton?.classList.remove("enabled");
  app.setOptions({
    autoQuality: false,
    qualityTier: undefined,
    maxPixels: Math.round(QUALITY_MAX_PIXELS * scale * scale)
  });
  setValue(elements.qualitySlider, scale.toFixed(2));
  setValue(elements.advancedQualitySlider, scale.toFixed(2));
  updateText(elements.qualityReadout, `${scale.toFixed(2)}x`);
  updateText(elements.advancedQualityReadout, `${scale.toFixed(2)}x`);
}

function bindSlider(
  slider: HTMLInputElement | null,
  readout: HTMLElement | null,
  format: (value: number) => string,
  onValue: (value: number) => void,
  afterValue?: () => void,
  commitMode: "input" | "change" = "input"
): void {
  if (!slider) {
    return;
  }

  const applyValue = (rawValue: number, syncStepper = true, commit = true): void => {
    const value = normalizeSliderValue(slider, rawValue);
    if (!Number.isFinite(value)) {
      return;
    }
    slider.value = formatSliderNumber(slider, value);
    if (syncStepper) {
      syncSliderStepper(slider, value);
    }
    updateText(readout, format(value));
    if (commit) {
      onValue(value);
      afterValue?.();
    }
  };

  slider.addEventListener("input", () => {
    const value = readFiniteNumber(slider.value);
    if (value !== null) {
      applyValue(value, true, commitMode === "input");
    }
  });
  slider.addEventListener("change", () => {
    applyValue(readFiniteNumber(slider.value) ?? readSliderFallback(slider), true, true);
  });

  bindSliderStepper(slider, applyValue, commitMode);
}

function bindSliderStepper(
  slider: HTMLInputElement,
  applyValue: (value: number, syncStepper?: boolean, commit?: boolean) => void,
  commitMode: "input" | "change"
): void {
  const stepper = slider
    .closest<HTMLElement>(".slider-group")
    ?.querySelector<HTMLElement>(`[data-stepper-for="${slider.id}"]`);
  const input = stepper?.querySelector<HTMLInputElement>(".range-stepper__input");
  if (!stepper || !input) {
    return;
  }

  input.addEventListener("input", () => {
    const value = readFiniteNumber(input.value);
    if (value !== null) {
      applyValue(value, shouldSyncStepperInput(slider, value), commitMode === "input");
    }
  });
  input.addEventListener("change", () => {
    applyValue(readFiniteNumber(input.value) ?? readSliderFallback(slider), true, true);
  });

  for (const button of stepper.querySelectorAll<HTMLButtonElement>("[data-stepper-delta]")) {
    button.addEventListener("click", () => {
      const delta = readFiniteNumber(button.dataset.stepperDelta ?? "") ?? 0;
      applyValue(readSliderFallback(slider) + delta * getSliderStep(slider));
    });
  }
}

function readSliderFallback(slider: HTMLInputElement): number {
  return readFiniteNumber(slider.value) ?? readNumericAttribute(slider, "min", 0);
}

function normalizeSliderValue(slider: HTMLInputElement, value: number): number {
  const min = readNumericAttribute(slider, "min", Number.NEGATIVE_INFINITY);
  const max = readNumericAttribute(slider, "max", Number.POSITIVE_INFINITY);
  const clamped = clampNumber(value, min, max);
  const step = getSliderStep(slider);
  if (!Number.isFinite(step) || step <= 0) {
    return clamped;
  }
  const base = Number.isFinite(min) ? min : 0;
  const stepped = base + Math.round((clamped - base) / step) * step;
  return clampNumber(roundSliderNumber(slider, stepped), min, max);
}

function shouldSyncStepperInput(slider: HTMLInputElement, value: number): boolean {
  return Math.abs(normalizeSliderValue(slider, value) - value) > 0.000001;
}

function getSliderStep(slider: HTMLInputElement): number {
  const step = readNumericAttribute(slider, "step", 1);
  return step > 0 ? step : 1;
}

function syncSliderStepper(slider: HTMLInputElement, value: number): void {
  const input = slider
    .closest<HTMLElement>(".slider-group")
    ?.querySelector<HTMLInputElement>(`[data-stepper-for="${slider.id}"] .range-stepper__input`);
  if (input) {
    input.value = formatSliderNumber(slider, value);
  }
}

function formatSliderNumber(slider: HTMLInputElement, value: number): string {
  const precision = sliderDecimalPlaces(slider);
  return precision > 0 ? value.toFixed(precision) : String(Math.round(value));
}

function roundSliderNumber(slider: HTMLInputElement, value: number): number {
  return Number(value.toFixed(Math.min(8, sliderDecimalPlaces(slider) + 2)));
}

function sliderDecimalPlaces(slider: HTMLInputElement): number {
  const step = slider.getAttribute("step") ?? "";
  const decimal = /\.(\d+)/.exec(step);
  return decimal?.[1]?.length ?? 0;
}

function readNumericAttribute(
  element: HTMLInputElement,
  attribute: "min" | "max" | "step",
  fallback: number
): number {
  const rawValue = element.getAttribute(attribute);
  if (rawValue === null || rawValue === "any") {
    return fallback;
  }
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : fallback;
}

function readFiniteNumber(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function bindNumberInput(input: HTMLInputElement | null, onValue: (value: number) => void): void {
  input?.addEventListener("change", () => {
    const value = Number(input.value);
    if (Number.isFinite(value)) {
      onValue(value);
    }
  });
}

function bindAtmosphereTimeInput(
  input: HTMLInputElement | null,
  onValue: (value: number) => void
): void {
  const handleInput = (): void => {
    const value = parseAtmosphereTime(input?.value ?? "");
    if (value !== null) {
      onValue(value);
    }
  };
  input?.addEventListener("change", handleInput);
  input?.addEventListener("input", handleInput);
}

function bindAtmosphereSunDrag(
  elements: ReturnType<typeof collectControls>,
  app: CloudAppController
): void {
  const canvas = elements.atmosphereCanvas;
  if (!canvas) {
    return;
  }
  const widget = canvas.closest<HTMLElement>("#solar-orbit-widget");
  let pointerId: number | null = null;
  const applyPointer = (event: PointerEvent): void => {
    app.setOptions(resolveAtmospherePointerPatch(canvas, event.clientX, event.clientY));
    if (elements.syncTimeCheckbox) {
      elements.syncTimeCheckbox.checked = false;
    }
    if (elements.syncStatus) {
      elements.syncStatus.hidden = true;
    }
    syncControls(elements, app.getOptions(), app.isPaused());
  };
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    pointerId = event.pointerId;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events used by smoke checks do not always own capture.
    }
    widget?.classList.add("is-dragging");
    event.preventDefault();
    applyPointer(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    applyPointer(event);
  });
  const releasePointer = (event: PointerEvent): void => {
    if (pointerId !== event.pointerId) {
      return;
    }
    try {
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore teardown races when the browser has already released capture.
    }
    pointerId = null;
    widget?.classList.remove("is-dragging");
  };
  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("lostpointercapture", () => {
    pointerId = null;
    widget?.classList.remove("is-dragging");
  });
}

function resolveAtmospherePointerPatch(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): Partial<RuntimeOptions> {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(2, rect.width || 240);
  const height = Math.max(2, rect.height || 110);
  const cx = width / 2;
  const cy = height - 16;
  const radius = Math.max(1, Math.min(width / 2 - 12, height - 25));
  const localX = clampNumber(clientX - rect.left, cx - radius, cx + radius);
  const localY = clampNumber(clientY - rect.top, cy - radius, cy);
  const dx = localX - cx;
  const dy = cy - localY;
  const orbitAngle =
    Math.hypot(dx, dy) < 1 ? Math.PI / 2 : clampNumber(Math.atan2(dy, dx), 0, Math.PI);
  const progress = 1 - orbitAngle / Math.PI;
  const hour = 6 + progress * 12;
  const sunElevation = Math.round(Math.sin(orbitAngle) * 82);
  return {
    ...resolveAtmosphereTimePatch(hour),
    ...resolveSunLightingPatch(sunElevation)
  };
}

function setValue(element: HTMLInputElement | HTMLSelectElement | null, value: string): void {
  if (element) {
    element.value = value;
    if (element instanceof HTMLInputElement && element.type === "range") {
      const numericValue = readFiniteNumber(value);
      if (numericValue !== null) {
        syncSliderStepper(element, normalizeSliderValue(element, numericValue));
      }
    }
  }
}

function setActive(element: HTMLElement | null, active: boolean): void {
  element?.classList.toggle("active", active);
  element?.setAttribute("aria-pressed", active ? "true" : "false");
}

function setPlaybackButton(element: HTMLElement | null, paused: boolean): void {
  const playLabel = element?.dataset.playbackLabel === "play" ? "Play" : "Resume";
  const label = paused ? playLabel : "Pause";
  updateText(element, label);
  element?.classList.toggle("enabled", paused);
  element?.setAttribute("aria-pressed", paused ? "true" : "false");
  element?.setAttribute("aria-label", label);
}

function setDockPlaybackButton(element: HTMLElement | null, paused: boolean): void {
  updateText(element, paused ? "RESUME" : "PAUSE");
  element?.classList.toggle("enabled", paused);
  element?.setAttribute("aria-label", paused ? "Resume" : "Pause");
}

function updateText(element: HTMLElement | null, value: string): void {
  if (element) {
    element.textContent = value;
  }
}

function syncAtmosphereToSystemTime(
  elements: ReturnType<typeof collectControls>,
  app: CloudAppController
): Date {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  app.setOptions(resolveAtmosphereTimePatch(hour));
  if (elements.syncTimeCheckbox) {
    elements.syncTimeCheckbox.checked = true;
  }
  return now;
}

function toggleSunElevationLink(elements: ReturnType<typeof collectControls>): void {
  const enabled = !elements.linkSunElevationButton?.classList.contains("enabled");
  elements.linkSunElevationButton?.classList.toggle("enabled", enabled);
  elements.linkElevationSunButton?.classList.toggle("enabled", enabled);
}

function resolveLinkedSunPatch(
  elements: ReturnType<typeof collectControls>,
  sunElevation: number
): Partial<RuntimeOptions> {
  if (!elements.linkSunElevationButton?.classList.contains("enabled")) {
    return { sunElevation };
  }
  const patch = resolveSunLightingPatch(sunElevation);
  const sunIntensity = patch.sunIntensity ?? 0;
  const ambientIntensity = patch.ambientIntensity ?? 0;
  setValue(elements.sunSlider, String(sunIntensity));
  updateText(elements.sunReadout, sunIntensity.toFixed(1));
  setValue(elements.ambientSlider, String(ambientIntensity));
  updateText(elements.ambientReadout, ambientIntensity.toFixed(2));
  return patch;
}

function resolveSunLightingPatch(sunElevation: number): Partial<RuntimeOptions> {
  const direct01 = clampNumber(Math.pow(Math.max(0, sunElevation) / 90, 0.65), 0, 1);
  const diffuse01 = clampNumber(Math.pow(Math.max(0, sunElevation + 18) / 108, 0.8), 0, 1);
  return {
    sunElevation,
    sunIntensity: Number((direct01 * 8).toFixed(1)),
    ambientIntensity: Number((diffuse01 * 1.2).toFixed(2))
  };
}

function resolveAtmosphereTimePatch(hour: number): Partial<RuntimeOptions> {
  const normalizedHour = normalizeDayHour(hour);
  const daylight = Math.max(0, Math.sin(((normalizedHour - 6) / 12) * Math.PI));
  const sunElevation = Math.round(-8 + daylight * 70);
  return {
    time: Number(normalizedHour.toFixed(2)),
    sunElevation,
    sunIntensity: Number((daylight * 7.2).toFixed(1)),
    ambientIntensity: Number((0.36 + daylight * 0.72).toFixed(2)),
    sunViewerAngle: Math.round((normalizedHour - 12) * 15)
  };
}

function estimateAtmosphereTime(options: RuntimeOptions): number {
  if (typeof options.sunViewerAngle === "number" && Number.isFinite(options.sunViewerAngle)) {
    return normalizeDayHour(12 + options.sunViewerAngle / 15);
  }
  if (typeof options.time === "number" && Number.isFinite(options.time)) {
    return normalizeDayHour(options.time);
  }
  return 9;
}

function normalizeDayHour(hour: number): number {
  if (!Number.isFinite(hour)) {
    return 9;
  }
  return ((hour % 24) + 24) % 24;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatAtmosphereTime(hour: number): string {
  const normalized = normalizeDayHour(hour);
  const wholeHour = Math.floor(normalized);
  const minutes = Math.round((normalized - wholeHour) * 60);
  const displayHour = (wholeHour + Math.floor(minutes / 60)) % 24;
  const displayMinutes = minutes % 60;
  return `${String(displayHour).padStart(2, "0")}:${String(displayMinutes).padStart(2, "0")}`;
}

function parseAtmosphereTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours > 23 || minutes > 59) {
    return null;
  }
  return hours + minutes / 60;
}

function updateAtmosphereWidget(
  elements: ReturnType<typeof collectControls>,
  options: RuntimeOptions
): void {
  const canvas = elements.atmosphereCanvas;
  if (!canvas) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(2, Math.round(rect.width || 240));
  const height = Math.max(2, Math.round(rect.height || 110));
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const w = canvas.width;
  const h = canvas.height;
  const elevation = options.sunElevation ?? 35;
  const direct01 = elevation > 0 ? Math.min(1, Math.pow(elevation / 90, 0.65)) : 0;
  const diffuse01 = Math.min(1, Math.pow(Math.max(0, elevation + 18) / 108, 0.8));
  updateText(elements.elevationValue, `${elevation.toFixed(1)}deg`);
  updateMeter(elements.elevationFill, Math.max(0, Math.min(100, (elevation / 90) * 100)));
  updateText(elements.directValue, `${(direct01 * 100).toFixed(0)}%`);
  updateMeter(elements.directFill, direct01 * 100);
  updateText(elements.diffuseValue, `${(diffuse01 * 100).toFixed(0)}%`);
  updateMeter(elements.diffuseFill, diffuse01 * 100);

  context.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h - 16 * dpr;
  const radius = Math.min(w / 2 - 12 * dpr, h - 25 * dpr);
  const skyGradient = context.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  skyGradient.addColorStop(0, `rgba(145, 190, 255, ${0.3 + diffuse01 * 0.45})`);
  skyGradient.addColorStop(1, `rgba(39, 84, 160, ${0.55 + diffuse01 * 0.28})`);
  context.beginPath();
  context.arc(cx, cy, radius, Math.PI, 0);
  context.fillStyle = skyGradient;
  context.fill();

  context.beginPath();
  context.arc(cx, cy, radius, Math.PI, 0);
  context.strokeStyle = "rgba(255,255,255,0.44)";
  context.lineWidth = 1 * dpr;
  context.setLineDash([4 * dpr, 4 * dpr]);
  context.stroke();
  context.setLineDash([]);

  context.beginPath();
  context.moveTo(cx - radius - 20 * dpr, cy);
  context.lineTo(cx + radius + 20 * dpr, cy);
  context.strokeStyle = "rgba(255,255,255,0.38)";
  context.lineWidth = 2 * dpr;
  context.stroke();

  const orbitHour = estimateAtmosphereTime(options);
  const orbitProgress = clampNumber((orbitHour - 6) / 12, 0, 1);
  const orbitAngle = Math.PI - orbitProgress * Math.PI;
  const sunDistance = radius + 10 * dpr;
  const sunX = cx + Math.cos(orbitAngle) * sunDistance;
  const sunY = cy - Math.sin(orbitAngle) * sunDistance;

  context.beginPath();
  context.moveTo(cx, cy);
  context.lineTo(sunX, sunY);
  context.strokeStyle = `rgba(215, 181, 82, ${0.36 + direct01 * 0.42})`;
  context.lineWidth = (4 + 8 * direct01) * dpr;
  context.stroke();

  context.beginPath();
  context.arc(sunX, sunY, 8 * dpr, 0, Math.PI * 2);
  context.fillStyle = "#efe6a7";
  context.fill();
  context.beginPath();
  context.arc(sunX, sunY, 13 * dpr, 0, Math.PI * 2);
  context.fillStyle = "rgba(239, 230, 167, 0.28)";
  context.fill();
}

function updateMeter(element: HTMLElement | null, value: number): void {
  if (element) {
    element.style.width = `${Math.max(0, Math.min(100, value))}%`;
  }
}

function updateFpsLine(
  element: HTMLElement | null,
  options: RuntimeOptions,
  paused: boolean,
  elements?: ReturnType<typeof collectControls>,
  stats?: RenderStats
): void {
  const qualityScale = resolveQualityScale(options);
  const quality = qualityScale.toFixed(2);
  const canvas =
    elements?.cloudCanvas ?? document.querySelector<HTMLCanvasElement>("#cloud-canvas");
  const bufferWidth = canvas?.width ?? 0;
  const bufferHeight = canvas?.height ?? 0;
  const bufferText = bufferWidth > 0 && bufferHeight > 0 ? `${bufferWidth}x${bufferHeight}` : "--";
  const aspect =
    bufferWidth > 0 && bufferHeight > 0
      ? (bufferWidth / bufferHeight).toFixed(2)
      : options.orientation === "landscape"
        ? "1.78"
        : "0.56";
  const qualityTierText = options.qualityTier
    ? ` ${getMobileQualitySettings(options.qualityTier).label}`
    : "";
  const fpsText = formatMetric(stats?.measuredFps, 1);
  const averageFpsText = formatMetric(stats?.averageFps, 1);
  const lastFrameMsText = formatMetric(stats?.lastFrameDurationMs, 1);
  const averageFrameMsText = formatMetric(stats?.averageFrameDurationMs, 1);
  const frameText = stats ? String(stats.frameCount) : "--";
  updateText(
    element,
    `FPS: ${fpsText} | AVG: ${averageFpsText} | Frame: ${frameText} | Last: ${lastFrameMsText}ms | Mean: ${averageFrameMsText}ms | RES: ${quality}x eff ${quality}x${options.autoQuality ? " AUTO" : ""}${qualityTierText} | BUF: ${bufferText} | Aspect: ${aspect} | Tropo: ${(options.tropopause ?? 12).toFixed(1)}km -> ${(options.tropopause ?? 12).toFixed(1)}km | Freeze: ${(
      options.freezingLevel ?? 5
    ).toFixed(1)}km | Shear: ${(options.windShear ?? 0.7).toFixed(2)} | Time: ${
      paused ? "paused" : `${(options.timeScale ?? 1).toFixed(1)}x`
    } | T: ${(options.time ?? 0).toFixed(1)}`
  );
}

function formatMetric(value: number | undefined, digits: number): string {
  if (value === undefined || !Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(digits);
}

function resolveQualityScale(options: RuntimeOptions): number {
  return Math.sqrt((options.maxPixels ?? QUALITY_MAX_PIXELS) / QUALITY_MAX_PIXELS);
}

function defaultCameraDistanceForOptions(options: RuntimeOptions): number {
  return options.displayProfile.mobileWideView ? 24 : 16;
}
