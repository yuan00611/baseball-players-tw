import type { Metadata } from "next";
import { getPosts } from "@/lib/social/store";
import { getPlayerBySlug } from "@/lib/players";
import { FilterBar } from "@/components/media/filter-bar";
import { MediaGrid } from "@/components/media/media-grid";
import type { Platform } from "@/types/social";

export const revalidate = 300; // ISR：社群快取更新後 5 分內反映

export const metadata: Metadata = {
  title: "媒體牆",
  description:
    "旅美幫 YouTube／Instagram／Threads／Facebook 貼文整合牆，可依平台與選手篩選。",
  alternates: { canonical: "/media" },
};

const VALID: Platform[] = ["youtube", "instagram", "threads", "facebook"];

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; player?: string }>;
}) {
  const sp = await searchParams;
  const platform = VALID.includes(sp.platform as Platform) ? (sp.platform as Platform) : "";
  const player = sp.player ?? "";

  const all = await getPosts();

  // 篩選
  const filtered = all.filter((p) => {
    if (platform && p.platform !== platform) return false;
    if (player && player !== "all" && !p.playerSlugs.includes(player)) return false;
    return true;
  });

  // 有貼文的選手（給篩選器）
  const slugSet = new Set(all.flatMap((p) => p.playerSlugs));
  const players = [...slugSet]
    .map((slug) => ({ slug, name: getPlayerBySlug(slug)?.name ?? slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hant"));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className="font-sans text-3xl font-bold text-text md:text-4xl">媒體牆</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        旅美幫四大社群平台的最新貼文。（以下為示意範例，真實社群資料接入中）
      </p>

      <FilterBar platform={platform} player={player} players={players} />
      <MediaGrid posts={filtered} />
    </div>
  );
}
