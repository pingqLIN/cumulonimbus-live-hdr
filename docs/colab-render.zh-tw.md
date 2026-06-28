# Colab Render 移植筆記

這份文件描述如何把 `cumulonimbus-live-hdr` 的離線 render pipeline 放到 Google Colab 執行。Colab 適合批次輸出與研究測試，不適合作為正式網站的即時 render server。

## 適用範圍

- 產生 quick/test/demo loop。
- 產生 `outputs/` 內的影片、frames、metrics。
- 讓 agent 或人類用同一條非互動命令重跑工作。

不適合：

- 每位網站訪客的即時逐幀 render。
- 長期常駐 API、WebSocket 或 WebRTC service。
- 依賴固定 GPU 型號或永久本機檔案。

## Colab Notebook 流程

1. 開啟 `notebooks/cumulonimbus_colab_render.ipynb`。
2. 選擇 GPU runtime。
3. 設定 repo URL。私有 repo 需要 Colab 端有 GitHub token 或先把 zip 上傳到 Drive。
4. 執行 setup cell。
5. 執行 render cell。
6. 從 `outputs/` 或 Google Drive 取回 artifacts。

## Agent 友善入口

Notebook 只是薄殼。實際工作由 `scripts/colab-runner.mjs` 處理：

```bash
npm run colab:render -- --mode quick --install --check -- --width 360 --height 640 --seconds 1
```

常用模式：

```bash
npm run colab:render -- --mode quick --install --check
npm run colab:render -- --mode test --install --check -- --width 540 --height 960 --seconds 5
npm run colab:render -- --mode demo --install --check -- --seconds 120 --width 720 --height 1280 --drift-cycle 90 --drift-amount 0.35
```

`--` 之前是 Colab runner 參數；`--` 之後會原樣轉交給既有 render script。

runner 會輸出：

- `outputs/colab/job-manifest.json`
- 既有 render script 產生的 MP4、frames、metrics。

## 最小驗證

在 Colab 或本機 worktree：

```bash
npm run check
npm run colab:render -- --mode quick --skip-render --check
```

完整 `npm run test:browser` 會啟動 browser-backed smoke suite，在本機約需數分鐘；Colab 上可能受 headless/browser 套件影響，不建議當作第一個 smoke gate。

## 與正式網站的關係

正式網站仍維持 client-side WebGL 互動。Colab 輸出的素材應作為：

- showcase video；
- 高品質 loop；
- release artifact；
- 未來 server-assisted cache 的研究資料。

不要把 Colab runtime 視為正式站後端。
