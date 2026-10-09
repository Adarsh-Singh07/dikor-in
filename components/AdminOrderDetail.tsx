"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import OrderTimeline from "@/components/OrderTimeline";
import { StatusPill, Sparkle, GoldButton, GhostButton, DemoBadge, Field, inputCls } from "@/components/ui";
import { api, fileToDataURL } from "@/lib/client";
import { inr, type Order, type OrderStatus } from "@/lib/store";

const NEXT: { from: OrderStatus[]; to: OrderStatus; label: string; note: string }[] = [
  { from: ["advance_paid"], to: "in_production", label: "Start production", note: "Production started" },
  { from: ["in_production", "approved"], to: "ready_for_balance", label: "Mark ready — request balance", note: "Piece finished, balance requested" },
  { from: ["ready_for_balance"], to: "completed", label: "Mark delivered", note: "Delivered to customer" },
];

const STAGES = ["Designing", "Printing", "Painting", "Finishing", "Quality check", "Packing"];

export default function AdminOrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState("");
  const [timeline, setTimeline] = useState("12");
  const [demoNote, setDemoNote] = useState("");
  const [stage, setStage] = useState(STAGES[1]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const d = await api(`/api/orders/${id}`);
        if (!live) return;
        setOrder(d.order);
        if (d.order.price) setPrice(String(d.order.price));
        if (d.order.timelineDays) setTimeline(String(d.order.timelineDays));
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : "Could not load order");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
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

  const onVideo = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const url = await fileToDataURL(f, 20 * 1024 * 1024);
      await patch(
        { demoVideo: url, demoNote: demoNote || "Fresh from the studio — turn your sound on!", status: "demo_shared", note: "Demo video shared for review" },
        "Demo video shared with the customer."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read video");
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center text-charcoal-muted">Loading order…</div>;
  if (!order) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center"><p className="text-charcoal-muted">{error || "Order not found"}</p><Link href="/admin" className="mt-4 inline-block text-rosegold-dark underline">Back to studio</Link></div>;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <Link href="/admin" className="text-sm text-charcoal-muted hover:text-rosegold-dark">← All orders</Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-dark">{order.category} · <DemoBadge /></p>
            <h1 className="mt-1 font-display text-4xl text-charcoal">{order.title}</h1>
          </div>
          <StatusPill status={order.status} />
        </div>
      </Reveal>
      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer brief */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />Customer brief</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {order.photos.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={p} alt={`Reference ${i + 1}`} className="aspect-square w-full rounded-2xl border border-charcoal/10 object-cover" />
                ))}
              </div>
              {order.description && <p className="mt-4 text-sm text-charcoal-muted">“{order.description}”</p>}
              <p className="mt-3 text-xs text-charcoal-muted">{order.size} · {order.material} · Ships to {order.city || "—"}</p>
            </div>
          </Reveal>

          {/* Quotation */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />Quotation</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price (₹)">
                  <input type="number" min={100} className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2499" />
                </Field>
                <Field label="Timeline (days)">
                  <input type="number" min={1} max={90} className={inputCls} value={timeline} onChange={(e) => setTimeline(e.target.value)} />
                </Field>
              </div>
              <GoldButton
                disabled={busy || order.status !== "submitted"}
                className="mt-5"
                onClick={() => patch({ price: Number(price), timelineDays: Number(timeline), status: "quoted", note: `Quote shared: ₹${Number(price).toLocaleString("en-IN")} · ${timeline} days` }, "Quote sent to customer.")}
              >
                Send quote {price ? `· ${inr(Number(price) || 0)}` : ""}
              </GoldButton>
              {order.status !== "submitted" && <p className="mt-2 text-xs text-charcoal-muted">Quote already sent — editing price updates it live.</p>}
            </div>
          </Reveal>

          {/* Demo video */}
          <Reveal>
            <div className="rounded-3xl border border-gold/30 bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />Demo video</h2>
              {order.demoVideo ? (
                <video src={order.demoVideo} controls className="aspect-video w-full rounded-2xl bg-charcoal" />
              ) : (
                <p className="rounded-2xl bg-cream-dark px-5 py-4 text-sm text-charcoal-muted">No demo video shared yet.</p>
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Video file (demo, ≤20MB)">
                  <input type="file" accept="video/*" className="text-sm" onChange={(e) => onVideo(e.target.files?.[0] || null)} disabled={busy} />
                </Field>
                <Field label="Note for customer">
                  <input className={inputCls} value={demoNote} onChange={(e) => setDemoNote(e.target.value)} placeholder="Fresh from the paint booth…" />
                </Field>
              </div>
              {order.revisionCount > 0 && <p className="mt-3 text-xs font-semibold text-rosegold-dark">Customer requested {order.revisionCount} revision{order.revisionCount > 1 ? "s" : ""} — re-share a fresh demo after tweaks.</p>}
            </div>
          </Reveal>

          {/* Production */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />Production</h2>
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-52 flex-1">
                  <Field label="Current stage">
                    <select className={inputCls} value={stage} onChange={(e) => setStage(e.target.value)}>
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <GhostButton disabled={busy} onClick={() => patch({ productionStage: stage, note: `Production stage: ${stage}` }, "Stage updated.")}>Update stage</GhostButton>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-charcoal/10 pt-6">
                {NEXT.filter((n) => n.from.includes(order.status)).map((n) => (
                  <GoldButton
                    key={n.to}
                    disabled={busy}
                    onClick={() => {
                      const body: Record<string, unknown> = { status: n.to, note: n.note };
                      if (n.to === "in_production") body.productionStage = stage;
                      patch(body, `Order moved: ${n.label}.`);
                    }}
                  >
                    {n.label}
                  </GoldButton>
                ))}
                {NEXT.every((n) => !n.from.includes(order.status)) && (
                  <p className="text-sm text-charcoal-muted">
                    {order.status === "completed" ? "This order is complete. ✦" : "Waiting on the customer for the next step."}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-5 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />Journey</h2>
              <OrderTimeline status={order.status} />
              <div className="mt-6 border-t border-charcoal/10 pt-5 text-sm">
                <p className="flex justify-between py-1"><span className="text-charcoal-muted">Advance {order.advancePct}%</span><span className="font-semibold">{order.advancePaid ? "✓ Paid" : "Pending"}</span></p>
                <p className="flex justify-between py-1"><span className="text-charcoal-muted">Balance</span><span className="font-semibold">{order.balancePaid ? "✓ Paid" : "Pending"}</span></p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
