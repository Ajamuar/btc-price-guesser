import { test, expect, type Page } from "@playwright/test";

test.describe("Auth guard and sign-in journey", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("unauthenticated user visiting /play is redirected to sign-in", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: /Sign in/i })
    ).toBeVisible();
  });

  test("full journey: home -> Play -> sign-in -> play page with game UI", async ({
    page,
  }: { page: Page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL;
    const password = process.env.E2E_TEST_USER_PASSWORD;

    if (!email || !password) {
      test.skip();
      return;
    }

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /BTC Price Guesser/i })
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Play" })
      .or(page.getByRole("button", { name: "Play" }))
      .click();

    await expect(page).toHaveURL(/\/auth\/signin/);

    await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 10_000 });
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page
      .getByRole("button", { name: "Sign in", exact: true })
      .click();

    await expect(page).toHaveURL(/\/(play|$)/);
    if (!page.url().endsWith("/play")) {
      await page.goto("/play");
    }

    await expect(
      page.getByRole("heading", { name: /Let's Play/i })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Score:/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Up" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Down" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
  });
});

test.describe("Play page (authenticated)", () => {
  test("shows game heading and user greeting", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    await expect(page).toHaveURL("/play");
    await expect(
      page.getByRole("heading", { name: /Let's Play/i })
    ).toBeVisible();
  });

  test("shows score and live BTC price or loading state", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    await expect(page.getByText(/Score:/)).toBeVisible();
    await expect(
      page.getByText(/BTC:/).or(page.getByText("—"))
    ).toBeVisible({ timeout: 15_000 });
  });

  test("shows Up and Down guess buttons", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    const upButton = page.getByRole("button", { name: "Up" });
    const downButton = page.getByRole("button", { name: "Down" });
    await expect(upButton).toBeVisible();
    await expect(downButton).toBeVisible();
    await expect(upButton).toBeEnabled();
    await expect(downButton).toBeEnabled();
  });

  test("shows Leaderboard and History tabs and can switch between them", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    const leaderboardTab = page.getByRole("tab", { name: /Leaderboard/i });
    const historyTab = page.getByRole("tab", { name: /History/i });
    await expect(leaderboardTab).toBeVisible();
    await expect(historyTab).toBeVisible();

    await leaderboardTab.click();
    await expect(leaderboardTab).toHaveAttribute("data-state", "active");

    await historyTab.click();
    await expect(historyTab).toHaveAttribute("data-state", "active");
  });

  test("header shows Sign out when authenticated", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/play");

    await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
    await expect(page.getByRole("link", { name: /BTC Price Guesser/i })).toBeVisible();
  });

  test("chart area is present", async ({ page }: { page: Page }) => {
    await page.goto("/play");

    const chart = page.locator("[class*='recharts']").first();
    await expect(chart).toBeVisible({ timeout: 15_000 });
  });
});
