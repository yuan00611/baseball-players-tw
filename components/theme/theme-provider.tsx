"use client";

import * as React from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// useLayoutEffect 在 client 執行、SSR 退回 useEffect（避免 SSR 警告）
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function resolveStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage 不可用 */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR 與首次 hydration 必須一致，故初值固定為 "light"；
  // 真正的主題在 layout effect 依 localStorage 補上（paint 前，故不閃爍）。
  const [theme, setThemeState] = React.useState<Theme>("light");

  const applyTheme = React.useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* 忽略 */
    }
    setThemeState(next);
  }, []);

  // React 19 hydration 會移除 inline script 寫入的 data-theme；
  // 這裡在 paint 前依 localStorage 重新套上，確保重整不閃爍。
  useIsomorphicLayoutEffect(() => {
    const resolved = resolveStoredTheme();
    document.documentElement.setAttribute("data-theme", resolved);
    setThemeState(resolved);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* 忽略 */
      }
      return next;
    });
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: applyTheme, toggleTheme }),
    [theme, applyTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme 必須在 <ThemeProvider> 內使用");
  return ctx;
}
