import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 2 Step 1: Seating Arrangement Builder & Interactive Seating Canvas", () => {
  test("couple can create banquet tables, assign guests, publish seating plan, and guest sees assigned table", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const timestamp = Date.now();
    const testEmail = `couple_seating_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `seating-plan-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Roshan & Dilani");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Roshan");
    await page.getByLabel("Partner 2 name").fill("Dilani");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Add Guests: Uncle Bandara (2 seats) and Aunty Shirani (3 seats)
    await page.goto(`/en/app/invitations/${invitationId}/guests`);
    await page.waitForLoadState("networkidle");

    // Guest 1: Uncle Bandara
    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Uncle Bandara & Family");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0771234567");
    await page.getByLabel("Seats / Heads Invited").fill("2");
    await page.getByLabel("Family Side").selectOption("bride");
    await page.getByRole("button", { name: "Save Guest" }).click();
    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // Copy Uncle Bandara's link
    const copyButton = page.getByRole("button", { name: "Copy personal link" }).first();
    await copyButton.click();
    await expect(page.getByText("Personal invitation link copied to clipboard!")).toBeVisible();
    const uncleBandaraUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(uncleBandaraUrl).toContain(`/i/${testSlug}?g=`);

    // Guest 2: Aunty Shirani
    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Aunty Shirani");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0719876543");
    await page.getByLabel("Seats / Heads Invited").fill("3");
    await page.getByLabel("Family Side").selectOption("groom");
    await page.getByRole("button", { name: "Save Guest" }).click();
    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // 3. Navigate to Seating tab
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Seating Plan & Table Layout" })).toBeVisible();
    await expect(page.getByText("Unseated Guests (2)")).toBeVisible();
    await expect(page.getByText("Uncle Bandara & Family")).toBeVisible();
    await expect(page.getByText("Aunty Shirani")).toBeVisible();

    // 4. Create Table 1: Poruwa Relatives (Capacity 10)
    await page.getByRole("button", { name: "Add Table" }).click();
    await expect(page.getByRole("heading", { name: "Add Banquet Table" })).toBeVisible();

    await page.getByLabel("Table Name or Number").fill("Table 1 - Poruwa Relatives");
    await page.getByLabel("Seat Capacity (Heads)").fill("10");
    await page.getByRole("button", { name: "Save Table" }).click();

    await expect(page.getByText("Table added successfully!")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Table 1 - Poruwa Relatives" })).toBeVisible();
    await expect(page.getByText("0 / 10 seats (0%)")).toBeVisible();

    // 5. Assign Uncle Bandara specifically to Table 1
    const uncleCard = page.locator("div").filter({ hasText: /^Uncle Bandara & Family/ });
    const assignSelect = uncleCard.getByRole("combobox", { name: "Assign to Table" });
    await assignSelect.selectOption({ label: "Table 1 - Poruwa Relatives (0/10)" });

    await expect(page.getByText("Guest assigned to table!")).toBeVisible();
    // Uncle Bandara is now seated under Table 1
    await expect(page.getByText("2 / 10 seats (20%)")).toBeVisible();
    // Unseated guests count drops to 1
    await expect(page.getByText("Unseated Guests (1)")).toBeVisible();

    // 6. Verify Personal Guest Page BEFORE Seating is Published
    await page.goto(uncleBandaraUrl);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Uncle Bandara & Family")).toBeVisible();
    // Table should NOT be visible yet because seating is private
    await expect(page.getByTestId("guest-assigned-table")).toHaveCount(0);

    // 7. Couple Publishes Seating Plan
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    const publishBtn = page.getByRole("button", { name: "Publish Seating to Guests" });
    await publishBtn.click();
    await expect(page.getByText("Seating plan visibility updated!")).toBeVisible();
    await expect(page.getByText("Seating plan is Published")).toBeVisible();

    // 8. Guest Page AFTER Seating is Published
    await page.goto(uncleBandaraUrl);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("guest-assigned-table")).toBeVisible();
    await expect(page.getByTestId("guest-assigned-table")).toContainText("Table 1 - Poruwa Relatives");
    await expect(page.getByTestId("guest-assigned-table")).toContainText("Your Banquet Table");

    // 9. Couple Unpublishes Seating Plan
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    const unpublishBtn = page.getByRole("button", { name: "Unpublish Seating Plan" });
    await unpublishBtn.click();
    await expect(page.getByText("Seating plan visibility updated!")).toBeVisible();
    await expect(page.getByText("Seating plan is Private")).toBeVisible();

    // Guest page again: Table is hidden
    await page.goto(uncleBandaraUrl);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("guest-assigned-table")).toHaveCount(0);

    // 10. Unassign Guest and Delete Table Test
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    // Unassign Uncle Bandara
    const unassignBtn = page.getByRole("button", { name: "Remove from table" }).first();
    await unassignBtn.click();
    await expect(page.getByText("Guest removed from table.")).toBeVisible();
    await expect(page.getByText("Unseated Guests (2)")).toBeVisible();
    await expect(page.getByText("0 / 10 seats (0%)")).toBeVisible();

    // Delete Table 1
    page.on("dialog", (dialog) => dialog.accept());
    const deleteBtn = page.getByRole("button", { name: "Delete Table" });
    await deleteBtn.click();
    await expect(page.getByText("Table deleted.")).toBeVisible();
    await expect(page.getByText("No banquet tables created yet")).toBeVisible();
  });

  test("seating page renders cleanly in Sinhala with zero horizontal scroll at 360, 768, and 1280px", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_seating_si_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `seating-si-${timestamp}`;

    // 1. Sign up couple in Sinhala
    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("නුවන් සහ දිනේෂි");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });

    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "මෙම සැලසුම තෝරන්න" }).first().click();

    await page.getByLabel("පළමු සහකරු/සහකාරියගේ නම").fill("නුවන්");
    await page.getByLabel("දෙවන සහකරු/සහකාරියගේ නම").fill("දිනේෂි");
    await page.getByLabel("ආරාධනා වෙබ් සබැඳිය (Web link)").fill(testSlug);
    await page.getByRole("button", { name: "ආරාධනය සකස් කරන්න" }).click();
    await page.waitForURL("**/si/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    const invitationId = match![1];

    // Go to seating tab directly
    await page.getByRole("link", { name: "ආසන සැකසුම" }).click();
    await page.waitForURL("**/si/app/invitations/**/seating", { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("ආසන සැකසුම");
    await expect(page.getByRole("button", { name: "මේසයක් එක් කරන්න" })).toBeVisible();

    // Add a banquet table in Sinhala
    await page.getByRole("button", { name: "මේසයක් එක් කරන්න" }).click();
    await expect(page.getByRole("heading", { name: "නව මේසයක් එක් කරන්න" })).toBeVisible();
    await page.getByLabel("මේසයේ නම හෝ අංකය").fill("1 වන මේසය - පොරුව ඥාතීන්");
    await page.getByLabel("ආසන ධාරිතාව (පුද්ගලයින්)").fill("8");
    await page.getByRole("button", { name: "මේසය සුරකින්න" }).click();

    await expect(page.getByText("මේසය සාර්ථකව එක් කරන ලදී!")).toBeVisible();
    await expect(page.getByRole("heading", { name: "1 වන මේසය - පොරුව ඥාතීන්" })).toBeVisible();

    // Check responsive viewports & capture screenshots
    const screenshotDir = path.resolve(process.cwd(), "screenshots-seating");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const viewports = [
      { width: 360, height: 740, name: "seating-si-360" },
      { width: 768, height: 1024, name: "seating-si-768" },
      { width: 1280, height: 800, name: "seating-si-1280" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      // Verify no horizontal overflow
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
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    const enViewports = [
      { width: 360, height: 740, name: "seating-en-360" },
      { width: 768, height: 1024, name: "seating-en-768" },
      { width: 1280, height: 800, name: "seating-en-1280" },
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
