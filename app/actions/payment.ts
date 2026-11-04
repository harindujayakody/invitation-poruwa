"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, invitations, auditLog } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { PLANS, generatePayHereHash } from "@/lib/payhere";
import { z } from "zod";

const checkoutSchema = z.object({
  invitationId: z.string().uuid(),
  plan: z.enum(["essential", "complete", "signature"]),
});

export async function createCheckoutOrderAction(formData: {
  invitationId: string;
  plan: "essential" | "complete" | "signature";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { invitationId, plan } = parsed.data;

  // Verify ownership
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  const planConfig = PLANS[plan];
  if (!planConfig) {
    return { error: "invalid_plan" };
  }

  // Create pending order
  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      invitationId: inv.id,
      plan,
      amountLkr: planConfig.priceLkr,
      status: "pending",
    })
    .returning();

  const merchantId = process.env.PAYHERE_MERCHANT_ID || "1211149";
  const merchantSecret =
    process.env.PAYHERE_MERCHANT_SECRET || "4MjAxNDMxNzEyMjAxOTAxMzg=";
  const isProduction = process.env.PAYHERE_MODE === "production";

  const hostHeader = (await headers()).get("host") || "localhost:3972";
  const protocol = hostHeader.includes("localhost") ? "http" : "https";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${hostHeader}`;

  const hash = generatePayHereHash(
    merchantId,
    order.id,
    planConfig.priceLkr,
    "LKR",
    merchantSecret,
  );

  const payhereParams = {
    sandbox: !isProduction,
    merchant_id: merchantId,
    return_url: `${appUrl}/app/invitations/${inv.id}/publish?status=success`,
    cancel_url: `${appUrl}/app/invitations/${inv.id}/publish?status=cancelled`,
    notify_url: `${appUrl}/api/webhooks/payhere`,
    order_id: order.id,
    items: `wedding.lk ${planConfig.id.toUpperCase()} Plan - ${inv.slug}`,
    amount: planConfig.priceLkr.toFixed(2),
    currency: "LKR",
    hash,
    first_name: session.user.name || "Couple",
    last_name: "Customer",
    email: session.user.email,
    phone: "0771234567",
    address: "Colombo",
    city: "Colombo",
    country: "Sri Lanka",
  };

  return {
    success: true,
    orderId: order.id,
    amountLkr: planConfig.priceLkr,
    payhereParams,
    checkoutUrl: isProduction
      ? "https://www.payhere.lk/pay/checkout"
      : "https://sandbox.payhere.lk/pay/checkout",
  };
}

/**
 * Developer and automated E2E sandbox payment simulation.
 * Marks the order paid and publishes the invitation.
 */
export async function simulateSandboxPaymentAction(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
    .limit(1);

  if (!order) {
    return { error: "not_found_or_unauthorized" };
  }

  if (order.status === "paid") {
    return { success: true };
  }

  const simRef = `sim_${Date.now()}`;

  await db
    .update(orders)
    .set({
      status: "paid",
      gatewayRef: simRef,
    })
    .where(eq(orders.id, order.id));

  if (order.invitationId) {
    await db
      .update(invitations)
      .set({
        status: "published",
        publishedAt: new Date(),
      })
      .where(eq(invitations.id, order.invitationId));
  }

  await db.insert(auditLog).values({
    actorId: session.user.id,
    action: "sandbox_payment_simulated",
    entity: "orders",
    entityId: order.id,
  });

  return { success: true };
}
