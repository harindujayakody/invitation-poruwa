import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 3 Step 2: Custom Design & Concierge Requests", () => {
  const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );

  test("couple can submit custom design request with reference sketch, view status in concierge queue, and check responsive Sinhala layout", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_design_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `design-req-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Chaminda & Thilini");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Chaminda");
    await page.getByLabel("Partner 2 name").fill("Thilini");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Navigate to Custom Design tab
    await page.getByRole("link", { name: "Custom Design" }).click();
    await page.waitForURL(`**/en/app/invitations/${invitationId}/custom-design`);
    await page.waitForLoadState("networkidle");

    // 3. Verify page elements
    await expect(page.getByRole("heading", { name: "Custom Design & Concierge Requests" })).toBeVisible();
    await expect(page.getByText("Artisan Concierge · Complimentary with Signature Plan")).toBeVisible();
    await expect(page.getByText("No custom design requests submitted yet.")).toBeVisible();

    // 4. Submit custom design request with reference attachment
    const tempFilePath = path.join(process.cwd(), `test-sketch-${timestamp}.png`);
    fs.writeFileSync(tempFilePath, samplePngBuffer);

    try {
      await page.selectOption("#requestType", "nakath_calligraphy");
      await page.locator("#title").fill("Poruwa ceremony auspicious times in Sinhala");
      await page.locator("#description").fill(
        "Need hand-drawn gold typography for the 09:42 AM Poruwa ceremony and 11:15 AM Jaya Mangala Gatha with traditional lotus accents.",
      );
      await page.locator("#contactWhatsapp").fill("+94 77 987 6543");
      await page.locator("#attachment").setInputFiles(tempFilePath);

      await page.getByRole("button", { name: "Submit Concierge Request" }).click();

      // 5. Verify submitted request appears
      const card = page.getByTestId("custom-design-card");
      await expect(card).toBeVisible({ timeout: 10000 });
      await expect(card.getByText("Poruwa ceremony auspicious times in Sinhala")).toBeVisible();
      await expect(card.getByText("Pending Review")).toBeVisible();
      await expect(card.getByText("+94 77 987 6543")).toBeVisible();
    } finally {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch {
        // Ignore file lock on Windows during test run
      }
    }

    // 6. Test in Sinhala locale and capture screenshots across viewports
    const screenshotDir = path.join(process.cwd(), "screenshots-custom-design");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // EN screenshots
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(screenshotDir, "custom-design-en-1280.png"), fullPage: true });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotDir, "custom-design-en-768.png"), fullPage: true });

    await page.setViewportSize({ width: 360, height: 800 });
    await page.screenshot({ path: path.join(screenshotDir, "custom-design-en-360.png"), fullPage: true });

    // Switch to Sinhala
    await page.goto(`/si/app/invitations/${invitationId}/custom-design`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "අභිරුචි නිර්මාණ සහ සැලසුම් සේවා" })).toBeVisible();
    await expect(page.getByText("නව අභිරුචි ඉල්ලුමක් ඉදිරිපත් කරන්න")).toBeVisible();
    await expect(page.getByText("සලකා බලමින් පවතී")).toBeVisible();

    await page.screenshot({ path: path.join(screenshotDir, "custom-design-si-360.png"), fullPage: true });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotDir, "custom-design-si-768.png"), fullPage: true });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(screenshotDir, "custom-design-si-1280.png"), fullPage: true });
  });
});
