/**
 * 台灣旅美球員（M4 擴充，對應 spec 6.2）。
 * 註：hometown/生日/社群/stats/journey 目前多為佔位，標 needsReview；之後接真資料。
 */
export type PlayerLevel = "MLB" | "AAA" | "AA" | "A+" | "A" | "R";

export type PlayerStats = {
  avg: number | null;
  ops: number | null;
  hr: number | null;
  sb: number | null;
  games: number | null;
};

export type JourneyStop = {
  level: PlayerLevel;
  team: string;
  /** [lng, lat]；台灣起點或美國球場 */
  latLng: [number, number];
  year?: number;
  /** 台灣起點（畫在 inset 上） */
  isOrigin?: boolean;
};

export type PlayerSocials = {
  youtube?: string;
  instagram?: string;
  threads?: string;
  facebook?: string;
};

export type Player = {
  name: string; // 中文名
  /** URL slug（英文名 kebab） */
  slug: string;
  /** 英文名 */
  nameEn: string;
  /** 守備位置（RHP/LHP/2B/SS/OF…） */
  position?: string;
  /** 母球隊 id（對應 data/teams.ts） */
  org: string;
  joinYear?: number;
  /** 目前所屬球隊（中文，MLB 或小聯盟隊名） */
  affiliate: string;
  currentLevel: PlayerLevel;
  highestLevel?: PlayerLevel;
  /** 目前所在球場 [lng, lat]；null = 無法定位（DSL / 球隊未定） */
  latLng: [number, number] | null;
  venueApprox?: boolean;

  // ── 以下 M4 新增，多為佔位待補 ──
  /** 出身地城市（中文） */
  hometown?: string;
  /** 出身地 [lng, lat]（旅程地圖起點） */
  hometownLatLng?: [number, number];
  birthDate?: string; // YYYY-MM-DD
  /** MLBAM person id（來自官方 API；供之後抓真數據/頭像） */
  mlbamId?: number;
  stats?: PlayerStats;
  journey?: JourneyStop[];
  socials?: PlayerSocials;

  /** 隊名/對應/資料待人工確認 */
  needsReview?: boolean;
};
