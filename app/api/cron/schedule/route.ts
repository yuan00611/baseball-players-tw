import { NextResponse } from "next/server";
import { fetchTodayMlbSchedule } from "@/lib/schedule/fetch";
import { setSchedule } from "@/lib/schedule/store";

// 只有這個 cron endpoint 會打外部 MLB API；前端一律讀快取。
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchTodayMlbSchedule();
    await setSchedule(data);
    return NextResponse.json({
      ok: true,
      date: data.date,
      count: data.games.length,
      fetchedAt: data.fetchedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
