# 旅美幫 2.0 — 工程開發規格書 (Engineering Spec)

> 版本 v1.0 · MVP 導向 · 給前後端工程師開工用
> 對應 Figma：`Site Flow`（流程稿）+ `Design System`（token/元件）
> 原則：**一次做一個 milestone，驗收通過再進下一個**。每個 milestone 底部都有「驗收清單 (DoD)」。

---

## 0. 這份文件怎麼讀

- **第 1 節**：技術選型與理由（先對齊 stack）
- **第 2 節**：整體架構、路由、資料流
- **第 3 節**：Design Tokens（直接可貼進 code）
- **第 4 節**：全站共用 — Navigation / Footer / RWD / SEO / 效能預算
- **第 5 節**：MVP 分階段開發計畫（M0–M6，逐步驗收）
- **第 6 節**：各頁面詳細規格
- **第 7 節**：資料來源與 API 抓取策略
- **第 8 節**：手機效能能不能撐住（實測預算 + 降級策略）

---

## 1. 技術選型 (Tech Stack)

| 層 | 選擇 | 為什麼 |
|---|---|---|
| 框架 | **Next.js 16 (App Router) + React 19** | SSR/SSG/ISR 三種渲染混用，SEO 與效能的關鍵。App Router 的 Server Components 讓內容 HTML 直出。 |
| 語言 | **TypeScript** (strict) | 型別安全，資料模型（選手、賽程）明確。 |
| 樣式 | **Tailwind CSS v4** + CSS Variables | Design token 直接映射成 CSS 變數，light/dark 用 `data-theme` 切換。 |
| UI 基礎元件 | **shadcn/ui**（Radix 底層）| 無樣式、可及性(a11y)完整、程式碼進 repo 可控。 |
| **MVP 地圖** | **react-simple-maps + d3-geo + us-atlas TopoJSON** | ⭐ 見下方說明。純 SVG、精準（美國普查局邊界）、零 API 成本、SEO 友善、手機輕量。 |
| 未來地圖 | Mapbox GL JS / react-map-gl（M6 之後）| 需要真實地理縮放、聚合時再上，可平滑替換。 |
| 3D（開場動畫，非 MVP）| Three.js / react-three-fiber | 之後才做，且一律 lazy-load + 降級。 |
| 資料視覺化 | **D3 (scale/shape) + 自繪 SVG** 或 **visx** | 打擊率折線、熱區圖。SVG 可 SSR。 |
| 動畫 | **Framer Motion (motion/react)** | 卡片進場、pin 落下、頁面轉場。尊重 `prefers-reduced-motion`。 |
| 資料庫/快取 | **PostgreSQL (Supabase 或 Neon) + ISR** | 存選手、賽程、社群貼文快取。前端不直接打外部 API。 |
| 內容管理 | **Sanity 或 Payload CMS** | 新聞、贊助商 LOGO、團隊成員後台可改。 |
| 部署 | **Vercel** | Next.js 原生、ISR/邊緣快取、免費額度夠 MVP。 |
| 監測 | Vercel Analytics + Sentry | Core Web Vitals、錯誤追蹤。 |

### ⭐ 為什麼 MVP 地圖不用 Mapbox？

你要求「美國地圖要精準」。精準的關鍵不是地圖引擎，而是**邊界資料 (geometry)**。做法：

- 使用 **`us-atlas`** npm 套件的 `states-10m.json`（來源：US Census Bureau，官方州界，非手繪）。
- 用 **`d3-geo` 的 `geoAlbersUsa()`** 投影 — 這是專為美國設計的投影，會把阿拉斯加、夏威夷擺到左下角，比麥卡托更適合「全美球團分布」。
- 球團據點用真實經緯度，透過同一個 projection 換算成 SVG 座標，**pin 位置與州界完全對齊**。

好處：純 SVG（可 SSR、可被 Google 索引、手機無 WebGL 負擔）、**零地圖 API 費用**、檔案小（states-10m 約 100KB gzipped）。等到需要「街道級縮放、上千點聚合」時，同一份球團經緯度資料可直接餵給 Mapbox，UI 邏輯不變。

---

## 2. 整體架構

### 2.1 路由結構 (App Router)

