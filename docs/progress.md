# 開發進度 Progress

> Claude 每次開工先讀這裡，確認「目前 milestone」和「下一步」。
> 每完成一個 milestone，Claude 更新這個檔案，然後停下等人類驗收。

## 目前狀態
- **目前 milestone**：M3（🟡 進行中）
- **下一步**：完成地圖互動（雙 Tab + hover 卡 + 賽程）→ 驗證 → 待驗收

## Milestone 進度表

| Milestone | 狀態 | 驗收人 | 備註 |
|---|---|---|---|
| M0 專案地基 | ✅ 已驗收 | 人類 | 2026-07-21 通過 |
| M1 Nav/Footer/關於頁 | ✅ 已驗收 | 人類 | 2026-07-21 通過 |
| M2 精準美國地圖(靜態) | ✅ 已驗收 | 人類 | 2026-07-22 通過（含藍點隱藏/深色邊界微調） |
| M3 地圖互動+賽程 | 🟡 進行中 | | |
| M4 選手列表+球員頁 | ⬜ 未開始 | | |
| M5 媒體牆 | ⬜ 未開始 | | |
| M6 打磨/進階 | ⬜ 未開始 | | |

狀態圖例：⬜ 未開始 · 🟡 進行中 · 🔵 待驗收 · ✅ 已驗收通過

## 決策紀錄 (Decision Log)
> 開發中做的重要決定寫在這，避免之後忘記或反覆。
- (範例) 2026-XX-XX：球員 slug 用英文名 kebab-case，例：cheng-tsung-che。
- 2026-07-21（M0）：base 元件用 **shadcn/ui CLI**（radix base），token 對接方式＝在 `globals.css` 把 shadcn semantic 變數（`--primary`、`--background`…）指向我們的 design token。
- 2026-07-21（M0）：dark 主題以 **`data-theme` 屬性**驅動（非 shadcn 預設的 `.dark` class），已把 `@custom-variant dark` 改成 `[data-theme="dark"]`。
- 2026-07-21（M0）：防閃爍＝`<head>` inline script（首屏）＋ ThemeProvider 的 **layout effect** 依 localStorage 重套（因 React 19 hydration 會移除 script 寫入的屬性，`suppressHydrationWarning` 無法阻止移除）。
- 2026-07-21（M0）：舊實驗檔 `components/Map/Map.jsx`（d3/topojson）保留但不 import；M2 會改用 `react-simple-maps` 重寫。它的 2 個 lint warning 屬既有、非 M0 產生。
- 2026-07-21（M1）：`lucide-react@1.x` **已移除品牌 icon**（Youtube/Instagram/Facebook 都不存在，只剩 Menu/AtSign 等）。四社群 icon 改用 `components/footer/social-links.tsx` 內的 **inline SVG**。
- 2026-07-21（M1）：手機漢堡選單（`components/nav/mobile-menu.tsx`）**移除了 Radix 的 enter/exit 動畫 class**。原因：Radix Presence 靠 `animationend` 才卸載節點，但動畫在背景分頁 / `prefers-reduced-motion` 下不會觸發 → 關閉後 overlay 會卡在畫面上。拿掉動畫後即時卸載，穩定。動畫留待 M6 打磨（需搭配 forceMount 或別的卸載策略）。
- 2026-07-21（M1）：團隊 6 人（`data/team.ts`）、贊助商三層（`data/sponsors.ts`）皆為「（示意）」佔位；網站網址 `https://www.mlbtw.net`（`lib/site.ts`，僅作 SEO tag，未轉址）；/about 三顆 CTA 去向、newsletter 後端待補。
- 2026-07-22（M2）：地圖用**純 d3-geo Server Component**（`components/map/UsMap.tsx`），非 react-simple-maps（後者留 M3）。`geoAlbersUsa().fitSize` 州界與 pin 共用同一 projection → 對齊。us-atlas `states-10m` build 時內嵌、不外部 CDN。
- 2026-07-22（M2）：地圖傳輸最佳化——(1) `geoPath().digits(1)` 座標取 1 位小數；(2) 用 `nation` 填色 + `mesh(states, a!==b)` 內部州界只畫一次（取代 50 個多邊形重描邊界）。/map 文件 gzip 從 225KB 降到 **107KB**（<150KB 預算）。
- 2026-07-22（M2）：`data/teams.ts` 30 隊主場經緯度為真實值（`[lng,lat]`）。特例：運動家=Sacramento Sutter Health Park（2025–）、光芒=Tropicana Field、**多倫多藍鳥在加拿大** geoAlbersUsa 回 null → 用鄰近美國點(水牛城)的投影 Jacobian 近似定位（`outsideUs` flag）。
- 2026-07-22（M2）：`data/players.ts` 25 位為使用者提供真實名單，依**母球隊**highlight，pin=選手目前所在球場（MLB 或小聯盟）。ACL 新人聯盟用母隊亞利桑那複合球場**近似**座標（`venueApprox`）；柯敬賢「安大略塔台蜂」暫對應道奇 Single-A（`needsReview`，隊名待確認）；賴謙凡(DSL 多明尼加)+林珺希/何樺/林睿杰(球隊未定) `latLng:null` → 列於 /map 側邊清單。英文 slug/nameEn 留 M4。
- 2026-07-22（M2）：`components/Map/` 因大小寫在 macOS 檔案系統與新檔衝突，已改名為小寫 `components/map/`（含舊 `Map.jsx` 仍不 import）。
- 2026-07-22（環境）：此 sandbox 的 `pnpm dev` 有時無法連 `fonts.gstatic.com` 抓 next/font（Inter）→ 整站 500。`pnpm build` 會把字型快取進 `.next`，故用 `pnpm start` 驗證正常。使用者本機有網路即無此問題。
- 2026-07-22（M2 微調，驗收中）：依使用者要求——(1) 其他 MLB 球場藍點**暫不顯示**（`data/teams.ts` 資料保留、`UsMap` 不畫底點、圖例移除藍點）；(2) 深色模式州界改 `dark:stroke-border-strong` 提高對比。

## 卡住 / 待人類確認的事項
- (無)

## 已知技術債 / 之後要回來處理
- (無)
