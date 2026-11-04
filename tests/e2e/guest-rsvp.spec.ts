import { test, expect } from "@playwright/test";

test.describe("Personal Guest Invitation Surface & Per-Event RSVP Loop Flow", () => {
  test("guest can open personal WhatsApp token link, view invitation, and submit RSVP", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const timestamp = Date.now();
    const testEmail = `couple_rsvp_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `saman-kavindi-rsvp-${timestamp}`;

    // 1. Sign up couple and create invitation
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Saman & Kavindi");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Saman");
    await page.getByLabel("Partner 2 name").fill("Kavindi");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    // Extract invitation ID from URL
    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 2. Go to Guests tab and add a guest with 2 seats
    await page.goto(`/en/app/invitations/${invitationId}/guests`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Add Guest" }).first().click();
    await page.getByLabel("Guest or Family Name *").fill("Sunil & Nilanthi Perera");
    await page.getByLabel("WhatsApp Phone Number (optional)").fill("0771234567");
    await page.getByLabel("Seats / Heads Invited").fill("2");
    await page.getByLabel("Family Side").selectOption("bride");
    await page.getByRole("button", { name: "Save Guest" }).click();

    await expect(page.getByText("Guest added successfully!")).toBeVisible();

    // 3. Copy personal invitation link
    const copyButton = page.getByRole("button", { name: "Copy personal link" }).first();
    await copyButton.click();
    await expect(page.getByText("Personal invitation link copied to clipboard!")).toBeVisible();
    const personalUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(personalUrl).toContain(`/i/${testSlug}?g=`);

    // 4. Open the personal guest link as the guest
    await page.goto(personalUrl);
    await page.waitForLoadState("networkidle");

    // Verify personalized greeting and seat count
    await expect(page.getByText("Warmly Invited")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sunil & Nilanthi Perera" })).toBeVisible();
    await expect(page.getByText("2 seats", { exact: true })).toBeVisible();
    await expect(
      page.getByText("We have reserved 2 seats in your honour."),
    ).toBeVisible();

    // Verify couple names and cultural invitation
    await expect(
      page.getByRole("heading", { name: "Saman & Kavindi" }),
    ).toBeVisible();
    await expect(page.getByText("Celebration Details")).toBeVisible();

    // Verify RSVP section
    await expect(
      page.getByRole("heading", { name: "Will you celebrate with us?" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Joyfully Accept" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Regretfully Decline" }).first()).toBeVisible();

    // Fill message / dietary notes
    const messageInput = page.getByPlaceholder("Congratulations to both of you! / Vegetarian notes...").first();
    await messageInput.fill("Warmest blessings! Vegetarian dietary preference.");

    // Submit RSVP
    await page.getByRole("button", { name: "Submit RSVP" }).click();

    // Verify success confirmation
    await expect(page.getByRole("status").getByText("Thank you! Your RSVP has been received.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Update RSVP" })).toBeVisible();

    // Take guest screen screenshot
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/guest-invite-en-${width}.png`,
      fullPage: true,
    });

    // 5. Check public preview (without token)
    await page.goto(`/en/i/${testSlug}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("This is a public preview.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit RSVP" })).not.toBeVisible();

    // 6. Check couple's RSVP Tracker dashboard
    await page.goto(`/en/app/invitations/${invitationId}/rsvp`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "RSVP Tracker" })).toBeVisible();
    await expect(page.getByText("Attending Heads")).toBeVisible();
    await expect(page.getByText("Sunil & Nilanthi Perera")).toBeVisible();
    await expect(page.getByText("Attending (2 seats)")).toBeVisible();
    await expect(page.getByText("Warmest blessings! Vegetarian dietary preference.")).toBeVisible();

    // Take tracker screenshot
    await page.screenshot({
      path: `screenshots/rsvp-tracker-en-${width}.png`,
      fullPage: true,
    });
  });

  test("sinhala guest invitation renders correctly without horizontal scroll", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `si_couple_rsvp_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `kasun-sanduni-rsvp-${timestamp}`;

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

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();
    const invitationId = match![1];

    // 3. Add guest in Sinhala
    await page.goto(`/si/app/invitations/${invitationId}/guests`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "ආරාධිතයෙකු එක් කරන්න" }).first().click();
    await page.getByLabel("ආරාධිතයාගේ හෝ පවුලේ නම *").fill("සුනිල් පෙරේරා පවුල");
    await page.getByLabel("ආරාධිත ආසන / පුද්ගලයින් ගණන").fill("2");
    await page.getByRole("button", { name: "ආරාධිතයා සුරකින්න" }).click();

    await expect(page.getByText("සුනිල් පෙරේරා පවුල")).toBeVisible();

    // 4. Open Sinhala guest link
    await page.goto(`/si/i/${testSlug}`);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "කසුන් & සඳුනි" }),
    ).toBeVisible();

    // Verify zero horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    // Take screenshot
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/guest-invite-si-${width}.png`,
      fullPage: true,
    });
  });
});
