# 開發進度 Progress

> Claude 每次開工先讀這裡，確認「目前 milestone」和「下一步」。
> 每完成一個 milestone，Claude 更新這個檔案，然後停下等人類驗收。

## 目前狀態
- **目前 milestone**：M5（🔵 待驗收）
- **下一步**：等人類驗收 M5；通過後說「M5 通過，開始 M6」

## Milestone 進度表

| Milestone | 狀態 | 驗收人 | 備註 |
|---|---|---|---|
| M0 專案地基 | ✅ 已驗收 | 人類 | 2026-07-21 通過 |
| M1 Nav/Footer/關於頁 | ✅ 已驗收 | 人類 | 2026-07-21 通過 |
| M2 精準美國地圖(靜態) | ✅ 已驗收 | 人類 | 2026-07-22 通過（含藍點隱藏/深色邊界微調） |
| M3 地圖互動+賽程 | ✅ 已驗收 | 人類 | 2026-07-22 通過（含同版型/雙向連動/抽屜高度增強） |
| M4 選手列表+球員頁 | ✅ 已驗收 | 人類 | 2026-07-23 通過（含真實出身地補強） |
| M5 媒體牆 | 🔵 待驗收 | | masonry+平台/選手篩選+無限捲動+載入更多；示意資料；YouTube 抓取待 key、IG/FB/Threads 待 Meta 審核 |
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
- 2026-07-22（M2 微調）：依使用者要求——(1) 其他 MLB 球場藍點**暫不顯示**（`data/teams.ts` 資料保留、不畫底點、圖例移除藍點）；(2) 深色模式州界改 `dark:stroke-border-strong` 提高對比。
- 2026-07-22（M3）：資料層 = **本地 JSON 快取**（`lib/schedule/store.ts` 寫 `.data/schedule.json`，讀不到回退 `data/schedule-fixture.json`），抽象化待換真 DB。前端只讀快取，只有 `app/api/cron/schedule/route.ts` 打 MLB Stats API。`/map` 因 searchParams 為 dynamic（原 revalidate 60 保留但 dynamic 每次讀快取）。
- 2026-07-22（M3）：今日賽程**只做 MLB**（3 位大聯盟選手）。`data/teams.ts` 每隊補 `mlbamId`（MLB Stats API 數字 id，來源：`statsapi.mlb.com/api/v1/teams?sportId=1`）供賽程 join。實測 cron 對 2026-07-21 抓到 3 場真實比賽。
- 2026-07-22（M3）：地圖互動重構——d3 幾何只在 server（`lib/map/geo.ts`，`server-only`）算，輸出 path 字串 + 投影後 pin 座標給 client `components/map/us-map-view.tsx` 畫（client 不吃 d3）。hover 卡目前 click 開啟（合「點 pin」），「看選手」暫連 `/players`（個別球員頁 M4）。手機抽屜用 vaul。
- 2026-07-22（M3）：對時用 `Intl.DateTimeFormat(timeZone:'Asia/Taipei')`；驗證 22:40Z→隔日 06:40 台北，正確。舊 `components/map/UsMap.tsx` 已移除（拆成 geo + view）。
- 2026-07-22（M3 驗證限制）：Lighthouse mobile 與真手機寬度視覺需你本機補測（sandbox 無法真縮到手機寬；vaul 抽屜以 `.click()` 功能驗證通過）。
- 2026-07-22（M3 增強）：依使用者要求——**兩 tab 同版型 + 母隊 tab 右側列出全部球員 + 地圖/清單雙向連動**。做法：抽 `components/map/map-explorer.tsx`（client）掌管共享 `selected`，內含受控 `us-map-view.tsx`（selected/onSelect props）＋ `pin-list.tsx`（點列連動、自動捲入視野）＋手機 vaul 抽屜。點圈圈↔點人互相標示。移除舊 `schedule-rail/sheet/list.tsx`。手機抽屜高度改 `max-h-[32vh]`。
- 2026-07-22（M3 修正，併入 M4）：使用者指出賽程 pin 應在**比賽確切位置**（依主/客場），非選手母隊主場。改：`fetch.ts` 加 `hydrate=venue(location)` 存 `venueLat/Lng` + `isHome`；`schedulePins` pin 落在 venue 座標；card/list 顯示「主場/客場 @ 球場」。已驗證邏輯正確（鄧愷威在 Daikin Park=主場、李灝宇 @ Wrigley=客場）。fixture 重抓 2026-07-21 今日 live 資料。
- 2026-07-23（M4）：`data/players.ts` 25 人富化——**英文名/守備位置取自使用者提供的參考站**（tw-mlb-baseball-watch），slug 由英文名 kebab（3 位未列者自產 needsReview）。柯敬賢確認 = Ontario Tower Buzzers。出身地/生日/社群/數據仍佔位（stats 顯示「—」不放假數字）。
- 2026-07-23（M4）：`/players` SSG 清單（依等級分組）；`/players/[slug]` SSG+ISR(600s) 25 頁、`generateStaticParams`、`Person` JSON-LD、`opengraph-image.tsx`（**英文為主**避 CJK 缺字，CJK OG 字型列 backlog）。
- 2026-07-23（M4）：旅程地圖 `components/player/journey.tsx`（client scrollytelling，IntersectionObserver 高亮 + 手機 sticky 40vh）；**真實台灣地圖**（`lib/map/taiwan.ts` server，world-atlas countries-50m 取台灣本島最大多邊形 + geoMercator fitSize；濾掉金馬等離島避免 bbox 失真）；美國站點重用 `lib/map/geo.ts`。d3 只跑 server，path 字串傳 client。
- 2026-07-23（M4 資料補強）：**出身地改用真實資料**！來源＝官方 MLB Stats API（`people/search`＋`sports/{id}/players?season=`），依英文名解析到 MLBAM person id + birthCity，22/25 命中（3 位無英文名者仍待補）。`data/player-bios.ts` 存 slug→{mlbamId, 出身地中文, 出身地經緯度(縣市中心)}；`players.ts` 合併，旅程地圖起點改用真實出身地（例：潘文輝=花蓮/東岸、鄧愷威=台中）。**mlbamId 已存**，之後抓真數據/官方頭像可直接用。
- 2026-07-23（更正）：先前記「MiLB schedule API 不穩(0 games)」是**誤判**——那天(2025-07-21)是明星賽休兵。實測正常賽日 `sportId=11~16` 每級 15~26 場，**小聯盟每日賽程其實抓得到**。故 M3 賽程 tab 之後可擴充涵蓋小聯盟選手（backlog）。
- 2026-07-23（決策）：**不從第三方粉絲站（tw-mlb-baseball-watch）爬資料**。該站資料本身也是來自官方 MLB Stats API + Baseball-Reference/MiLB.com；我們直接走官方免費來源（合法、穩定、結構化）。照片若要用＝官方 MLB headshot（`midfield.mlbstatic.com/v1/people/{id}/spots/...`），有版權考量，列 backlog 謹慎處理。
- 2026-07-24（M5）：媒體牆 `/media`——資料層 `lib/social/`（fetch/store，本地 JSON 快取 + `data/social-fixture.json` 20 則示意貼文保底，同 schedule 模式）；`app/api/cron/social/route.ts` 回各平台筆數。前端只讀快取。
- 2026-07-24（M5）：資料 = **示意範例**（標題含「範例」、連真實 mlbtwnet 帳號、縮圖用平台色生成式佔位避版權）。**YouTube 抓取程式已寫好**（`lib/social/fetch.ts`，讀 env `YOUTUBE_API_KEY`，handle→channelId→uploads playlist），填 key 即通；IG/FB/Threads 為 stub（待 Meta App 審核）。
- 2026-07-24（M5）：`/media` SSR + client island——CSS masonry（`columns-*` + `break-inside-avoid`）、平台/選手篩選（URL query）、**無限捲動（IntersectionObserver）+ 載入更多按鈕保底**（IO 在內容成長把 sentinel 推出視野時會停，故加按鈕確保載到底，已驗 8→16→20）。四社群 icon 抽成 `components/icons/social-icons.tsx`（footer 與 media 共用）。球員頁「社群動態」卡連 `/media?player={slug}`。
- 2026-07-24（M5 待補）：真縮圖接入後需 `next.config.ts` 允許 `i.ytimg.com` 等 remote image；真資料待 API key / Meta App。
- 2026-07-24（跨里程碑微調，使用者測試回饋）：
  1. **首頁＝主地圖**：`app/page.tsx` 改成主地圖（原 M0 測試頁移除）；`/map` → 307 redirect 到 `/`；Nav/Footer「地圖」與 MapTabs 路徑改 `/`；sitemap 移除 `/map`、加入 25 球員頁。
  2. **地圖 pin 卡連個別球員頁**：`MapPin` 加 `players[].slug` / `playerSlug`；`pin-hover-card` 的連結由 `/players` 改成 `/players/{slug}`（homebase 每位選手各自連、schedule 連該選手）。
  3. **媒體牆改齊一格線**：`media-grid` 由 CSS masonry(`columns-*`) 改 **grid `grid-cols-*`**、卡片 `h-full flex` + 標題 `line-clamp-2 min-h`，卡片等高等寬（解決大小不一 + 4 欄一致）。
  4. **旅程航線移到最上層**：`journey.tsx` 太平洋弧線改在美國地圖之後渲染（不被蓋住），淺色用 `stroke-accent-text`（深藍）、深色 `stroke-accent`。
