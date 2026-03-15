import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, tableName } from "@/lib/dynamodb";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export type GuessHistoryItem = {
  direction: string;
  timestamp: number;
  priceAtGuess: number;
  result: "win" | "loss" | "tie";
  priceAtResolution: number;
  scoreAfter: number;
};

/**
 * Query the current user's guess history: resolved guesses (newest first).
 * Uses main table: pk = USER#<userId>, sk begins_with GUESS#.
 */
export async function getGuessHistory(
  userId: string,
  limit: number = DEFAULT_LIMIT
): Promise<GuessHistoryItem[]> {
  const cappedLimit = Math.min(Math.max(1, limit), MAX_LIMIT);

  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "GUESS#",
      },
      ScanIndexForward: false,
      Limit: cappedLimit,
    })
  );

  if (!Items?.length) return [];

  return Items.map((item) => ({
    direction: (item.direction as string) ?? "",
    timestamp: (item.timestamp as number) ?? 0,
    priceAtGuess: (item.priceAtGuess as number) ?? 0,
    result: (item.result as "win" | "loss" | "tie") ?? "tie",
    priceAtResolution: (item.priceAtResolution as number) ?? 0,
    scoreAfter: (item.scoreAfter as number) ?? 0,
  }));
}
