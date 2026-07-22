# 旅美幫 MLBTW.NET — 台灣旅美球員全紀錄

追蹤台灣旅美棒球選手在大聯盟與小聯盟的**所在球隊、今日賽程、數據與最新動態**的網站。核心是一張地理精準的美國地圖，把每位台灣選手「現在在哪」直覺地畫出來。

> 狀態：MVP（M0–M5）已完成、開發中。部分資料為示意佔位，逐步接入真實來源。

---

## 功能總覽

| 頁面 | 路徑 | 內容 |
|---|---|---|
| **主地圖**（首頁） | `/` | 美國地圖 + 台灣選手 pin；雙 tab：**今日賽程**（MLB Stats API、換算台灣時間、主/客場落在比賽確切球場）/ **母隊在哪裡**（全選手現況）。地圖與右側清單雙向連動。 |
| **選手列表** | `/players` | 依層級（MLB/AAA/AA/A+/A/R）分組，可被搜尋引擎索引。 |
| **球員頁** | `/players/[slug]` | Hero + 數據列 + **從台灣出身地出發的旅程地圖**（真實台灣島 + 太平洋航線 + scrollytelling）+ 最新新聞/照片/媒體牆。`Person` JSON-LD + 動態 OG 圖。 |
| **媒體牆** | `/media` | YouTube/IG/Threads/FB 貼文整合牆，可依平台/選手篩選、無限捲動。 |
| **關於** | `/about` | 團隊、贊助分層、`Organization` JSON-LD。 |

其他：`/sitemap.xml`、`/robots.txt`、`/api/cron/*`（資料抓取端點）。

---

## 技術棧

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript（strict）
- **樣式**：Tailwind CSS v4（CSS-first `@theme`）+ design tokens（`app/globals.css`）+ light/dark 主題（`data-theme`）
- **UI 元件**：shadcn/ui（Radix）+ class-variance-authority + lucide-react
- **地圖**：**d3-geo**（`geoAlbersUsa`）+ topojson-client + **us-atlas**（美國州界）+ **world-atlas**（台灣島）— 純 SVG、Server-side 計算、無 WebGL/Mapbox
- **手機抽屜**：vaul
- **資料**：MLB Stats API（`statsapi.mlb.com`，免金鑰）→ 本地快取 → ISR
- **套件管理**：pnpm

---

## 快速開始

需求：Node 20+、pnpm。

```bash
pnpm install
pnpm dev            # 開發：http://localhost:3000
```

其他指令：

```bash
pnpm build          # 生產建置
pnpm start          # 跑生產版（build 後）
pnpm lint           # ESLint
pnpm exec tsc --noEmit   # 型別檢查
```

### 環境變數（皆選用）

在 `.env.local`：

```bash
# 有填才會抓真實 YouTube 貼文；沒填則媒體牆用示意 fixture
YOUTUBE_API_KEY=

# IG / FB / Threads 需另建 Meta App 並過審後接入（尚未實作）
```

### 抓取資料（cron 端點）

前端只讀快取，不即時打外部 API。手動觸發抓取（Vercel 上由 Cron 定時呼叫）：

```bash
curl http://localhost:3000/api/cron/schedule   # 抓今日 MLB 賽程 → .data/schedule.json
curl http://localhost:3000/api/cron/social     # 抓社群貼文（需 YOUTUBE_API_KEY）→ .data/social.json
```

快取寫在 `.data/`（已 gitignore）；讀不到時回退 `data/*-fixture.json` 示意資料，確保頁面永遠有內容。

---

## 專案結構

