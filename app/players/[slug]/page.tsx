import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlayerBySlug, allSlugs } from "@/lib/players";
import { TEAM_BY_ID } from "@/data/teams";
import { NATION_PATH, BORDERS_PATH, project } from "@/lib/map/geo";
import { TAIWAN_PATH, TAIWAN_W, TAIWAN_H, projectHometown } from "@/lib/map/taiwan";
import { Journey, type UsStop } from "@/components/player/journey";
import { SITE } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";

export const revalidate = 600; // ISR：數據每 10 分鐘更新（接真資料後生效）

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlayerBySlug(slug);
  if (!p) return {};
  const team = TEAM_BY_ID.get(p.org)?.name ?? "";
  const desc = `${p.name}（${p.nameEn}）目前效力 ${p.affiliate}，${p.currentLevel} 級。從台灣到美國的旅程、數據與最新動態。`;
  return {
    title: `${p.name}（${team}）數據與旅程`,
    description: desc,
    alternates: { canonical: `/players/${p.slug}` },
    openGraph: {
      title: `${p.name}（${team}）｜旅美幫`,
      description: desc,
      url: `${SITE.url}/players/${p.slug}`,
    },
  };
}

const STAT_COLS: { key: "avg" | "ops" | "hr" | "sb" | "games"; label: string }[] = [
  { key: "avg", label: "AVG" },
  { key: "ops", label: "OPS" },
  { key: "hr", label: "HR" },
  { key: "sb", label: "SB" },
  { key: "games", label: "G" },
];

// 照片集示意佔位色（柔和色塊）
const PHOTO_PLACEHOLDER = ["#b9c6da", "#8ea6c6", "#cdbfa6", "#a99f92"];

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlayerBySlug(slug);
  if (!p) notFound();

  const team = TEAM_BY_ID.get(p.org);
  const origin = p.journey?.find((s) => s.isOrigin);
  const usStops: UsStop[] = (p.journey ?? [])
    .filter((s) => !s.isOrigin)
    .flatMap((s) => {
      const xy = project(s.latLng);
      if (!xy) return [];
      return [{ x: xy[0], y: xy[1], label: s.team, level: s.level, year: s.year }];
    });
  const originLocal = projectHometown(origin?.latLng ?? [120.96, 23.7]);

  // 最新新聞（示意，模板產生；待接真新聞來源）
  const sampleNews = [
    { title: `${p.name}${p.affiliate}最新出賽表現整理`, date: "2026/07/21", source: "旅美幫（示意）" },
    { title: `從${p.hometown ?? "台灣"}到美國：${p.name}的旅美之路`, date: "2026/07/18", source: "專題（示意）" },
    { title: `${p.name}本週數據與亮點回顧`, date: "2026/07/15", source: "數據室（示意）" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    alternateName: p.nameEn,
    url: `${SITE.url}/players/${p.slug}`,
    nationality: "Taiwanese",
    jobTitle: "棒球選手",
    ...(p.socials ? { sameAs: Object.values(p.socials).filter(Boolean) } : {}),
    ...(team ? { memberOf: { "@type": "SportsTeam", name: team.name } } : {}),
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="mb-4 text-sm text-text-muted">
        <Link href="/players" className="hover:text-accent-text">
          ← 選手列表
        </Link>
      </p>

      <article>
        {/* Hero */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span
            aria-hidden="true"
            className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand font-num text-3xl font-semibold text-on-brand"
          >
            {p.name.charAt(0)}
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-sans text-3xl font-bold leading-none text-text md:text-4xl">
                {p.name}
              </h1>
              {/* 選手社群（目前連旅美幫官方帳號，個人帳號待補） */}
              <div className="flex items-center gap-1.5">
                <a
                  href={p.socials?.facebook ?? SITE.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} Facebook`}
                  className="text-text-muted transition-colors hover:text-accent-text"
                >
                  <FacebookIcon className="size-5" />
                </a>
                <a
                  href={p.socials?.instagram ?? SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} Instagram`}
                  className="text-text-muted transition-colors hover:text-accent-text"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </div>
            </div>
            <p className="mt-1 text-text-muted">
              {p.nameEn}
              {p.position && ` · ${p.position}`}
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {team?.name} · {p.affiliate}（{p.currentLevel}）
              {p.hometown ? ` · 出身 ${p.hometown}` : " · 出身地待補"}
            </p>
          </div>
        </header>

        {/* 數據列（值待接真資料，先顯示 —） */}
        <section className="mt-6" aria-label="數據">
          <div className="grid grid-cols-5 gap-2">
            {STAT_COLS.map((c) => (
              <div
                key={c.key}
                className="rounded-lg border border-border-subtle bg-surface p-3 text-center"
              >
                <p className="font-num text-xl font-semibold text-text">
                  {p.stats?.[c.key] ?? "—"}
                </p>
                <p className="text-xs text-text-muted">{c.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted">數據接入中，稍後更新。</p>
        </section>

        {/* 旅程地圖 */}
        <section className="mt-10" aria-label="旅程地圖">
          <h2 className="mb-4 font-sans text-2xl font-bold text-text">
            從台灣到美國的旅程
          </h2>
          <Journey
            nationPath={NATION_PATH}
            bordersPath={BORDERS_PATH}
            taiwanPath={TAIWAN_PATH}
            taiwanW={TAIWAN_W}
            taiwanH={TAIWAN_H}
            originLocal={originLocal}
            originLabel={p.hometown ?? "台灣（出身地待補）"}
            hometownKnown={!!p.hometownLatLng}
            usStops={usStops}
          />
        </section>

        {/* 最新動態：左＝新聞＋媒體牆，右＝照片集（皆示意，待接真資料） */}
        <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="最新動態">
          {/* 左：最新新聞 */}
          <div>
            <h2 className="mb-3 font-sans text-xl font-bold text-text">最新新聞</h2>
            <ul className="flex flex-col gap-3">
              {sampleNews.map((n) => (
                <li
                  key={n.title}
                  className="rounded-lg border border-border-subtle bg-surface p-4"
                >
                  <p className="font-sans text-sm font-medium text-text">
                    {n.title}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {n.date} · {n.source}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：媒體牆 + 照片集 */}
          <div>
            <h2 className="mb-3 font-sans text-xl font-bold text-text">照片與媒體</h2>
            <Link
              href={`/media?player=${p.slug}`}
              className="flex rounded-lg border border-border-subtle bg-surface px-4 py-3 text-sm font-medium text-accent-text transition-colors hover:border-border-strong"
            >
              看 {p.name} 的媒體牆 →
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
              {PHOTO_PLACEHOLDER.map((c, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-text-muted">照片整合中（示意）。</p>
          </div>
        </section>
      </article>
    </div>
  );
}
