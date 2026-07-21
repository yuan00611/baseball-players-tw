"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? "切換為淺色主題" : "切換為深色主題"}
      title={isDark ? "切換為淺色主題" : "切換為深色主題"}
    >
      {isDark ? "🌙 深色" : "☀️ 淺色"}
    </Button>
  );
}
