"use client";

import * as React from "react";
import type { MapPin } from "@/components/map/map-types";
import { cn } from "@/lib/utils";

export type ExtraPlayer = { name: string; sub: string };

type Row = {
  pinIndex: number;
  key: string;
  pin: MapPin;
  player?: { name: string; slug: string; affiliate: string; level: string };
};

/**
 * 與地圖連動的清單。homebase 每位選手一列（就算同球場/同隊也獨立列出）；
 * schedule 每場一列。點列 → 選取對應 pin（同球場多列共享同一 pin）。
 */
export function PinList({
  pins,
  selected,
  onSelect,
  extra,
}: {
  pins: MapPin[];
  selected: number | null;
  onSelect: (i: number | null) => void;
  extra?: ExtraPlayer[];
}) {
  const refs = React.useRef<Map<number, HTMLButtonElement | null>>(new Map());

  // 展開成「每位選手一列」
  const rows: Row[] = [];
  pins.forEach((pin, i) => {
    if (pin.variant === "schedule") {
      rows.push({ pinIndex: i, key: `s-${i}`, pin });
    } else {
      (pin.players ?? []).forEach((pl) =>
        rows.push({ pinIndex: i, key: `${i}-${pl.slug}`, pin, player: pl }),
      );
    }
  });

  React.useEffect(() => {
    if (selected !== null) {
      refs.current.get(selected)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  if (rows.length === 0) {
    return <p className="text-sm text-text-muted">目前沒有可顯示的球員。</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => {
        const isSel = row.pinIndex === selected;
        const { pin, player } = row;
        return (
          <button
            key={row.key}
            ref={(el) => {
              // 記該 pinIndex 對應列，供 selected 變動時捲入視野
              refs.current.set(row.pinIndex, el);
            }}
            type="button"
            aria-pressed={isSel}
            onClick={() => onSelect(row.pinIndex)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              isSel
                ? "border-brand bg-brand/5"
                : "border-border-subtle bg-surface hover:border-border-strong",
            )}
          >
            {pin.variant === "schedule" ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-sm font-bold text-text">
                    {pin.playerName}
                  </span>
                  <span className="text-xs text-text-muted">{pin.status}</span>
                </div>
                <p className="mt-1 text-sm text-text">{pin.matchup}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {pin.homeAway}
                  {pin.venue ? ` · ${pin.venue}` : ""} · 台灣時間 {pin.taiwanTime}
                </p>
              </>
            ) : (
              <>
                <p className="font-sans text-sm font-bold text-text">
                  {player?.name}
                </p>
                <p className="mt-0.5 text-sm text-text-muted">
                  {player?.affiliate}（{player?.level}）
                  {pin.venueApprox && <span className="ml-1 text-xs">（近似）</span>}
                </p>
              </>
            )}
          </button>
        );
      })}

      {extra && extra.length > 0 && (
        <div className="mt-2 border-t border-border-subtle pt-2">
          <p className="mb-2 text-xs font-medium text-text-muted">
            其他旅美選手（未在地圖）
          </p>
          {extra.map((e) => (
            <div key={e.name} className="rounded-lg px-3 py-2">
              <p className="text-sm font-bold text-text">{e.name}</p>
              <p className="text-xs text-text-muted">{e.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