```
app/
  page.tsx                  # 首頁＝主地圖（searchParams: tab/region）
  players/                  # 選手列表 + [slug] 球員頁 + opengraph-image
  media/                    # 媒體牆
  about/                    # 關於
  api/cron/{schedule,social}/route.ts   # 資料抓取（唯一會打外部 API 的地方）
  layout.tsx globals.css sitemap.ts robots.ts
components/
  map/     # 互動地圖（us-map-view / map-explorer / pin-list / hover-card / tabs …）
  player/  # 旅程地圖 scrollytelling（journey）
  media/   # 媒體牆（grid / card / filter-bar）
  nav/ footer/ theme/ brand/ ui/ icons/
lib/
  map/geo.ts               # d3-geo 投影 + 州界 path（server-only）
  map/taiwan.ts            # 真實台灣島（world-atlas + geoMercator，server-only）
  schedule/ social/        # 資料層（fetch / store / format）
  players.ts site.ts utils.ts
data/                      # teams / players / player-bios / *-fixture.json
types/                     # team / player / social
docs/                      # spec / progress / design-tokens / milestones
```

---

## 資料來源與現況

| 資料 | 來源 | 現況 |
|---|---|---|
| 球團主場座標 | 各隊主場（人工，真實經緯度）| ✅ 真 |
| 選手名單／英文名／守備位置 | 使用者提供 + 參考站整理 | ✅ 真（28 位，含 3 位台裔）|
| 選手出身地 + MLBAM id | **官方 MLB Stats API** | ✅ 真（22/25 解析成功）|
| 今日賽程（含確切球場、主/客） | **MLB Stats API**（`hydrate=venue(location)`）| ✅ 真（MLB；cron 抓）|
| 球員數據（AVG/OPS…） | — | ⏳ 待接（mlbamId 已備）|
| 媒體牆貼文 | YouTube API（待 key）/ Meta（待審）| ⏳ 示意 fixture |
| 團隊/贊助/新聞/照片 | — | ⏳ 示意佔位 |

> 原則：所有選手/數據/賽程一律以 SSR/SSG 的 HTML 存在（利於 SEO 與爬蟲）；重互動元件才 client-side。前端絕不直接打外部 API，一律走 cron → 快取 → ISR。**不從第三方網站爬資料**，只用官方免費來源。

---

## 開發節奏（milestone）

本專案以「一次做一個 milestone、逐個驗收」推進。相關文件：

- `CLAUDE.md` — 常駐開發鐵則（每個 session 載入）
- `docs/progress.md` — 進度日誌 + 決策紀錄（跨 session 記憶）
- `docs/spec.md` — 完整規格手冊
- `docs/design-tokens.md` — design token 值
- `docs/milestones/M0…M6.md` — 各階段任務

### 進度

| M | 名稱 | 狀態 |
|---|---|---|
| M0 | 專案地基（Next + token + 主題 + base 元件）| ✅ |
| M1 | Nav/Footer/關於頁 | ✅ |
| M2 | 精準美國地圖（靜態）| ✅ |
| M3 | 地圖互動 + 賽程 | ✅ |
| M4 | 選手列表 + 球員頁（旅程地圖）| ✅ |
| M5 | 媒體牆 | ✅ |
| M6 | 打磨/進階（開場動畫、數據圖表、電子報、贊助 CMS…）| ⬜ |

### Backlog（見 `docs/progress.md` 完整清單）

- 中／英雙語 i18n
- 球員真數據接入（cron → DB → ISR）、傷兵名單（IL）
- 球員照片與個人社群連結
- 現役＆回台灣（CPBL）球員、退役球員資料集
- 資料層由本地 JSON 換成真 DB/KV（上線前）

---

## 部署備註

- 目標平台 Vercel（Cron 定時打 `/api/cron/*`）。
- ⚠️ 本地 JSON 快取（`.data/`）在 serverless 不跨實例持久 → 上線前需換 DB/KV（`lib/*/store.ts` 已抽象好，方便替換）。
- 效能預算：LCP < 2.5s、INP < 200ms、CLS < 0.1、首屏 JS < 170KB gzipped。地圖用 SVG（非 WebGL）、字型 `next/font` self-host。

## 授權 / 致謝

- 資料來源：MLB Advanced Media（MLB Stats API）、Natural Earth / US Census（us-atlas、world-atlas）。
- 內部專案，尚未定授權。
