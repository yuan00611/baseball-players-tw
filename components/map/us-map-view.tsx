"use client";

import * as React from "react";
import Image from "next/image";
import type { MapPin } from "@/components/map/map-types";
import { PinHoverCard } from "@/components/map/pin-hover-card";
import { headshotUrl } from "@/lib/headshot";
import { cn } from "@/lib/utils";

/** 受控地圖：selected/onSelect 由外層 MapExplorer 管理，好與清單連動 */
export function UsMapView({
  nationPath,
  bordersPath,
  pins,
  width,
  height,
  selected,
  onSelect,
}: {
  nationPath: string;
  bordersPath: string;
  pins: MapPin[];
  width: number;
  height: number;
  selected: number | null;
  onSelect: (i: number | null) => void;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  const activePin = selected !== null ? pins[selected] : null;

  return (
    <div className="relative" onClick={() => onSelect(null)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="美國地圖：台灣旅美球員位置"
      >
        <path
          d={nationPath}
          className="fill-surface stroke-border-subtle dark:stroke-border-strong"
          strokeWidth={0.75}
        />
        <path
          d={bordersPath}
          className="fill-none stroke-border-subtle dark:stroke-border-strong"
          strokeWidth={0.6}
        />
      </svg>

      {/* 頭像 pin 疊層：用 next/image（webp/縮圖，符合傳輸預算），
          位置/尺寸換算成容器百分比 → 與地圖同步縮放，對齊 SVG 座標。 */}
      <div className="pointer-events-none absolute inset-0">
        {pins.map((pin, i) => {
          const count = pin.players?.length ?? 1;
          const isActive = i === selected;
          const mlbamId =
            pin.variant === "schedule"
              ? pin.playerMlbamId
              : pin.players?.[0]?.mlbamId;
          const r = isActive ? 16 : 13;
          const sizePct = ((2 * r) / width) * 100;
          const title =
            pin.variant === "schedule"
              ? `${pin.teamName} · ${pin.matchup}`
              : `${pin.players?.[0]?.affiliate} · ${pin.players
                  ?.map((p) => p.name)
                  .join("、")}`;
          return (
            <button
              key={i}
              type="button"
              aria-label={title}
              title={title}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected === i ? null : i);
              }}
              className={cn(
                "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-[width] duration-150",
                isActive ? "z-[2]" : "z-[1] hover:z-[2]",
              )}
              style={{
                left: `${(pin.x / width) * 100}%`,
                top: `${(pin.y / height) * 100}%`,
                width: `${sizePct}%`,
              }}
            >
              <span
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-full bg-canvas ring-brand",
                  isActive ? "ring-[3px]" : "ring-2",
                )}
              >
                {mlbamId ? (
                  <Image
                    src={headshotUrl(mlbamId, 240)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 10vw, 5vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="block h-full w-full bg-brand" />
                )}
              </span>
              {count > 1 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[1.15em] items-center justify-center rounded-full border border-canvas bg-brand px-1 font-num text-[0.62em] font-semibold leading-tight text-on-brand">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activePin && (
        <div
          className="absolute z-10"
          style={{
            left: `${(activePin.x / width) * 100}%`,
            top: `${(activePin.y / height) * 100}%`,
            transform:
              activePin.y < height * 0.4
                ? "translate(-50%, 12px)"
                : "translate(-50%, calc(-100% - 12px))",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <PinHoverCard pin={activePin} onClose={() => onSelect(null)} />
        </div>
      )}
    </div>
  );
}
