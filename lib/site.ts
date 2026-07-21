/**
 * 全站單一設定源。metadata / Footer / JSON-LD / sitemap 共用。
 * 網址目前僅作 metadataBase / sameAs / sitemap 用，未做任何轉址。
 */
export const SITE = {
  name: "旅美幫 MLBTW.NET",
  shortName: "旅美幫",
  url: "https://www.mlbtw.net",
  description:
    "追蹤台灣旅美棒球選手在大聯盟與小聯盟的所在球隊、賽程、數據與最新動態。",
  tagline: "台灣旅美球員的所在地圖與最新動態",
  socials: {
    youtube: "https://www.youtube.com/@MLBTWNet",
    instagram: "https://www.instagram.com/mlbtwnet",
    threads: "https://www.threads.net/@mlbtwnet",
    facebook: "https://www.facebook.com/mlbtwnet",
  },
} as const;

/** Organization JSON-LD 的 sameAs 陣列 */
export const SITE_SAME_AS = Object.values(SITE.socials);
