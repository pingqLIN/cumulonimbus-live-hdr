![Cumulonimbus Live HDR banner](assets/caief-banner.jpg)

# Cumulonimbus Live HDR

積雨雲視覺模型原型。現階段主線維護目標是 standalone 的 `cumulonimbus-live-hdr-mainline.html` 模型：以 Three.js shader/raymarch 做出具物理模擬外觀的雲體觀察狀態，但不宣稱是真實物理還原。

## Bootstrap Decisions

- Archetype: single-package web app with a local render script.
- Storage root: [repository root](.) (`Q:\Projects\cumulonimbus-live-hdr`).
- Runtime: TypeScript, Vite preview, Node.js render pipeline.
- Persistence: local files only for rendered frames and video outputs.
- Output target: browser preview first, FFmpeg HDR-tagged MP4 test segment second.

The reference clip is a 1920x3840, 30 fps, 5.03 second portrait MOV. This prototype keeps the same portrait rhythm, but starts at a smaller render size so iteration stays fast.

## Commands

```powershell
npm install
npm run dev
npm run live:url
npm run test:06
npm run render:quick
npm run render:test
npm test
npm run test:browser
```

`render:quick` writes `outputs/cumulonimbus-quick-hdr.mp4`.

`render:test` writes `outputs/cumulonimbus-test-hdr.mp4`.

`render:demo-loop` writes `outputs/cumulonimbus-demo-loop.mp4` by default. It starts from the demo preset and applies slow, smooth parameter drift for continuous cloud animation.

Both render commands generate 16-bit PPM frames and encode them with FFmpeg as 10-bit HEVC with HDR10 metadata. This is a prototype HDR path, not final color mastering.

`live:url` prints the canonical local `live=1` Browser Source URL plus suggested OBS Browser Source dimensions.

`cumulonimbus-live-hdr-mainline.html` 是目前主線模型入口，可直接開啟：

```text
file:///Q:/Projects/cumulonimbus-live-hdr/cumulonimbus-live-hdr-mainline.html
```

`test:06` 會以 headless browser 開啟同一個 file URL，確認主線畫面能渲染出非空雲體。

`capture:field-still` launches a local browser-backed CPU field preview capture and writes `outputs/cumulonimbus-field-still.png` unless `--out` is provided.

`capture:3d-still` launches a local browser-backed 3D preview capture and writes `outputs/cumulonimbus-3d-still.png`.

`test:3d-capture` runs a small browser-backed 3D capture smoke test and validates the PNG is non-flat.

`test:live-entry` runs the same browser-backed visibility smoke through the `live=1` entrypoint.

`test:ui-capture` runs a browser-backed screenshot smoke against the full control-panel UI, without `live=1` or `capture=1`.

`report:3d-looks` captures all 3D look presets and writes comparison metrics to `outputs/analysis/3d-looks/report.json`.

`test:3d-looks` runs a small browser-backed smoke over every 3D look preset and validates report ranking behavior.

`spike:raymarch` writes an isolated CPU density-raymarch PPM still to `outputs/analysis/raymarch-density-spike.ppm`.

`spike:cml-lite` writes an offline CML-inspired density-grid research preview to `outputs/analysis/cml-lite-density-grid/`. It simulates a low-resolution 3D lattice with vapor source, updraft, humidity condensation, and advection; it is not used by the runtime renderer.

`test:raymarch` runs a smaller isolated raymarch smoke and fails when alpha or lit-pixel coverage is too low.

`test:cml-lite` runs a small no-MP4 CML-lite smoke and fails when the lattice does not condense, grow upward, or produce enough visible density.

`test:webgpu-uniforms` validates the CPU parameter to WebGPU preview uniform mapping.

`test:field-capture` validates the CPU field renderer fallback through the browser-backed capture path.

`test:browser` runs a dedicated browser smoke suite for field fallback, 3D capture, full UI capture, and the live entrypoint without nesting multiple `npm run` calls.

## Research

