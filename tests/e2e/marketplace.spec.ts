import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 3 Step 3: Public Template Marketplace & Live Showcase", () => {
  test("guest or couple can browse marketplace, filter categories, view live sample showcase, simulate RSVP, and toggle Sinhala", async ({
    page,
  }) => {
    // 1. Visit Marketplace
    await page.goto("/en/templates");
    await page.waitForLoadState("networkidle");

    // Verify Marketplace Header and Value Props
    await expect(
      page.getByRole("heading", { name: "Wedding Invitation Template Collection" }),
    ).toBeVisible();
    await expect(page.getByText("Free to Build & Preview")).toBeVisible();
    await expect(page.getByText("Pay Once to Publish")).toBeVisible();

    // Verify all 8 templates rendered initially
    const cards = page.getByTestId("template-marketplace-card");
    await expect(cards).toHaveCount(8);

    // 2. Test Category Filtering
    // Filter by "Church & Cathedral"
    await page.getByRole("button", { name: "Church & Cathedral" }).click();
    await expect(cards).toHaveCount(1);
    await expect(page.getByText("Church & Cathedral Elegance")).toBeVisible();

    // Filter by "Traditional & Poruwa"
    await page.getByRole("button", { name: "Traditional & Poruwa" }).click();
    await expect(cards).toHaveCount(2); // poruwa-traditional and kandyan-heritage
    await expect(page.getByText("Poruwa Traditional")).toBeVisible();

    // Filter back to "All Designs"
    await page.getByRole("button", { name: "All Designs" }).click();
    await expect(cards).toHaveCount(8);

    // 3. Navigate to Live Full Preview for Poruwa Traditional
    const poruwaCard = cards.filter({ hasText: "Poruwa Traditional" });
    await poruwaCard.getByRole("link", { name: "Live Full Preview" }).click();
    await page.waitForURL("**/en/samples/poruwa-traditional");
    await page.waitForLoadState("networkidle");

    // Verify sample preview details
    await expect(page.getByRole("banner").getByText("Poruwa Traditional")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Kasun Perera/ })).toBeVisible();
    await expect(page.getByText("09:42 AM", { exact: true })).toBeVisible();

    // 4. Test Simulated Guest RSVP Interaction
    const rsvpSection = page.getByRole("heading", {
      name: "Confirm Your Attendance (Sample RSVP)",
    });
    await expect(rsvpSection).toBeVisible();

    await page.getByRole("button", { name: "Attending" }).click();
    await expect(
      page.getByText("Simulated response recorded! Couple sees updated headcount instantly."),
    ).toBeVisible();

    // 5. Switch to Sinhala from the live preview banner
    await page.getByRole("button", { name: "සිං" }).click();
    await page.waitForURL("**/si/samples/poruwa-traditional");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("banner").getByText("පොරුව චාරිත්‍ර")).toBeVisible();
    await expect(page.locator("main").getByText("විවාහ ආරාධනය")).toBeVisible();

    // 6. Capture responsive screenshots
    const screenshotDir = path.join(process.cwd(), "screenshots-marketplace");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Showcase Sinhala Screenshots
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({
      path: path.join(screenshotDir, "sample-poruwa-si-1280.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: path.join(screenshotDir, "sample-poruwa-si-768.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 360, height: 800 });
    await page.screenshot({
      path: path.join(screenshotDir, "sample-poruwa-si-360.png"),
      fullPage: true,
    });

    // Marketplace Sinhala Screenshots
    await page.goto("/si/templates");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "මංගල ආරාධනා සැලසුම් එකතුව" })).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-si-360.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-si-768.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-si-1280.png"),
      fullPage: true,
    });

    // Marketplace English Screenshots
    await page.goto("/en/templates");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-en-1280.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-en-768.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 360, height: 800 });
    await page.screenshot({
      path: path.join(screenshotDir, "marketplace-en-360.png"),
      fullPage: true,
    });
  });
});
