import { type ExperienceProfile } from "./experience-profile.js";
import { RaymarchCloudRenderer, type RaymarchCloudOptions } from "./raymarch-cloud-renderer.js";

export type CloudRenderer = {
  updateOptions(options: RaymarchCloudOptions): void;
  resize(width: number, height: number): void;
  render(time: number): void;
  dispose(): void;
};

export function createCloudRenderer(
  canvas: HTMLCanvasElement,
  options: RaymarchCloudOptions,
  profile: ExperienceProfile
): CloudRenderer {
  switch (profile.rendererPipeline) {
    case "raymarch-webgl":
      return new RaymarchCloudRenderer(canvas, options);
  }
}
