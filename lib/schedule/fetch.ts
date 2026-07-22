import type { Game, PlayerGame, ScheduleData } from "@/lib/schedule/types";
import { PLAYERS } from "@/data/players";
import { TEAM_BY_ID, TEAM_BY_MLBAM } from "@/data/teams";

const STATS_API = "https://statsapi.mlb.com/api/v1/schedule";

/** MLB 級台灣選手 → 母隊 mlbamId 對應（今日賽程只做 MLB） */
const MLB_PLAYER_TEAM_MLBAM = PLAYERS.filter((p) => p.currentLevel === "MLB").map(
  (p) => ({ playerName: p.name, teamId: p.org, mlbamId: TEAM_BY_ID.get(p.org)!.mlbamId }),
);

/** 美東當日 YYYY-MM-DD（賽程以美東日期為準） */
export function easternDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeGame(g: any): Game {
  const coords = g.venue?.location?.defaultCoordinates;
  return {
    gamePk: g.gamePk,
    gameDateUtc: g.gameDate,
    status: g.status?.detailedState ?? "Scheduled",
    homeMlbId: g.teams?.home?.team?.id,
    awayMlbId: g.teams?.away?.team?.id,
    homeName: TEAM_BY_MLBAM.get(g.teams?.home?.team?.id)?.name ?? g.teams?.home?.team?.name,
    awayName: TEAM_BY_MLBAM.get(g.teams?.away?.team?.id)?.name ?? g.teams?.away?.team?.name,
    venue: g.venue?.name ?? "",
    venueLat: typeof coords?.latitude === "number" ? coords.latitude : null,
    venueLng: typeof coords?.longitude === "number" ? coords.longitude : null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * 抓今日 MLB 賽程，篩出含台灣 MLB 選手母隊的比賽。
 * 只有 cron route 會呼叫（前端不直接打外部 API）。
 */
export async function fetchTodayMlbSchedule(date = easternDate()): Promise<ScheduleData> {
  const url = `${STATS_API}?sportId=1&date=${date}&hydrate=venue(location)`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`MLB API ${res.status}`);
  const data = await res.json();

  const rawGames: unknown[] = data?.dates?.[0]?.games ?? [];
  const games: PlayerGame[] = [];
  for (const raw of rawGames) {
    const game = normalizeGame(raw);
    for (const p of MLB_PLAYER_TEAM_MLBAM) {
      if (game.homeMlbId === p.mlbamId || game.awayMlbId === p.mlbamId) {
        games.push({
          game,
          playerName: p.playerName,
          teamId: p.teamId,
          isHome: game.homeMlbId === p.mlbamId,
        });
      }
    }
  }

  return { date, fetchedAt: new Date().toISOString(), games };
}
