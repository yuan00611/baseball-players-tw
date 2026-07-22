import type { Team } from "@/types/team";

/**
 * 30 支 MLB 球團 + 主場經緯度（[lng, lat]，真實值）。
 * 座標來源：各隊主場公開地理位置。
 * 特例：
 *  - athletics：2025– 暫居 Sacramento 的 Sutter Health Park。
 *  - rays：Tropicana Field（2025 颶風暫遷，此處用固定主場）。
 *  - blue-jays：Rogers Centre 在加拿大，geoAlbersUsa 無法投影 → outsideUs（近似定位）。
 */
export const TEAMS: Team[] = [
  // ── 有台灣選手母隊（highlight 由 players.ts 決定，這裡只是球團底圖）──
  { id: "astros", name: "休士頓太空人", nameEn: "Houston Astros", city: "Houston, TX", latLng: [-95.3555, 29.7573], mlbamId: 117, level: "MLB" },
  { id: "red-sox", name: "波士頓紅襪", nameEn: "Boston Red Sox", city: "Boston, MA", latLng: [-71.0972, 42.3467], mlbamId: 111, level: "MLB" },
  { id: "tigers", name: "底特律老虎", nameEn: "Detroit Tigers", city: "Detroit, MI", latLng: [-83.0485, 42.339], mlbamId: 116, level: "MLB" },
  { id: "athletics", name: "運動家", nameEn: "Athletics", city: "West Sacramento, CA", latLng: [-121.5083, 38.58], mlbamId: 133, level: "MLB" },
  { id: "diamondbacks", name: "亞利桑那響尾蛇", nameEn: "Arizona Diamondbacks", city: "Phoenix, AZ", latLng: [-112.0667, 33.4455], mlbamId: 109, level: "MLB" },
  { id: "pirates", name: "匹茲堡海盜", nameEn: "Pittsburgh Pirates", city: "Pittsburgh, PA", latLng: [-80.0057, 40.4469], mlbamId: 134, level: "MLB" },
  { id: "phillies", name: "費城費城人", nameEn: "Philadelphia Phillies", city: "Philadelphia, PA", latLng: [-75.1665, 39.9057], mlbamId: 143, level: "MLB" },
  { id: "cardinals", name: "聖路易紅雀", nameEn: "St. Louis Cardinals", city: "St. Louis, MO", latLng: [-90.1928, 38.6226], mlbamId: 138, level: "MLB" },
  { id: "giants", name: "舊金山巨人", nameEn: "San Francisco Giants", city: "San Francisco, CA", latLng: [-122.3893, 37.7786], mlbamId: 137, level: "MLB" },
  { id: "reds", name: "辛辛那提紅人", nameEn: "Cincinnati Reds", city: "Cincinnati, OH", latLng: [-84.5069, 39.0975], mlbamId: 113, level: "MLB" },
  { id: "dodgers", name: "洛杉磯道奇", nameEn: "Los Angeles Dodgers", city: "Los Angeles, CA", latLng: [-118.24, 34.0739], mlbamId: 119, level: "MLB" },
  { id: "mariners", name: "西雅圖水手", nameEn: "Seattle Mariners", city: "Seattle, WA", latLng: [-122.3316, 47.5914], mlbamId: 136, level: "MLB" },
  { id: "padres", name: "聖地牙哥教士", nameEn: "San Diego Padres", city: "San Diego, CA", latLng: [-117.1571, 32.7073], mlbamId: 135, level: "MLB" },
  { id: "brewers", name: "密爾瓦基釀酒人", nameEn: "Milwaukee Brewers", city: "Milwaukee, WI", latLng: [-87.9712, 43.028], mlbamId: 158, level: "MLB" },
  { id: "yankees", name: "紐約洋基", nameEn: "New York Yankees", city: "Bronx, NY", latLng: [-73.9265, 40.8296], mlbamId: 147, level: "MLB" },
  { id: "twins", name: "明尼蘇達雙城", nameEn: "Minnesota Twins", city: "Minneapolis, MN", latLng: [-93.2777, 44.9817], mlbamId: 142, level: "MLB" },
  // ── 其餘無台灣選手 MLB 球團 ──
  { id: "angels", name: "洛杉磯天使", nameEn: "Los Angeles Angels", city: "Anaheim, CA", latLng: [-117.8827, 33.8003], mlbamId: 108, level: "MLB" },
  { id: "mets", name: "紐約大都會", nameEn: "New York Mets", city: "Queens, NY", latLng: [-73.8458, 40.7571], mlbamId: 121, level: "MLB" },
  { id: "braves", name: "亞特蘭大勇士", nameEn: "Atlanta Braves", city: "Atlanta, GA", latLng: [-84.4677, 33.8907], mlbamId: 144, level: "MLB" },
  { id: "orioles", name: "巴爾的摩金鶯", nameEn: "Baltimore Orioles", city: "Baltimore, MD", latLng: [-76.6217, 39.2839], mlbamId: 110, level: "MLB" },
  { id: "cubs", name: "芝加哥小熊", nameEn: "Chicago Cubs", city: "Chicago, IL", latLng: [-87.6556, 41.9484], mlbamId: 112, level: "MLB" },
  { id: "white-sox", name: "芝加哥白襪", nameEn: "Chicago White Sox", city: "Chicago, IL", latLng: [-87.6339, 41.83], mlbamId: 145, level: "MLB" },
  { id: "guardians", name: "克里夫蘭守護者", nameEn: "Cleveland Guardians", city: "Cleveland, OH", latLng: [-81.6852, 41.4962], mlbamId: 114, level: "MLB" },
  { id: "rockies", name: "科羅拉多落磯", nameEn: "Colorado Rockies", city: "Denver, CO", latLng: [-104.9942, 39.7559], mlbamId: 115, level: "MLB" },
  { id: "royals", name: "堪薩斯市皇家", nameEn: "Kansas City Royals", city: "Kansas City, MO", latLng: [-94.4803, 39.0517], mlbamId: 118, level: "MLB" },
  { id: "marlins", name: "邁阿密馬林魚", nameEn: "Miami Marlins", city: "Miami, FL", latLng: [-80.2197, 25.7781], mlbamId: 146, level: "MLB" },
  { id: "rangers", name: "德州遊騎兵", nameEn: "Texas Rangers", city: "Arlington, TX", latLng: [-97.0847, 32.7473], mlbamId: 140, level: "MLB" },
  { id: "rays", name: "坦帕灣光芒", nameEn: "Tampa Bay Rays", city: "St. Petersburg, FL", latLng: [-82.6534, 27.7683], mlbamId: 139, level: "MLB" },
  { id: "nationals", name: "華盛頓國民", nameEn: "Washington Nationals", city: "Washington, D.C.", latLng: [-77.0074, 38.873], mlbamId: 120, level: "MLB" },
  { id: "blue-jays", name: "多倫多藍鳥", nameEn: "Toronto Blue Jays", city: "Toronto, ON", latLng: [-79.3891, 43.6414], mlbamId: 141, level: "MLB", outsideUs: true },
];

export const TEAM_BY_ID = new Map(TEAMS.map((t) => [t.id, t]));
export const TEAM_BY_MLBAM = new Map(TEAMS.map((t) => [t.mlbamId, t]));
