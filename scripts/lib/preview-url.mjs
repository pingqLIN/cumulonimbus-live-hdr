export function buildPreviewUrl(options = {}) {
  const origin = options.origin ?? "http://127.0.0.1:5173";
  const url = new URL("/", origin);
  url.searchParams.set("view", options.view ?? "3d");
  url.searchParams.set("look", options.look ?? "demo-like");
  url.searchParams.set("simPreset", options.simPreset ?? "mid");
  url.searchParams.set("simWidth", String(options.width ?? 540));
  url.searchParams.set("simHeight", String(options.height ?? 960));
  url.searchParams.set("fps", String(options.fps ?? 30));
  if (options.renderer) {
    url.searchParams.set("renderer", options.renderer);
  }
  if (options.preset) {
    url.searchParams.set("preset", options.preset);
  }
  if (options.captureFrames) {
    url.searchParams.set("captureFrames", String(options.captureFrames));
  }

  const outputMode = options.outputMode ?? "live";
  if (outputMode === "capture") {
    url.searchParams.set("capture", "1");
  } else if (outputMode === "live") {
    url.searchParams.set("live", "1");
  }

  return url;
}
