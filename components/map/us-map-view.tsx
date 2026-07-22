"use client";

import * as React from "react";
import type { MapPin } from "@/components/map/map-types";
import { PinHoverCard } from "@/components/map/pin-hover-card";

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

        {pins.map((pin, i) => {
          const count = pin.players?.length ?? 1;
          const isActive = i === selected;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected === i ? null : i);
              }}
            >
              <circle cx={pin.x} cy={pin.y} r={12} fill="transparent" />
              {isActive && (
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={11}
                  className="fill-none stroke-brand"
                  strokeWidth={1.5}
                  opacity={0.5}
                />
              )}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={isActive ? 7.5 : 6}
                className="fill-brand stroke-canvas transition-all"
                strokeWidth={isActive ? 2 : 1.5}
              >
                <title>
                  {pin.variant === "schedule"
                    ? `${pin.teamName} · ${pin.matchup}`
                    : `${pin.players?.[0]?.affiliate} · ${pin.players
                        ?.map((p) => p.name)
                        .join("、")}`}
                </title>
              </circle>
              {count > 1 && (
                <text
                  x={pin.x}
                  y={pin.y + 2.5}
                  textAnchor="middle"
                  className="pointer-events-none fill-on-brand font-num"
                  fontSize={7}
                  fontWeight={600}
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

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
