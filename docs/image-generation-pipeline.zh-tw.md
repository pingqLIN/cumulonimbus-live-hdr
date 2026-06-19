# 專案影像程式化生成與流水線

## 目的

這份文件整理專案目前可用的程式化影像輸出流程：從參數輸入、逐格渲染、到媒體輸出與驗證，並區分主線入口與測試/捕捉流程。

## 流程圖

```mermaid
flowchart TD
  A["開發者執行指令"] --> B{選擇路徑}

  B --> C["cumulonimbus-live-hdr-mainline.html 單檔主線入口"]
  B --> D["npm run render:test / render:quick / render:demo-loop"]
  B --> E["npm run capture:* 或 test:browser"]

  C --> C1["直接開啟 cumulonimbus-live-hdr-mainline.html 或附帶 query"]
  C1 --> C2["即時 WebGL 預覽與互動參數"]
  C2 --> C3["手動截圖 / 外部串流擷取"]

  D --> D1["npm run build:core（tsc -> dist/core）"]
  D1 --> D2["載入預設參數或預設樣態"]
  D2 --> D3["建立 IterativeCloudField + HDR 設定"]
  D3 --> D4["預熱步驟（負向時間視窗）"]
  D4 --> D5["逐格：field.step -> samplePixel -> 輸出 PPM16"]
  D5 --> D6["outputs/frames/frame_0000.ppm ..."]
  D6 --> D7["FFmpeg 編碼 HEVC 10-bit HDR10"]
  D7 --> D8["outputs/*.mp4"]
  D8 --> D9["彙整逐格指標"]
  D9 --> D10["outputs/metrics/*.json"]
  D10 --> D11["可選：與 baseline metrics 比對"]

  E --> E1["npm run build（tsc + vite build）"]
  E1 --> E2["啟動 Vite 預覽（127.0.0.1 動態 port）"]
  E2 --> E3["組合預覽 URL（look / preset / renderer / query）"]
  E3 --> E4["headless browser 擷取 PNG"]
  E4 --> E5["PNG 視覺分析與 smoke thresholds 驗證"]
  E5 --> E6["outputs/*.png 或測試結果"]
```

## 主線路徑（目前使用）

- 主線視覺入口：`cumulonimbus-live-hdr-mainline.html`
- 主線輸出腳本：`npm run render:quick`, `npm run render:test`, `npm run render:demo-loop`
- 主要抓圖路徑：`npm run capture:field-still`, `npm run capture:3d-still`
- 主要驗證：
  - `npm run test:06`
  - `npm run test:browser`
  - `npm run test:smoke`
  - `npm run test:3d-capture`
  - `npm run test:ui-capture`
  - `npm run test:3d-looks`

## 輸出摘要

### 1) 逐格離線輸出（render*）

- 幀格式：16-bit PPM (`P6`)
- 編碼：HEVC (`libx265`) + `yuv420p10le` + HDR10 metadata (`bt2020` / `smpte2084`)
- 常見輸出：
  - `outputs/demo/<period>/cumulonimbus-quick-hdr.mp4`（建議追蹤版本）
  - `outputs/demo/<period>/cumulonimbus-test-hdr.mp4`（建議追蹤版本）
  - `outputs/demo/<period>/cumulonimbus-demo-loop.mp4`（建議追蹤版本）
- 對應指標：
  - `outputs/demo/<period>/metrics/cumulonimbus-quick-hdr.json`（建議追蹤版本）
  - `outputs/demo/<period>/metrics/cumulonimbus-test-hdr.json`（建議追蹤版本）
  - `outputs/demo/<period>/metrics/cumulonimbus-demo-loop.json`（建議追蹤版本）

### 2) 預覽與 still/capture

- 圖片輸出：PNG in `outputs/`
- 常見輸出：
  - `outputs/cumulonimbus-field-still.png`
  - `outputs/cumulonimbus-3d-still.png`
- 這條路徑同時供預覽 URL 與 smoke 測試回報。

## 常用參數

- `--width`, `--height`, `--fps`, `--seconds`
- `--seed`
- `--drift-cycle`, `--drift-amount`（`render:demo-loop`）
- `--preset` / `--look` / `--simPreset`
- `--renderer`, `--view`
- `--out`, `--metrics`（可自訂輸出）
- `--baseline`（`render:test`）

## 重複產出能力

可重複輸出的關鍵在於參數可控與 seed 固定：

- `seed` 控制擾動起點
- `params` 控制雲體形態、成長規則、光照與渲染
- 指標檔含 `git commit`、專案版本與運行 metadata
- 固定幀率與幀數確保可回放一致

## 下一步建議

1. 將此流程圖放入 `test:browser` 或 CI 報告
2. 每次 render 加入輸入參數 manifest
3. 輸出名稱加入 timestamp / runId，方便對比
4. 將 `outputs` 命名規則在文件中標準化

