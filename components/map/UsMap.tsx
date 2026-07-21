import { geoAlbersUsa, geoPath, type GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import statesTopo from "us-atlas/states-10m.json";
import { LOCATED_PIN_GROUPS } from "@/data/players";

const WIDTH = 975;
const HEIGHT = 610;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = statesTopo as any;
// 州界 FeatureCollection（含 AK/HI）→ 供 fitSize；nation 填色、mesh 畫共享邊界
const states = feature(topo, topo.objects.states) as unknown as FeatureCollection<Geometry>;
const nation = feature(topo, topo.objects.nation) as unknown as Geometry;
// mesh：只取「內部」州界（filter a!==b），每條共享邊界僅一次；
// 外圍海岸線由 nation 路徑的 stroke 提供 → 全圖每條線只畫一次。
const bordersMesh = mesh(
  topo,
  topo.objects.states,
  (a: unknown, b: unknown) => a !== b,
) as unknown as Geometry;

// 單一 projection：州界與所有 pin 共用 → 保證對齊
const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], states);
// digits(1)：座標取 1 位小數（975 寬 viewBox 下為次像素精度），縮小體積、視覺無損。
const pathGen = geoPath(projection).digits(1);
const nationPath = pathGen(nation) ?? "";
const bordersPath = pathGen(bordersMesh) ?? "";

/**
 * 投影一個 [lng,lat]。geoAlbersUsa 對加拿大等 US 外座標回傳 null；
 * 若 outsideUs，用鄰近美國錨點（水牛城）的局部 Jacobian 線性近似定位。
 */
function projectPoint(
  proj: GeoProjection,
  lngLat: [number, number],
  outsideUs?: boolean,
): [number, number] | null {
  const direct = proj(lngLat);
  if (direct) return direct;
  if (!outsideUs) return null;

  const anchor: [number, number] = [-78.8784, 42.8864]; // Buffalo, NY
  const pA = proj(anchor);
  const pdLng = proj([anchor[0] + 0.01, anchor[1]]);
  const pdLat = proj([anchor[0], anchor[1] + 0.01]);
  if (!pA || !pdLng || !pdLat) return null;

  const dxLng = (pdLng[0] - pA[0]) / 0.01;
  const dyLng = (pdLng[1] - pA[1]) / 0.01;
  const dxLat = (pdLat[0] - pA[0]) / 0.01;
  const dyLat = (pdLat[1] - pA[1]) / 0.01;
  const dLng = lngLat[0] - anchor[0];
  const dLat = lngLat[1] - anchor[1];
  return [pA[0] + dLng * dxLng + dLat * dxLat, pA[1] + dLng * dyLng + dLat * dyLat];
}

export function UsMap() {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-auto w-full"
      role="img"
      aria-label="美國地圖：MLB 球場與台灣旅美球員所在位置"
    >
      {/* 陸地填色 + 外圍海岸線（一條路徑）+ 內部州界（共享邊界只畫一次）
          深色模式邊界改用 border-strong 提高對比 */}
      <path
        d={nationPath}
        className="fill-surface stroke-border-subtle dark:stroke-border-strong"
        strokeWidth={0.75}
      />
      <path
        d={bordersPath}
        className="fill-none stroke-border-subtle dark:stroke-border-strong"
        strokeWidth={0.6}
      />

      {/* 台灣選手所在球場（紅點 highlight）。其他 MLB 球場資料仍在 data/teams.ts 但暫不顯示。 */}
      <g>
        {LOCATED_PIN_GROUPS.map((g, i) => {
          const p = projectPoint(projection, g.latLng);
          if (!p) return null;
          const names = g.players.map((pl) => pl.name).join("、");
          const affiliate = g.players[0].affiliate;
          return (
            <g key={i}>
              <circle
                cx={p[0]}
                cy={p[1]}
                r={6}
                className="fill-brand stroke-canvas"
                strokeWidth={1.5}
              >
                <title>
                  {`${affiliate}${g.venueApprox ? "（近似位置）" : ""} · ${names}`}
                </title>
              </circle>
              {g.players.length > 1 && (
                <text
                  x={p[0]}
                  y={p[1] + 2.5}
                  textAnchor="middle"
                  className="pointer-events-none fill-on-brand font-num"
                  fontSize={7}
                  fontWeight={600}
                >
                  {g.players.length}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
