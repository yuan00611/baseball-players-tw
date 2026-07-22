import type { Player, JourneyStop, PlayerStats } from "@/types/player";
import { TEAM_BY_ID } from "@/data/teams";
import { PLAYER_BIOS } from "@/data/player-bios";

const mlb = (org: string): [number, number] => TEAM_BY_ID.get(org)!.latLng;

/** 出身地未知時的台灣預設起點（中部，佔位；待補真實出身地） */
const TW_DEFAULT: [number, number] = [120.96, 23.7];

/** 空數據（顯示為「—」，不放假數字） */
const EMPTY_STATS: PlayerStats = { avg: null, ops: null, hr: null, sb: null, games: null };

/**
 * 台灣旅美球員名單（使用者提供 25 人；英文名/守備位置取自使用者提供的參考站，2026）。
 * 出身地/生日/社群/數據多為佔位待補（見 needsReview / stats=EMPTY_STATS）。
 * latLng = 選手目前所在球場（詳見各特例，同 M2/M3）。
 */
type Seed = Omit<Player, "journey" | "stats" | "hometownLatLng"> & {
  hometownLatLng?: [number, number];
};

const SEED: Seed[] = [
  // ── MLB ──
  { name: "鄧愷威", nameEn: "Kai-Wei Teng", slug: "kai-wei-teng", position: "RHP", org: "astros", joinYear: 2018, affiliate: "休士頓太空人", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("astros") },
  { name: "鄭宗哲", nameEn: "Tsung-Che Cheng", slug: "tsung-che-cheng", position: "SS/2B", org: "red-sox", joinYear: 2021, affiliate: "波士頓紅襪", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("red-sox") },
  { name: "李灝宇", nameEn: "Hao-Yu Lee", slug: "hao-yu-lee", position: "2B", org: "tigers", joinYear: 2021, affiliate: "底特律老虎", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("tigers") },
  // ── AAA ──
  { name: "莊陳仲敖", nameEn: "Chen Zhong-Ao Zhuang", slug: "chen-zhong-ao-zhuang", position: "RHP", org: "athletics", joinYear: 2022, affiliate: "拉斯維加斯飛行者", currentLevel: "AAA", latLng: [-115.3286, 36.162] },
  { name: "林昱珉", nameEn: "Yu-Min Lin", slug: "yu-min-lin", position: "LHP", org: "diamondbacks", joinYear: 2022, affiliate: "雷諾王牌", currentLevel: "AAA", latLng: [-119.8103, 39.533] },
  { name: "林維恩", nameEn: "Wei-En Lin", slug: "wei-en-lin", position: "LHP", org: "athletics", joinYear: 2025, affiliate: "拉斯維加斯飛行者", currentLevel: "AAA", latLng: [-115.3286, 36.162] },
  // ── AA ──
  { name: "陳柏毓", nameEn: "Po-Yu Chen", slug: "po-yu-chen", position: "RHP", org: "pirates", joinYear: 2021, affiliate: "阿爾圖納曲球", currentLevel: "AA", latLng: [-78.4008, 40.515] },
  { name: "潘文輝", nameEn: "Wen-Hui Pan", slug: "wen-hui-pan", position: "RHP", org: "phillies", joinYear: 2023, affiliate: "雷丁格鬥費爾斯", currentLevel: "AA", latLng: [-75.937, 40.3438] },
  { name: "林振瑋", nameEn: "Chen-Wei Lin", slug: "chen-wei-lin", position: "RHP", org: "cardinals", joinYear: 2023, affiliate: "春田紅雀", currentLevel: "AA", latLng: [-93.286, 37.21] },
  // ── A+ ──
  { name: "張弘稜", nameEn: "Hung-Leng Chang", slug: "hung-leng-chang", position: "RHP", org: "pirates", joinYear: 2022, affiliate: "格林斯伯勒蚱蜢", currentLevel: "A+", latLng: [-79.792, 36.079] },
  { name: "沙子宸", nameEn: "Tzu-Chen Sha", slug: "tzu-chen-sha", position: "RHP", org: "athletics", joinYear: 2023, affiliate: "蘭辛螺母", currentLevel: "A+", latLng: [-84.552, 42.734] },
  // ── A ──
  { name: "李晨薰", nameEn: "Chen-Hsun Lee", slug: "chen-hsun-lee", position: "RHP", org: "giants", joinYear: 2023, affiliate: "聖荷西巨人", currentLevel: "A", latLng: [-121.87, 37.325] },
  { name: "林盛恩", nameEn: "Sheng-En Lin", slug: "sheng-en-lin", position: "RHP", org: "reds", joinYear: 2023, affiliate: "戴通納烏龜", currentLevel: "A", latLng: [-81.009, 29.193] },
  { name: "柯敬賢", nameEn: "Ching-Hsien Ko", slug: "ching-hsien-ko", position: "OF", org: "dodgers", joinYear: 2024, affiliate: "安大略塔台蜂（Ontario Tower Buzzers）", currentLevel: "A", latLng: [-117.556, 34.1015] },
  { name: "沈家羲", nameEn: "Chia-Shi Shen", slug: "chia-shi-shen", position: "RHP", org: "mariners", joinYear: 2025, affiliate: "內陸帝國66人", currentLevel: "A", latLng: [-117.293, 34.108] },
  { name: "黃仲翔", nameEn: "Chung-Hsiang Huang", slug: "chung-hsiang-huang", position: "RHP", org: "diamondbacks", joinYear: 2025, affiliate: "維薩利亞生皮鞭", currentLevel: "A", latLng: [-119.312, 36.33] },
  { name: "蘇嵐鴻", nameEn: "Lan-Hong Su", slug: "lan-hong-su", position: "RHP", org: "padres", joinYear: 2026, affiliate: "艾辛諾湖暴風雨", currentLevel: "A", latLng: [-117.332, 33.669] },
  // ── R（ACL 新人聯盟，母隊亞利桑那複合球場近似）──
  { name: "陽念希", nameEn: "Nien-Hsi Yang", slug: "nien-hsi-yang", position: "RHP", org: "giants", joinYear: 2025, affiliate: "ACL 巨人", currentLevel: "R", latLng: [-111.948, 33.459], venueApprox: true },
  { name: "林張子俊", nameEn: "Chang Tzu-Chun Lin", slug: "chang-tzu-chun-lin", position: "RHP", org: "brewers", joinYear: 2025, affiliate: "ACL 釀酒人", currentLevel: "R", latLng: [-112.156, 33.497], venueApprox: true },
  { name: "林鉑濬", nameEn: "Po-Chun Lin", slug: "po-chun-lin", position: "RHP", org: "mariners", joinYear: 2026, affiliate: "ACL 水手", currentLevel: "R", latLng: [-112.238, 33.63], venueApprox: true },
  { name: "廖宥霖", nameEn: "Yu-Lin Liao", slug: "yu-lin-liao", position: "1B/3B", org: "brewers", joinYear: 2026, affiliate: "ACL 釀酒人", currentLevel: "R", latLng: [-112.156, 33.497], venueApprox: true },
  { name: "賴謙凡", nameEn: "Chien-Fan Lai", slug: "chien-fan-lai", position: "RHP", org: "yankees", affiliate: "DSL 洋基", currentLevel: "R", latLng: null },
  // ── 參考站未列（英文名自行羅馬拼音，待確認）──
  { name: "林珺希", nameEn: "Chun-Hsi Lin", slug: "chun-hsi-lin", org: "pirates", affiliate: "（球隊未定）", currentLevel: "R", latLng: null, needsReview: true },
  { name: "何樺", nameEn: "Hua Ho", slug: "hua-ho", org: "phillies", affiliate: "（球隊未定）", currentLevel: "R", latLng: null, needsReview: true },
  { name: "林睿杰", nameEn: "Jui-Chieh Lin", slug: "jui-chieh-lin", org: "twins", affiliate: "（球隊未定）", currentLevel: "R", latLng: null, needsReview: true },
  // ── 台裔球員（美國出生，Taiwanese heritage）──
  { name: "Corbin Carroll", nameEn: "Corbin Carroll", slug: "corbin-carroll", position: "OF", org: "diamondbacks", affiliate: "亞利桑那響尾蛇（台裔）", currentLevel: "MLB", highestLevel: "MLB", latLng: mlb("diamondbacks"), mlbamId: 682998, hometown: "西雅圖（台裔）" },
  { name: "Stuart Fairchild", nameEn: "Stuart Fairchild", slug: "stuart-fairchild", position: "OF", org: "mariners", affiliate: "Tacoma Rainiers（台裔）", currentLevel: "AAA", latLng: [-122.5075, 47.2318], mlbamId: 656413, hometown: "西雅圖（台裔）" },
  { name: "Jonathon Long", nameEn: "Jonathon Long", slug: "jonathon-long", position: "1B", org: "cubs", affiliate: "Iowa Cubs（台裔）", currentLevel: "AAA", latLng: [-93.6118, 41.5836], mlbamId: 675085, hometown: "Orange, CA（台裔）" },
];

/** 簡化 journey：台灣起點（佔位，待補真實出身地）→ 現在球場 */
function buildJourney(s: Seed): JourneyStop[] {
  const origin: JourneyStop = {
    level: "R",
    team: s.hometown ?? "台灣（出身地待補）",
    latLng: s.hometownLatLng ?? TW_DEFAULT,
    isOrigin: true,
  };
  if (!s.latLng) return [origin];
  return [
    origin,
    {
      level: s.currentLevel,
      team: s.affiliate,
      latLng: s.latLng,
      year: s.joinYear,
    },
  ];
}

export const PLAYERS: Player[] = SEED.map((s) => {
  const bio = PLAYER_BIOS[s.slug];
  const merged: Seed = bio
    ? { ...s, mlbamId: bio.mlbamId, hometown: bio.hometown, hometownLatLng: bio.hometownLatLng }
    : s;
  return {
    ...merged,
    stats: EMPTY_STATS,
    journey: buildJourney(merged),
  };
});

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
