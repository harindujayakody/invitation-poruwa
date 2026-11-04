import { test, expect } from "@playwright/test";

test("design page renders all token sections and components", async ({ page }) => {
  await page.goto("/en/design");
  await page.waitForLoadState("networkidle");

  // Check H1
  const h1 = page.locator("h1");
  await expect(h1).toHaveText("Design system (dev only)");

  // Check section headings
  await expect(page.getByRole("heading", { name: "Colours" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spacing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Radii" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Motion & Accessibility Tokens" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Typography" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "States", exact: true })).toBeVisible();

  // Check component states
  await expect(page.getByRole("button", { name: "Default" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Disabled" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Loading" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Destructive" })).toBeVisible();

  // Check inputs
  await expect(page.locator("#inp-default")).toBeVisible();
  await expect(page.locator("#inp-disabled")).toBeDisabled();
  await expect(page.locator("#inp-error")).toHaveAttribute("aria-invalid", "true");

  // Check checkbox & switch
  await expect(page.locator("#chk-1")).toBeChecked();
  await expect(page.locator("#sw-1")).toBeVisible();

  // Check table
  await expect(page.getByText("Kasun & Family")).toBeVisible();
  await expect(page.getByText("+94 77 123 4567")).toBeVisible();

  // Check languages sample text
  await expect(page.locator("p[lang='si']").first()).toBeVisible();
  await expect(page.locator("p[lang='ta']").first()).toBeVisible();
  await expect(page.locator("p[lang='en']").first()).toBeVisible();
});
