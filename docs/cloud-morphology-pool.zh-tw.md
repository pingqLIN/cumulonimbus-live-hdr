# 雲體型態池

## 目的

型態池把雲體外觀變因整理成可命名、可回放、可檢查的樣式。`seeded` 仍然保留 seed 驅動的自然隨機性；其它樣式則可直接強化某一類宏觀構型，方便比較、截圖與後續調參。

## 型態清單

| 值                   | UI 名稱     | 形態意圖                                             |
| -------------------- | ----------- | ---------------------------------------------------- |
| `seeded`             | Seeded pool | 由 seed 決定輪廓、表面、支解等多種 trait 的混合。    |
| `baseline`           | Base sphere | 保持接近球體，降低表面與超對比邊界變化。             |
| `macro-boundary`     | Macro edge  | 強化突出、伸長、壓縮、硬邊輪廓與缺口。               |
| `flatten`            | Flattened   | 壓扁與水平展寬，用於扁平雲體。                       |
| `skew-twist`         | Skew twist  | 加入偏斜、扭曲、沿風剪切，讓球體拓樸產生明顯姿態差。 |
| `tear-silk`          | Tear silk   | 強化模糊邊界、風吹支解、絲狀消散。                   |
| `budding`            | Budding     | 一大一小的附著形態，近似酵母菌出芽。                 |
| `giant-cumulonimbus` | Giant Cb    | 原始巨型積雨雲塔狀與砧狀輪廓，作為型態池成員。       |

## 可追溯公式

型態池採用「樣式索引 + seed trait」的簡單公式：

- `src/app/raymarch-cloud-renderer.ts` 定義 `CLOUD_MORPHOLOGY_STYLES`，並把樣式轉成數值送進 `uMorphologyStyle` 與 `CUMULONIMBUS_MORPHOLOGY_STYLE`。
- `src/app/cloud-morphology-library.ts` 是 UI 使用的型態庫資料檔，集中保存名稱、短代碼、用途描述與 trait 標籤。
- `src/app/runtime-options.ts` 從 URL 讀取 `morphologyStyle`、`morphology`、`shapeStyle` 或 `shape`。
- `src/app/raymarch-cloud-shader.ts` 以 `sphericalRecipe(slot) = hash(uSeed * 0.0137 + slot * 17.371)` 生成可重複的 trait 取樣。
- `sphericalTrait(slot, onset, full)` 用 `smoothstep` 控制 trait 何時出現、何時達到滿幅。
- `morphologyMask(style)` 和 `morphologyForcedTrait(...)` 讓明確樣式能強制某些 trait，但 `seeded` 仍維持自然抽樣。

特殊形態的 macro 分支：

- `mapBuddingCloudMacro(...)`：主球、小芽、neck 三者以 smooth union 合成，形成一大一小的出芽構型。
- `mapOriginalGiantCumulonimbusMacro(...)`：復用原始 tower/anvil cell 邏輯，讓單雲模式也能直接切到巨型積雨雲。

## UI 與 URL 用法

網頁控制後台已在 Cloud Body 面板加入型態庫：

- 元件：`#select-morphology`
- 型態庫：`#cloud-morphology-library`
- 卡片：`[data-morphology-style]`
- 狀態文字：`#morphology-library-current` 與 `#morphology-library-intent`
- 相關檔案：`src/ui/app-shell.ts`、`src/ui/controls.ts`

點選型態卡或切換 Morph select 都會寫入同一個 `morphologyStyle` option，更新 active 卡片狀態，並立即套用到 renderer。

URL 可直接指定：

```text
/?morphology=seeded
/?morphology=budding
/?morphology=giant-cumulonimbus
/?shape=tear-silk
```

截圖腳本會透過 `scripts/lib/preview-url.mjs` 轉送同一組 query key，因此自動化截圖與 UI 使用的是同一套型態池。

## 已儲存的樣式檢查輸出

目前樣式檢查輸出已存於：

```text
outputs/analysis/morphology-pool-samples-20260628/
```

重要檔案：

- `contact-sheet.png`：八種型態的總覽圖。
- `manifest.json`：每種型態的 PNG 分析與形態指標。
- `ui-morphology-landscape.png`：包含 Morph selector 的 UI 樣式檢查截圖。

注意：`.gitignore` 目前忽略 `outputs/*`，所以這些截圖與 manifest 是本機已保存，但不會自動進入 Git 版本控管。若要把樣式板變成版本化素材，應另存到 tracked 的 docs/assets 類路徑。

## 檢查紀錄

本輪已做的檢查：

- `npm run check`
- live-entry smoke capture
- 八種型態各自截圖
- landscape UI capture，並實際把 `#select-morphology` 切到 `budding`
- `git diff --check` 僅回報既有 CRLF normalization warning，未發現空白錯誤
