![Cumulonimbus Live HDR banner](assets/caief-banner.jpg)

# Cumulonimbus Live HDR

Cumulonimbus Live HDR is a Vite/TypeScript single-canvas WebGL renderer for
live cumulonimbus cloud look development. The current public and local entry is
[`index.html`](index.html), which loads `src/app/main.ts` and the raymarch cloud
renderer. It is a visual volumetric approximation for iteration, capture, and
browser presentation; it is not a validated atmospheric simulation.

Traditional Chinese companion: [README.ZHTW.md](README.ZHTW.md)

## Current Surface

- Runtime entry: `index.html`
- App module: `src/app/main.ts`
- Cloud renderer: `src/app/raymarch-cloud-renderer.ts`
- Shader source: `src/app/raymarch-cloud-shader.ts`
- Public deployment build: `npm run build` -> `dist/`, deployed by
  `.github/workflows/deploy-pages.yml`

The retired standalone HTML entrypoints are no longer the source of truth. Use
the Vite app and URL parameters for local preview, smoke tests, and GitHub Pages
output.

## Quick Start

```powershell
npm install
npm run dev
npm run check
npm run test:live-entry
npm run test:browser
```

Local preview:

```text
http://127.0.0.1:5173/
```

`test:live-entry` checks the current single-canvas live entry, while
`test:browser` runs the broader browser-backed smoke suite.

## Useful URLs

Default live canvas:

```text
http://127.0.0.1:5173/?live=1
```

Mobile horizon preset:

```text
http://127.0.0.1:5173/?live=1&orientation=portrait&preset=mobile-horizon&simWidth=390&simHeight=844
```

Deterministic capture:

```text
http://127.0.0.1:5173/?capture=1&captureFrames=1&seed=574&time=2.2&preset=mobile-horizon
```

Common query parameters:

- `seed`, `time`, `fps`
- `orientation=portrait|landscape`
- `simWidth`, `simHeight`, `maxPixels`
- `preset=mobile-horizon|sunrise-horizon|noon-blue|model-landscape|model-portrait`
- `systems`, `tropopause`, `freezingLevel`, `windShear`
- `cloudCurl`, `fbmOctaves`, `stepSize`, `maxSteps`
- `sunIntensity`, `ambientIntensity`, `sunElevation`, `sunViewerAngle`
- `sky=atmosphere|clear|sunset|moonlight|workbench`
- `light=daylight|golden-side|backlit-edge`

## Mobile Behavior

The runtime uses narrow viewport detection to choose mobile visual defaults, and
uses coarse-pointer/iOS Chrome signals for lower-risk renderer budget defaults.
Mobile defaults reduce pixel budget and raymarch work while widening the model
view so the cloud remains visible in portrait layouts. The mobile smoke scripts
verify full-viewport canvas geometry, WebGL availability, runtime errors, and
non-flat cloud output.

## Captures And Tests

```powershell
npm run capture:3d-still
npm run test:live-entry
npm run test:ui-capture
npm run test:raymarch
npm run test:browser
```

Generated outputs normally land under `outputs/`, which is local runtime output
unless a specific demo artifact is intentionally tracked.

## Documentation

- [Project image generation pipeline](docs/image-generation-pipeline.md)
- [專案影像程式化生成與流水線](docs/image-generation-pipeline.zh-tw.md)
- [Research notes](docs/research-notes.md)
- [Colab render workflow](docs/colab-render.md)

## Development Notes

Keep `main` as the canonical working branch unless a task explicitly needs a
temporary branch or worktree. Development plans, audit packets, reviewer raw
output, and generated analysis files should remain local-only unless the user
explicitly asks to publish them.
