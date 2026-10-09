import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

// POST /api/orders/[id]/request-changes — customer asks for revisions (revisions included)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  const order = db.getOrder(params.id);
  if (!order || (me.role !== "admin" && order.userId !== me.id)) return err("Order not found", 404);
  if (order.status !== "demo_shared") return err("This order isn't waiting for approval", 400);
  const { note } = await req.json().catch(() => ({}));
  const updated = db.updateOrder(
    params.id,
    { revisionCount: order.revisionCount + 1 },
    `Revision requested: ${String(note || "Please tweak and re-share").slice(0, 200)}`,
    "customer"
  );
  return json({ order: updated });
}
