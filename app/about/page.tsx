import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEAM } from "@/data/team";
import { SPONSOR_TIERS } from "@/data/sponsors";
import type { TeamMember } from "@/types/about";
import { SITE, SITE_SAME_AS } from "@/lib/site";

export const metadata: Metadata = {
  title: "關於旅美幫",
  description:
    "認識旅美幫團隊、我們追蹤台灣旅美球員的初衷，以及支持我們的贊助夥伴。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `關於旅美幫｜${SITE.name}`,
    description:
      "認識旅美幫團隊、我們追蹤台灣旅美球員的初衷，以及支持我們的贊助夥伴。",
    url: `${SITE.url}/about`,
  },
};

// Organization 結構化資料（含四社群 sameAs、logo）
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  logo: `${SITE.url}/favicon.ico`,
  description: SITE.description,
  sameAs: SITE_SAME_AS,
};

function TeamCard({ member }: { member: TeamMember }) {
  const initial = member.name.trim().charAt(0);
  return (
    <article className="flex min-w-[72%] snap-start flex-col rounded-lg border border-border-subtle bg-surface p-5 sm:min-w-[45%] md:min-w-0">
      <div
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full bg-accent font-num text-xl font-semibold text-on-accent"
      >
        {initial}
      </div>
      <h3 className="mt-4 font-sans text-lg font-bold text-text">
        {member.name}
      </h3>
      <p className="text-sm font-medium text-accent-text">{member.role}</p>
      {member.bio && (
        <p className="mt-2 text-sm text-text-muted">{member.bio}</p>
      )}
    </article>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      <article>
        {/* Hero */}
        <header className="max-w-2xl">
          <Badge variant="secondary">關於我們</Badge>
          <h1 className="mt-4 font-sans text-3xl font-bold text-text md:text-4xl">
            旅美幫 — 台灣旅美球員的所在地圖
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            我們追蹤每一位在大聯盟與小聯盟奮鬥的台灣球員，用一張地圖、一份賽程、一頁數據，
            讓球迷隨時知道他們在哪、打得如何。
          </p>
        </header>

        {/* 團隊 */}
        <section className="mt-16" aria-labelledby="team-heading">
          <h2
            id="team-heading"
            className="font-sans text-2xl font-bold text-text"
          >
            團隊成員
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            （以下為示意資料，待補真實成員）
          </p>
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {TEAM.map((member) => (
              <TeamCard key={member.role} member={member} />
            ))}
          </div>
        </section>

        {/* 贊助分層 */}
        <section
          id="sponsors"
          className="mt-16 scroll-mt-20"
          aria-labelledby="sponsors-heading"
        >
          <h2
            id="sponsors-heading"
            className="font-sans text-2xl font-bold text-text"
          >
            贊助夥伴
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            （以下為示意資料，待補真實贊助商）
          </p>
          <div className="mt-6 flex flex-col gap-6">
            {SPONSOR_TIERS.map((tier) => (
              <div
                key={tier.key}
                className="rounded-lg border border-border-subtle bg-surface p-6"
              >
                <h3 className="font-sans text-lg font-bold text-text">
                  {tier.label}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{tier.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {tier.sponsors.map((sponsor) => (
                    <li key={sponsor.name}>
                      <span className="inline-flex items-center rounded-md border border-border-subtle bg-canvas px-4 py-2 text-sm text-text">
                        {sponsor.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 rounded-lg border border-border-subtle bg-surface p-8 text-center"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="font-sans text-2xl font-bold text-text"
          >
            一起支持旅美幫
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-text-muted">
            無論是企業合作或球迷的小額支持，都是我們持續產出內容的動力。
            （以下連結待補真實去向）
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary">
              <a href="mailto:hello@mlbtw.net?subject=贊助合作">
                成為贊助夥伴
              </a>
            </Button>
            <Button asChild variant="accent">
              <a href="#">小額支持</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="#">下載贊助方案</a>
            </Button>
          </div>
        </section>
      </article>
    </div>
  );
}
