import { NextRequest } from "next/server";
import { db, type OrderStatus } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";
import { sendEmail, generateInvoiceEmailHtml } from "@/lib/email";

const STATUSES: OrderStatus[] = [
  "photos_received",
  "advance_pending",
  "advance_paid",
  "in_production",
  "approval_shared",
  "changes_requested",
  "approved",
  "balance_pending",
  "balance_paid",
  "shipped",
  "delivered",
  "cancelled",
];

type Ctx = { params: { id: string } };

// GET /api/orders/[id]: supports user session or query token
export async function GET(req: NextRequest, { params }: Ctx) {
  const me = await getSessionUser(req);
  const token = req.nextUrl.searchParams.get("token");

  const order = await db.getOrder(params.id);
  if (!order) return err("Order not found", 404);

  // Allow access if admin, or owner, or valid tracking token provided
  const isOwner = me && (me.id === order.userId || (order.customerEmail && me.email === order.customerEmail));
  const isTokenMatch = token && (order.trackingToken === token || order.id === token);

  if (!me?.role?.includes("admin") && !isOwner && !isTokenMatch && order.userId) {
    return err("Unauthorized to view this order", 403);
  }

  return json({ order });
}

// PATCH /api/orders/[id]: admin manages price/status/video/production/delivery
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  if (me.role !== "admin") return err("Admin only", 403);

  const order = await db.getOrder(params.id);
  if (!order) return err("Order not found", 404);

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  if (body.price !== undefined) {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 100) return err("Enter a valid price (min ₹100)", 400);
    patch.totalPrice = Math.round(p);
  }
  if (body.advancePct !== undefined) {
    const a = Number(body.advancePct);
    if (Number.isFinite(a) && a >= 10 && a <= 100) {
      patch.advancePct = Math.round(a);
    }
  }
  if (body.timelineDays !== undefined) {
    const t = Number(body.timelineDays);
    if (!Number.isFinite(t) || t < 1 || t > 90) return err("Timeline must be 1-90 days", 400);
    patch.timelineDays = Math.round(t);
  }

  if (typeof body.approvalVideoUrl === "string") patch.approvalVideoUrl = body.approvalVideoUrl;
  if (typeof body.studioNotes === "string") patch.studioNotes = body.studioNotes.slice(0, 1000);
  if (typeof body.trackingNumber === "string") patch.trackingNumber = body.trackingNumber;
  if (typeof body.courierPartner === "string") patch.courierPartner = body.courierPartner;
  if (Array.isArray(body.approvalPhotos)) patch.approvalPhotos = body.approvalPhotos;
  if (body.advancePaid !== undefined) patch.advancePaid = Boolean(body.advancePaid);
  if (body.balancePaid !== undefined) patch.balancePaid = Boolean(body.balancePaid);

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return err("Invalid status", 400);
    patch.status = body.status as OrderStatus;
  }

  const updated = await db.updateOrder(
    params.id,
    patch,
    typeof body.note === "string" ? body.note.slice(0, 300) : undefined,
    "admin"
  );

  if (!updated) return err("Failed to update order", 500);

  // AUTOMATED INVOICE GENERATION & DISPATCH ON DELIVERY
  if (patch.status === "delivered" && order.status !== "delivered") {
    try {
      const invoice = await db.createInvoice(updated);
      if (updated.customerEmail) {
        const hostUrl = req.headers.get("origin") || "https://dikor-in.vercel.app";
        const invoiceUrl = `${hostUrl}/invoice/${updated.id}`;
        const emailHtml = generateInvoiceEmailHtml({
          customerName: updated.customerName,
          orderId: updated.id,
          invoiceNumber: invoice.invoiceNumber,
          totalPrice: updated.totalPrice,
          advancePaid: updated.advanceAmount,
          balancePaid: updated.balanceAmount,
          items: [{ title: updated.title, size: updated.size, price: updated.totalPrice }],
          invoiceUrl,
        });

        await sendEmail({
          to: updated.customerEmail,
          subject: `Your DIKOR Keepsake is Delivered! Official Tax Invoice ${invoice.invoiceNumber}`,
          html: emailHtml,
        });
      }
    } catch (invErr) {
      console.error("Automated invoice error on delivery:", invErr);
    }
  }

  return json({ order: updated });
}
