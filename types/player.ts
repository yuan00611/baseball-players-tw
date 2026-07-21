/**
 * 台灣旅美球員（M2 精簡版）。
 * M4 會擴充為 spec 6.2 的完整模型（slug / nameEn / stats / journey…）。
 */
export type PlayerLevel = "MLB" | "AAA" | "AA" | "A+" | "A" | "R";

export type Player = {
  name: string; // 中文名
  /** 母球隊 id（對應 data/teams.ts） */
  org: string;
  /** 加入年分（西元） */
  joinYear?: number;
  /** 目前所屬球隊（中文，MLB 或小聯盟隊名） */
  affiliate: string;
  currentLevel: PlayerLevel;
  highestLevel?: PlayerLevel;
  /** 目前所在球場 [lng, lat]；null = 無法定位（DSL / 球隊未定），列於地圖旁清單 */
  latLng: [number, number] | null;
  /** 座標為近似（ACL 新人聯盟母隊複合球場） */
  venueApprox?: boolean;
  /** 隊名/對應待人工確認 */
  needsReview?: boolean;
};