The first source-backed research pass is in [docs/research-notes.md](docs/research-notes.md). It covers atmospheric science, procedural volumetric cloud rendering, HDR standards, and science-art precedents.

## Procedural image generation

The project procedural generation and output pipeline is documented in:

- [Project image generation pipeline](docs/image-generation-pipeline.md) (English)
- [專案影像程式化生成與流水線](docs/image-generation-pipeline.zh-tw.md) (中文)

## Project Assets

Reference and prototype files copied into this repository:

- [Simulation research notes](research/2026-05-13-cumulonimbus-simulation-notes.md)
- [Reference manifest](research/reference-manifest.json)
- [Atmospheric cloud-modeling paper](references/papers/A_Method_for_Modeling_Clouds_Based_on_Atmospheric_.pdf)
- [Portrait cumulonimbus reference](references/images/reference_portrait_cumulonimbus.png)
- [Landscape cumulonimbus reference](references/images/reference_landscape_cumulonimbus.png)
- [Motion reference video](references/videos/reference_cumulonimbus_cloud_simulationmp.mp4)
- [Motion reference frames](references/videos/cumulonimbus_cloud_simulationmp_frames/)
- [CPU procedural prototype notes](prototypes/cpu-procedural/README.md)
- [CPU procedural prototype source](prototypes/cpu-procedural/cumulonimbus_proc_preview.py)
- [CPU procedural prototype output](prototypes/cpu-procedural/cumulonimbus_proc_preview.mp4)

## Current State

目前主線是 [`cumulonimbus-live-hdr-mainline.html`](cumulonimbus-live-hdr-mainline.html)。它是單檔 Three.js shader/raymarch 模型，具備 seed、time、quality、tropopause、freezing level、wind shear、sun、ambient、grid、orthographic/perspective 與 HUD 控制；可用 `file:///Q:/Projects/cumulonimbus-live-hdr/cumulonimbus-live-hdr-mainline.html` 直接觀察。

定位：`cumulonimbus-live-hdr-mainline.html` 不是科學驗證過的物理模擬，而是視覺/可觀察狀態的 volumetric approximation。目標是讓雲體在多角度觀察時維持同一個主線模型的結構一致性，而不是每個角度重新生成不同雲圖。

`src/` 內的 Vite/TypeScript preview、`view=3d` bubble model 與離線 render scripts 仍保留為歷史原型與工具鏈，但現階段不再視為主線模型核心。

## Next Steps

1. 先以 `cumulonimbus-live-hdr-mainline.html` 作為單一 source of truth，調整雲塔、砧狀雲、tropopause scale、光照與觀察角度。
2. 若要工程化，再把 06 的 shader/raymarch 結構拆回可測的 TypeScript/Vite 模組。
3. 後續再接 OBS/NDI/Spout、streaming 或 HDR capture/export path。

## 進階使用：持續迭代 Demo 影片

若要接著原本 demo 樣態長時間輸出：

```powershell
npm run render:demo-loop -- --seconds 120 --width 720 --height 1280 --drift-cycle 90 --drift-amount 0.35
```

預設從 `defaultCloudParams` 的基底啟動。輸出會自動產生：

- `outputs/cumulonimbus-demo-loop.mp4`
- `outputs/metrics/cumulonimbus-demo-loop.json`

常用參數：

- `--seconds`：輸出長度（秒）
- `--drift-cycle`：參數震盪週期（秒，越大越慢）
- `--drift-amount`：漂移幅度（0~1，越大越明顯）
- `--seed`：固定種子，方便接著同一樣態續拍
- `--preset demo|raw|billow`：`billow` 會直接從 demo-like 積雨雲雲泡樣態開始

## 預覽效能參數

在 `http://127.0.0.1:5173/` 可用 query 參數加速預覽，例如：

```text
http://127.0.0.1:5173/?simPreset=low&simFps=30
```

若要直接從目前的積雨雲 billow starter 開始：

```text
http://127.0.0.1:5173/?preset=billow&simPreset=low&fps=15
```