```
app/
├── layout.tsx                 # 全站 shell：<Nav> + {children} + <Footer>，掛 theme
├── page.tsx                   # 首頁（MVP：直接是主地圖；開場動畫之後才加）
├── map/
│   └── page.tsx               # 主地圖頁（美國/台灣/日本 × 今日賽程/母隊據點）
├── players/
│   ├── page.tsx               # 選手列表（可被搜尋引擎索引的 HTML 清單）
│   └── [slug]/page.tsx        # 球員頁（SSG + ISR），slug = cheng-tsung-che
├── media/
│   └── page.tsx               # 媒體牆（四平台整合）
├── about/
│   └── page.tsx               # 關於旅美幫 + 團隊 + 贊助
├── api/
│   ├── revalidate/route.ts    # ISR on-demand 重新驗證
│   └── cron/
│       ├── schedule/route.ts  # 抓 MLB 賽程（每 10 分鐘）
│       └── social/route.ts    # 抓四平台貼文（每 30 分鐘）
├── sitemap.ts                 # 動態 sitemap
├── robots.ts
└── opengraph-image.tsx        # 預設 OG 圖
```

### 2.2 渲染策略（每頁怎麼算）

| 頁面 | 渲染方式 | 快取 | 理由 |
|---|---|---|---|
| 主地圖 | Server Component 直出 SVG + client island 做互動 | ISR 60s（賽程） | 地圖骨架 SSR，hover/點擊是 client。 |
| 球員列表 | SSG | rebuild on content change | 純清單，最利 SEO。 |
| 球員頁 | **SSG + ISR** | `revalidate: 600` | 靜態產生每位選手頁，數據每 10 分鐘更新。 |
| 媒體牆 | Server Component 讀 DB 快取 | ISR 300s | 不即時打外部 API。 |
| 關於頁 | SSG | on CMS change | 幾乎不變。 |

### 2.3 資料流（重點：前端絕不直接打外部 API）

```
外部來源 (MLB Stats API / YouTube / IG / FB / Threads)
   │   ← Vercel Cron 定時抓取
   ▼
PostgreSQL (正規化後儲存)
   │   ← Next.js Server Component 讀取
   ▼
ISR 快取的 HTML
   │
   ▼
使用者（拿到的是已快取的頁面，快且穩，不會撞 rate limit）
```

---

## 3. Design Tokens（可直接貼進 code）

> 三層架構：Primitives → Semantic(light/dark) → Scale/DataViz。
> 已與 Figma variables 完全同步。

### 3.1 CSS Variables（`app/globals.css`）

