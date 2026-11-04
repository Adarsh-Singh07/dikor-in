"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import OrderTimeline from "@/components/OrderTimeline";
import { StatusPill, Sparkle, GoldButton, GhostButton, Field, inputCls } from "@/components/ui";
import { api } from "@/lib/client";
import { inr, advanceAmount, balanceAmount, type Order } from "@/lib/types";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-6 shadow-card md:p-8 ${className}`}>{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl text-charcoal font-bold">
      <Sparkle className="h-4 w-4 text-gold" />
      {children}
    </h2>
  );
}

export default function OrderDetail({ id, backHref }: { id: string; backHref: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revNote, setRevNote] = useState("");
  const [showRev, setShowRev] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const d = await api(`/api/orders/${id}`);
        if (live) setOrder(d.order);
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

  const act = async (fn: () => Promise<{ order: Order }>, doneMsg?: string) => {
    setBusy(true);
    setError("");
    try {
      const d = await fn();
      setOrder(d.order);
      if (doneMsg) alert(doneMsg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleInitiatePayment = async (type: "advance" | "balance") => {
    setBusy(true);
    setError("");
    try {
      const res = await api(`/api/orders/${id}/pay`, {
        method: "POST",
        body: JSON.stringify({ type, initiate: true }),
      });
      if (res.paymentUrl) {
        router.push(res.paymentUrl);
      } else {
        await act(() => api(`/api/orders/${id}/pay`, { method: "POST", body: JSON.stringify({ type }) }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment initiation failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center text-charcoal-muted">Loading your keepsake…</div>;
  if (error && !order) {
    return (
      <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center">
        <p className="text-charcoal-muted">{error}</p>
        <Link href={backHref} className="mt-4 inline-block text-rosegold-dark underline font-semibold">
          Go back
        </Link>
      </div>
    );
  }
  if (!order) return null;

  const adv = advanceAmount(order);
  const bal = balanceAmount(order);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <Link href={backHref} className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-rosegold-dark">
          ← Back
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-dark">{order.category} &bull; #{order.id}</p>
            <h1 className="mt-1 font-serif text-3xl md:text-5xl text-charcoal font-bold">{order.title}</h1>
          </div>
          <StatusPill status={order.status} />
        </div>
      </Reveal>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Guest claim notification banner */}
      {!order.userId && (
        <div className="mt-6 p-4 rounded-2xl bg-cream-dark/60 border border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-charcoal">Viewing as Guest Order</p>
            <p className="text-charcoal-muted">Sign up or log in using your phone or email to save this keepsake permanently to your account dashboard.</p>
          </div>
          <Link href="/auth" className="px-4 py-2 rounded-full bg-gold text-charcoal font-bold uppercase tracking-wider text-[10px]">
            Claim to Account
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Photos & Specs */}
          <Reveal>
            <Card>
              <CardTitle>Reference Photos & Engraving</CardTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {order.photos && order.photos.length > 0 ? (
                  order.photos.map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={p} alt={`Reference ${i + 1}`} className="aspect-square w-full rounded-2xl border border-charcoal/10 object-cover" />
                  ))
                ) : (
                  <p className="text-xs text-charcoal-muted col-span-3">Photos received on WhatsApp chat.</p>
                )}
              </div>
              {order.tagText && (
                <div className="mt-4 p-3 rounded-xl bg-cream-dark/50 border border-gold/30 text-xs">
                  <span className="text-charcoal-muted font-semibold uppercase tracking-wider text-[10px] block">Engraved Brass Plaque</span>
                  <span className="font-serif text-sm font-bold text-charcoal italic">&ldquo;{order.tagText}&rdquo;</span>
                </div>
              )}
              {order.description && <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">“{order.description}”</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {[order.size, order.material, order.city && `Ships to ${order.city}`].filter(Boolean).map((t) => (
                  <span key={t as string} className="rounded-full bg-cream-dark px-3 py-1.5 font-medium text-charcoal-soft">{t}</span>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Split Pricing & Payments */}
          <Reveal>
            <Card>
              <CardTitle>Price & Split Payment Breakdown</CardTitle>
              {order.totalPrice ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted font-bold">Total Price</p>
                    <p className="mt-1 font-serif text-3xl font-bold text-charcoal">{inr(order.totalPrice)}</p>
                    <p className="mt-1 text-xs text-emerald-800 font-semibold">Free Pan-India Delivery</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted font-bold">75% Advance</p>
                    <p className="mt-1 font-serif text-3xl font-bold text-charcoal">{inr(adv)}</p>
                    <p className="mt-1 text-xs font-semibold">{order.advancePaid ? <span className="text-emerald-700">✓ Paid via Easebuzz</span> : "Due to begin 3D print"}</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted font-bold">25% Balance</p>
                    <p className="mt-1 font-serif text-3xl font-bold text-charcoal">{inr(bal)}</p>
                    <p className="mt-1 text-xs font-semibold">{order.balancePaid ? <span className="text-emerald-700">✓ Paid</span> : "Due only after you approve video"}</p>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl bg-cream-dark px-5 py-4 text-sm text-charcoal-muted">
                  Our studio is confirming your price on WhatsApp.
                </p>
              )}

              {/* Pay Advance Button */}
              {(!order.advancePaid || order.status === "photos_received" || order.status === "advance_pending") && (
                <div className="mt-6 pt-4 border-t border-charcoal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Step 1: Reserve Your Atelier Slot</p>
                    <p className="text-xs text-charcoal-muted">Pay 75% advance to start CAD sculpting & resin printing.</p>
                  </div>
                  <GoldButton disabled={busy} onClick={() => handleInitiatePayment("advance")}>
                    {busy ? "Connecting..." : `Pay 75% Advance (${inr(adv)}) via Easebuzz`}
                  </GoldButton>
                </div>
              )}
            </Card>
          </Reveal>

          {/* 360° Video Proof & Approval */}
          {(order.status === "approval_shared" || order.approvalVideoUrl || ["approved", "balance_paid", "shipped", "delivered"].includes(order.status)) && (
            <Reveal>
              <Card className="border border-gold/40">
                <CardTitle>360° Craft Proof — Inspect Before It Ships</CardTitle>
                {order.approvalVideoUrl ? (
                  <video src={order.approvalVideoUrl} controls className="aspect-video w-full rounded-2xl bg-charcoal" />
                ) : (
                  <div className="grid aspect-video w-full place-items-center rounded-2xl bg-gradient-to-br from-cream-dark to-blush">
                    <div className="text-center p-6">
                      <Sparkle className="mx-auto h-8 w-8 text-gold" />
                      <p className="mt-2 text-sm font-semibold text-charcoal">Studio Craft Video Proof Ready</p>
                      <p className="text-xs text-charcoal-muted mt-1">Our artists have finished 3D printing & hand-painting.</p>
                    </div>
                  </div>
                )}
                {order.studioNotes && <p className="mt-3 text-xs italic text-charcoal-soft bg-cream/40 p-3 rounded-xl">&ldquo;{order.studioNotes}&rdquo;</p>}

                {order.status === "approval_shared" && (
                  <div className="mt-6 pt-4 border-t border-charcoal/10">
                    {!showRev ? (
                      <div className="flex flex-wrap gap-3">
                        <GoldButton
                          disabled={busy}
                          onClick={() => act(() => api(`/api/orders/${id}/approve`, { method: "POST" }), "Craft Approved! You can now clear the balance for shipping.")}
                        >
                          ✓ Approve — Looks Perfect!
                        </GoldButton>
                        <GhostButton disabled={busy} onClick={() => setShowRev(true)}>
                          Request Tweaks / Adjustments
                        </GhostButton>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-2xl bg-cream p-5">
                        <Field label="What would you like our artist to tweak?">
                          <textarea
                            className={`${inputCls} min-h-20`}
                            value={revNote}
                            onChange={(e) => setRevNote(e.target.value)}
                            placeholder="e.g. Please darken the spot around the left ear slightly..."
                          />
                        </Field>
                        <div className="flex gap-3">
                          <GoldButton
                            disabled={busy}
                            onClick={() =>
                              act(() => api(`/api/orders/${id}/request-changes`, { method: "POST", body: JSON.stringify({ note: revNote }) })).then(() => {
                                setShowRev(false);
                                setRevNote("");
                              })
                            }
                          >
                            Send Revision Request
                          </GoldButton>
                          <GhostButton onClick={() => setShowRev(false)}>Cancel</GhostButton>
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-[11px] text-charcoal-muted">Revisions are complimentary until you are 100% satisfied.</p>
                  </div>
                )}
              </Card>
            </Reveal>
          )}

          {/* Balance Clearance & Shipping */}
          {(order.status === "approved" || !order.balancePaid && ["approved", "in_production"].includes(order.status)) && (
            <Reveal>
              <Card className="border border-gold/30">
                <CardTitle>Step 2: Clear 25% Balance & Ship</CardTitle>
                <p className="text-xs text-charcoal-soft leading-relaxed">
                  You&apos;ve greenlit your piece! Clear the final 25% balance ({inr(bal)}) so our studio can pack it in the protective wooden velvet crate and hand it to express courier.
                </p>
                <div className="mt-5">
                  <GoldButton disabled={busy} onClick={() => handleInitiatePayment("balance")}>
                    {busy ? "Connecting..." : `Pay Final 25% Balance (${inr(bal)}) via Easebuzz`}
                  </GoldButton>
                </div>
              </Card>
            </Reveal>
          )}

          {/* Tracking & Delivery Completed with Invoice */}
          {["shipped", "delivered"].includes(order.status) && (
            <Reveal>
              <Card className="bg-gradient-to-br from-cream to-white border-2 border-gold/40">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      {order.status === "delivered" ? "Delivered & Verified" : "Express Transit In Progress"}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-charcoal mt-2">
                      {order.status === "delivered" ? "Your Keepsake Has Arrived!" : "On Its Way to Your Doorstep"}
                    </h3>
                    {order.trackingNumber && (
                      <p className="text-xs text-charcoal-soft mt-1">
                        Carrier: <strong>{order.courierPartner || "BlueDart Express"}</strong> &bull; AWB: <strong>{order.trackingNumber}</strong>
                      </p>
                    )}
                  </div>
                  <div>
                    <Link href={`/invoice/${order.id}`} target="_blank">
                      <GoldButton className="py-2.5 px-6 text-xs">
                        View & Print Tax Invoice
                      </GoldButton>
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          )}
        </div>

        {/* Timeline sidebar */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          <Reveal delay={0.1}>
            <Card>
              <CardTitle>Craft Journey</CardTitle>
              <OrderTimeline status={order.status} />

              <div className="mt-6 border-t border-charcoal/10 pt-5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">75% Advance:</span>
                  <span className="font-bold">{order.advancePaid ? "✓ Paid" : "Pending"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">25% Balance:</span>
                  <span className="font-bold">{order.balancePaid ? "✓ Paid" : "Pending"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-charcoal/10 font-bold text-charcoal">
                  <span>Total Crafting:</span>
                  <span>{inr(order.totalPrice)}</span>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
