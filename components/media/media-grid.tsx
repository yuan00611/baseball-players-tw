"use client";

import * as React from "react";
import type { SocialPost } from "@/types/social";
import { MediaCard } from "@/components/media/media-card";

const BATCH = 8;

export function MediaGrid({ posts }: { posts: SocialPost[] }) {
  const [count, setCount] = React.useState(Math.min(BATCH, posts.length));
  const sentinel = React.useRef<HTMLDivElement | null>(null);

  // posts 變了（切篩選）重置
  React.useEffect(() => setCount(Math.min(BATCH, posts.length)), [posts]);

  React.useEffect(() => {
    if (count >= posts.length) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + BATCH, posts.length));
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, posts.length]);

  if (posts.length === 0) {
    return (
      <p className="mt-8 text-text-muted">
        目前沒有符合條件的貼文（真實社群資料接入中）。
      </p>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.slice(0, count).map((p) => (
          <MediaCard key={p.id} post={p} />
        ))}
      </div>
      {count < posts.length && (
        <div ref={sentinel} className="mt-2 flex justify-center">
          {/* IntersectionObserver 自動載入；按鈕為保底（IO 未觸發時可手動載入） */}
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + BATCH, posts.length))}
            className="rounded-full border border-border-subtle px-5 py-2 text-sm font-medium text-text-muted hover:text-text"
          >
            載入更多（{posts.length - count}）
          </button>
        </div>
      )}
    </>
  );
}