若要啟動舊的 3D bubble model 預覽：

```text
http://127.0.0.1:5173/?view=3d&look=demo-like&simPreset=mid&fps=30
```

若要用 OBS Browser Source 或本機全螢幕輸出入口，可用 `live=1` 隱藏控制面板：

```text
http://127.0.0.1:5173/?live=1&view=3d&look=demo-like&simPreset=mid&fps=30
```

也可以由工具輸出 canonical URL 與建議尺寸：

```powershell
npm run live:url -- --width 540 --height 960 --fps 30
npm run test:live-entry
```

3D look-dev presets 可用 `look` 切換，用目前 bubble model 骨架做不同視覺語言：

```text
http://127.0.0.1:5173/?view=3d&look=structural&simPreset=mid&fps=30
http://127.0.0.1:5173/?view=3d&look=demo-like&simPreset=mid&fps=30
http://127.0.0.1:5173/?view=3d&look=soft-volumetric-ish&simPreset=mid&fps=30
```

若要輸出舊 3D/Vite baseline 的可重複 PNG still：

```powershell
npm run capture:field-still -- --width 540 --height 960 --captureFrames 12
npm run capture:3d-still -- --look demo-like --simPreset mid --width 540 --height 960
npm run test:3d-capture
npm run test:ui-capture
npm run test:3d-looks
npm run report:3d-looks
```

若要執行隔離的 volumetric raymarch still spike：

```powershell
npm run spike:raymarch -- --width 180 --height 320 --steps 56
```

新參數：

- `simFps=<正整數>`（或 `fps`、`maxFps`）：限制 preview 目標幀率（例如 `simFps=30`、`fps=15`）。
  - `simFps=30` 通常比預設順滑且 CPU 佔用更低。
  - 不設定表示不限制（採用畫面請求速率）。
- `renderer=cpu`：強制 CPU fallback。
- `simPreset=low|mid|high|live4k`：控制預覽解析度。
- `simWidth`/`simHeight`：自訂解析度（會套上安全上限）。
- `captureFrames=<正整數>`：只給 browser-backed smoke/capture 使用；渲染到指定幀數後暫停，避免 headless screenshot 等待無止境動畫。
- `freezingLevel=<3..6>` 或 `freezing=<3..6>`：調整水滴到冰晶纖維質感的高度過渡，單位 km。
- `windShear=<0..1>` 或 `shear=<0..1>`：調整砧狀雲迎風/下風不對稱外流強度。
- `--source ui`：給 `capture:3d-still`/smoke 腳本使用；不加 `live=1` 或 `capture=1`，保留完整控制面板以檢查 UI。
- `preset=billow` 或 `cloudPreset=billow`：使用 demo-like 積雨雲起手樣態；目前會自動走 CPU preview，避免 WebGPU preview 與 CPU 模型不同步。
- `view=3d` 或 `model=3d-billow`：使用 Three.js InstancedMesh 3D bubble model，保留相同參數控制語意。
- `look=structural|demo-like|soft-volumetric-ish`：切換 3D look-dev preset。`structural` 保留幾何可讀性，`demo-like` 對齊 `outputs/analysis/demo_mid.png` 的暗背景與側逆光，`soft-volumetric-ish` 用更強 fog、halo、edge particles 模擬柔霧體積感。

## Demo reference tuning

快速掃描 `demo.mov` 對應參數：

```powershell
npm run tune:demo -- --samples 16 --frames 18 --width 80 --height 160
```

輸出會寫到 `outputs/analysis/tuning/`，包含 reference frame、候選 frame 與 `report.json`。

1. Keep tuning growth, edge drift, color response, and 3D framing against `demo.mov`, `capture:3d-still`, and `report:3d-looks`.
2. Add shader/WebGPU or raymarch rendering when the 3D bubble baseline needs real volume fidelity.
3. Extend the `live=1` canvas entry into an OBS/NDI/Spout or streaming pipeline with an explicit HDR capture/export path.
