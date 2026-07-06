import {
  resolveExperienceProfile,
  type ExperienceProfile,
  type UiVariant
} from "../app/experience-profile.js";
import { type RuntimeOptions } from "../app/runtime-options.js";
import { configureCompactControlSurface } from "./shell/compact-control-surface.js";
import {
  buildFullObservatoryShell,
  type ShellRenderOptions
} from "./shell/full-observatory-shell.js";

export type AppShell = {
  readonly root: HTMLElement;
  readonly renderContainer: HTMLElement;
  readonly canvas: HTMLCanvasElement;
};

export function createAppShell(
  options: RuntimeOptions,
  experienceProfile: ExperienceProfile = resolveExperienceProfile(options)
): AppShell {
  const root = document.querySelector<HTMLElement>("#app") ?? document.body;
  const compactControls = experienceProfile.compactControls;
  root.innerHTML = renderShellVariant(experienceProfile.uiVariant, {
    orientation: options.orientation,
    renderMode: options.renderMode,
    compactControls,
    controlsVisible: options.controlsVisible
  });
  if (compactControls) {
    configureCompactControlSurface(root);
  }
  const renderContainer = requireElement<HTMLElement>("#render-container");
  const canvas = requireElement<HTMLCanvasElement>("#cloud-canvas");
  const canvasSize = resolveInitialCanvasSize(options);
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  return { root, renderContainer, canvas };
}

function renderShellVariant(variant: UiVariant, options: ShellRenderOptions): string {
  switch (variant) {
    case "full-observatory":
      return buildFullObservatoryShell(options);
  }
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing app shell element: ${selector}`);
  }
  return element;
}

function resolveInitialCanvasSize(options: RuntimeOptions): { width: number; height: number } {
  const fallback =
    options.orientation === "landscape" ? { width: 960, height: 540 } : { width: 540, height: 960 };
  return {
    width: Math.round(options.simWidth ?? fallback.width),
    height: Math.round(options.simHeight ?? fallback.height)
  };
}
