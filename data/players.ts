import type { Player } from "@/types/player";
import { TEAM_BY_ID } from "@/data/teams";

/**
 * 台灣旅美球員名單（使用者提供，2026）。
 * latLng = 選手「目前所在球場」：
 *  - MLB 級 → 母隊 MLB 球場（取自 teams.ts）。
 *  - 固定小聯盟球場 → 該球場精確座標。
 *  - ACL 新人聯盟 → 母隊亞利桑那複合球場近似座標（venueApprox）。
 *  - DSL / 球隊未定 → null（列於地圖旁清單）。
 * ⚠️ 待確認：柯敬賢「安大略塔台蜂」暫對應道奇 Single-A（Rancho Cucamonga Quakes）。
 */
const mlb = (org: string): [number, number] =>
  TEAM_BY_ID.get(org)!.latLng;

export const PLAYERS: Player[] = [
  // ── MLB ──
  { name: "鄧愷威", org: "astros", joinYear: 2018, affiliate: "休士頓太空人", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("astros") },
  { name: "鄭宗哲", org: "red-sox", joinYear: 2021, affiliate: "波士頓紅襪", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("red-sox") },
  { name: "李灝宇", org: "tigers", joinYear: 2021, affiliate: "底特律老虎", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("tigers") },
  // ── AAA ──
  { name: "莊陳仲敖", org: "athletics", joinYear: 2022, affiliate: "拉斯維加斯飛行者", currentLevel: "AAA", latLng: [-115.3286, 36.162] },
  { name: "林昱珉", org: "diamondbacks", joinYear: 2022, affiliate: "雷諾王牌", currentLevel: "AAA", latLng: [-119.8103, 39.533] },
  { name: "林維恩", org: "athletics", joinYear: 2025, affiliate: "拉斯維加斯飛行者", currentLevel: "AAA", latLng: [-115.3286, 36.162] },
  // ── AA ──
  { name: "陳柏毓", org: "pirates", joinYear: 2021, affiliate: "阿爾圖納曲球", currentLevel: "AA", latLng: [-78.4008, 40.515] },
  { name: "潘文輝", org: "phillies", joinYear: 2023, affiliate: "雷丁格鬥費爾斯", currentLevel: "AA", latLng: [-75.937, 40.3438] },
  { name: "林振瑋", org: "cardinals", joinYear: 2023, affiliate: "春田紅雀", currentLevel: "AA", latLng: [-93.286, 37.21] },
  // ── A+ ──
  { name: "張弘稜", org: "pirates", joinYear: 2022, affiliate: "格林斯伯勒蚱蜢", currentLevel: "A+", latLng: [-79.792, 36.079] },
  { name: "沙子宸", org: "athletics", joinYear: 2023, affiliate: "蘭辛螺母", currentLevel: "A+", latLng: [-84.552, 42.734] },
  // ── A ──
  { name: "李晨薰", org: "giants", joinYear: 2023, affiliate: "聖荷西巨人", currentLevel: "A", latLng: [-121.87, 37.325] },
  { name: "林盛恩", org: "reds", joinYear: 2023, affiliate: "戴通納烏龜", currentLevel: "A", latLng: [-81.009, 29.193] },
  { name: "柯敬賢", org: "dodgers", joinYear: 2024, affiliate: "安大略塔台蜂", currentLevel: "A", latLng: [-117.556, 34.1015], needsReview: true },
  { name: "沈家羲", org: "mariners", joinYear: 2025, affiliate: "內陸帝國66人", currentLevel: "A", latLng: [-117.293, 34.108] },
  { name: "黃仲翔", org: "diamondbacks", joinYear: 2025, affiliate: "維薩利亞生皮鞭", currentLevel: "A", latLng: [-119.312, 36.33] },
  { name: "蘇嵐鴻", org: "padres", joinYear: 2026, affiliate: "艾辛諾湖暴風雨", currentLevel: "A", latLng: [-117.332, 33.669] },
  // ── R（ACL 新人聯盟，母隊亞利桑那複合球場近似）──
  { name: "陽念希", org: "giants", joinYear: 2025, affiliate: "ACL 巨人", currentLevel: "R", latLng: [-111.948, 33.459], venueApprox: true },
  { name: "林張子俊", org: "brewers", joinYear: 2025, affiliate: "ACL 釀酒人", currentLevel: "R", latLng: [-112.156, 33.497], venueApprox: true },
  { name: "林鉑濬", org: "mariners", joinYear: 2026, affiliate: "ACL 水手", currentLevel: "R", latLng: [-112.238, 33.63], venueApprox: true },
  { name: "廖宥霖", org: "brewers", joinYear: 2026, affiliate: "ACL 釀酒人", currentLevel: "R", latLng: [-112.156, 33.497], venueApprox: true },
  // ── 無法定位（DSL 多明尼加 / 球隊未定）→ 側邊清單 ──
  { name: "賴謙凡", org: "yankees", affiliate: "DSL 洋基", currentLevel: "R", latLng: null },
  { name: "林珺希", org: "pirates", affiliate: "（球隊未定）", currentLevel: "R", latLng: null },
  { name: "何樺", org: "phillies", affiliate: "（球隊未定）", currentLevel: "R", latLng: null },
  { name: "林睿杰", org: "twins", affiliate: "（球隊未定）", currentLevel: "R", latLng: null },
];

/** 可定位選手依球場座標聚合（同球場多人 → 一顆 pin） */
export type PinGroup = {
  latLng: [number, number];
  players: Player[];
  venueApprox: boolean;
};

export const LOCATED_PIN_GROUPS: PinGroup[] = (() => {
  const map = new Map<string, PinGroup>();
  for (const p of PLAYERS) {
    if (!p.latLng) continue;
    const key = `${p.latLng[0]},${p.latLng[1]}`;
    const g = map.get(key);
    if (g) {
      g.players.push(p);
      g.venueApprox = g.venueApprox || !!p.venueApprox;
    } else {
      map.set(key, { latLng: p.latLng, players: [p], venueApprox: !!p.venueApprox });
    }
  }
  return [...map.values()];
})();

/** 無法在地圖上定位的選手（DSL / 球隊未定） */
export const UNLOCATABLE_PLAYERS: Player[] = PLAYERS.filter((p) => !p.latLng);
