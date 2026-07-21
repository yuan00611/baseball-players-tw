# Design Tokens

> 與 Figma `Design System` 頁的 variables 完全同步。三層：Primitives → Semantic(light/dark) → Scale/DataViz。
> 直接貼進 `app/globals.css`。

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

