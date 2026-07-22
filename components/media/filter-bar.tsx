"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PLATFORM_LABEL, type Platform } from "@/types/social";
import { cn } from "@/lib/utils";

const PLATFORMS: (Platform | "all")[] = [
  "all",
  "youtube",
  "instagram",
  "threads",
  "facebook",
];

export function FilterBar({
  platform,
  player,
  players,
}: {
  platform: string;
  player: string;
  players: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.replace(`/media?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {/* 平台 pills（手機可橫向滑） */}
      <div
        role="tablist"
        aria-label="平台篩選"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      >
        {PLATFORMS.map((p) => {
          const active = platform === p || (p === "all" && !platform);
          return (
            <button
              key={p}
              role="tab"
              aria-selected={active}
              onClick={() => setParam("platform", p)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-brand bg-brand text-on-brand"
                  : "border-border-subtle text-text-muted hover:text-text",
              )}
            >
              {p === "all" ? "全部" : PLATFORM_LABEL[p as Platform]}
            </button>
          );
        })}
      </div>

      {/* 選手篩選 */}
      {players.length > 0 && (
        <div className="flex items-center gap-2">
          <label htmlFor="player-filter" className="text-sm text-text-muted">
            選手
          </label>
          <select
            id="player-filter"
            value={player}
            onChange={(e) => setParam("player", e.target.value)}
            className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-sm text-text"
          >
            <option value="all">全部選手</option>
            {players.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
