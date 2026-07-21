import type { SponsorTier } from "@/types/about";

/**
 * 贊助分層（M1 佔位資料，贊助商名皆為「（示意）」，待補真實內容）。
 * M6 之後改由 CMS 提供。
 */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    key: "title",
    label: "冠名贊助",
    blurb: "與旅美幫深度合作、共同冠名的年度夥伴。",
    sponsors: [{ name: "冠名企業（示意）" }],
  },
  {
    key: "gold",
    label: "金級贊助",
    blurb: "支持內容持續產出的主要贊助夥伴。",
    sponsors: [
      { name: "金級品牌 A（示意）" },
      { name: "金級品牌 B（示意）" },
    ],
  },
  {
    key: "friend",
    label: "好朋友",
    blurb: "以小額支持旅美幫的朋友們。",
    sponsors: [
      { name: "好朋友 A（示意）" },
      { name: "好朋友 B（示意）" },
      { name: "好朋友 C（示意）" },
      { name: "好朋友 D（示意）" },
    ],
  },
];
