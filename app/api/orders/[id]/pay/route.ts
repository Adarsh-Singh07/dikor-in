import { NextRequest } from "next/server";
import { db, advanceAmount, balanceAmount } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

// POST /api/orders/[id]/pay { type: 'advance' | 'balance' } — DEMO mock payment, no real charge.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  const order = db.getOrder(params.id);
  if (!order || (me.role !== "admin" && order.userId !== me.id)) return err("Order not found", 404);
  if (!order.price) return err("Price isn't set yet", 400);
  const { type } = await req.json().catch(() => ({}));

  if (type === "advance") {
    if (order.status !== "quoted") return err("Advance can only be paid once the quote is ready", 400);
    if (order.advancePaid) return err("Advance already paid", 400);
    const updated = db.updateOrder(
      params.id,
      { status: "advance_paid", advancePaid: true },
      `Demo advance of ₹${advanceAmount(order).toLocaleString("en-IN")} received — no real charge`,
      "customer"
    );
    return json({ order: updated });
  }
  if (type === "balance") {
    if (order.status !== "ready_for_balance") return err("Balance is due only when the piece is ready", 400);
    if (order.balancePaid) return err("Balance already paid", 400);
    const updated = db.updateOrder(
      params.id,
      { status: "completed", balancePaid: true },
      `Demo balance of ₹${balanceAmount(order).toLocaleString("en-IN")} received — order complete`,
      "customer"
    );
    return json({ order: updated });
  }
  return err("type must be 'advance' or 'balance'", 400);
}
