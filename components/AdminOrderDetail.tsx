"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import OrderTimeline from "@/components/OrderTimeline";
import { StatusPill, Sparkle, GoldButton, GhostButton, Field, inputCls } from "@/components/ui";
import { api, fileToDataURL } from "@/lib/client";
import { inr, type Order, type OrderStatus } from "@/lib/types";

const NEXT: { from: OrderStatus[]; to: OrderStatus; label: string; note: string }[] = [
  { from: ["photos_received", "advance_pending"], to: "advance_paid", label: "Mark Advance Paid (75%)", note: "Advance received" },
  { from: ["advance_paid"], to: "in_production", label: "Start Printing & Painting", note: "3D CAD modeling complete, SLA printing started" },
  { from: ["in_production"], to: "approval_shared", label: "Share Craft Video Proof", note: "360° approval video shared for review" },
  { from: ["approval_shared", "changes_requested"], to: "approved", label: "Client Approved", note: "Customer approved craft finish" },
  { from: ["approved", "balance_pending"], to: "balance_paid", label: "Mark Balance Paid (25%)", note: "Final 25% balance payment confirmed" },
  { from: ["balance_paid"], to: "shipped", label: "Dispatch & Mark Shipped", note: "Packed in velvet box and handed over to courier" },
  { from: ["shipped"], to: "delivered", label: "Mark Delivered (Generates Tax Invoice)", note: "Delivered to customer doorstep" },
];

const STAGES = ["3D CAD Sculpting", "SLA Resin 3D Printing", "Layer Curing & Sanding", "Artisan Hand-Painting", "UV Clear Coating", "Quality Inspection", "Velvet Wooden Crate Packing"];

