import { expect, test } from "@playwright/test";

test.describe("review board demo", () => {
  test("queues a review-owned e2e package and marks it generated", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Proofboard keeps review-stage/i })).toBeVisible();
    await expect(page.getByText("2 / 4")).toBeVisible();

    await page.getByLabel("Case title").fill("Checkout retry copy");
    await page.getByLabel(/^Owner$/).fill("Mina");
    await page.getByLabel("Target lane").selectOption("e2e");
    await page.getByRole("button", { name: "Queue test case" }).click();

    await expect(page.getByRole("status")).toContainText("Checkout retry copy is queued for review-owned test generation.");

    const card = page
      .locator(".case-card")
      .filter({ has: page.getByRole("heading", { name: "Checkout retry copy" }) })
      .first();
    await expect(card.getByText("Missing")).toBeVisible();

    await card.getByRole("button", { name: /Mark Checkout retry copy as generated/i }).click();

    await expect(card.getByText("Generated")).toBeVisible();
    await expect(page.getByText("3 / 5")).toBeVisible();
    await expect(page.getByText("60% of cases generated")).toBeVisible();
  });

  test("filters cases and exposes the empty state", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel(/^Search by title, owner, or lane$/).fill("zzzz");

    await expect(page.getByText("No review cases match this filter.")).toBeVisible();
    await expect(page.getByText("Try another owner, lane, or title keyword.")).toBeVisible();
  });
});
