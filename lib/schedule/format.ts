import type { Game } from "@/lib/schedule/types";

/** UTC ISO → 台灣時間顯示（Asia/Taipei, UTC+8） */
export function toTaiwanTime(utcIso: string): string {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).format(new Date(utcIso));
}

/** 對戰標籤（客隊 @ 主隊，用中文隊名） */
export function matchupLabel(game: Game): string {
  return `${game.awayName} @ ${game.homeName}`;
}

/** 比賽狀態中文化 */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    Scheduled: "未開始",
    "Pre-Game": "賽前",
    Warmup: "熱身",
    "In Progress": "進行中",
    Final: "已結束",
    "Game Over": "已結束",
    Postponed: "延賽",
    Cancelled: "取消",
  };
  return map[status] ?? status;
}
