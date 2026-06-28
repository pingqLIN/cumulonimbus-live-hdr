![Cumulonimbus Live HDR banner](assets/caief-banner.jpg)

# Cumulonimbus Live HDR

Cumulonimbus Live HDR 是 Vite/TypeScript 的單一 canvas WebGL 積雨雲視覺 renderer。
目前公開網站與本機預覽的入口是 [`index.html`](index.html)，由
`src/app/main.ts` 載入 raymarch cloud renderer。它是用於視覺迭代、截圖與瀏覽器呈現的體積近似模型，不宣稱是真實大氣物理模擬。

英文權威版：[README.md](README.md)

## 目前主線

- Runtime 入口：`index.html`
- App 模組：`src/app/main.ts`
- 雲體 renderer：`src/app/raymarch-cloud-renderer.ts`
- Shader source：`src/app/raymarch-cloud-shader.ts`
- 公開網站建置：`npm run build` -> `dist/`，由
  `.github/workflows/deploy-pages.yml` 部署到 GitHub Pages

舊的 standalone HTML 入口已不是 source of truth。請以 Vite app 與 URL query
參數作為本機預覽、smoke 測試與網站輸出的主線。

## 快速啟動

```powershell
npm install
npm run dev
npm run check
npm run test:live-entry
npm run test:browser
```

本機預覽：

```text
http://127.0.0.1:5173/
```

`test:live-entry` 會檢查現行單一 canvas live 入口；`test:browser` 會跑較完整的
browser-backed smoke suite。

## 常用 URL

Live canvas：

```text
http://127.0.0.1:5173/?live=1
```

手機 horizon preset：

```text
http://127.0.0.1:5173/?live=1&orientation=portrait&preset=mobile-horizon&simWidth=390&simHeight=844
```

固定截圖：

```text
http://127.0.0.1:5173/?capture=1&captureFrames=1&seed=574&time=2.2&preset=mobile-horizon
```

常用 query 參數：

- `seed`, `time`, `fps`
- `orientation=portrait|landscape`
- `simWidth`, `simHeight`, `maxPixels`
- `preset=mobile-horizon|sunrise-horizon|noon-blue|model-landscape|model-portrait`
- `systems`, `tropopause`, `freezingLevel`, `windShear`
- `cloudCurl`, `fbmOctaves`, `stepSize`, `maxSteps`
- `sunIntensity`, `ambientIntensity`, `sunElevation`, `sunViewerAngle`
- `sky=atmosphere|clear|sunset|moonlight|workbench`
- `light=daylight|golden-side|backlit-edge`

## 行動裝置行為

Runtime 會用窄螢幕偵測選擇手機視覺預設，並用粗指標觸控與 iOS Chrome 訊號調整較低風險的
renderer 預算預設。手機預設會降低 pixel budget 與 raymarch 工作量，同時放寬模型視野，讓
portrait layout 仍能看見完整雲體。手機 smoke scripts 會檢查全視窗 canvas 幾何、WebGL、
runtime error 與非空雲體輸出。

## 截圖與驗證

```powershell
npm run capture:3d-still
npm run test:live-entry
npm run test:ui-capture
npm run test:raymarch
npm run test:browser
```

輸出通常寫入 `outputs/`。除非明確指定 demo artifact，`outputs/` 內容視為本機產物。

## 文件

- [Project image generation pipeline](docs/image-generation-pipeline.md)
- [專案影像程式化生成與流水線](docs/image-generation-pipeline.zh-tw.md)
- [Research notes](docs/research-notes.md)
- [Colab render workflow](docs/colab-render.md)

## 開發注意事項

除非任務明確需要臨時 branch 或 worktree，`main` 是 canonical working branch。開發計畫、
audit packet、reviewer raw output 與 generated analysis 檔案預設保留在 local-only 位置，
除非使用者明確要求發布。
