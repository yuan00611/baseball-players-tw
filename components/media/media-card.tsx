import type { SocialPost } from "@/types/social";
import { PLATFORM_LABEL } from "@/types/social";
import { PLATFORM_ICON, PLATFORM_COLOR } from "@/components/icons/social-icons";
import { getPlayerBySlug } from "@/lib/players";

function formatStat(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}萬`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function MediaCard({ post }: { post: SocialPost }) {
  const Icon = PLATFORM_ICON[post.platform];
  const color = PLATFORM_COLOR[post.platform];
  const players = post.playerSlugs
    .map((s) => getPlayerBySlug(s)?.name)
    .filter(Boolean) as string[];

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface transition-colors hover:border-border-strong"
    >
      {/* 縮圖：固定 16:9；有真圖用 <img> lazy，否則平台色生成式佔位 */}
      {post.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumbnailUrl}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div
          className="flex aspect-video w-full items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}22)` }}
          aria-hidden="true"
        >
          <Icon className="size-12 text-white/85" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Icon className="size-3.5" />
          <span>{PLATFORM_LABEL[post.platform]}</span>
        </div>
        {/* 標題固定兩行高度，讓卡片一致 */}
        <p className="mt-1.5 line-clamp-2 min-h-[2.6rem] font-sans text-sm font-medium text-text">
          {post.title}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-text-muted">
          {post.stats.views != null && <span>▶ {formatStat(post.stats.views)}</span>}
          {post.stats.likes != null && <span>♥ {formatStat(post.stats.likes)}</span>}
          {players.map((n) => (
            <span key={n} className="text-accent-text">
              #{n}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
