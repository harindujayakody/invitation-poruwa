import { describe, it, expect } from "vitest";
import {
  generatePayHereHash,
  verifyPayHereSignature,
  PLANS,
} from "../../lib/payhere";
import crypto from "crypto";

describe("PayHere Hash & Signature Utilities", () => {
  const merchantId = "1211149";
  const merchantSecret = "4MjAxNDMxNzEyMjAxOTAxMzg=";
  const orderId = "ord-test-12345";
  const amount = 4500;
  const currency = "LKR";

  it("calculates correct MD5 checkout hash according to PayHere spec", () => {
    const hash = generatePayHereHash(
      merchantId,
      orderId,
      amount,
      currency,
      merchantSecret,
    );

    expect(hash).toBeDefined();
    expect(hash).toMatch(/^[A-F0-9]{32}$/);

    // Verify against manual formula
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    const expected = crypto
      .createHash("md5")
      .update(`${merchantId}${orderId}4500.00LKR${hashedSecret}`)
      .digest("hex")
      .toUpperCase();

    expect(hash).toBe(expected);
  });

  it("verifies valid PayHere webhook signature for successful status (2)", () => {
    const statusCode = "2";
    const payhereAmount = "4500.00";

    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    const md5sig = crypto
      .createHash("md5")
      .update(
        `${merchantId}${orderId}${payhereAmount}${currency}${statusCode}${hashedSecret}`,
      )
      .digest("hex")
      .toUpperCase();

    const isValid = verifyPayHereSignature({
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency: currency,
      statusCode,
      md5sig,
      merchantSecret,
    });

    expect(isValid).toBe(true);
  });

  it("rejects forged or tampered PayHere webhook signatures", () => {
    const isValid = verifyPayHereSignature({
      merchantId,
      orderId,
      payhereAmount: "4500.00",
      payhereCurrency: currency,
      statusCode: "2",
      md5sig: "FORGED_SIGNATURE_HEX_1234567890",
      merchantSecret,
    });

    expect(isValid).toBe(false);
  });

  it("defines all three pricing plan tiers with LKR amounts", () => {
    expect(PLANS.essential.priceLkr).toBe(4500);
    expect(PLANS.complete.priceLkr).toBe(7500);
    expect(PLANS.signature.priceLkr).toBe(12500);
    expect(PLANS.complete.popular).toBe(true);
  });
});
