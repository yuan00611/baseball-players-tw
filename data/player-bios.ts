/**
 * 球員出身地 + MLBAM person id（來源：官方 MLB Stats API `people` / `sports/{id}/players`）。
 * 出身地城市為 API 的 birthCity；經緯度為該縣市/行政區中心（centroid，非確切住址）。
 * mlbamId 之後可用於抓真數據 / 官方頭像。
 * 3 位無英文名者（林珺希/何樺/林睿杰）API 查無，維持待補。
 */
export type PlayerBio = {
  mlbamId: number;
  hometown: string; // 中文顯示
  hometownLatLng: [number, number]; // [lng, lat] 縣市中心
};

// 台灣縣市/行政區中心座標 [lng, lat]
const TW = {
  台北: [121.5654, 25.033] as [number, number],
  新北: [121.4657, 25.0169] as [number, number],
  桃園: [121.301, 24.9936] as [number, number],
  台中: [120.6839, 24.1477] as [number, number],
  台中太平: [120.7185, 24.1265] as [number, number],
  台南: [120.227, 22.9999] as [number, number],
  基隆: [121.7392, 25.1276] as [number, number],
  花蓮: [121.6015, 23.991] as [number, number],
  台東: [121.1132, 22.7583] as [number, number],
  屏東: [120.62, 22.6761] as [number, number],
  南投埔里: [120.9647, 23.965] as [number, number],
};

export const PLAYER_BIOS: Record<string, PlayerBio> = {
  "kai-wei-teng": { mlbamId: 678906, hometown: "台中", hometownLatLng: TW.台中 },
  "tsung-che-cheng": { mlbamId: 691907, hometown: "屏東", hometownLatLng: TW.屏東 },
  "hao-yu-lee": { mlbamId: 701678, hometown: "新北", hometownLatLng: TW.新北 },
  "chen-zhong-ao-zhuang": { mlbamId: 800018, hometown: "台北", hometownLatLng: TW.台北 },
  "yu-min-lin": { mlbamId: 801179, hometown: "台東", hometownLatLng: TW.台東 },
  "wei-en-lin": { mlbamId: 827734, hometown: "桃園", hometownLatLng: TW.桃園 },
  "po-yu-chen": { mlbamId: 696040, hometown: "桃園", hometownLatLng: TW.桃園 },
  "wen-hui-pan": { mlbamId: 808207, hometown: "花蓮", hometownLatLng: TW.花蓮 },
  "chen-wei-lin": { mlbamId: 813820, hometown: "台南", hometownLatLng: TW.台南 },
  "hung-leng-chang": { mlbamId: 800213, hometown: "台中", hometownLatLng: TW.台中 },
  "tzu-chen-sha": { mlbamId: 809223, hometown: "台北", hometownLatLng: TW.台北 },
  "chen-hsun-lee": { mlbamId: 808486, hometown: "桃園", hometownLatLng: TW.桃園 },
  "sheng-en-lin": { mlbamId: 806823, hometown: "台東", hometownLatLng: TW.台東 },
  "ching-hsien-ko": { mlbamId: 828667, hometown: "台中·太平", hometownLatLng: TW.台中太平 },
  "chia-shi-shen": { mlbamId: 828430, hometown: "南投·埔里", hometownLatLng: TW.南投埔里 },
  "chung-hsiang-huang": { mlbamId: 829473, hometown: "基隆", hometownLatLng: TW.基隆 },
  "lan-hong-su": { mlbamId: 837088, hometown: "台北", hometownLatLng: TW.台北 },
  "nien-hsi-yang": { mlbamId: 806825, hometown: "台南", hometownLatLng: TW.台南 },
  "chang-tzu-chun-lin": { mlbamId: 835646, hometown: "新北", hometownLatLng: TW.新北 },
  "po-chun-lin": { mlbamId: 806836, hometown: "台北", hometownLatLng: TW.台北 },
  "yu-lin-liao": { mlbamId: 835879, hometown: "桃園", hometownLatLng: TW.桃園 },
  "chien-fan-lai": { mlbamId: 843397, hometown: "台東", hometownLatLng: TW.台東 },
};
