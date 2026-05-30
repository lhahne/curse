import { expect, test } from "@playwright/test";

test.describe("Hydration calculator (e2e)", () => {
  test("navigates from home to the calculator", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Fuel smarter/i })).toBeVisible();
    await page.getByRole("link", { name: "Open Hydration Calculator" }).click();

    await expect(page).toHaveURL("/hydration");
    await expect(
      page.getByRole("heading", { name: "Hydration Calculator" }),
    ).toBeVisible();
  });

  test("recalculates targets when event inputs change", async ({ page }) => {
    await page.goto("/hydration");

    await expect(page.getByText("45 g/hr", { exact: true })).toBeVisible();

    await page.locator("#duration-hours").fill("1");
    await page.locator("#duration-minutes").fill("0");

    await expect(page.getByText("30 g/hr", { exact: true })).toBeVisible();
    await expect(page.getByText("30 g total", { exact: true })).toBeVisible();
  });

  test("switches between fueling strategies", async ({ page }) => {
    await page.goto("/hydration");

    await expect(page.getByRole("button", { name: "Gels + water" })).toBeVisible();
    await expect(page.getByText("Energy gels")).toBeVisible();

    await page.getByRole("button", { name: "Premade drink" }).click();
    await expect(page.getByText("Total drink volume")).toBeVisible();

    await page.getByRole("button", { name: "Homemade drink" }).click();
    await expect(page.getByText("Per 500 ml bottle", { exact: true })).toBeVisible();
    await expect(page.getByText("Bottles to mix", { exact: true })).toBeVisible();
  });
});
