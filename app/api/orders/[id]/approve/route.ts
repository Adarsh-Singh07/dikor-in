import { NextRequest } from "next/server";
import { db } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

// POST /api/orders/[id]/approve — customer approves the demo video
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  const order = db.getOrder(params.id);
  if (!order || (me.role !== "admin" && order.userId !== me.id)) return err("Order not found", 404);
  if (order.status !== "demo_shared") return err("This order isn't waiting for approval", 400);
  const updated = db.updateOrder(params.id, { status: "approved" }, "Demo approved — looks perfect!", "customer");
  return json({ order: updated });
}
