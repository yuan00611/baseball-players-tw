import type { Metadata } from "next";
import Link from "next/link";
import { playersByLevel } from "@/lib/players";
import { TEAM_BY_ID } from "@/data/teams";

export const metadata: Metadata = {
  title: "選手",
  description:
    "台灣旅美棒球選手列表：大聯盟與各級小聯盟球員，點入看數據與旅程地圖。",
  alternates: { canonical: "/players" },
};

const LEVEL_LABEL: Record<string, string> = {
  MLB: "大聯盟 MLB",
  AAA: "3A",
  AA: "2A",
  "A+": "高階 1A",
  A: "1A",
  R: "新人聯盟 / 其他",
};

export default function PlayersPage() {
  const groups = playersByLevel();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <h1 className="font-sans text-3xl font-bold text-text md:text-4xl">選手</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        台灣旅美球員，依目前所在層級分類。點選手看數據與從台灣出發的旅程地圖。
      </p>

      {groups.map((g) => (
        <section key={g.level} className="mt-10" aria-labelledby={`level-${g.level}`}>
          <h2
            id={`level-${g.level}`}
            className="mb-4 font-sans text-xl font-bold text-text"
          >
            {LEVEL_LABEL[g.level] ?? g.level}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.players.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/players/${p.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface p-4 transition-colors hover:border-border-strong"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand font-num text-lg font-semibold text-on-brand"
                  >
                    {p.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans font-bold text-text">
                      {p.name}
                      {p.position && (
                        <span className="ml-2 text-xs font-normal text-text-muted">
                          {p.position}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-sm text-text-muted">
                      {TEAM_BY_ID.get(p.org)?.name} · {p.affiliate}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
