import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, invitations, auditLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPayHereSignature } from "@/lib/payhere";

export async function POST(req: NextRequest) {
  try {
    let merchantId = "";
    let orderId = "";
    let paymentId = "";
    let payhereAmount = "";
    let payhereCurrency = "LKR";
    let statusCode = "";
    let md5sig = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      merchantId = (formData.get("merchant_id") as string) || "";
      orderId = (formData.get("order_id") as string) || "";
      paymentId = (formData.get("payment_id") as string) || "";
      payhereAmount = (formData.get("payhere_amount") as string) || "";
      payhereCurrency = (formData.get("payhere_currency") as string) || "LKR";
      statusCode = (formData.get("status_code") as string) || "";
      md5sig = (formData.get("md5sig") as string) || "";
    } else {
      const body = await req.json();
      merchantId = body.merchant_id || "";
      orderId = body.order_id || "";
      paymentId = body.payment_id || "";
      payhereAmount = String(body.payhere_amount || "");
      payhereCurrency = body.payhere_currency || "LKR";
      statusCode = String(body.status_code || "");
      md5sig = body.md5sig || "";
    }

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    // Never fall back to a known secret: anyone could forge a "paid" webhook.
    if (!merchantSecret) {
      return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
    }

    // Verify signature
    const isValid = verifyPayHereSignature({
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      md5sig,
      merchantSecret,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "invalid_signature" },
        { status: 400 },
      );
    }

    // Lookup order
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        orderId,
      );
    if (!isUuid) {
      return NextResponse.json({ error: "order_not_found" }, { status: 404 });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "order_not_found" }, { status: 404 });
    }

    // Idempotent guard
    if (order.status === "paid") {
      return NextResponse.json({ message: "already_processed" }, { status: 200 });
    }

    if (statusCode === "2") {
      // Payment Successful
      await db
        .update(orders)
        .set({
          status: "paid",
          gatewayRef: paymentId || `pay_${Date.now()}`,
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
        actorId: order.userId,
        action: "payment_completed",
        entity: "orders",
        entityId: order.id,
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Payment failed or cancelled
      await db
        .update(orders)
        .set({ status: "failed" })
        .where(eq(orders.id, order.id));

      return NextResponse.json({ status: "acknowledged_failure" }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 },
    );
  }
}