- 2026-07-24（第二批測試回饋）：
  1. **今日賽程改為預設 tab 且在左**：`MapTabs` 順序改 [今日賽程, 母隊]，`app/page.tsx` 預設 `schedule`。
  2. **右側清單改「以選手為主」**：`pin-list` homebase 列改成選手名粗體在上、球隊（等級）次要在下（層級對調）。
  3. **同球場/同隊選手拆成獨立列**：`pin-list` 由「每 pin 一列」改「**每位選手一列**」（拉斯維加斯 2 人現在兩列）；地圖仍每球場一顆點（含「2」）、點列共享同一 pin 的選取連動。
  4. **地圖與右側清單同高**：`map-explorer` 桌機 aside 用 `relative` + 內層 `absolute inset-0` + row `items-stretch`，讓清單高度＝地圖高度、內部捲動。
  5. **新增 3 位台裔球員**（Corbin Carroll/響尾蛇、Stuart Fairchild/水手 Tacoma、Jonathon Long/小熊 Iowa）：`data/players.ts`，含 MLBAM id（API 解析）、affiliate 標「（台裔）」。美國出生，出身地/旅程起點特殊處理列 backlog。
- 2026-07-24（球員頁動態區改版，使用者回饋）：`app/players/[slug]/page.tsx`——
  1. hero 選手名旁加 **FB/IG icon**（連 `player.socials` 或退回官方 mlbtwnet；個人帳號待補列 backlog）。
  2. 移除「社群動態」卡；**媒體牆連結移到左側「最新新聞」下方**。
  3. **最新新聞**改成 3 則示意新聞列（標題＋日期·來源，模板產生標「示意」）；**照片集**改成 4 個柔和色塊佔位（`PHOTO_PLACEHOLDER`）。皆待接真資料。
  4. hero h1 加 `leading-none` 讓 FB/IG icon 與名字**垂直置中**；**媒體牆連結移到右欄**（最新新聞右邊，右欄＝媒體牆連結＋照片集，標題「照片與媒體」）。

