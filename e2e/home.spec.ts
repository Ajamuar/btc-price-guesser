import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows app title and header", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /BTC Price Guesser/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /BTC Price Guesser/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("shows Rules section with all rule items", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Rules:", { exact: true })).toBeVisible();
    await expect(
      page.getByText(/Predict whether Bitcoin.*one minute after you guess/i)
    ).toBeVisible();
    await expect(page.getByText(/After one minute, we compare/i)).toBeVisible();
    await expect(page.getByText(/tie after two minutes/i)).toBeVisible();
    await expect(page.getByText(/Score:.*correct.*wrong.*tie/i)).toBeVisible();
    await expect(page.getByText(/Sign in to play/i)).toBeVisible();
  });

  test("shows primary Play button", async ({ page }) => {
    await page.goto("/");

    const playControl = page
      .getByRole("link", { name: "Play" })
      .or(page.getByRole("button", { name: "Play" }));
    await expect(playControl).toBeVisible();
    await expect(playControl).toBeEnabled();
  });

  test("Play button navigates to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/");

    const playLink = page
      .getByRole("link", { name: "Play" })
      .or(page.getByRole("button", { name: "Play" }));
    await playLink.click();

    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: /Sign in/i })
    ).toBeVisible();
  });

  test("sign-in page shows Sign up link for new users", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: "Play" })
      .or(page.getByRole("button", { name: "Play" }))
      .click();

    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });
});
