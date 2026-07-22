import { NextResponse } from "next/server";
import { fetchAllSocial } from "@/lib/social/fetch";
import { setPosts } from "@/lib/social/store";
import type { Platform } from "@/types/social";

// 只有這個 cron endpoint 會（未來）打社群 API；前端一律讀快取。
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await fetchAllSocial();
    await setPosts(posts);
    const byPlatform: Record<Platform, number> = {
      youtube: 0,
      instagram: 0,
      threads: 0,
      facebook: 0,
    };
    for (const p of posts) byPlatform[p.platform]++;
    return NextResponse.json({ ok: true, total: posts.length, byPlatform });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
