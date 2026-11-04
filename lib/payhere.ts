import crypto from "crypto";

export interface PlanConfig {
  id: "essential" | "complete" | "signature";
  nameKey: string;
  descKey: string;
  priceLkr: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<"essential" | "complete" | "signature", PlanConfig> = {
  essential: {
    id: "essential",
    nameKey: "planEssentialName",
    descKey: "planEssentialDesc",
    priceLkr: 4500,
    features: [
      "featureOneDesign",
      "featureUnlimitedGuests",
      "featureWhatsAppLinks",
      "featureRsvpTracking",
    ],
  },
  complete: {
    id: "complete",
    nameKey: "planCompleteName",
    descKey: "planCompleteDesc",
    priceLkr: 7500,
    features: [
      "featureAllEssential",
      "featureMultiEvent",
      "featureCateringCsv",
      "featureCountdownMusic",
    ],
    popular: true,
  },
  signature: {
    id: "signature",
    nameKey: "planSignatureName",
    descKey: "planSignatureDesc",
    priceLkr: 12500,
    features: [
      "featureAllComplete",
      "featureBilingual",
      "featureConcierge",
      "featurePrioritySupport",
    ],
  },
};

/**
 * PayHere MD5 checkout hash generator.
 * Format: strtoupper(md5(merchant_id + order_id + number_format(amount, 2, '.', '') + currency + strtoupper(md5(merchant_secret))))
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string = "LKR",
  merchantSecret: string,
): string {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
}

/**
 * PayHere Webhook signature verification.
 * Format: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 */
export function verifyPayHereSignature({
  merchantId,
  orderId,
  payhereAmount,
  payhereCurrency,
  statusCode,
  md5sig,
  merchantSecret,
}: {
  merchantId: string;
  orderId: string;
  payhereAmount: string;
  payhereCurrency: string;
  statusCode: string;
  md5sig: string;
  merchantSecret: string;
}): boolean {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const checkString = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;
  const calculatedSig = crypto
    .createHash("md5")
    .update(checkString)
    .digest("hex")
    .toUpperCase();

  return calculatedSig === md5sig.toUpperCase();
}