## 卡住 / 待人類確認的事項
- (無)

## 已知技術債 / 之後要回來處理
- **中/英雙語 i18n**（使用者 2026-07-22 提出）：規劃放 **M6 強化**。全站文案抽 key、語言切換（可沿用主題切換的 data-attr + localStorage 模式）、`<html lang>` 動態、`hreflang`。目前全站硬編中文。
- 賽程本地 JSON 快取（`.data/`）在 Vercel serverless 不持久 → 上線前換真 DB/KV（`lib/schedule/store.ts` 已抽象）。
- 地圖 pin hover 卡目前 click 開啟；之後可加桌機 hover 預覽（注意手機）。
- **球員圖片/頭像**（使用者 2026-07-22 提出）：backlog。球員列表、pin 卡、球員頁（M4）加頭像；用 `next/image`（AVIF/WebP + lazy）。目前 `data/players.ts` 無圖片欄位、關於頁團隊卡用字母 avatar。
- **傷兵名單（IL）**（使用者 2026-07-22 提出）：backlog。標示球員是否在傷兵名單（MLB Stats API 有 rosterType=fullRoster/40Man 及 status；小聯盟較不完整）；可在球員列表/pin 卡/球員頁顯示傷兵狀態。
- **現役＆回台灣球員**（使用者 2026-07-22 提出）：backlog。補上仍現役但已回台灣打球（CPBL 等）的旅美歸國球員；地圖需擴充台灣島 pin/地區切換（台灣 region 目前 disabled）。
- **真數據接入**（使用者 2026-07-23）：backlog。已有各選手 `mlbamId`（`data/player-bios.ts`），可用 MLB Stats API `people/{id}/stats?stats=season&group=hitting/pitching` 抓真數據，走 cron→快取→ISR（同賽程模式），填球員頁數據列（目前「—」）。
- **球員照片**（使用者 2026-07-23 加碼）：backlog。官方頭像 `https://midfield.mlbstatic.com/v1/people/{mlbamId}/spots/120`（或 securea.mlb.com head_shot）。有版權/使用條款考量，需確認可用範圍再上；用 `next/image`。**不從第三方站抓圖**。
- **退役球員資料**（使用者 2026-07-23）：backlog。歷史旅美球員（王建民、郭泓志、陳偉殷等）獨立資料集；MLB Stats API 對退役球員仍有 bio/生涯數據。
- **剩餘 3 位出身地**（林珺希/何樺/林睿杰）：backlog。無英文名故 API 查無，需人工補英文名或 bref/MLBAM id 後再解析。
- **選手頁社群媒體**（使用者 2026-07-24）：backlog。球員頁「社群動態」加上該選手個人的 YouTube/IG/Threads/FB 連結（`Player.socials` 目前多空）；資料需人工補或從官方/選手帳號整理。
- **台裔球員旅程起點**（Corbin Carroll / Stuart Fairchild / Jonathon Long）：backlog。三人美國出生（西雅圖/Orange CA），現行旅程地圖以台灣為起點，對他們不適用（目前 hometownLatLng 未設→起點落台灣佔位點、label 顯示美國出生地）。之後改成 US 出生地起點或台裔專屬呈現。
