import { promises as fs } from "node:fs";
import path from "node:path";
import type { ScheduleData } from "@/lib/schedule/types";
import fixture from "@/data/schedule-fixture.json";

/**
 * 賽程快取存取層（M3：本地 JSON 檔，之後換真 DB/KV）。
 * 讀不到快取時回退內建 fixture，確保 UI 永遠有資料可顯示。
 */
const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "schedule.json");

export async function setSchedule(data: ScheduleData): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getSchedule(): Promise<ScheduleData & { source: "cache" | "fixture" }> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    return { ...(JSON.parse(raw) as ScheduleData), source: "cache" };
  } catch {
    return { ...(fixture as ScheduleData), source: "fixture" };
  }
}
