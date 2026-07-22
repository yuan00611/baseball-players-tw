import type { Metadata } from "next";
import {
  NATION_PATH,
  BORDERS_PATH,
  MAP_WIDTH,
  MAP_HEIGHT,
  project,
} from "@/lib/map/geo";
import { MapExplorer } from "@/components/map/map-explorer";
import { MapTabs } from "@/components/map/map-tabs";
import { RegionPills } from "@/components/map/region-pills";
import type { MapPin } from "@/components/map/map-types";
import type { ExtraPlayer } from "@/components/map/pin-list";
import { LOCATED_PIN_GROUPS, UNLOCATABLE_PLAYERS, PLAYERS } from "@/data/players";
import { TEAM_BY_ID } from "@/data/teams";
import { getSchedule } from "@/lib/schedule/store";
import { toTaiwanTime, matchupLabel, statusLabel } from "@/lib/schedule/format";

export const revalidate = 60; // ISR：賽程快取更新後 60s 內反映

export const metadata: Metadata = {
  title: "地圖",
  description:
    "台灣旅美棒球選手所在地圖：今日賽程與母隊位置，賽事時間換算為台灣時間。",
  alternates: { canonical: "/" },
};

const SLUG_BY_NAME = new Map(PLAYERS.map((p) => [p.name, p.slug]));

function homebasePins(): MapPin[] {
  return LOCATED_PIN_GROUPS.flatMap((g) => {
    const p = project(g.latLng);
    if (!p) return [];
    return [
      {
        x: p[0],
        y: p[1],
        variant: "homebase" as const,
        players: g.players.map((pl) => ({
          name: pl.name,
          slug: pl.slug,
          affiliate: pl.affiliate,
          level: pl.currentLevel,
        })),
        venueApprox: g.venueApprox,
      },
    ];
  });
}

function schedulePins(games: Awaited<ReturnType<typeof getSchedule>>["games"]): MapPin[] {
  return games.flatMap((pg) => {
    const team = TEAM_BY_ID.get(pg.teamId);
    if (!team) return [];
    // pin 落在比賽「確切位置」（球場座標）；無座標時退回選手母隊主場
    const g = pg.game;
    const coord: [number, number] | null =
      g.venueLng != null && g.venueLat != null ? [g.venueLng, g.venueLat] : team.latLng;
    const p = project(coord, team.outsideUs);
    if (!p) return [];
    return [
      {
        x: p[0],
        y: p[1],
        variant: "schedule" as const,
        teamName: team.name,
        playerName: pg.playerName,
        playerSlug: SLUG_BY_NAME.get(pg.playerName),
        matchup: matchupLabel(pg.game),
        taiwanTime: toTaiwanTime(pg.game.gameDateUtc),
        status: statusLabel(pg.game.status),
        venue: g.venue,
        homeAway: pg.isHome ? "主場" : "客場",
      },
    ];
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; region?: string }>;
}) {
  const sp = await searchParams;
  // 預設顯示「今日賽程」
  const tab = sp.tab === "homebase" ? "homebase" : "schedule";

  const schedule = await getSchedule();
  const pins = tab === "schedule" ? schedulePins(schedule.games) : homebasePins();

  // homebase：把未定位選手也列進右側清單（非互動）
  const extra: ExtraPlayer[] | undefined =
    tab === "homebase"
      ? UNLOCATABLE_PLAYERS.map((p) => ({
          name: p.name,
          sub: `${TEAM_BY_ID.get(p.org)?.name ?? ""} · ${p.affiliate}`,
        }))
      : undefined;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className="font-sans text-3xl font-bold text-text md:text-4xl">
        台灣旅美球員地圖
      </h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        {tab === "schedule"
          ? "今日有比賽的台灣大聯盟選手球隊，賽事時間換算為台灣時間。點清單或地圖上的點可互相對應。"
          : "台灣旅美球員目前所在的球場。點右側名單或地圖上的點，兩邊會互相標示。"}
      </p>

      {/* 控制列 */}
      <div className="mt-5 flex flex-col gap-3">
        <MapTabs active={tab} />
        <RegionPills />
      </div>

      {/* 地圖 + 右側清單（兩 tab 同版型、可互動連動） */}
      <div className="mt-6">
        <MapExplorer
          nationPath={NATION_PATH}
          bordersPath={BORDERS_PATH}
          pins={pins}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          listTitle={tab === "schedule" ? "今日賽程" : "球員列表"}
          extra={extra}
        />
      </div>
    </div>
  );
}
