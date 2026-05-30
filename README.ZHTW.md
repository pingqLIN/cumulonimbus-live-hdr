# Cumulonimbus Live HDR

積雨雲視覺模型原型。主線入口是 standalone 的 [06.html](06.html)，以 Three.js shader/raymarch 呈現可觀察、可調參的積雨雲體積近似。此專案重點是視覺一致性與直播/預覽工作流，不宣稱是真實大氣物理驗證模型。

## 快速啟動

```powershell
npm install
npm run dev
npm run test:06
npm run test:browser
```

`06.html` 也可直接用本機檔案開啟：

```text
file:///Q:/Projects/cumulonimbus-live-hdr/06.html
```

## 目前主線

[06.html](06.html) 是目前的單一 source of truth。它提供 seed、time、quality、tropopause、freezing level、wind shear、sun、ambient、grid、orthographic/perspective 與 HUD 控制。

重點控制：

- `頂高`：對流層頂高度，影響雲塔壓平位置與砧狀雲高度。
- `凍結`：凍結高度，影響中高層水滴到冰晶纖維質感的過渡。
- `風切`：高空風切，影響砧狀雲迎風/下風不對稱外流。
- `算力` / `自動算力`：調整內部渲染解析度與 raymarch 步數，用於平衡畫質與 FPS。

常用 query 參數：

```text
http://127.0.0.1:5173/06.html?seed=574&time=2.2&timeSpeed=0&quality=0.72
http://127.0.0.1:5173/06.html?freezingLevel=5&windShear=0.7
```

## 驗證

最小高訊號驗證：

```powershell
npm run test:06
npm run test:links
```

完整瀏覽器 smoke：

```powershell
npm run test:browser
```

輸出檔案通常寫入 `outputs/`；該資料夾是本機產物，不作為主要原始碼維護面。
