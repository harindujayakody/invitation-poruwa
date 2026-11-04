import { test, expect } from "@playwright/test";

test.describe("Guest List Management, CSV Import & WhatsApp Click-to-Send Flow", () => {
  test("couple can manage guests, import CSV, copy personal tokens, and trigger WhatsApp", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions for personal link copy test
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const timestamp = Date.now();
    const testEmail = `couple_guests_${timestamp}@example.com`;
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

    // 3. Create an invitation
    await page.getByRole("link", { name: "Create new invitation" }).first().click();
    await page.waitForURL("**/en/app/new", { timeout: 10000 });
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Saman");
    await page.getByLabel("Partner 2 name").fill("Kavindi");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    // 4. Navigate to "Guests & WhatsApp" tab via sub-navigation
    await page.getByRole("link", { name: "Guests & WhatsApp" }).click();
    await page.waitForURL("**/en/app/invitations/**/guests", { timeout: 10000 });

    // 5. Verify initial empty state & metrics
    await expect(page.getByRole("heading", { name: "Guests & WhatsApp Delivery" })).toBeVisible();
    await expect(page.getByText(`Manage guest invites for suba.lk/i/${testSlug}`)).toBeVisible();
    await expect(page.getByText("Total Guests")).toBeVisible();
    await expect(page.getByText("No guests added yet")).toBeVisible();

    // 6. Add a single guest
    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await expect(page.getByRole("heading", { name: "Add New Guest" })).toBeVisible();

    await page.getByLabel("Guest or Family Name *").fill("Sunil & Nilanthi Perera");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0771234567");
    await page.getByLabel("Seats / Heads Invited").fill("2");
    await page.getByLabel("Family Side").selectOption("bride");
    await page.getByLabel("Group Tag (optional)").fill("Close Family");

    await page.getByRole("button", { name: "Save Guest" }).click();

    // 7. Verify guest added in list with normalized +94 phone
    await expect(page.getByText("Guest added successfully!")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sunil & Nilanthi Perera" })).toBeVisible();
    await expect(page.getByText("+94771234567")).toBeVisible();
    await expect(page.getByText("2 seats")).toBeVisible();
    await expect(page.locator("span", { hasText: "Bride side" })).toBeVisible();
    await expect(page.getByText("• Close Family")).toBeVisible();
    await expect(page.getByText("Not sent", { exact: true })).toBeVisible();

    // 8. Test "Copy link" personal token URL
    const copyButton = page.getByRole("button", { name: "Copy personal link" }).first();
    await copyButton.click();
    await expect(page.getByText("Personal invitation link copied to clipboard!")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain(`/i/${testSlug}?g=`);

    // 9. Test "Send on WhatsApp" button triggering wa.me with E.164 and marking delivery
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Send on WhatsApp" }).first().click(),
    ]);
    expect(popup.url()).toMatch(/(wa\.me|whatsapp\.com)/);
    expect(popup.url()).toContain("94771234567");
    await popup.close();

    // Delivery status should now update to "Sent"
    await expect(page.getByText("WhatsApp delivery marked as sent!")).toBeVisible();
    await expect(page.getByText("Sent", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Send again" })).toBeVisible();

    // 10. Test CSV Bulk Import
    await page.getByRole("button", { name: "Import CSV" }).click();
    await expect(page.getByRole("heading", { name: "Import Guests via CSV" })).toBeVisible();

    const sampleCsv = `Name,Phone,Heads,Side,Group
Ruwan Jayasinghe,0712345678,3,groom,College Friends
Nimali Silva,0769998888,1,bride,Colleagues
Dr. B. Fernando,,2,both,VIP
`;

    await page.locator('input[type="file"]').setInputFiles({
      name: "sample-guests.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(sampleCsv, "utf-8"),
    });

    await expect(page.getByText("Parsed 3 guests from file:")).toBeVisible();
    await expect(page.getByText("Ruwan Jayasinghe")).toBeVisible();
    await expect(page.getByText("Nimali Silva")).toBeVisible();
    await expect(page.getByText("Dr. B. Fernando")).toBeVisible();

    await page.getByRole("button", { name: "Import 3 Guests" }).click();
    await expect(page.getByText("Successfully imported 3 guests!")).toBeVisible();

    // Total should now be 4 guests (1 single + 3 CSV)
    await expect(page.getByRole("heading", { name: "Ruwan Jayasinghe" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nimali Silva" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dr. B. Fernando" })).toBeVisible();

    // 11. Test Search and Filtering
    const searchInput = page.getByPlaceholder("Search by guest name or phone…");
    await searchInput.fill("Ruwan");
    await expect(page.getByRole("heading", { name: "Ruwan Jayasinghe" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sunil & Nilanthi Perera" })).not.toBeVisible();

    await searchInput.fill("");

    // Filter by Side (Bride side)
    const sideSelect = page.getByLabel("Filter by side");
    await sideSelect.selectOption("bride");
    await expect(page.getByRole("heading", { name: "Sunil & Nilanthi Perera" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nimali Silva" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ruwan Jayasinghe" })).not.toBeVisible();

    await sideSelect.selectOption("all");

    // Filter by Delivery Status
    const deliverySelect = page.getByLabel("Filter by delivery status");
    await deliverySelect.selectOption("sent");
    await expect(page.getByRole("heading", { name: "Sunil & Nilanthi Perera" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ruwan Jayasinghe" })).not.toBeVisible();

    await deliverySelect.selectOption("all");

    // Take screenshot across viewport
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/guests-en-${width}.png`,
      fullPage: true,
    });
  });

  test("sinhala guest management renders correctly without horizontal scroll", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `si_couple_guests_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `kasun-sanduni-${timestamp}`;

    // 1. Sign up couple in Sinhala
    await page.goto("/si/login");
    await page.getByRole("button", { name: "ගිණුමක් නැද්ද? අලුත් ගිණුමක් සාදන්න" }).click();
    await page.getByLabel("දෙපළගේ නම්").fill("කසුන් සහ සඳුනි");
    await page.getByLabel("විද්‍යුත් තැපෑල (Email)").fill(testEmail);
    await page.getByLabel("මුරපදය (Password)").fill(testPassword);
    await page.getByRole("button", { name: "ගිණුම සාදන්න" }).click();

    await page.waitForURL("**/si/app", { timeout: 15000 });

    // 2. Create invitation
    await page.goto("/si/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "මෙම සැලසුම තෝරන්න" }).first().click();

    await page.getByLabel("පළමු සහකරු/සහකාරියගේ නම").fill("කසුන්");
    await page.getByLabel("දෙවන සහකරු/සහකාරියගේ නම").fill("සඳුනි");
    await page.getByLabel("ආරාධනා වෙබ් සබැඳිය (Web link)").fill(testSlug);
    await page.getByRole("button", { name: "ආරාධනය සකස් කරන්න" }).click();
    await page.waitForURL("**/si/app/invitations/**/edit", { timeout: 15000 });

    // 3. Navigate to Sinhala "ආරාධිතයින් සහ WhatsApp" tab
    await page.getByRole("link", { name: "ආරාධිතයින් සහ WhatsApp" }).click();
    await page.waitForURL("**/si/app/invitations/**/guests", { timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "ආරාධිතයින් සහ WhatsApp පණිවිඩ" }),
    ).toBeVisible();

    // 4. Add guest in Sinhala
    await page.getByRole("button", { name: "ආරාධිතයෙකු එක් කරන්න" }).first().click();
    await expect(
      page.getByRole("heading", { name: "නව ආරාධිතයෙකු එක් කරන්න" }),
    ).toBeVisible();

    await page.getByLabel("ආරාධිතයාගේ හෝ පවුලේ නම *").fill("සුනිල් පෙරේරා පවුල");
    await page.getByLabel("WhatsApp දුරකථන අංකය (අවශ්‍ය නම්)").fill("0777654321");
    await page.getByLabel("ආරාධිත ආසන / පුද්ගලයින් ගණන").fill("2");
    await page.getByRole("button", { name: "ආරාධිතයා සුරකින්න" }).click();

    await expect(page.getByText("සුනිල් පෙරේරා පවුල")).toBeVisible();
    await expect(page.getByText("+94777654321")).toBeVisible();

    // 5. Verify zero horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    // 6. Screenshot in Sinhala
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/guests-si-${width}.png`,
      fullPage: true,
    });
  });
});
