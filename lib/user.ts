import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { hash, compare } from "bcryptjs";
import { docClient, tableName } from "@/lib/dynamodb";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type UserProfile = {
  userId: string;
  email: string | null;
  name: string | null;
  score: number;
  pendingGuess: {
    direction: string;
    timestamp: number;
    priceAtGuess: number;
  } | null;
  passwordHash?: string;
};

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${userId}`,
        sk: "PROFILE",
      },
    })
  );
  if (!Item) return null;
  return {
    userId: Item.userId as string,
    email: (Item.email as string) ?? null,
    name: (Item.name as string) ?? null,
    score: (Item.score as number) ?? 0,
    pendingGuess: (Item.pendingGuess as UserProfile["pendingGuess"]) ?? null,
    ...(Item.passwordHash && { passwordHash: Item.passwordHash as string }),
  };
}

export async function setPendingGuess(
  userId: string,
  direction: "up" | "down",
  priceAtGuess: number
): Promise<void> {
  const timestamp = Date.now();
  await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `USER#${userId}`,
        sk: "PROFILE",
      },
      UpdateExpression: "SET pendingGuess = :pg",
      ExpressionAttributeValues: {
        ":pg": {
          direction,
          timestamp,
          priceAtGuess,
        },
      },
      ConditionExpression: "attribute_not_exists(pendingGuess)",
    })
  );
}

export async function createUser(
  userId: string,
  email: string | null,
  name: string | null
): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `USER#${userId}`,
        sk: "PROFILE",
        userId,
        email: email ?? null,
        name: name ?? null,
        score: 0,
        pendingGuess: null,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    })
  );
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const normalized = normalizeEmail(email);
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        pk: `EMAIL#${normalized}`,
        sk: "USERID",
      },
    })
  );
  return (Item?.userId as string) ?? null;
}

export async function getUserByEmail(
  email: string
): Promise<UserProfile | null> {
  const userId = await getUserIdByEmail(email);
  if (!userId) return null;
  return getUserById(userId);
}

export async function createUserWithPassword(
  email: string,
  name: string | null,
  password: string
): Promise<{ userId: string }> {
  const normalized = normalizeEmail(email);
  const userId = crypto.randomUUID();
  const passwordHash = await hash(password, 10);

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `EMAIL#${normalized}`,
        sk: "USERID",
        userId,
      },
      ConditionExpression: "attribute_not_exists(pk)",
    })
  );

  try {
    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          pk: `USER#${userId}`,
          sk: "PROFILE",
          userId,
          email: normalized,
          name: name ?? normalized,
          score: 0,
          pendingGuess: null,
          passwordHash,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );
  } catch (err) {
    throw err;
  }

  return { userId };
}

export function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}
