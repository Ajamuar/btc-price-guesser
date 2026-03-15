import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import { tryResolve } from "@/lib/guess";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let profile = await getUserById(session.user.id);
  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let resolution:
    | {
        priceAtGuess: number;
        priceAtResolution: number;
        result: "win" | "loss" | "tie";
      }
    | undefined;
  if (profile.pendingGuess != null) {
    const result = await tryResolve(session.user.id);
    if (result) {
      profile = result.profile;
      resolution = result.resolution;
    }
  }

  const body: {
    user: { id: string; email: string | null; name: string | null };
    score: number;
    pendingGuess: typeof profile.pendingGuess;
    resolution?: {
      priceAtGuess: number;
      priceAtResolution: number;
      result: "win" | "loss" | "tie";
    };
  } = {
    user: {
      id: profile.userId,
      email: profile.email,
      name: profile.name,
    },
    score: profile.score,
    pendingGuess: profile.pendingGuess,
  };
  if (resolution) body.resolution = resolution;

  console.log("[api/me]", {
    userId: session.user.id,
    score: body.score,
    hasPendingGuess: body.pendingGuess != null,
    hasResolution: resolution != null,
    resolutionResult: resolution?.result,
  });

  return NextResponse.json(body);
}
