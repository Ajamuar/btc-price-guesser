import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGuessHistory } from "@/lib/history";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  let limit = DEFAULT_LIMIT;
  if (limitParam !== null && limitParam !== "") {
    const parsed = parseInt(limitParam, 10);
    if (Number.isFinite(parsed)) {
      limit = Math.min(Math.max(1, parsed), MAX_LIMIT);
    }
  }

  const history = await getGuessHistory(session.user.id, limit);
  return NextResponse.json({ history });
}
