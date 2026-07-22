"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "schedule", label: "今日賽程在哪" },
  { key: "homebase", label: "母隊在哪裡" },
] as const;

export function MapTabs({ active }: { active: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function switchTo(key: string) {
    const next = new URLSearchParams(params.toString());
    next.set("tab", key);
    router.replace(`/?${next.toString()}`, { scroll: false });
  }

  return (
    <div
      role="tablist"
      aria-label="地圖檢視"
      className="inline-flex rounded-full border border-border-subtle bg-surface p-1"
    >
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => switchTo(t.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand text-on-brand"
                : "text-text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
