import { NextRequest } from "next/server";
import { db, type OrderStatus } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

const STATUSES: OrderStatus[] = ["submitted", "quoted", "advance_paid", "demo_shared", "approved", "in_production", "ready_for_balance", "completed"];

type Ctx = { params: { id: string } };

function canSee(me: { id: string; role: string }, orderUserId: string) {
  return me.role === "admin" || me.id === orderUserId;
}

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: Ctx) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  const order = db.getOrder(params.id);
  if (!order || !canSee(me, order.userId)) return err("Order not found", 404);
  return json({ order });
}

// PATCH /api/orders/[id] — admin manages price/status/video/production
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  if (me.role !== "admin") return err("Admin only", 403);
  const order = db.getOrder(params.id);
  if (!order) return err("Order not found", 404);
  const body = await req.json().catch(() => ({}));

  const patch: Record<string, unknown> = {};
  if (body.price !== undefined) {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 100) return err("Enter a valid price (min ₹100)");
    patch.price = Math.round(p);
  }
  if (body.timelineDays !== undefined) {
    const t = Number(body.timelineDays);
    if (!Number.isFinite(t) || t < 1 || t > 90) return err("Timeline must be 1–90 days");
    patch.timelineDays = Math.round(t);
  }
  if (typeof body.demoVideo === "string") patch.demoVideo = body.demoVideo.slice(0, 25_000_000);
  if (typeof body.demoNote === "string") patch.demoNote = body.demoNote.slice(0, 500);
  if (typeof body.productionStage === "string") patch.productionStage = body.productionStage.slice(0, 80);
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return err("Invalid status");
    patch.status = body.status as OrderStatus;
  }

  const updated = db.updateOrder(params.id, patch, typeof body.note === "string" ? body.note.slice(0, 200) : undefined, "admin");
  return json({ order: updated });
}
