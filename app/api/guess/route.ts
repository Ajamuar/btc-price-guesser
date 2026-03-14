import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, setPendingGuess } from "@/lib/user";
import { NextResponse } from "next/server";

type GuessBody = {
  direction?: unknown;
  priceAtGuess?: unknown;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserById(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (profile.pendingGuess != null) {
    return NextResponse.json(
      { error: "You already have a pending guess. Wait for it to resolve." },
      { status: 409 }
    );
  }

  let body: GuessBody;
  try {
    body = (await request.json()) as GuessBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const direction = body.direction;
  if (direction !== "up" && direction !== "down") {
    return NextResponse.json(
      { error: "direction must be 'up' or 'down'" },
      { status: 400 }
    );
  }

  const priceAtGuess = body.priceAtGuess;
  if (typeof priceAtGuess !== "number" || !Number.isFinite(priceAtGuess)) {
    return NextResponse.json(
      { error: "priceAtGuess must be a finite number" },
      { status: 400 }
    );
  }

  await setPendingGuess(session.user.id, direction, priceAtGuess);

  const updated = await getUserById(session.user.id);
  return NextResponse.json({
    score: updated?.score ?? profile.score,
    pendingGuess: updated?.pendingGuess ?? {
      direction,
      timestamp: Date.now(),
      priceAtGuess,
    },
  });
}
