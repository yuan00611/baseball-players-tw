/** 社群貼文（spec 6.3）。M5 目前為示意 fixture；真資料走 cron→快取→ISR。 */
export type Platform = "youtube" | "instagram" | "threads" | "facebook";

export type SocialPost = {
  id: string;
  platform: Platform;
  title: string;
  excerpt?: string;
  /** 縮圖 URL；null → 前端用生成式佔位（避免版權） */
  thumbnailUrl?: string | null;
  /** 原貼文連結（真 <a>） */
  permalink: string;
  /** ISO 時間 */
  publishedAt: string;
  /** 相關選手 slug（對應 data/players.ts） */
  playerSlugs: string[];
  stats: { likes?: number; views?: number };
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  threads: "Threads",
  facebook: "Facebook",
};
