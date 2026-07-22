import { promises as fs } from "node:fs";
import path from "node:path";
import type { SocialPost } from "@/types/social";
import fixture from "@/data/social-fixture.json";

/** 社群貼文快取（M5：本地 JSON，之後換真 DB/KV，同 schedule 模式） */
const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "social.json");

export async function setPosts(posts: SocialPost[]): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(posts, null, 2), "utf8");
}

export async function getPosts(): Promise<SocialPost[]> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    const posts = JSON.parse(raw) as SocialPost[];
    if (posts.length > 0) return posts;
  } catch {
    /* 無快取 → fixture */
  }
  return fixture as SocialPost[];
}
