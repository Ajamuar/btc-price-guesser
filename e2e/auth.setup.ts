import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_TEST_USER_EMAIL;
  const password = process.env.E2E_TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E credentials required. Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD (e.g. in .env.local or CI secrets)."
    );
  }

  await page.goto("/auth/signin?callbackUrl=/play");

  await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 10_000 });
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .click();

  await expect(page).toHaveURL(/\/(play|$)/);
  await expect(
    page.getByRole("link", { name: "Sign out" })
  ).toBeVisible({ timeout: 10_000 });

  const dir = path.dirname(authFile);
  fs.mkdirSync(dir, { recursive: true });
  await page.context().storageState({ path: authFile });
});
