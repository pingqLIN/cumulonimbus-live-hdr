import { buildPreviewUrl } from "./lib/preview-url.mjs";

const args = parseArgs(process.argv.slice(2));
const width = readIntegerArg(args, "width", 540);
const height = readIntegerArg(args, "height", 960);
const fps = readIntegerArg(args, "fps", 30);
const port = readIntegerArg(args, "port", 5173);
const host = args.host ?? "127.0.0.1";
const protocol = args.protocol ?? "http";
const origin = `${protocol}://${host}:${port}`;
const url = buildPreviewUrl({
  origin,
  view: args.view ?? "3d",
  look: args.look ?? "demo-like",
  simPreset: args.simPreset ?? "mid",
  width,
  height,
  fps,
  outputMode: "live"
});

console.log(
  JSON.stringify(
    {
      ok: true,
      url: url.toString(),
      obsBrowserSource: {
        width,
        height,
        fps,
        shutdownSourceWhenNotVisible: false,
        refreshBrowserWhenSceneBecomesActive: true
      }
    },
    null,
    2
  )
);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=", 2);
    const value = inlineValue ?? rawArgs[index + 1];
    if (inlineValue === undefined) {
      index += 1;
    }
    parsed[key] = value;
  }
  return parsed;
}

function readIntegerArg(parsed, name, fallback) {
  const value = Number(parsed[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return Math.round(value);
}
