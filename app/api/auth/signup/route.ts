import { NextResponse } from "next/server";
import { createUserWithPassword } from "@/lib/user";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (body === null || typeof body !== "object") {
    return NextResponse.json(
      { error: "Body must be an object" },
      { status: 400 }
    );
  }

  const { email, password, name } = body as { email?: unknown; password?: unknown; name?: unknown };

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }
  if (typeof password !== "string") {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  const nameValue =
    name !== undefined && name !== null && typeof name === "string"
      ? name.trim() || null
      : null;

  try {
    await createUserWithPassword(email.trim(), nameValue, password);
    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    const isConditionalFailure =
      err instanceof ConditionalCheckFailedException ||
      (err instanceof Error && err.name === "ConditionalCheckFailedException");
    if (isConditionalFailure) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }
    throw err;
  }
}
