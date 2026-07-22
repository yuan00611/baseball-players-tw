import { ImageResponse } from "next/og";
import { getPlayerBySlug } from "@/lib/players";
import { TEAM_BY_ID } from "@/data/teams";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "旅美幫球員卡";

// 註：ImageResponse 預設字型無 CJK 字符，故 OG 以英文為主（中文 OG 字型列 backlog）。
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlayerBySlug(slug);
  const nameEn = p?.nameEn ?? "Player";
  const teamEn = p ? (TEAM_BY_ID.get(p.org)?.nameEn ?? "") : "";
  const meta = p ? `${p.position ?? ""}  ·  ${p.currentLevel}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e1626",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              background: "#c4333f",
            }}
          />
          <div style={{ color: "#faf6ed", fontSize: "30px", letterSpacing: "2px" }}>
            MLBTW.NET
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#4fd1ff", fontSize: "34px", marginBottom: "8px" }}>
            {teamEn}
          </div>
          <div style={{ color: "#ffffff", fontSize: "88px", fontWeight: 700, lineHeight: 1.05 }}>
            {nameEn}
          </div>
          <div style={{ color: "#a8a190", fontSize: "36px", marginTop: "16px" }}>
            {meta}
          </div>
        </div>

        <div style={{ color: "#a8a190", fontSize: "26px" }}>
          Taiwanese Players Abroad
        </div>
      </div>
    ),
    size,
  );
}
