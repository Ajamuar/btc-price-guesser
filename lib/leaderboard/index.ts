import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, tableName } from "@/lib/dynamodb";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/** GSI name for leaderboard (partition gsi1pk, sort gsi1sk). Set DYNAMODB_GSI_LEADERBOARD if your index has a different name. */
const leaderboardIndexName =
  process.env.DYNAMODB_GSI_LEADERBOARD ?? "gsi1";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  score: number;
};

/**
 * Query the global leaderboard via GSI: top N users by score (highest first).
 * Uses gsi1pk = LEADERBOARD#global, sort by gsi1sk descending.
 */
export async function getLeaderboard(
  limit: number = DEFAULT_LIMIT
): Promise<LeaderboardEntry[]> {
  const cappedLimit = Math.min(Math.max(1, limit), MAX_LIMIT);

  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: leaderboardIndexName,
      KeyConditionExpression: "gsi1pk = :pk",
      ExpressionAttributeValues: { ":pk": "LEADERBOARD#global" },
      ScanIndexForward: false,
      Limit: cappedLimit,
    })
  );

  if (!Items?.length) return [];

  const byUser = new Map<string, LeaderboardEntry>();
  for (const item of Items) {
    const userId = (item.userId as string) ?? "";
    const score = (item.score as number) ?? 0;
    const existing = byUser.get(userId);
    if (existing === undefined || score > existing.score) {
      byUser.set(userId, {
        rank: 0,
        userId,
        name: (item.name as string) ?? userId ?? "",
        score,
      });
    }
  }
  const sorted = [...byUser.values()].sort((a, b) => b.score - a.score);
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
