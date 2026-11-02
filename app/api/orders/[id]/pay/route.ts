import { NextRequest } from "next/server";
import { db, advanceAmount, balanceAmount } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";
import { initiateEasebuzzPayment } from "@/lib/easebuzz";

// POST /api/orders/[id]/pay { type: 'advance' | 'balance' | 'full', initiate?: boolean }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  const order = await db.getOrder(params.id);
  if (!order) return err("Order not found", 404);

  // Allow payment if admin, order owner, or guest order
  if (order.userId && me && me.role !== "admin" && order.userId !== me.id) {
    return err("Unauthorized to pay for this order", 403);
  }

  if (!order.totalPrice || order.totalPrice < 100) {
    return err("Price isn't set yet. Our studio will confirm on WhatsApp.", 400);
  }

  const { type, initiate = false } = await req.json().catch(() => ({}));
  const payType = type === "balance" ? "balance" : "advance";
  const amountToPay = payType === "advance" ? advanceAmount(order) : balanceAmount(order);

  // If client requested payment gateway initiation
  if (initiate) {
    const hostUrl = req.headers.get("origin") || "https://dikor-in.vercel.app";
    const txnid = `EBZ-${order.id}-${payType.toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const ebzResult = await initiateEasebuzzPayment(
      {
        txnid,
        amount: amountToPay,
        productinfo: `DIKOR 3D Keepsake ${payType === "advance" ? "75% Advance" : "25% Balance"} - ${order.title}`,
        firstname: order.customerName || "DIKOR Customer",
        email: order.customerEmail || "orders@dikor.in",
        phone: order.customerPhone || "919878070123",
        udf1: order.id,
        udf2: payType,
        udf3: order.trackingToken,
      },
      hostUrl
    );

    return json({
      paymentUrl: ebzResult.paymentUrl,
      txnid: ebzResult.txnid,
      amount: ebzResult.amount,
      isMock: ebzResult.isMock,
    });
  }

  // Direct / confirmed payment flow
  if (payType === "advance") {
    if (order.advancePaid) return err("Advance already paid", 400);

    await db.recordPayment({
      orderId: order.id,
      paymentType: "advance",
      amount: amountToPay,
      gateway: "easebuzz",
    });

    const updated = await db.updateOrder(
      params.id,
      {
        status: "advance_paid",
        advancePaid: true,
      },
      `75% Advance payment of ₹${amountToPay.toLocaleString("en-IN")} received via Easebuzz`,
      order.customerName || "customer"
    );

    return json({ order: updated, paid: true });
  }

  if (payType === "balance") {
    if (order.balancePaid) return err("Balance already paid", 400);

    await db.recordPayment({
      orderId: order.id,
      paymentType: "balance",
      amount: amountToPay,
      gateway: "easebuzz",
    });

    const updated = await db.updateOrder(
      params.id,
      {
        status: "balance_paid",
        balancePaid: true,
      },
      `25% Final balance of ₹${amountToPay.toLocaleString("en-IN")} received via Easebuzz. Preparing for dispatch.`,
      order.customerName || "customer"
    );

    return json({ order: updated, paid: true });
  }

  return err("type must be 'advance' or 'balance'", 400);
}
