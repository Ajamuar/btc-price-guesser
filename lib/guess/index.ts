import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, tableName } from "@/lib/dynamodb";
import { getBinancePriceAtTime } from "@/lib/binance";
import { getUserById, type UserProfile } from "@/lib/user";

const SIXTY_SECONDS_MS = 60_000;
const TWO_MINUTES_MS = 120_000;

/** Epsilon for float price comparison (avoid noise). */
const PRICE_EPSILON = 0.01;

function priceChanged(at60s: number, atGuess: number): boolean {
  return Math.abs(at60s - atGuess) >= PRICE_EPSILON;
}

function resolveResult(
  direction: string,
  priceAtGuess: number,
  priceAt60s: number
): "win" | "loss" {
  const wentUp = priceAt60s > priceAtGuess;
  if (direction === "up") return wentUp ? "win" : "loss";
  return !wentUp ? "win" : "loss";
}

function leaderboardGsiSortKey(score: number, userId: string): string {
  return `SCORE#${-score}#${userId}`;
}

function leaderboardUserSk(userId: string): string {
  return `USER#${userId}`;
}

export type TryResolveResult = {
  profile: UserProfile;
  resolution?: { priceAtGuess: number; priceAtResolution: number };
};

/**
 * If the user has a pending guess and conditions are met, resolve it (win/loss/tie),
 * update score, clear pending, write leaderboard row and guess history.
 * Uses historical price at (guessTimestamp + 60s). Returns profile and optional resolution (when just resolved).
 */
export async function tryResolve(
  userId: string
): Promise<TryResolveResult | null> {
  const profile = await getUserById(userId);
  if (!profile?.pendingGuess) return null;

  const { direction, timestamp: guessTimestamp, priceAtGuess } =
    profile.pendingGuess;
  const elapsed = Date.now() - guessTimestamp;

  if (elapsed < SIXTY_SECONDS_MS) return { profile };

  const resolutionTimeMs = guessTimestamp + SIXTY_SECONDS_MS;
  const priceAt60s = await getBinancePriceAtTime(resolutionTimeMs);
  if (priceAt60s === null) return { profile };

  const changed = priceChanged(priceAt60s, priceAtGuess);

  if (changed) {
    const result = resolveResult(direction, priceAtGuess, priceAt60s);
    const newScore = profile.score + (result === "win" ? 1 : -1);
    await clearPendingAndSetScore(userId, newScore);
    await upsertLeaderboardRow(userId, profile.name ?? "", newScore);
    await putGuessHistory(userId, {
      direction,
      timestamp: guessTimestamp,
      priceAtGuess,
      result,
      priceAtResolution: priceAt60s,
      scoreAfter: newScore,
    });
    const updated = await getUserById(userId);
    return updated
      ? {
          profile: updated,
          resolution: { priceAtGuess, priceAtResolution: priceAt60s },
        }
      : { profile, resolution: { priceAtGuess, priceAtResolution: priceAt60s } };
  }

  if (elapsed >= TWO_MINUTES_MS) {
    await clearPendingAndSetScore(userId, profile.score);
    await upsertLeaderboardRow(userId, profile.name ?? "", profile.score);
    await putGuessHistory(userId, {
      direction,
      timestamp: guessTimestamp,
      priceAtGuess,
      result: "tie",
      priceAtResolution: priceAt60s,
      scoreAfter: profile.score,
    });
    const updated = await getUserById(userId);
    return updated
      ? {
          profile: updated,
          resolution: { priceAtGuess, priceAtResolution: priceAt60s },
        }
      : { profile, resolution: { priceAtGuess, priceAtResolution: priceAt60s } };
  }

  return { profile };
}

async function clearPendingAndSetScore(
  userId: string,
  newScore: number
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${userId}`,
        sk: "PROFILE",
      },
      UpdateExpression: "REMOVE pendingGuess SET score = :s",
      ExpressionAttributeValues: { ":s": newScore },
    })
  );
}

async function upsertLeaderboardRow(
  userId: string,
  name: string,
  score: number
): Promise<void> {
  const sk = leaderboardUserSk(userId);
  const gsi1sk = leaderboardGsiSortKey(score, userId);
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: "LEADERBOARD#global",
        sk,
        userId,
        name: name || userId,
        score,
        gsi1pk: "LEADERBOARD#global",
        gsi1sk,
      },
    })
  );
}

type GuessHistoryEntry = {
  direction: string;
  timestamp: number;
  priceAtGuess: number;
  result: "win" | "loss" | "tie";
  priceAtResolution: number;
  scoreAfter: number;
};

async function putGuessHistory(
  userId: string,
  entry: GuessHistoryEntry
): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `USER#${userId}`,
        sk: `GUESS#${entry.timestamp}`,
        userId,
        direction: entry.direction,
        timestamp: entry.timestamp,
        priceAtGuess: entry.priceAtGuess,
        result: entry.result,
        priceAtResolution: entry.priceAtResolution,
        scoreAfter: entry.scoreAfter,
      },
    })
  );
}
