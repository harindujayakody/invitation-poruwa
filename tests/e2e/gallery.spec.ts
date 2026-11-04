import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 2 Step 3: Guest Live Photo Gallery & Couple Moderation Stream", () => {
  const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );

  test("guest can upload a candid photo, couple can moderate and approve, and photo appears in live gallery", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_gallery_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `gallery-stream-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Pradeep & Menaka");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Pradeep");
    await page.getByLabel("Partner 2 name").fill("Menaka");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Guest visits public gallery before any photos are uploaded
    await page.goto(`/en/i/${testSlug}/gallery`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Live Wedding Photo Stream" })).toBeVisible();
    await expect(page.getByTestId("empty-photo-gallery")).toBeVisible();
    await expect(
      page.getByText("No approved photos in the gallery yet. Be the first to share a moment!"),
    ).toBeVisible();

    // 3. Guest uploads a photo
    // Write temporary test image
    const tempFilePath = path.join(process.cwd(), `test-upload-${timestamp}.png`);
    fs.writeFileSync(tempFilePath, samplePngBuffer);

    try {
      const fileInput = page.locator("#photo-upload-input");
      await fileInput.setInputFiles(tempFilePath);

      // Verify upload success toast
      await expect(
        page.getByText(
          "Thank you! Your photo has been uploaded and will appear once approved by the couple.",
        ),
      ).toBeVisible({ timeout: 10000 });
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }

    // Still empty on guest side because photo is pending moderation
    await expect(page.getByTestId("empty-photo-gallery")).toBeVisible();

    // 4. Couple goes to Photo Gallery Moderation page
    await page.goto(`/en/app/invitations/${invitationId}/gallery`);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Guest Photo Stream & Moderation" }),
    ).toBeVisible();
    await expect(page.getByText("Pending Review (1)")).toBeVisible();
    await expect(page.getByTestId("moderation-photo-card")).toHaveCount(1);
    await expect(page.getByText("Pending", { exact: true })).toBeVisible();

    // 5. Couple approves the photo
    await page
      .getByTestId("moderation-photo-card")
      .getByRole("button", { name: "Approve", exact: true })
      .click();
    await expect(
      page.getByText("Photo approved and published to live gallery!"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Approved (1)" })).toBeVisible();

    // Switch to Approved tab to verify approved photo badge
    await page.getByRole("button", { name: "Approved (1)" }).click();
    await expect(page.getByTestId("moderation-photo-card")).toHaveCount(1);
    await expect(page.getByText("Approved", { exact: true })).toBeVisible();

    // 6. Guest reloads public gallery: Photo is now visible!
    await page.goto(`/en/i/${testSlug}/gallery`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("public-photo-grid")).toBeVisible();
    const photoImg = page.locator("img[alt='Wedding candid photo']").first();
    await expect(photoImg).toBeVisible();

    // Click photo to open lightbox
    await photoImg.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    // 7. Check CTA on main guest invitation page
    await page.goto(`/en/i/${testSlug}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("live-gallery-cta")).toBeVisible();
    await expect(page.getByText("Live Photo Stream")).toBeVisible();
  });

  test("photo gallery and moderation render cleanly in Sinhala at 360, 768, and 1280px", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_gallery_si_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `gallery-si-${timestamp}`;

    // 1. Sign up couple in Sinhala
    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("චාමර සහ නිලූෂි");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });

    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "මෙම සැලසුම තෝරන්න" }).first().click();

    await page.getByLabel("පළමු සහකරු/සහකාරියගේ නම").fill("චාමර");
    await page.getByLabel("දෙවන සහකරු/සහකාරියගේ නම").fill("නිලූෂි");
    await page.getByLabel("ආරාධනා වෙබ් සබැඳිය (Web link)").fill(testSlug);
    await page.getByRole("button", { name: "ආරාධනය සකස් කරන්න" }).click();
    await page.waitForURL("**/si/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    const invitationId = match![1];

    // Go to Sinhala gallery tab via sub-navigation
    await page.getByRole("link", { name: "ඡායාරූප ගැලරිය" }).click();
    await page.waitForURL(`**/si/app/invitations/${invitationId}/gallery`, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "සජීවී ඡායාරූප ගැලරිය සහ අනුමැතිය" }),
    ).toBeVisible();

    const screenshotDir = path.resolve(process.cwd(), "screenshots-gallery");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const viewports = [
      { width: 360, height: 740, name: "gallery-si-360" },
      { width: 768, height: 1024, name: "gallery-si-768" },
      { width: 1280, height: 800, name: "gallery-si-1280" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      await page.screenshot({
        path: path.join(screenshotDir, `${vp.name}.png`),
        fullPage: true,
      });
    }

    // Also take English screenshots
    await page.goto(`/en/app/invitations/${invitationId}/gallery`);
    await page.waitForLoadState("networkidle");

    const enViewports = [
      { width: 360, height: 740, name: "gallery-en-360" },
      { width: 768, height: 1024, name: "gallery-en-768" },
      { width: 1280, height: 800, name: "gallery-en-1280" },
    ];

    for (const vp of enViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      await page.screenshot({
        path: path.join(screenshotDir, `${vp.name}.png`),
        fullPage: true,
      });
    }
  });
});
