"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type UsStop = {
  x: number;
  y: number;
  label: string;
  level: string;
  year?: number;
};

const VIEW_W = 1320;
const VIEW_H = 610;
const US_OFFSET_X = 345; // 美國地圖右移，左側留給台灣 inset
const INSET_X = 70;
const INSET_Y = 250;
const INSET_SCALE = 1.2;

export function Journey({
  nationPath,
  bordersPath,
  taiwanPath,
  taiwanW,
  taiwanH,
  originLocal,
  originLabel,
  hometownKnown,
  usStops,
}: {
  nationPath: string;
  bordersPath: string;
  taiwanPath: string;
  taiwanW: number;
  taiwanH: number;
  originLocal: [number, number];
  originLabel: string;
  hometownKnown: boolean;
  usStops: UsStop[];
}) {
  const [active, setActive] = React.useState(0);
  const panelRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // 有序站點：台灣起點 + 美國各站
  const stops = [
    { kind: "origin" as const, label: originLabel, level: "出身地", sub: hometownKnown ? "" : "（待補）" },
    ...usStops.map((s) => ({ kind: "us" as const, label: s.label, level: s.level, sub: s.year ? `${s.year}` : "" })),
  ];

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    panelRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // 螢幕座標
  const originAbs: [number, number] = [
    INSET_X + originLocal[0] * INSET_SCALE,
    INSET_Y + originLocal[1] * INSET_SCALE,
  ];
  const firstUsAbs = usStops[0]
    ? ([usStops[0].x + US_OFFSET_X, usStops[0].y] as [number, number])
    : null;

  const pacificArc = firstUsAbs
    ? `M ${originAbs[0]} ${originAbs[1]} Q ${(originAbs[0] + firstUsAbs[0]) / 2} ${
        Math.min(originAbs[1], firstUsAbs[1]) - 130
      } ${firstUsAbs[0]} ${firstUsAbs[1]}`
    : "";

  return (
    <div className="lg:flex lg:items-start lg:gap-8">
      {/* 地圖：手機 sticky 置頂 40vh；桌機左半並排 sticky */}
      <div className="sticky top-16 z-0 -mx-4 bg-canvas px-4 py-2 lg:mx-0 lg:w-3/5 lg:self-start lg:px-0">
        <div className="h-[40vh] w-full lg:h-auto">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
            role="img"
            aria-label={`${originLabel} 到美國的旅程地圖`}
          >
            {/* 美國地圖 + 美國境內站點（右移） */}
            <g transform={`translate(${US_OFFSET_X},0)`}>
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
              {/* 美國站點連線 */}
              {usStops.length > 1 && (
                <polyline
                  points={usStops.map((s) => `${s.x},${s.y}`).join(" ")}
                  className="fill-none stroke-brand"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  opacity={0.6}
                />
              )}
              {usStops.map((s, i) => {
                const isActive = active === i + 1;
                return (
                  <circle
                    key={i}
                    cx={s.x}
                    cy={s.y}
                    r={isActive ? 8 : 6}
                    className="fill-brand stroke-canvas transition-all"
                    strokeWidth={isActive ? 2.5 : 1.5}
                  >
                    <title>{s.label}</title>
                  </circle>
                );
              })}
            </g>

            {/* 台灣 inset（真實地圖） */}
            <g transform={`translate(${INSET_X},${INSET_Y}) scale(${INSET_SCALE})`}>
              <path
                d={taiwanPath}
                className="fill-surface stroke-border-strong"
                strokeWidth={0.8}
              />
              <circle
                cx={originLocal[0]}
                cy={originLocal[1]}
                r={active === 0 ? 5 : 3.5}
                className="fill-accent stroke-canvas transition-all"
                strokeWidth={1.2}
              />
              <text
                x={taiwanW / 2}
                y={taiwanH + 16}
                textAnchor="middle"
                className="fill-text-muted font-sans"
                fontSize={12}
              >
                台灣
              </text>
            </g>

            {/* 太平洋航線（畫在最上層，不被美國地圖蓋住；淺色用較深藍） */}
            {pacificArc && (
              <path
                d={pacificArc}
                className="fill-none stroke-accent-text dark:stroke-accent"
                strokeWidth={2}
                strokeDasharray="6 6"
              />
            )}
          </svg>
        </div>
      </div>

      {/* 站點卡（scrollytelling） */}
      <div className="mt-6 lg:mt-0 lg:w-2/5">
        {stops.map((s, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={cn(
              "mb-4 rounded-lg border p-4 transition-colors",
              active === i
                ? "border-brand bg-brand/5"
                : "border-border-subtle bg-surface",
            )}
          >
            <p className="text-xs font-medium text-accent-text">
              {s.level}
              {s.sub ? ` · ${s.sub}` : ""}
            </p>
            <p className="mt-1 font-sans text-lg font-bold text-text">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
