# 旅美幫 2.0 — Claude Code 專案守則

你正在幫「旅美幫 MLBTW.NET」重做官網。這個檔案每次 session 都會載入，是你的常駐記憶。
**開工前先做這件事**：讀 `docs/progress.md` 確認目前在哪個 milestone，只做那一個。

## 工作節奏（最重要）
1. 一次只做**一個 milestone**。做別的之前先問我。
2. 每個 milestone 的規格在 `docs/milestones/M{n}.md`，開工前完整讀那一個檔。
3. 動手前先用 **plan mode** 提計畫給我確認，我同意才寫 code。
4. 做完後：跑該 milestone 的「驗證指令」→ 貼出結果 → 更新 `docs/progress.md` → 停下來等我驗收。**不要自動接著做下一個。**
5. 卡住或要偏離規格時：停下來問，不要自己發明替代方案。

## 技術鐵則（不可違反）
- **框架**：Next.js 16 App Router + React 19 + TypeScript (strict)。用 Server Components 為預設，只有需要互動才加 `"use client"`。
- **樣式**：Tailwind v4 + CSS variables。顏色/間距**一律用 design token**（`app/globals.css` 定義），禁止寫死 hex 或 px（除非 token 沒有）。
- **MVP 地圖**：用 `react-simple-maps` + `d3-geo` (`geoAlbersUsa`) + `us-atlas` 的 `states-10m`。**絕對不要在 MVP 用 Mapbox 或 WebGL。**
- **地圖 = 裝飾層**：所有選手資料、數據、賽程、新聞一律是 SSR/SSG 的 HTML。互動地圖/動畫用 `next/dynamic` `ssr:false`。
- **重元件延後**：3D、開場動畫、Mapbox 都是 MVP 之後，且一律 lazy-load + `prefers-reduced-motion` 降級。
- **前端絕不直接打外部 API**：MLB/社群資料走 Cron → DB → ISR，前端只讀 DB。

## 每頁必做（否則不算完成）
- 語意化 HTML：每頁唯一 `<h1>`、用 `<nav><main><article>`。`<html lang="zh-Hant">`。
- `generateMetadata()`：title / description / OG。
- 對應的 JSON-LD（球員頁 `Person`、關於頁 `Organization`、新聞 `NewsArticle`）。
- Mobile-first：先寫手機樣式再 `md:`/`lg:` 往上加。320–430px 不可破版。

## 效能預算（每頁上線前必過，Lighthouse mobile + 4G 節流）
- LCP < 2.5s ｜ INP < 200ms ｜ CLS < 0.1
- 首屏 JS < 170KB gzipped ｜ 主地圖頁總傳輸 < 500KB
- 圖片用 `next/image`（AVIF/WebP + lazy）；字型用 `next/font` self-host + `display:swap`。

## 程式風格
- 元件放 `components/`，依功能分資料夾（`components/nav/`、`components/map/`）。
- 資料模型集中在 `types/`，假資料在 `data/`。
- 檔名 kebab-case，元件 PascalCase。
- 每個 `"use client"` 元件盡量小，把靜態部分留在 Server Component。
- Commit 訊息用 conventional commits（`feat:`、`fix:`、`chore:`）。

## 參考文件（需要時才讀，不要每次全讀）
- `docs/spec.md` — 完整規格手冊（當字典查特定細節）。
- `docs/design-tokens.md` — 所有 token 的值。
- `docs/milestones/M{n}.md` — 各階段任務。

## 驗收哲學
完成標準是「可驗證的事實」不是「看起來對」。例如地圖 milestone 的驗收是「`curl` 頁面 view-source 看得到 `<svg>`」「pin 座標對比 Google Maps 抽查」，不是「地圖很漂亮」。做完務必實際跑驗證指令並貼結果。