```css
:root {
  /* --- Primitives --- */
  --red-50:#fcebec; --red-100:#f7c9cd; --red-300:#e8737c;
  --red-500:#c4333f; --red-700:#8a1e2d; --red-900:#4e121a;
  --sky-50:#e6f7fe; --sky-300:#7fdbff; --sky-500:#4fd1ff;
  --sky-700:#1e7fa8; --sky-900:#0e3b50;
  --gold-300:#ffd98a; --gold-500:#e3a51f; --gold-700:#a8760f;
  --green-300:#9bd98a; --green-500:#4a9e5c; --green-700:#2e6b3c;
  --neutral-0:#ffffff; --neutral-50:#faf6ed; --neutral-100:#f1ece0;
  --neutral-200:#e1dac9; --neutral-400:#a8a190; --neutral-600:#6b6555;
  --neutral-800:#2c2a24; --neutral-900:#1a1918;
  --navy-700:#16233c; --navy-800:#0e1626; --navy-900:#0e1626; --navy-950:#070b14;

  /* --- Scale (spacing 4pt) --- */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;
  --space-12:48px; --space-16:64px;
  --radius-sm:8px; --radius-md:12px; --radius-lg:18px; --radius-xl:24px; --radius-pill:999px;
}

/* --- Semantic: Light (default) --- */
:root, [data-theme="light"] {
  --bg-canvas:var(--neutral-50);
  --bg-surface:var(--neutral-0);
  --bg-surface-raised:var(--neutral-0);
  --bg-inverse:var(--navy-900);
  --text-primary:var(--neutral-900);
  --text-secondary:var(--neutral-600);
  --text-on-brand:var(--neutral-0);
  --text-on-accent:var(--navy-900);
  --border-subtle:var(--neutral-200);
  --border-strong:var(--neutral-400);
  --brand-primary:var(--red-500);
  --brand-primary-hover:var(--red-700);
  --brand-accent:var(--sky-500);
  --brand-accent-text:var(--sky-700);
  --status-success:var(--green-500);
  --status-warning:var(--gold-500);
  --status-danger:var(--red-500);
  --level-low:var(--green-500);   /* 🍃 低階小聯盟 */
  --level-mid:var(--gold-500);    /* 🌷 AA/AAA */
  --level-mlb:var(--red-500);     /* 🌼 大聯盟 */
  /* data viz */
  --viz-cat-1:#c4333f; --viz-cat-2:#1e7fa8; --viz-cat-3:#e3a51f;
  --viz-cat-4:#4a9e5c; --viz-cat-5:#7a5cc4; --viz-cat-6:#d97706;
  --viz-seq-1:#fcebec; --viz-seq-2:#f3b0b6; --viz-seq-3:#e8737c;
  --viz-seq-4:#c4333f; --viz-seq-5:#8a1e2d;
  --viz-grid:#e1dac9; --viz-axis:#6b6555;
}

/* --- Semantic: Dark --- */
[data-theme="dark"] {
  --bg-canvas:var(--navy-900);
  --bg-surface:var(--navy-900);
  --bg-surface-raised:var(--navy-700);
  --bg-inverse:var(--neutral-0);
  --text-primary:var(--neutral-0);
  --text-secondary:var(--neutral-400);
  --text-on-brand:var(--neutral-0);
  --text-on-accent:var(--navy-900);
  --border-subtle:var(--navy-700);
  --border-strong:var(--neutral-600);
  --brand-primary:var(--red-500);
  --brand-primary-hover:var(--red-300);
  --brand-accent:var(--sky-500);
  --brand-accent-text:var(--sky-500);
  --status-success:var(--green-300);
  --status-warning:var(--gold-300);
  --status-danger:var(--red-300);
  --level-low:var(--green-300);
  --level-mid:var(--gold-300);
  --level-mlb:var(--red-300);
  --viz-cat-1:#e8737c; --viz-cat-2:#4fd1ff; --viz-cat-3:#ffd98a;
  --viz-cat-4:#9bd98a; --viz-cat-5:#b49be8; --viz-cat-6:#fbbf77;
  --viz-seq-1:#2a1418; --viz-seq-2:#5e202a; --viz-seq-3:#8a1e2d;
  --viz-seq-4:#c4333f; --viz-seq-5:#e8737c;
  --viz-grid:#22314f; --viz-axis:#7a8296;
}
```

### 3.2 字型

```css
/* next/font — 自架、無 FOUT、無外部請求 */
--font-sans: "Noto Sans TC", system-ui, sans-serif; /* 中文標題+內文 */
--font-num:  "Inter", system-ui, sans-serif;          /* 數字/英文/標籤 */
```

字級（text styles，對應 Figma）：

| Token | Font | Size / Line | 用途 |
|---|---|---|---|
| Display XL | Noto Sans TC Bold | 44 / 120% | 頁面主標 |
| Heading L | Noto Sans TC Bold | 32 / 125% | 區塊標題 |
| Heading M | Noto Sans TC Bold | 24 / 130% | 卡片標題 |
| Heading S | Noto Sans TC Bold | 18 / 135% | 小標 |
| Body L | Noto Sans TC Regular | 18 / 150% | 大內文 |
| Body M | Noto Sans TC Regular | 15 / 155% | 內文 |
| Body S | Noto Sans TC Regular | 13 / 150% | 說明 |
| Label M | Inter Medium | 13 / 120% (+2 LS) | 標籤 |
| Overline | Inter SemiBold | 12 / 120% (+18 LS) | 分類眉標 |
| Stat Number | Inter SemiBold | 28 / 110% | 數據數字 |

### 3.3 Tailwind v4 對接（`@theme`）

```css
/* app/globals.css — Tailwind v4 用 CSS-first 設定 */
@import "tailwindcss";
@theme {
  --color-canvas: var(--bg-canvas);
  --color-surface: var(--bg-surface);
  --color-brand: var(--brand-primary);
  --color-accent: var(--brand-accent);
  --color-text: var(--text-primary);
  --color-text-muted: var(--text-secondary);
  --radius-md: var(--radius-md);
  /* → 產生 bg-canvas / text-brand / rounded-md 等 utility */
}
```

