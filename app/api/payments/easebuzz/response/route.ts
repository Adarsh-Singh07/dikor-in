import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { getEasebuzzConfig, verifyEasebuzzResponseHash } from "@/lib/easebuzz";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const status = formData.get("status")?.toString() || "";
    const txnid = formData.get("txnid")?.toString() || "";
    const amount = formData.get("amount")?.toString() || "0";
    const productinfo = formData.get("productinfo")?.toString() || "";
    const firstname = formData.get("firstname")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const udf1 = formData.get("udf1")?.toString() || ""; // orderId
    const udf2 = formData.get("udf2")?.toString() || "advance"; // paymentType
    const hash = formData.get("hash")?.toString() || "";
    const easepayid = formData.get("easepayid")?.toString() || "";

    const { key, salt, isConfigured } = getEasebuzzConfig();

    let isValid = true;
    if (isConfigured && hash) {
      isValid = verifyEasebuzzResponseHash({
        salt,
        key,
        status,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1,
        udf2,
        receivedHash: hash,
      });
    }

    if (isValid && status.toLowerCase() === "success" && udf1) {
      const order = await db.getOrder(udf1);
      if (order) {
        const payType = udf2 === "balance" ? "balance" : "advance";
        await db.recordPayment({
          orderId: order.id,
          paymentType: payType,
          amount: parseFloat(amount) || (payType === "advance" ? order.advanceAmount : order.balanceAmount),
          gateway: "easebuzz",
          transactionId: easepayid || txnid,
        });

        if (payType === "advance") {
          await db.updateOrder(
            order.id,
            { status: "advance_paid", advancePaid: true },
            `Easebuzz Advance Payment of ₹${amount} confirmed (Txn: ${txnid})`,
            "Easebuzz Gateway"
          );
        } else {
          await db.updateOrder(
            order.id,
            { status: "balance_paid", balancePaid: true },
            `Easebuzz Final Balance Payment of ₹${amount} confirmed (Txn: ${txnid})`,
            "Easebuzz Gateway"
          );
        }
      }
      return NextResponse.redirect(new URL(`/dashboard/orders/${udf1}?payment=success`, req.url));
    }

    return NextResponse.redirect(new URL(`/dashboard/orders/${udf1}?payment=failed`, req.url));
  } catch (err) {
    console.error("Easebuzz response callback error:", err);
    return NextResponse.redirect(new URL(`/`, req.url));
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  return NextResponse.redirect(new URL(orderId ? `/dashboard/orders/${orderId}` : "/", req.url));
}
