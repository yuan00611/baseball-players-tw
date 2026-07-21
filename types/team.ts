/** MLB 球團（M2）。latLng 為主場經緯度 [lng, lat]（d3-geo 慣例）。 */
export type Team = {
  /** kebab-case id，players.ts 的 org 對應這個 */
  id: string;
  name: string; // 中文
  nameEn: string;
  city: string;
  latLng: [number, number]; // [lng, lat]
  level: "MLB";
  /** 主場在加拿大（geoAlbersUsa 無法投影，需 fallback 近似定位） */
  outsideUs?: boolean;
};
