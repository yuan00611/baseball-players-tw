import type { SocialPost } from "@/types/social";

/**
 * YouTube Data API v3 抓 mlbtwnet 頻道近期影片。
 * 無 YOUTUBE_API_KEY 時回 []（M5 先用 fixture；填 key 即通）。
 */
export async function fetchYouTube(): Promise<SocialPost[]> {
  const key = process.env.YOUTUBE_API_KEY;
  const handle = "@MLBTWNet";
  if (!key) return [];
  try {
    // 1) handle → channelId
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${key}`,
      { cache: "no-store" },
    );
    const ch = await chRes.json();
    const uploads = ch?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) return [];
    // 2) uploads playlist → 近期影片
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=20&playlistId=${uploads}&key=${key}`,
      { cache: "no-store" },
    );
    const pl = await plRes.json();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (pl?.items ?? []).map((it: any) => {
      const s = it.snippet;
      const vid = it.contentDetails?.videoId;
      return {
        id: `yt-${vid}`,
        platform: "youtube" as const,
        title: s?.title ?? "",
        thumbnailUrl: s?.thumbnails?.medium?.url ?? null,
        permalink: `https://www.youtube.com/watch?v=${vid}`,
        publishedAt: s?.publishedAt ?? "",
        playerSlugs: [],
        stats: {},
      };
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return [];
  }
}

// IG / FB / Threads：需 Meta App + 審核（行政流程請人類啟動）。目前 stub。
export async function fetchInstagram(): Promise<SocialPost[]> {
  return [];
}
export async function fetchThreads(): Promise<SocialPost[]> {
  return [];
}
export async function fetchFacebook(): Promise<SocialPost[]> {
  return [];
}

export async function fetchAllSocial(): Promise<SocialPost[]> {
  const results = await Promise.all([
    fetchYouTube(),
    fetchInstagram(),
    fetchThreads(),
    fetchFacebook(),
  ]);
  return results
    .flat()
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
