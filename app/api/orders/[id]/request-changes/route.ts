import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

// POST /api/orders/[id]/request-changes — customer asks for revisions
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  const token = req.nextUrl.searchParams.get("token");

  const order = await db.getOrder(params.id);
  if (!order) return err("Order not found", 404);

  const isOwner = me && (me.id === order.userId || (order.customerEmail && me.email === order.customerEmail));
  const isTokenMatch = token && (order.trackingToken === token || order.id === token);

  if (order.userId && !isOwner && !isTokenMatch && me?.role !== "admin") {
    return err("Unauthorized", 403);
  }

  if (order.status !== "approval_shared") {
    return err("This order isn't waiting for approval", 400);
  }

  const { note } = await req.json().catch(() => ({}));
  const updated = await db.updateOrder(
    params.id,
    {
      status: "changes_requested",
      revisionCount: (order.revisionCount || 0) + 1,
    },
    `Revision requested: ${String(note || "Please adjust paint details / markings.").slice(0, 300)}`,
    order.customerName || "customer"
  );

  return json({ order: updated });
}
