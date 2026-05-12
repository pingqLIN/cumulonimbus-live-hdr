export function buildPreviewUrl(options = {}) {
  const origin = options.origin ?? "http://127.0.0.1:5173";
  const url = new URL("/", origin);
  url.searchParams.set("view", options.view ?? "3d");
  url.searchParams.set("look", options.look ?? "demo-like");
  url.searchParams.set("simPreset", options.simPreset ?? "mid");
  url.searchParams.set("simWidth", String(options.width ?? 540));
  url.searchParams.set("simHeight", String(options.height ?? 960));
  url.searchParams.set("fps", String(options.fps ?? 30));

  const outputMode = options.outputMode ?? "live";
  if (outputMode === "capture") {
    url.searchParams.set("capture", "1");
  } else {
    url.searchParams.set("live", "1");
  }

  return url;
}
