import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Phase 3 Step 1: WhatsApp Delivery Tracking & Automated RSVP Reminders", () => {
  test("couple can track link opens, filter pending guests, and trigger WhatsApp RSVP reminders", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const timestamp = Date.now();
    const testEmail = `couple_remind_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `remind-flow-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Lahiru & Niluka");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Lahiru");
    await page.getByLabel("Partner 2 name").fill("Niluka");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Add Guest 1: Kasun Jayasuriya (2 seats)
    await page.goto(`/en/app/invitations/${invitationId}/guests`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Kasun Jayasuriya");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0771234567");
    await page.getByLabel("Seats / Heads Invited").fill("2");
    await page.getByLabel("Family Side").selectOption("bride");
    await page.getByRole("button", { name: "Save Guest" }).click();
    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // Copy Kasun's link
    const copyButton = page.getByRole("button", { name: "Copy personal link" }).first();
    await copyButton.click();
    await expect(page.getByText("Personal invitation link copied to clipboard!")).toBeVisible();
    const kasunUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(kasunUrl).toContain(`/i/${testSlug}?g=`);

    // Add Guest 2: Chaminda Vaas (3 seats, never opened)
    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Chaminda Vaas");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0712345678");
    await page.getByLabel("Seats / Heads Invited").fill("3");
    await page.getByLabel("Family Side").selectOption("groom");
    await page.getByRole("button", { name: "Save Guest" }).click();
    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // 3. Guest 1 opens their personal link (triggers telemetry firstOpenedAt)
    await page.goto(kasunUrl);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Kasun Jayasuriya")).toBeVisible();

    // 4. Couple navigates to Reminders & Delivery Tracking page
    await page.goto(`/en/app/invitations/${invitationId}/reminders`);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "RSVP Reminders & Delivery Tracking" }),
    ).toBeVisible();

    // Verify delivery metrics: 2 guests, 1 opened (50%), 2 pending
    await expect(page.getByText("Total Guests")).toBeVisible();
    await expect(page.getByText("Opened Links")).toBeVisible();
    await expect(page.getByText("(50%)")).toBeVisible();
    await expect(page.getByText("Pending RSVPs")).toBeVisible();

    // Verify filter pills
    await expect(page.getByRole("button", { name: "All Pending (2)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Opened • Not Replied (1)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Unopened (1)" })).toBeVisible();

    // Test filter: Opened • Not Replied
    await page.getByRole("button", { name: "Opened • Not Replied (1)" }).click();
    await expect(page.getByTestId("reminder-guest-card")).toHaveCount(1);
    await expect(page.getByText("Kasun Jayasuriya")).toBeVisible();
    await expect(page.getByText("Chaminda Vaas")).toHaveCount(0);
    await expect(page.getByText("Opened:", { exact: false })).toBeVisible();

    // Test filter: Unopened
    await page.getByRole("button", { name: "Unopened (1)" }).click();
    await expect(page.getByTestId("reminder-guest-card")).toHaveCount(1);
    await expect(page.getByText("Chaminda Vaas")).toBeVisible();
    await expect(page.getByText("Kasun Jayasuriya")).toHaveCount(0);
    await expect(page.getByText("Delivered • Not opened yet")).toBeVisible();

    // 5. Send reminder to Kasun Jayasuriya
    await page.getByRole("button", { name: "All Pending (2)" }).click();
    const kasunCard = page.locator("div").filter({ hasText: /^Kasun Jayasuriya/ });
    const sendReminderBtn = kasunCard.getByRole("button", { name: "Send Reminder" });
    await sendReminderBtn.click();

    await expect(page.getByText("WhatsApp reminder marked as sent!")).toBeVisible();
    await expect(kasunCard.getByText("Reminded 1 time")).toBeVisible();

    // Check Reminders Sent filter
    await page.getByRole("button", { name: "Reminders Sent (1)" }).click();
    await expect(page.getByTestId("reminder-guest-card")).toHaveCount(1);
    await expect(page.getByText("Kasun Jayasuriya")).toBeVisible();
  });

  test("reminders page renders cleanly in Sinhala at 360, 768, and 1280px with zero horizontal scroll", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_remind_si_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `remind-si-${timestamp}`;

    // 1. Sign up couple in Sinhala
    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("දිනුක සහ මල්කි");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });

    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "මෙම සැලසුම තෝරන්න" }).first().click();

    await page.getByLabel("පළමු සහකරු/සහකාරියගේ නම").fill("දිනුක");
    await page.getByLabel("දෙවන සහකරු/සහකාරියගේ නම").fill("මල්කි");
    await page.getByLabel("ආරාධනා වෙබ් සබැඳිය (Web link)").fill(testSlug);
    await page.getByRole("button", { name: "ආරාධනය සකස් කරන්න" }).click();
    await page.waitForURL("**/si/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    const invitationId = match![1];

    // Navigate to Sinhala Reminders tab via nav bar
    await page.getByRole("link", { name: "සිහිකැඳවීම්" }).click();
    await page.waitForURL(`**/si/app/invitations/${invitationId}/reminders`, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "RSVP සිහිකැඳවීම් සහ ලුහුබැඳීම" }),
    ).toBeVisible();

    const screenshotDir = path.resolve(process.cwd(), "screenshots-reminders");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const viewports = [
      { width: 360, height: 740, name: "reminders-si-360" },
      { width: 768, height: 1024, name: "reminders-si-768" },
      { width: 1280, height: 800, name: "reminders-si-1280" },
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
    await page.goto(`/en/app/invitations/${invitationId}/reminders`);
    await page.waitForLoadState("networkidle");

    const enViewports = [
      { width: 360, height: 740, name: "reminders-en-360" },
      { width: 768, height: 1024, name: "reminders-en-768" },
      { width: 1280, height: 800, name: "reminders-en-1280" },
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
