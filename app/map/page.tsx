import type { Metadata } from "next";
import { UsMap } from "@/components/map/UsMap";
import { UNLOCATABLE_PLAYERS } from "@/data/players";
import { TEAM_BY_ID } from "@/data/teams";

export const metadata: Metadata = {
  title: "地圖",
  description:
    "台灣旅美棒球選手所在地圖：MLB 與小聯盟球場位置，以及台灣選手目前所在球隊。",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className="font-sans text-3xl font-bold text-text md:text-4xl">地圖</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        紅點為台灣選手目前所在的球場（MLB 或小聯盟）。
      </p>

      {/* 圖例 */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block size-3 rounded-full bg-brand" />
          台灣選手所在球場
        </span>
      </div>

      {/* 地圖 */}
      <div className="mt-6 overflow-hidden rounded-lg border border-border-subtle bg-canvas p-2">
        <UsMap />
      </div>

      {/* 無法在地圖上定位的選手 */}
      {UNLOCATABLE_PLAYERS.length > 0 && (
        <section className="mt-10" aria-labelledby="offmap-heading">
          <h2 id="offmap-heading" className="font-sans text-xl font-bold text-text">
            其他旅美選手
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            以下選手目前在多明尼加夏季聯盟或所屬球隊未定，暫未標於地圖。
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {UNLOCATABLE_PLAYERS.map((p) => (
              <li
                key={p.name}
                className="rounded-lg border border-border-subtle bg-surface p-4"
              >
                <p className="font-sans font-bold text-text">{p.name}</p>
                <p className="text-sm text-text-muted">
                  {TEAM_BY_ID.get(p.org)?.name} · {p.affiliate}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
