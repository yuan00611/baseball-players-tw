import { PLAYERS } from "@/data/players";
import type { Player, PlayerLevel } from "@/types/player";

export function getAllPlayers(): Player[] {
  return PLAYERS;
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return PLAYERS.find((p) => p.slug === slug);
}

export function allSlugs(): string[] {
  return PLAYERS.map((p) => p.slug);
}

/** 依等級分組（清單頁用），依 MLB→R 排序 */
const LEVEL_ORDER: PlayerLevel[] = ["MLB", "AAA", "AA", "A+", "A", "R"];

export function playersByLevel(): { level: PlayerLevel; players: Player[] }[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    players: PLAYERS.filter((p) => p.currentLevel === level),
  })).filter((g) => g.players.length > 0);
}
