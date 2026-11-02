import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

// POST /api/orders/[id]/approve — customer approves the finished craft proof
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  const token = req.nextUrl.searchParams.get("token");

  const order = await db.getOrder(params.id);
  if (!order) return err("Order not found", 404);

  const isOwner = me && (me.id === order.userId || (order.customerEmail && me.email === order.customerEmail));
  const isTokenMatch = token && (order.trackingToken === token || order.id === token);

  if (order.userId && !isOwner && !isTokenMatch && me?.role !== "admin") {
    return err("Unauthorized to approve this order", 403);
  }

  if (order.status !== "approval_shared") {
    return err("This order isn't waiting for approval", 400);
  }

  const updated = await db.updateOrder(
    params.id,
    { status: "approved" },
    "Customer approved the finished craft preview! Ready for balance clearance.",
    order.customerName || "customer"
  );

  return json({ order: updated });
}
