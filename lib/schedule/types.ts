/** 正規化後的一場 MLB 比賽（來自 MLB Stats API） */
export type Game = {
  gamePk: number;
  gameDateUtc: string; // ISO UTC，例 2025-07-21T22:40:00Z
  status: string; // detailedState，例 "Scheduled" / "Final" / "In Progress"
  homeMlbId: number;
  awayMlbId: number;
  homeName: string;
  awayName: string;
  venue: string;
  /** 比賽確切位置（球場座標，來自 API venue.location.defaultCoordinates） */
  venueLat: number | null;
  venueLng: number | null;
};

/** 台灣選手今日賽事（一場比賽 + 對應選手 + 選手母隊 id） */
export type PlayerGame = {
  game: Game;
  playerName: string;
  teamId: string; // data/teams.ts 的 id（該選手母隊 = 參賽隊）
  /** 選手的隊是否為主場（決定比賽在誰的球場） */
  isHome: boolean;
};

/** 快取內容 */
export type ScheduleData = {
  /** 抓取當下的日期（美東 YYYY-MM-DD） */
  date: string;
  /** 抓取時間（ISO） */
  fetchedAt: string;
  games: PlayerGame[];
};
