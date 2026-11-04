import { test, expect } from "@playwright/test";

test.describe("Couple Auth & Dashboard Flow", () => {
  test("unauthenticated access to /app redirects to /login", async ({ page }) => {
    await page.goto("/en/app");
    await page.waitForURL("**/en/login");
    await expect(page.getByRole("heading", { name: "Sign in to your wedding space" })).toBeVisible();
  });

  test("can switch between Sign in and Create account", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page.getByRole("heading", { name: "Sign in to your wedding space" })).toBeVisible();

    // Click toggle to switch to sign up
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await expect(page.getByRole("heading", { name: "Create your couple account" })).toBeVisible();
    await expect(page.getByLabel("Couple names")).toBeVisible();

    // Click toggle to switch back to sign in
    await page.getByRole("button", { name: "Already have an account? Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Sign in to your wedding space" })).toBeVisible();
    await expect(page.getByLabel("Couple names")).not.toBeVisible();
  });

  test("full couple registration, dashboard landing, and sign out flow", async ({ page }) => {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "Password123!";
    const testName = "Kasun & Sanduni";

    // 1. Go to signup
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();

    // 2. Fill registration
    await page.getByLabel("Couple names").fill(testName);
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);

    // 3. Submit
    await page.getByRole("button", { name: "Create account" }).click();

    // 4. Expect navigation to dashboard
    await page.waitForURL("**/en/app", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Your Invitations" })).toBeVisible();
    await expect(page.getByText(`Welcome back, ${testName}`)).toBeVisible();
    await expect(page.getByText("No invitations yet")).toBeVisible();
    await expect(page.getByRole("link", { name: "Create new invitation" }).first()).toBeVisible();

    // Take screenshot for verification
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/dashboard-en-${width}.png`,
      fullPage: true,
    });

    // 5. Sign out
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForURL("**/en/login", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Sign in to your wedding space" })).toBeVisible();
  });

  test("sinhala login page renders correctly without horizontal scroll", async ({ page }) => {
    await page.goto("/si/login");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "ඔබගේ විවාහ ආරාධනා ගිණුමට පිවිසෙන්න" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);

    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/login-si-${width}.png`,
      fullPage: true,
    });
  });

  test("english login page renders correctly without horizontal scroll", async ({ page }) => {
    await page.goto("/en/login");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Sign in to your wedding space" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);

    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/login-en-${width}.png`,
      fullPage: true,
    });
  });
});
