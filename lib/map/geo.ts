import "server-only";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import statesTopo from "us-atlas/states-10m.json";

export const MAP_WIDTH = 975;
export const MAP_HEIGHT = 610;

/* eslint-disable @typescript-eslint/no-explicit-any */
const topo = statesTopo as any;
const states = feature(topo, topo.objects.states) as unknown as FeatureCollection<Geometry>;
const nation = feature(topo, topo.objects.nation) as unknown as Geometry;
const bordersMesh = mesh(topo, topo.objects.states, (a: unknown, b: unknown) => a !== b) as unknown as Geometry;
/* eslint-enable @typescript-eslint/no-explicit-any */

const projection = geoAlbersUsa().fitSize([MAP_WIDTH, MAP_HEIGHT], states);
const pathGen = geoPath(projection).digits(1);

/** 州界靜態路徑（模組載入時算一次；供 client 直接渲染，client 不吃 d3） */
export const NATION_PATH = pathGen(nation) ?? "";
export const BORDERS_PATH = pathGen(bordersMesh) ?? "";

/**
 * [lng,lat] → 螢幕座標。geoAlbersUsa 對加拿大回傳 null →
 * 用鄰近美國錨點（水牛城）的局部 Jacobian 近似（供多倫多）。
 */
export function project(
  lngLat: [number, number],
  outsideUs = false,
): [number, number] | null {
  const direct = projection(lngLat);
  if (direct) return direct;
  if (!outsideUs) return null;

  const anchor: [number, number] = [-78.8784, 42.8864];
  const pA = projection(anchor);
  const pdLng = projection([anchor[0] + 0.01, anchor[1]]);
  const pdLat = projection([anchor[0], anchor[1] + 0.01]);
  if (!pA || !pdLng || !pdLat) return null;
  const dxLng = (pdLng[0] - pA[0]) / 0.01;
  const dyLng = (pdLng[1] - pA[1]) / 0.01;
  const dxLat = (pdLat[0] - pA[0]) / 0.01;
  const dyLat = (pdLat[1] - pA[1]) / 0.01;
  const dLng = lngLat[0] - anchor[0];
  const dLat = lngLat[1] - anchor[1];
  return [pA[0] + dLng * dxLng + dLat * dxLat, pA[1] + dLng * dyLng + dLat * dyLat];
}
