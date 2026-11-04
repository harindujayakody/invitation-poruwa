import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 2 Step 2: Wedding Reception Entrance QR Check-in Sign & Table Locator", () => {
  test("couple can view entrance QR sign, guest can look up assigned table on /i/[slug]/tables", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_qr_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `entrance-sign-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Amila & Sandamali");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Amila");
    await page.getByLabel("Partner 2 name").fill("Sandamali");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Add Guest: Kusal Mendis
    await page.goto(`/en/app/invitations/${invitationId}/guests`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Kusal Mendis");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0772345678");
    await page.getByLabel("Seats / Heads Invited").fill("2");
    await page.getByLabel("Family Side").selectOption("groom");
    await page.getByRole("button", { name: "Save Guest" }).click();
    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // 3. Create Table 1 and Assign Kusal
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Add Table" }).click();
    await page.getByLabel("Table Name or Number").fill("Table 1 - VIP Relatives");
    await page.getByLabel("Seat Capacity (Heads)").fill("10");
    await page.getByRole("button", { name: "Save Table" }).click();
    await expect(page.getByText("Table added successfully!")).toBeVisible();

    const assignSelect = page.getByRole("combobox", { name: "Assign to Table" }).first();
    await assignSelect.selectOption({ label: "Table 1 - VIP Relatives (0/10)" });
    await expect(page.getByText("Guest assigned to table!")).toBeVisible();

    // 4. Verify Private Guard on Table Locator Before Publishing
    await page.goto(`/en/i/${testSlug}/tables`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("seating-private-guard")).toBeVisible();
    await expect(page.getByText("Table assignments are currently private")).toBeVisible();

    // 5. Navigate to Entrance QR Sign page via Seating Actions
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Reception QR Sign" }).click();
    await page.waitForURL(`**/en/app/invitations/${invitationId}/entrance`, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify Entrance Sign UI elements
    await expect(page.getByRole("button", { name: "Print Welcome Sign" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open Table Locator" })).toBeVisible();
    await expect(page.getByText("Welcome to the Wedding of")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Amila & Sandamali" })).toBeVisible();
    await expect(page.getByText("Scan with your phone camera to find your banquet table")).toBeVisible();

    // 6. Publish Seating Plan
    await page.goto(`/en/app/invitations/${invitationId}/seating`);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Publish Seating to Guests" }).click();
    await expect(page.getByText("Seating plan visibility updated!")).toBeVisible();

    // 7. Test Table Locator Search as Guest
    await page.goto(`/en/i/${testSlug}/tables`);
    await page.waitForLoadState("networkidle");

    // Verify search interface is now active
    await expect(page.getByRole("textbox", { name: "Search by guest or family name…" })).toBeVisible();
    await expect(page.getByText("Type your name to look up your table assignment.")).toBeVisible();

    // Search for "Kusal"
    await page.getByRole("textbox", { name: "Search by guest or family name…" }).fill("Kusal");
    await expect(page.getByTestId("guest-table-result")).toBeVisible();
    await expect(page.getByText("Kusal Mendis")).toBeVisible();
    await expect(page.getByText("Table 1 - VIP Relatives")).toBeVisible();

    // Search for non-existent guest
    await page.getByRole("textbox", { name: "Search by guest or family name…" }).fill("Zephyr Nonexistent");
    await expect(page.getByText("No matching guests found.")).toBeVisible();

    // Switch to All Tables Directory tab
    await page.getByRole("button", { name: "All Banquet Tables (1)" }).click();
    await expect(page.getByTestId("all-tables-directory")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Table 1 - VIP Relatives" })).toBeVisible();
    await expect(page.getByText("Kusal Mendis")).toBeVisible();
  });

  test("entrance sign and table locator render cleanly in Sinhala at 360, 768, and 1280px", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_qr_si_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `entrance-si-${timestamp}`;

    // 1. Sign up couple in Sinhala
    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("තිළිණ සහ චතුරිකා");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });

    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "මෙම සැලසුම තෝරන්න" }).first().click();

    await page.getByLabel("පළමු සහකරු/සහකාරියගේ නම").fill("තිළිණ");
    await page.getByLabel("දෙවන සහකරු/සහකාරියගේ නම").fill("චතුරිකා");
    await page.getByLabel("ආරාධනා වෙබ් සබැඳිය (Web link)").fill(testSlug);
    await page.getByRole("button", { name: "ආරාධනය සකස් කරන්න" }).click();
    await page.waitForURL("**/si/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    const invitationId = match![1];

    // Go to seating -> entrance sign
    await page.goto(`/si/app/invitations/${invitationId}/entrance`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("button", { name: "පිළිගැනීමේ පුවරුව මුද්‍රණය කරන්න" })).toBeVisible();
    await expect(page.getByText("සාදරයෙන් පිළිගනිමු")).toBeVisible();
    await expect(page.getByRole("heading", { name: "තිළිණ & චතුරිකා" })).toBeVisible();

    const screenshotDir = path.resolve(process.cwd(), "screenshots-entrance");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const viewports = [
      { width: 360, height: 740, name: "entrance-si-360" },
      { width: 768, height: 1024, name: "entrance-si-768" },
      { width: 1280, height: 800, name: "entrance-si-1280" },
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

    // English viewports for Entrance Sign
    await page.goto(`/en/app/invitations/${invitationId}/entrance`);
    await page.waitForLoadState("networkidle");

    const enViewports = [
      { width: 360, height: 740, name: "entrance-en-360" },
      { width: 768, height: 1024, name: "entrance-en-768" },
      { width: 1280, height: 800, name: "entrance-en-1280" },
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