export default function AdminOrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierPartner, setCourierPartner] = useState("BlueDart Express");
  const [approvalVideoUrl, setApprovalVideoUrl] = useState("");
  const [studioNotes, setStudioNotes] = useState("");
  const [stage, setStage] = useState(STAGES[1]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const d = await api(`/api/orders/${id}`);
        if (!live) return;
        setOrder(d.order);
        if (d.order.totalPrice) setPrice(String(d.order.totalPrice));
        if (d.order.trackingNumber) setTrackingNumber(d.order.trackingNumber);
        if (d.order.courierPartner) setCourierPartner(d.order.courierPartner);
        if (d.order.approvalVideoUrl) setApprovalVideoUrl(d.order.approvalVideoUrl);
        if (d.order.studioNotes) setStudioNotes(d.order.studioNotes);
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : "Could not load order");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [id]);

  const patch = async (body: Record<string, unknown>, okMsg?: string) => {
    setBusy(true);
    setError("");
    try {
      const d = await api(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      setOrder(d.order);
      if (okMsg) alert(okMsg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const onVideoFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const url = await fileToDataURL(f, 25 * 1024 * 1024);
      await patch(
        {
          approvalVideoUrl: url,
          studioNotes: studioNotes || "Fresh from the paint booth, inspect your 3D likeness!",
          status: "approval_shared",
          note: "360° approval video uploaded for customer review",
        },
        "Approval video shared with customer!"
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process video");
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center text-charcoal-muted">Loading order details...</div>;
  if (!order) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center"><p className="text-charcoal-muted">{error || "Order not found"}</p><Link href="/admin" className="mt-4 inline-block text-rosegold-dark underline">Back to studio panel</Link></div>;

  const customerPhone = order.customerPhone ? order.customerPhone.replace(/\D/g, "") : "";
  const waUpdateUrl = `https://wa.me/${customerPhone ? `91${customerPhone}` : "919878070123"}?text=${encodeURIComponent(
    `Hi ${order.customerName}! Update on your DIKOR 3D order #${order.id} (${order.title}): Status is now "${order.status.replace("_", " ").toUpperCase()}". View live craft progress: ${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/orders/${order.id}?token=${order.trackingToken}`
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-sm font-semibold text-charcoal-muted hover:text-rosegold-dark">← All Orders</Link>
          <div className="flex gap-2">
            <a
              href={waUpdateUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
              WhatsApp Customer
            </a>
            <Link
              href={`/invoice/${order.id}`}
              target="_blank"
              className="px-4 py-2 rounded-full border border-gold text-xs font-bold text-charcoal hover:bg-gold/20"
            >
              Tax Invoice
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-dark">{order.category} &bull; #{order.id}</p>
            <h1 className="mt-1 font-serif text-3xl md:text-4xl text-charcoal font-bold">{order.title}</h1>
            <p className="text-xs text-charcoal-muted mt-1">Client: <strong>{order.customerName}</strong> ({order.customerPhone || order.customerEmail || "Guest"}) &bull; Placed via {order.source || "web"}</p>
          </div>
          <StatusPill status={order.status} />
        </div>
      </Reveal>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Photos and Customer brief */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> Reference Photos & Specs
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {order.photos && order.photos.length > 0 ? (
                  order.photos.map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={p} alt={`Reference ${i + 1}`} className="aspect-square w-full rounded-2xl border border-charcoal/10 object-cover" />
                  ))
                ) : (
                  <p className="text-xs text-charcoal-muted col-span-4">No uploaded photos. Customer communicating on WhatsApp.</p>
                )}
              </div>
              <div className="mt-4 space-y-1 text-xs text-charcoal-soft bg-cream/40 p-4 rounded-2xl">
                <p><strong>Engraved Brass Plaque:</strong> &ldquo;{order.tagText || order.subjectName || "DIKOR"}&rdquo;</p>
                <p><strong>Scale & Size:</strong> {order.size}</p>
                <p><strong>Shipping City:</strong> {order.city || "Pan India"}</p>
                {order.description && <p><strong>Notes:</strong> {order.description}</p>}
              </div>
            </div>
          </Reveal>

          {/* Pricing & Split Payment Overrides */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> Pricing & Payment Split
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Total Price (₹)">
                  <input
                    type="number"
                    min={100}
                    className={inputCls}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Field>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Field label="Advance Status">
                      <select
                        className={inputCls}
                        value={order.advancePaid ? "paid" : "pending"}
                        onChange={(e) => patch({ advancePaid: e.target.value === "paid" }, "Advance status updated")}
                      >
                        <option value="pending">Pending (75%)</option>
                        <option value="paid">Paid (75%)</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field label="Balance Status">
                      <select
                        className={inputCls}
                        value={order.balancePaid ? "paid" : "pending"}
                        onChange={(e) => patch({ balancePaid: e.target.value === "paid" }, "Balance status updated")}
                      >
                        <option value="pending">Pending (25%)</option>
                        <option value="paid">Paid (25%)</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </div>
              <GoldButton
                disabled={busy}
                className="mt-5"
                onClick={() => patch({ price: Number(price), note: `Price updated to ₹${Number(price).toLocaleString("en-IN")}` }, "Price updated live.")}
              >
                Save Price ({price ? inr(Number(price) || 0) : ""})
              </GoldButton>
            </div>
          </Reveal>

          {/* Approval Video Proof */}
          <Reveal>
            <div className="rounded-3xl border border-gold/30 bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> 360° Craft Approval Video
              </h2>
              {order.approvalVideoUrl ? (
                <video src={order.approvalVideoUrl} controls className="aspect-video w-full rounded-2xl bg-charcoal" />
              ) : (
                <p className="rounded-2xl bg-cream-dark px-5 py-4 text-xs text-charcoal-muted">No approval video shared yet.</p>
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Upload Video (≤25MB)">
                  <input type="file" accept="video/*" className="text-xs" onChange={(e) => onVideoFile(e.target.files?.[0] || null)} disabled={busy} />
                </Field>
                <Field label="Notes for Client">
                  <input className={inputCls} value={studioNotes} onChange={(e) => setStudioNotes(e.target.value)} placeholder="Turn on your sound to hear the plinth resonance..." />
                </Field>
              </div>
            </div>
          </Reveal>

          {/* Shipping Details */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> Shipping & Dispatch Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Courier Partner">
                  <input
                    className={inputCls}
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    placeholder="BlueDart Express / DTDC"
                  />
                </Field>
                <Field label="Air Waybill (AWB) / Tracking Number">
                  <input
                    className={inputCls}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="BLUEDART-84920492"
                  />
                </Field>
              </div>
              <GhostButton
                disabled={busy}
                className="mt-4"
                onClick={() => patch({ trackingNumber, courierPartner, note: `Courier tracking updated: ${trackingNumber}` }, "Shipping details updated.")}
              >
                Save Shipping Info
              </GhostButton>
            </div>
          </Reveal>

          {/* Status Pipeline Step Advance */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> Advance Order Status
              </h2>
              <div className="flex flex-wrap gap-3">
                {NEXT.filter((n) => n.from.includes(order.status)).map((n) => (
                  <GoldButton
                    key={n.to}
                    disabled={busy}
                    onClick={() => patch({ status: n.to, note: n.note }, `Order updated to ${n.label}`)}
                  >
                    {n.label}
                  </GoldButton>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Sidebar Journey */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
                <Sparkle className="h-4 w-4 text-gold" /> Milestone Progress
              </h2>
              <OrderTimeline status={order.status} />
              <div className="mt-6 border-t border-charcoal/10 pt-5 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">75% Advance:</span>
                  <span className="font-bold">{order.advancePaid ? "✓ Paid" : "Pending"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">25% Balance:</span>
                  <span className="font-bold">{order.balancePaid ? "✓ Paid" : "Pending"}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
