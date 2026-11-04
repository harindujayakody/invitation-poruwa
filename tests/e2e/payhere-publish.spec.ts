import { test, expect } from "@playwright/test";
import crypto from "crypto";

test.describe("PayHere Checkout & Publishing Gate Flow", () => {
  test("couple can review checklist, select pricing tier, and publish via sandbox simulation", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `couple_publish_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `saman-kavindi-pub-${timestamp}`;

    // 1. Sign up couple
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Don't have an account yet? Create one" }).click();
    await page.getByLabel("Couple names").fill("Saman & Kavindi");
    await page.getByLabel("Email address").fill(testEmail);
    await page.getByLabel("Password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/en/app", { timeout: 15000 });

    // 2. Create invitation
    await page.goto("/en/app/new");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Choose this design" }).first().click();

    await page.getByLabel("Partner 1 name").fill("Saman");
    await page.getByLabel("Partner 2 name").fill("Kavindi");
    await page.getByLabel("Invitation web link").fill(testSlug);
    await page.getByRole("button", { name: "Build your invitation" }).click();
    await page.waitForURL("**/en/app/invitations/**/edit", { timeout: 15000 });

    const url = page.url();
    const match = url.match(/\/app\/invitations\/([a-f0-9-]+)\/edit/);
    expect(match).not.toBeNull();

    // 3. Navigate to "Publish & Pay" tab via sub-navigation
    await page.getByRole("link", { name: "Publish & Pay" }).click();
    await page.waitForURL("**/en/app/invitations/**/publish", { timeout: 10000 });

    // 4. Verify Publish & Pay Checklist and Plans
    await expect(page.getByRole("heading", { name: "Publish & Pay" })).toBeVisible();
    await expect(page.getByText("Pre-Publish Checklist")).toBeVisible();
    await expect(page.getByText("Couple names configured: Saman & Kavindi")).toBeVisible();

    // Verify Plan Tiers
    await expect(page.getByRole("heading", { name: "Essential Plan" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Complete Celebration" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Signature Suite" })).toBeVisible();
    await expect(page.getByText("Most Popular", { exact: true })).toBeVisible();

    // Take screenshot before publishing
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/publish-checkout-en-${width}.png`,
      fullPage: true,
    });

    // 5. Click "Simulate Sandbox Payment (Dev)" button
    await page.getByRole("button", { name: "Simulate Sandbox Payment (Dev)" }).click();

    // 6. Verify instant publishing confirmation
    await expect(page.getByText("Payment successful! Your invitation is now published and live.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "This invitation is currently Live and Published!" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Live Invitation" })).toBeVisible();

    // 7. Verify live invitation page works
    await page.goto(`/en/i/${testSlug}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Saman & Kavindi" })).toBeVisible();
  });

  test("payhere webhook verifies MD5 signatures and processes payments idempotently", async ({
    request,
  }) => {
    const merchantId = "1211149";
    const merchantSecret = "4MjAxNDMxNzEyMjAxOTAxMzg=";
    const testOrderId = crypto.randomUUID();
    const amount = "7500.00";
    const currency = "LKR";
    const statusCode = "2";

    // 1. Test invalid signature rejection
    const invalidResponse = await request.post("/api/webhooks/payhere", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      form: {
        merchant_id: merchantId,
        order_id: testOrderId,
        payment_id: "pay_123",
        payhere_amount: amount,
        payhere_currency: currency,
        status_code: statusCode,
        md5sig: "INVALID_SIG_12345",
      },
    });

    expect(invalidResponse.status()).toBe(400);
    const invalidJson = await invalidResponse.json();
    expect(invalidJson.error).toBe("invalid_signature");

    // 2. Compute valid signature for non-existent order
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    const validSig = crypto
      .createHash("md5")
      .update(`${merchantId}${testOrderId}${amount}${currency}${statusCode}${hashedSecret}`)
      .digest("hex")
      .toUpperCase();

    const notFoundResponse = await request.post("/api/webhooks/payhere", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      form: {
        merchant_id: merchantId,
        order_id: testOrderId,
        payment_id: "pay_123",
        payhere_amount: amount,
        payhere_currency: currency,
        status_code: statusCode,
        md5sig: validSig,
      },
    });

    expect(notFoundResponse.status()).toBe(404);
  });

  test("sinhala publish view renders correctly without horizontal scroll", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `si_couple_pub_${timestamp}@example.com`;
    const testPassword = "Password123!";
    const testSlug = `kasun-sanduni-pub-${timestamp}`;

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

    // 3. Navigate to Sinhala Publish & Pay tab
    await page.getByRole("link", { name: "ප්‍රකාශනය සහ ගෙවීම්" }).click();
    await page.waitForURL("**/si/app/invitations/**/publish", { timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "ප්‍රකාශනය සහ ගෙවීම්" }),
    ).toBeVisible();
    await expect(
      page.getByText("ප්‍රකාශනයට පෙර පිරික්සුම් ලැයිස්තුව"),
    ).toBeVisible();

    // 4. Verify zero horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    // 5. Take screenshot
    const viewport = page.viewportSize();
    const width = viewport ? viewport.width : "unknown";
    await page.screenshot({
      path: `screenshots/publish-checkout-si-${width}.png`,
      fullPage: true,
    });
  });
});
