import { test, expect } from "@playwright/test";

test.describe("Cultural Templates & Live Preview Editor Flow", () => {
  test("couple can choose a template, customize names, and edit in live preview", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `saman-kavindi-${timestamp}`;

    // 1. Sign up a fresh couple
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Saman & Kavindi");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    // 2. Wait for dashboard landing
    await page.waitForURL("**/en/app", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Your Invitations" })).toBeVisible();

    // 3. Click "Create new invitation"
    await page.getByRole("link", { name: "Create new invitation" }).first().click();
    await page.waitForURL("**/en/app/new", { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Choose an invitation design" }),
    ).toBeVisible();

    // Take screenshot of template picker
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/template-picker-en-${width}.png`,
      fullPage: true,
    });

    // 4. Select Poruwa Traditional template
    await page.getByRole("button", { name: "Choose this design" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Customize your invitation" }),
    ).toBeVisible();

    // 5. Fill names and slug
    await page.getByLabel("Partner 1 name").fill("Saman");
    await page.getByLabel("Partner 2 name").fill("Kavindi");
    await page.getByLabel("Invitation web link").fill(testSlug);

    // 6. Submit to create and go to editor
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    // 7. Verify Editor interface
    await expect(page.getByText(`wedding.lk/i/${testSlug}`)).toBeVisible();
    await expect(page.locator("#partner-one")).toHaveValue("Saman");
    await expect(page.locator("#partner-two")).toHaveValue("Kavindi");

    // 8. On desktop (>=1024), check Live Preview directly; on mobile/tablet (<1024), toggle to preview
    if (typeof width === "number" && width >= 1024) {
      await expect(page.getByRole("heading", { name: "Saman & Kavindi" })).toBeVisible();
    } else {
      // On mobile and tablet, switch to preview tab
      await page.getByRole("button", { name: "Live preview" }).click();
      await expect(page.getByRole("heading", { name: "Saman & Kavindi" })).toBeVisible();
      // Switch back to edit tab
      await page.getByRole("button", { name: "Edit details" }).click();
    }

    // 9. Edit partner 1 to "Saman Kumara"
    await page.locator("#partner-one").fill("Saman Kumara");

    // 10. Save changes
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Changes saved successfully!")).toBeVisible();

    // Take screenshot of editor
    await page.screenshot({
      path: `screenshots/editor-en-${width}.png`,
      fullPage: true,
    });
  });

  test("sinhala template picker renders correctly without horizontal scroll", async ({
    page,
  }) => {
    // Sign up a fresh couple in Sinhala
    const timestamp = Date.now();
    const testEmail = `si_couple_${timestamp}@example.com`;
    const testPassword = "Password123!";

    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("කසුන් සහ සඳුනි");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });
    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "ආරාධනා සැලසුමක් තෝරන්න" }),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/template-picker-si-${width}.png`,
      fullPage: true,
    });
  });
});