### 3.4 陰影（effect styles）

```css
--elevation-1: 0 2px 8px rgba(26,25,24,.08);
--elevation-2: 0 6px 18px rgba(26,25,24,.12);
--elevation-3: 0 14px 40px rgba(26,25,24,.18);
```

---

## 4. 全站共用規格

### 4.1 Navigation（導覽列）

**桌機**：固定頂部 (`sticky top-0`)，高度 64px。左：LOGO（棒球圖示 + 旅美幫字樣）。中/右：`地圖 · 選手 · 媒體牆 · 關於`。最右：主題切換鈕（☀️/🌙）。

**手機**（<768px）：LOGO 靠左 + 漢堡選單靠右。點漢堡開全屏 overlay 選單（Radix Dialog）。

```tsx
// components/nav/Nav.tsx — Server Component 外殼 + client 的漢堡/主題切換
const NAV_ITEMS = [
  { href: "/map",     label: "地圖" },
  { href: "/players", label: "選手" },
  { href: "/media",   label: "媒體牆" },
  { href: "/about",   label: "關於" },
];
```

- 目前頁面用 `aria-current="page"`，顏色 `--brand-accent`。
- 主題切換：寫入 `localStorage` + `document.documentElement.dataset.theme`；用 inline script 在 `<head>` 提前套用避免閃爍 (FART)。

### 4.2 Footer

三欄（手機堆疊）：
1. **品牌**：LOGO + 一句話簡介 + 版權。
2. **網站地圖**：地圖 / 選手 / 媒體牆 / 關於 / 贊助我們。
3. **社群**：YouTube / Instagram / Threads / Facebook 四顆 icon（連到 mlbtwnet 各帳號）+ 電子報訂閱框。

底部：`© 2026 旅美幫 MLBTW.NET`。所有連結是真 `<a>`（SEO 內鏈）。

### 4.3 RWD 斷點

| 斷點 | 寬度 | 佈局變化 |
|---|---|---|
| `sm` | ≥640 | 單欄 → 卡片可雙欄 |
| `md` | ≥768 | 漢堡 → 完整導覽列；地圖右欄出現 |
| `lg` | ≥1024 | 內容最大寬 1200px 置中 |
| `xl` | ≥1280 | 媒體牆 3–4 欄 |

**Mobile-first 原則**：所有元件先寫手機版樣式，再用 `md:` `lg:` 往上加。核心 RWD 決策（已在 Figma 手機稿定義）：
- **主地圖**：桌機右側賽程欄 → 手機**底部抽屜 (bottom sheet)**，可拖曳。
- **球員頁旅程地圖**：桌機並排 → 手機**地圖 sticky 置頂 40vh**，卡片下方捲動。
- **媒體牆**：桌機 3–4 欄 masonry → 手機單欄；篩選列橫向滑動。
- **關於頁**：團隊卡桌機 3×2 網格 → 手機橫向滑動 carousel；贊助分層直排。

### 4.4 SEO 規格（每頁必做）

**全站**：
- `app/sitemap.ts` 動態產生（含每位選手 URL）。
- `app/robots.ts`。
- `metadataBase` + 每頁 `generateMetadata()`（title/description/OG/Twitter card）。
- 語意化 HTML：`<nav> <main> <article> <h1>`（每頁唯一 h1）。
- 繁中 `<html lang="zh-Hant">`。

**結構化資料 (JSON-LD)**：
- 球員頁：`Person` + `sameAs`（連到選手社群）；賽事用 `SportsEvent`。
- 關於頁：`Organization`（含 `sameAs` 四大社群、`logo`）。
- 新聞：`NewsArticle`。

