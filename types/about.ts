/** 關於頁資料模型（M1；M6 之後改由 CMS 提供） */

export type TeamMember = {
  /** 姓名（M1 為佔位） */
  name: string;
  /** 職稱／分工 */
  role: string;
  /** 一句話簡介 */
  bio?: string;
  /** 頭像圖片路徑；未提供時前端出字母 avatar */
  avatar?: string;
};

export type Sponsor = {
  name: string;
  /** 官網連結（可選） */
  url?: string;
};

export type SponsorTierKey = "title" | "gold" | "friend";

export type SponsorTier = {
  key: SponsorTierKey;
  /** 顯示名稱：冠名／金級／好朋友 */
  label: string;
  /** 分層說明 */
  blurb: string;
  sponsors: Sponsor[];
};
