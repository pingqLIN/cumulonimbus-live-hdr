import { type RuntimeOptions } from "./runtime-options.js";

export type CloudModelVariant = "giant-cumulonimbus";
export type RendererPipeline = "raymarch-webgl";
export type UiVariant = "full-observatory";

export type ExperienceProfile = {
  readonly modelVariant: CloudModelVariant;
  readonly rendererPipeline: RendererPipeline;
  readonly uiVariant: UiVariant;
  readonly compactControls: boolean;
};

export function resolveExperienceProfile(options: RuntimeOptions): ExperienceProfile {
  return {
    modelVariant: "giant-cumulonimbus",
    rendererPipeline: "raymarch-webgl",
    uiVariant: "full-observatory",
    compactControls:
      options.presetName === "mobile-cumulus" || options.displayProfile.mobileWideView
  };
}