**球員頁範例 metadata**：
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const p = await getPlayer(params.slug);
  return {
    title: `${p.nameZh}（${p.team}）數據與旅程 | 旅美幫`,
    description: `${p.nameZh} 最新打擊數據、從${p.hometown}到大聯盟的旅程、新聞與社群動態。`,
    openGraph: { images: [`/players/${p.slug}/opengraph-image`] },
    alternates: { canonical: `/players/${p.slug}` },
  };
}
```

**關鍵**：所有地圖 / 3D / canvas 都是「加值裝飾層」。選手名、數據、賽程、新聞一律以 SSR/SSG 的 HTML 存在，爬蟲永遠拿得到完整內容。互動元件用 `next/dynamic` 的 `ssr:false` 只在 client 掛載。

### 4.5 效能預算 (Performance Budget)

每頁上線前必須通過（Lighthouse mobile，中階 Android + 4G 節流）：

| 指標 | 目標 |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| 首屏 JS (gzipped) | < 170KB |
| 主地圖頁總傳輸 | < 500KB |

達標手段：Server Components 少送 JS、地圖用 SVG 非 WebGL、圖片用 `next/image`（AVIF/WebP + lazy）、字型 `next/font` self-host + `display:swap`、互動元件全部 lazy。

---

## 5. MVP 分階段開發計畫 ⭐

> **核心工作方式：一個 milestone 做完 → 跑驗收清單 (DoD) → 確認沒問題 → 才進下一個。**
> 每個 milestone 都是可獨立 demo 的完整片段。

### M0 — 專案地基（1 個 milestone 先打底）
**做什麼**：
- `create-next-app`（App Router + TS + Tailwind v4）。
- 貼入第 3 節所有 design tokens 到 `globals.css`。
- 設定 `next/font`（Noto Sans TC + Inter）。
- 建 `<ThemeProvider>`（light/dark 切換 + 防閃爍 inline script）。
- 建 shadcn/ui base（Button/Card/Dialog/Tabs/Badge）套上我們的 token。
- 空的 `layout.tsx`（含 `<Nav>` `<Footer>` 骨架，內容先放假資料）。

**DoD**：
- [ ] `npm run build` 通過、`npm run dev` 起得來。
- [ ] 切換 light/dark，背景/文字色正確變化、重整不閃爍。
- [ ] Button/Card 三種變體顏色符合 Figma。
- [ ] Lighthouse 空殼頁效能 100。

### M1 — Navigation + Footer + 靜態關於頁
**做什麼**：完整導覽列（桌機+手機漢堡）、Footer、`/about` 靜態頁（團隊 + 贊助，資料先寫死在檔案裡）。
**為什麼先做這個**：最單純、無外部資料，可驗證 RWD、主題、SEO metadata、路由跳轉全都通。
**DoD**：
- [ ] 手機漢堡選單開合正常、可及性（鍵盤/aria）過。
- [ ] 桌機/手機 Footer 佈局符合 Figma。
- [ ] `/about` 有正確 title/OG/`Organization` JSON-LD。
- [ ] 四大社群連結正確導向 mlbtwnet 帳號。
- [ ] 手機 RWD 無破版（320–430px 都測）。

### M2 — 精準美國地圖（靜態版，MVP 核心）⭐
**做什麼**：
- 裝 `react-simple-maps` `d3-geo` `topojson-client` `us-atlas`。
- `<UsMap>` 元件：`geoAlbersUsa` 投影 + `states-10m` 州界。
- 球團據點資料 `data/teams.ts`（含真實經緯度），pin 用同 projection 換算，**與州界對齊**。
- 純靜態：先畫出所有 MLB 球場位置 + 台灣選手所在球團 highlight。
- 桌機/手機（手機縮放 viewBox）。
**先不做**：tab 切換、hover 卡、即時賽程（下一個 milestone）。
**DoD**：
- [ ] 州界精準（對比 Google Maps 抽查 5 州）。
- [ ] 球團 pin 落在正確城市（波士頓/洛杉磯/西雅圖抽查）。
- [ ] SVG 在 view-source 看得到（SSR 成功）。
- [ ] 手機不破版、無 WebGL、地圖區塊傳輸 < 150KB。

### M3 — 地圖互動：雙 Tab + hover 卡 + 賽程資料
**做什麼**：
- 兩個 tab：「今日賽程在哪」/「母隊在哪裡」。
- 地區切換：美國（台灣/日本先放 disabled，標「即將推出」）。
- hover/點 pin → 迷你卡（選手 + 對戰 + 台灣時間）→ 連到球員頁。
- 桌機右側賽程欄 / 手機底部抽屜。
- 接 **MLB Stats API**（見第 7 節）經 Cron → DB → ISR。
**DoD**：
- [ ] Tab 切換資料正確。
- [ ] 迷你卡顯示正確台灣時間（時區換算）。
- [ ] 手機底部抽屜可拖曳、賽程列表正確。
- [ ] 賽程 10 分鐘內更新（ISR 驗證）。
- [ ] 主地圖頁 Lighthouse mobile 過效能預算。

### M4 — 球員列表 + 球員頁（含旅程地圖）
**做什麼**：
- `/players` SSG 清單（可搜尋引擎索引）。
- `/players/[slug]` SSG+ISR：hero（頭像+中英名+出身地+數據列）、**從台灣出身地出發的旅程地圖**（用 M2 的地圖元件 + 台灣→美國航線 + 小聯盟升遷路線）、最新新聞、照片、社群動態卡。
- `Person` JSON-LD + OG 分享圖。
**DoD**：
- [ ] 每位選手獨立 URL、可分享（OG 卡正確）。
- [ ] 旅程地圖起點是正確台灣城市。
- [ ] 數據來自 DB、10 分鐘更新。
- [ ] 手機：地圖 sticky 置頂、卡片捲動。
- [ ] `Person` 結構化資料通過 Google Rich Results 測試。

### M5 — 媒體牆（四平台整合）
**做什麼**：
- Cron 抓 YouTube / IG / Threads / FB → DB。
- `/media` 卡片牆（桌機 masonry / 手機單欄），可依平台+選手篩選。
- 每張卡連回原貼文。
**DoD**：
- [ ] 四平台資料都進得來（見第 7 節注意事項）。
- [ ] 篩選正確、手機篩選列橫向滑動。
- [ ] 30 分鐘更新、不撞 rate limit（讀 DB 非即時 API）。
- [ ] 圖片 lazy-load、效能預算過。

### M6 — 打磨 + 進階（MVP 後）
開場動畫（Three.js，lazy+降級）、資料視覺化圖表（打擊率折線/熱區）、電子報、贊助 CMS 化、（未來）Mapbox 升級、遊戲模式皮膚。

---

## 6. 各頁面詳細規格

### 6.1 主地圖頁 `/map`
- **資料**：`teams.ts`（球團+經緯度）、`todaySchedule`（DB）、`players.ts`（台灣選手↔球團對應）。
- **元件**：`<UsMap>` `<MapTabs>` `<RegionPills>` `<ScheduleRail>`（桌機）/`<ScheduleSheet>`（手機）、`<PlayerPin>` `<PinHoverCard>`。
- **狀態**：`activeRegion`（us/tw/jp）、`activeTab`（schedule/homebase）、`selectedPlayer`。用 URL query 保存（`?region=us&tab=schedule`）以利分享與 SSR。

### 6.2 球員頁 `/players/[slug]`
- **資料模型**：
```ts
interface Player {
  slug: string;            // cheng-tsung-che
  nameZh: string;          // 鄭宗哲
  nameEn: string;          // Cheng Tsung-Che
  team: string; teamId: string; level: "A"|"AA"|"AAA"|"MLB";
  position: string; hometown: string;  // 高雄市
  hometownLatLng: [number, number];    // 旅程地圖起點
  birthDate: string;
  stats: { avg:number; ops:number; hr:number; sb:number; games:number };
  journey: Array<{ level:string; team:string; latLng:[number,number]; year:number }>;
  socials: { youtube?:string; instagram?:string; threads?:string; facebook?:string };
}
```
- **區塊**：hero → 旅程 scrollytelling 地圖 → 數據（可放 M6 圖表）→ 新聞 → 照片 → 社群卡。

### 6.3 媒體牆 `/media`
- **資料模型**：
```ts
interface SocialPost {
  id:string; platform:"youtube"|"instagram"|"threads"|"facebook";
  title:string; thumbnailUrl?:string; permalink:string;
  publishedAt:string; playerSlugs:string[]; stats:{likes?:number; views?:number};
}
```

### 6.4 關於頁 `/about`
- 團隊成員（CMS 或先寫死）、贊助分層（冠名/金級/好朋友）、CTA（成為贊助夥伴 / 小額支持 / 下載方案）、`Organization` JSON-LD。

---

## 7. 資料來源與抓取策略

| 來源 | API | 頻率 | 注意 |
|---|---|---|---|
| 賽程/數據 | **MLB Stats API**（`statsapi.mlb.com`，免費、無需 key）| 10 分鐘 | 小聯盟資料用對應 sportId；比賽日可加密。 |
| 影片 | **YouTube Data API v3**（需 API key，有每日配額）| 30 分鐘 | 只抓 mlbtwnet 頻道，用 `playlistItems`。 |
| IG / FB | **Meta Graph API** | 30 分鐘 | ⚠️ 需建 Meta App 並通過審核；用自家帳號走 Instagram API with Instagram Login 較單純。 |
| Threads | **Threads API**（官方，2024 起）| 30 分鐘 | 需 Meta 開發者帳號。 |

**抓取實作**：Vercel Cron → `/api/cron/*` → 正規化寫入 DB → `revalidateTag()` 更新 ISR。前端只讀 DB。**這樣保證：不撞 rate limit、頁面快、外部 API 掛掉也還有上次快取。**

---

## 8. 手機端效能能不能撐住？（重點回答）

**結論：MVP 這樣設計，中階手機 + 4G 完全撐得住，且有很大餘裕。** 原因：

1. **主地圖用 SVG，不是 WebGL**
   - `states-10m` TopoJSON ≈ 100KB gzipped，一次載入。
   - d3-geo 投影是純數學運算，在 render 時算完就是靜態 SVG，之後不吃 GPU、不吃電。
   - 對比：Mapbox GL 首次載入引擎 + tiles 動輒 800KB–2MB + 持續 GPU 運算。MVP 用 SVG 直接省掉這塊。

2. **內容 SSR/SSG，JS 極少**
   - Server Components 不送元件 JS，只有互動 island（tab、hover、抽屜）才 hydrate。
   - 首屏 JS 目標 < 170KB gzipped。

3. **重的東西全部延後 + 降級**
   - 開場動畫（Three.js）→ 非 MVP，且 `next/dynamic ssr:false` + 手機偵測退回 2D/影片 + `prefers-reduced-motion`。
   - 未來 Mapbox / 3D 皮膚 → 使用者主動點「進階模式」才載。

4. **圖片與字型**
   - `next/image` 自動 AVIF/WebP + 尺寸自適應 + lazy。
   - `next/font` self-host，無外部字型請求，`display:swap` 無 FOIT。

**風險點與對策**：
| 風險 | 對策 |
|---|---|
| 球員頁社群卡塞很多圖 | 全部 lazy-load，首屏只載前 2–3 張。 |
| 媒體牆無限捲動 | 分頁 + IntersectionObserver 懶載，不一次塞 100 張。 |
| 旅程地圖若之後改 Mapbox | 手機維持 SVG 版，桌機才給 Mapbox；或用 `flyTo` 但限制在使用者滾到該區才初始化。 |
| 低階手機（4 年前機種）| SVG 版本本來就跑得動；3D 一律偵測 GPU 後降級。 |

**驗收方法**：每個 milestone 用 Lighthouse mobile（Moto G Power 等級 + 4G 節流）+ Vercel Analytics 真實使用者 Core Web Vitals，未達預算不上線。

---

## 附錄 A：建議套件清單

```jsonc
{
  // 核心
  "next": "^16", "react": "^19", "react-dom": "^19", "typescript": "^5",
  "tailwindcss": "^4",
  // UI
  "@radix-ui/react-*": "latest", "class-variance-authority": "*", "lucide-react": "*",
  // 地圖 (MVP)
  "react-simple-maps": "*", "d3-geo": "*", "topojson-client": "*", "us-atlas": "*",
  // 動畫 / 圖表
  "motion": "*", "d3-scale": "*", "d3-shape": "*",
  // 資料
  "@supabase/supabase-js": "*", // 或 drizzle + neon
  // 監測
  "@vercel/analytics": "*", "@sentry/nextjs": "*"
}
```

## 附錄 B：里程碑順序總覽

```
M0 地基 → M1 Nav/Footer/關於 → M2 精準美國地圖(靜態)
   → M3 地圖互動+賽程 → M4 選手列表+球員頁 → M5 媒體牆 → M6 打磨/進階
每個 milestone：開發 → 驗收清單(DoD) → 確認 → 才進下一個
```
