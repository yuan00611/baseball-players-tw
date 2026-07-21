# 旅美幫 2.0 — Claude Code 開工包

這是給 **Claude Code** 開工用的完整規格包。設計成「AI 一次做一個 milestone、你逐個驗收」的節奏。

## 檔案結構

```
your-repo/
├── CLAUDE.md                    ← ⭐ Claude Code 每次 session 自動讀。常駐鐵則。
├── README.md                    ← 你正在看的這份。
└── docs/
    ├── progress.md              ← 進度日誌。AI 開工先讀、做完更新。你和 AI 共用。
    ├── spec.md                  ← 完整規格手冊（AI 需要細節時查）。
    ├── design-tokens.md         ← 所有 design token 值（貼進 globals.css）。
    └── milestones/
        ├── M0.md … M6.md        ← 七個階段，一次餵一個給 AI。
```

## 怎麼用（建議流程）

### 一次性設定
1. 把整包放進你的 repo 根目錄（`CLAUDE.md` 一定要在根目錄，Claude Code 才會自動讀）。
2. `git init && git add -A && git commit -m "chore: add spec pack"`。
3. 開 Claude Code：`claude`（在 repo 目錄下）。

### 每個 milestone 的循環
```
你：  「讀 docs/progress.md 和 docs/milestones/M0.md，用 plan mode 提計畫」
AI：  提出計畫（先不寫 code）
你：  確認/修正 → 「可以，開始」
AI：  寫 code → 跑該 milestone 的「驗證指令」→ 貼結果 → 更新 progress.md → 停下
你：  自己再跑一次驗證指令 / 讀 diff → 通過 → 「M0 通過，開始 M1」
```

### 幾個讓 AI 更穩的指令習慣
- **開工前**：「先讀 progress.md 確認在哪個 milestone」——避免它做錯階段。
- **寫 code 前**：用 **plan mode**（Claude Code 按 Shift+Tab 兩下）讓它先講計畫，你確認再放行。
- **它想偏離規格時**：CLAUDE.md 已要求它「停下來問」，但你也可以主動說「照 M2.md 的限制，不要用 Mapbox」。
- **context 變長時**：一個 milestone 做完後用 `/clear` 或 `/compact` 重置，下個 milestone 重新讀 progress + 該 M 檔即可（progress.md 就是跨 session 的記憶）。
- **它學到新慣例時**：說「把這條規則加進 CLAUDE.md 或 progress.md 的決策紀錄」，讓記憶累積。

## 為什麼這樣切

- `CLAUDE.md` 每次都載入、消耗 context，所以保持精簡（<50 行），只放鐵則。
- 細節放 `docs/`，AI 需要時才讀，不佔常駐 context。
- milestone 拆檔 → 一次只餵一個 → AI 專注、不會一口氣寫完整站然後哪裡都不對。
- 驗收是「可驗證的指令」不是「看起來對」→ 你和 AI 都能客觀確認。

## Milestone 總覽

| M | 名稱 | 一句話 |
|---|---|---|
| M0 | 專案地基 | Next.js + token + 主題 + base 元件 |
| M1 | Nav/Footer/關於頁 | 全站骨架，驗 RWD/SEO/主題 |
| M2 | 精準美國地圖(靜態) | SVG 州界 + 對齊的球團 pin ⭐ |
| M3 | 地圖互動+賽程 | 雙 tab + hover 卡 + MLB 賽程 |
| M4 | 選手列表+球員頁 | SSG 球員頁 + 台灣出身地旅程 |
| M5 | 媒體牆 | 四平台整合牆 |
| M6 | 打磨/進階 | 開場動畫/圖表/Mapbox/遊戲皮膚 |

## Figma 對照

開工時可搭配 Figma 看樣子（記得開 view 權限，或用 Dev Mode 抓 token/尺寸）：
- Site Flow 頁（整站流程）
- Design System 頁（token/元件/branding 暫定版）

> 把各 milestone 對應的 Figma frame 連結補進下面表格，AI/你做到哪貼哪：
>
> | Milestone | Figma frame 連結 |
> |---|---|
> | M1 關於頁 | (貼 S5/M5 frame 連結) |
> | M2/M3 地圖 | (貼 S2/M2 frame 連結) |
> | M4 球員頁 | (貼 S3/M3 frame 連結) |
> | M5 媒體牆 | (貼 S4/M4 frame 連結) |
