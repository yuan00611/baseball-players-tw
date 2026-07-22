import "server-only";
import { geoMercator, geoPath, geoArea } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry, Polygon } from "geojson";
import countriesTopo from "world-atlas/countries-50m.json";

/**
 * 真實台灣地圖（world-atlas，US Census/Natural Earth 等級）。
 * 只取最大多邊形（台灣本島；濾掉金馬等離島避免 bbox 失真），
 * 用 geoMercator fitSize 到本地座標系，供旅程地圖 inset。
 */
export const TAIWAN_W = 100;
export const TAIWAN_H = 165;

/* eslint-disable @typescript-eslint/no-explicit-any */
const topo = countriesTopo as any;
const countries = feature(topo, topo.objects.countries) as unknown as FeatureCollection;
const twFeature = countries.features.find((f) => f.id === "158");

// 台灣本島 = 面積最大的多邊形
function mainIslandPolygon(): Polygon {
  const geom = twFeature!.geometry as any;
  if (geom.type === "Polygon") return geom as Polygon;
  let best = geom.coordinates[0];
  let bestArea = 0;
  for (const coords of geom.coordinates) {
    const poly: Polygon = { type: "Polygon", coordinates: coords };
    const a = geoArea(poly);
    if (a > bestArea) {
      bestArea = a;
      best = coords;
    }
  }
  return { type: "Polygon", coordinates: best };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const taiwan = mainIslandPolygon();
const projection = geoMercator().fitSize([TAIWAN_W, TAIWAN_H], taiwan as unknown as Geometry);
const pathGen = geoPath(projection).digits(1);

export const TAIWAN_PATH = pathGen(taiwan as unknown as Geometry) ?? "";

/** 出身地 [lng,lat] → 台灣 inset 本地座標（與地圖同投影，準確） */
export function projectHometown(lngLat: [number, number]): [number, number] {
  const p = projection(lngLat);
  return p ? [p[0], p[1]] : [TAIWAN_W / 2, TAIWAN_H / 2];
}
