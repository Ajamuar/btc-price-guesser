import { getLeaderboard } from "@/lib/leaderboard";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  let limit = DEFAULT_LIMIT;
  if (limitParam !== null && limitParam !== "") {
    const parsed = parseInt(limitParam, 10);
    if (Number.isFinite(parsed)) {
      limit = Math.min(Math.max(1, parsed), MAX_LIMIT);
    }
  }

  try {
    const entries = await getLeaderboard(limit);
    return NextResponse.json({ entries });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Leaderboard unavailable";
    console.error("[GET /api/leaderboard]", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
