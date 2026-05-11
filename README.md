# Cumulonimbus Live HDR

Algorithmic prototype for a high-altitude cumulonimbus image that slowly grows, drifts, and recedes at the edge. The immediate target is a single portrait test segment; the longer target is a live HDR video source.

## Bootstrap Decisions

- Archetype: single-package web app with a local render script.
- Storage root: `Q:\Projects\cumulonimbus-live-hdr`.
- Runtime: TypeScript, Vite preview, Node.js render pipeline.
- Persistence: local files only for rendered frames and video outputs.
- Output target: browser preview first, FFmpeg HDR-tagged MP4 test segment second.

The reference clip is a 1920x3840, 30 fps, 5.03 second portrait MOV. This prototype keeps the same portrait rhythm, but starts at a smaller render size so iteration stays fast.

## Commands

```powershell
npm install
npm run dev
npm run render:quick
npm run render:test
```

`render:quick` writes `outputs/cumulonimbus-quick-hdr.mp4`.

`render:test` writes `outputs/cumulonimbus-test-hdr.mp4`.

`render:demo-loop` writes `outputs/cumulonimbus-demo-loop.mp4` by default. It starts from the demo preset and applies slow, smooth parameter drift for continuous cloud animation.

Both render commands generate 16-bit PPM frames and encode them with FFmpeg as 10-bit HEVC with HDR10 metadata. This is a prototype HDR path, not final color mastering.

## Research

The first source-backed research pass is in [docs/research-notes.md](docs/research-notes.md). It covers atmospheric science, procedural volumetric cloud rendering, HDR standards, and science-art precedents.

## Next Steps

The current renderer uses a persistent `IterativeCloudField`, so the cloud edge now has memory: target density condenses into the field gradually, previous density is advected by slow wind shear, and evaporation trails behind the ideal mathematical shape.

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

新參數：

- `simFps=<正整數>`（或 `fps`、`maxFps`）：限制 preview 目標幀率（例如 `simFps=30`、`fps=15`）。
  - `simFps=30` 通常比預設順滑且 CPU 佔用更低。
  - 不設定表示不限制（採用畫面請求速率）。
- `renderer=cpu`：強制 CPU fallback。
- `simPreset=low|mid|high|live4k`：控制預覽解析度。
- `simWidth`/`simHeight`：自訂解析度（會套上安全上限）。
- `preset=billow` 或 `cloudPreset=billow`：使用 demo-like 積雨雲起手樣態；目前會自動走 CPU preview，避免 WebGPU preview 與 CPU 模型不同步。

## Demo reference tuning

快速掃描 `demo.mov` 對應參數：

```powershell
npm run tune:demo -- --samples 16 --frames 18 --width 80 --height 160
```

輸出會寫到 `outputs/analysis/tuning/`，包含 reference frame、候選 frame 與 `report.json`。

1. Tune the growth and edge drift against the reference video.
2. Add WebGPU or shader rendering for realtime 4K portrait output.
3. Add a live output mode for OBS or a streaming pipeline.

