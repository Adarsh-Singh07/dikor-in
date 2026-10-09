"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import OrderTimeline from "@/components/OrderTimeline";
import { StatusPill, Sparkle, GoldButton, GhostButton, DemoBadge, Field, inputCls } from "@/components/ui";
import { api, fileToDataURL } from "@/lib/client";
import { inr, advanceAmount, balanceAmount, type Order } from "@/lib/store";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-6 shadow-card md:p-8 ${className}`}>{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 flex items-center gap-2 font-display text-2xl text-charcoal"><Sparkle className="h-4 w-4 text-gold" />{children}</h2>;
}

/** Demo mock-payment modal — clearly labelled, no real charge. */
function PayModal({ amount, label, onClose, onPaid }: { amount: number; label: string; onClose: () => void; onPaid: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-charcoal/60 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-[2rem] bg-cream p-8 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-3xl text-charcoal">{label}</h3>
          <DemoBadge />
        </div>
        <p className="rounded-2xl bg-gold/15 px-4 py-3 text-sm text-gold-dark">
          Demo payment — no real money moves. In production this would open a secure gateway.
        </p>
        <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal-muted">Amount due</p>
          <p className="mt-1 font-display text-4xl text-charcoal">{inr(amount)}</p>
          <div className="mt-4 space-y-2 text-sm text-charcoal-muted">
            <p className="flex justify-between"><span>Card</span><span className="font-mono">•••• 4242 (demo)</span></p>
            <p className="flex justify-between"><span>Gateway</span><span>DemoPay</span></p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <GoldButton
            disabled={busy}
            className="flex-1"
            onClick={async () => { setBusy(true); await onPaid(); }}
          >
            {busy ? "Processing…" : `Pay ${inr(amount)}`}
          </GoldButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail({ id, backHref }: { id: string; backHref: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payType, setPayType] = useState<null | "advance" | "balance">(null);
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
    return () => { live = false; };
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

  if (loading) return <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center text-charcoal-muted">Loading your keepsake…</div>;
  if (error && !order) return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-40 text-center">
      <p className="text-charcoal-muted">{error}</p>
      <Link href={backHref} className="mt-4 inline-block text-rosegold-dark underline">Go back</Link>
    </div>
  );
  if (!order) return null;

  const adv = advanceAmount(order);
  const bal = balanceAmount(order);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <Link href={backHref} className="text-sm text-charcoal-muted hover:text-rosegold-dark">← Back</Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-dark">{order.category}</p>
            <h1 className="mt-1 font-display text-4xl text-charcoal md:text-5xl">{order.title}</h1>
          </div>
          <StatusPill status={order.status} />
        </div>
      </Reveal>
      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Photos */}
          <Reveal>
            <Card>
              <CardTitle>Reference photos</CardTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {order.photos.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={p} alt={`Reference ${i + 1}`} className="aspect-square w-full rounded-2xl border border-charcoal/10 object-cover" />
                ))}
              </div>
              {order.description && <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">“{order.description}”</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {[order.size, order.material, order.city && `Ships to ${order.city}`].filter(Boolean).map((t) => (
                  <span key={t as string} className="rounded-full bg-cream-dark px-3 py-1.5 font-medium text-charcoal-soft">{t}</span>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Quotation */}
          <Reveal>
            <Card>
              <CardTitle>Quotation</CardTitle>
              {order.price ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted">Total price</p>
                    <p className="mt-1 font-display text-3xl text-charcoal">{inr(order.price)}</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted">Advance ({order.advancePct}%)</p>
                    <p className="mt-1 font-display text-3xl text-charcoal">{inr(adv)}</p>
                    <p className="mt-1 text-xs text-charcoal-muted">{order.advancePaid ? "✓ Paid" : "Due to begin"}</p>
                  </div>
                  <div className="rounded-2xl bg-cream p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted">Timeline</p>
                    <p className="mt-1 font-display text-3xl text-charcoal">{order.timelineDays ?? "—"} days</p>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl bg-cream-dark px-5 py-4 text-sm text-charcoal-muted">
                  Our studio is preparing your clear quotation — you&apos;ll see price and timeline here soon.
                </p>
              )}
              {order.status === "quoted" && !order.advancePaid && (
                <div className="mt-6">
                  <GoldButton disabled={busy} onClick={() => setPayType("advance")}>Pay advance {inr(adv)} to begin</GoldButton>
                  <p className="mt-2 text-xs text-charcoal-muted">Demo payment — no real charge.</p>
                </div>
              )}
            </Card>
          </Reveal>

          {/* Demo video + approval */}
          {(order.status === "demo_shared" || order.demoVideo || order.demoNote || ["approved", "in_production", "ready_for_balance", "completed"].includes(order.status)) && (
            <Reveal>
              <Card className="border border-gold/30">
                <CardTitle>Video demo — review before it ships</CardTitle>
                {order.demoVideo ? (
                  <video src={order.demoVideo} controls className="aspect-video w-full rounded-2xl bg-charcoal" />
                ) : (
                  <div className="grid aspect-video w-full place-items-center rounded-2xl bg-gradient-to-br from-cream-dark to-blush">
                    <div className="text-center">
                      <Sparkle className="mx-auto h-8 w-8 text-gold-dark" />
                      <p className="mt-2 text-sm font-semibold text-charcoal">Demo video shared by the studio</p>
                      <p className="text-xs text-charcoal-muted">(video file placeholder in this demo)</p>
                    </div>
                  </div>
                )}
                {order.demoNote && <p className="mt-3 text-sm italic text-charcoal-muted">“{order.demoNote}”</p>}
                {order.status === "demo_shared" && (
                  <div className="mt-6">
                    {!showRev ? (
                      <div className="flex flex-wrap gap-3">
                        <GoldButton disabled={busy} onClick={() => act(() => api(`/api/orders/${id}/approve`, { method: "POST" }), "Approved! The studio will now finish production.")}>
                          ✓ Approve — looks perfect
                        </GoldButton>
                        <GhostButton disabled={busy} onClick={() => setShowRev(true)}>Request changes</GhostButton>
                      </div>
                    ) : (
                      <div className="space-y-3 rounded-2xl bg-cream p-5">
                        <Field label="What should we tweak?">
                          <textarea className={`${inputCls} min-h-20`} value={revNote} onChange={(e) => setRevNote(e.target.value)} placeholder="e.g. make the ears a touch darker…" />
                        </Field>
                        <div className="flex gap-3">
                          <GoldButton disabled={busy} onClick={() => act(() => api(`/api/orders/${id}/request-changes`, { method: "POST", body: JSON.stringify({ note: revNote }) })).then(() => { setShowRev(false); setRevNote(""); })}>
                            Send revision request
                          </GoldButton>
                          <GhostButton onClick={() => setShowRev(false)}>Cancel</GhostButton>
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-charcoal-muted">Revisions are included — we re-share a fresh demo after tweaks.</p>
                  </div>
                )}
                {order.revisionCount > 0 && (
                  <p className="mt-3 text-xs text-charcoal-muted">{order.revisionCount} revision{order.revisionCount > 1 ? "s" : ""} requested so far</p>
                )}
              </Card>
            </Reveal>
          )}

          {/* Production + balance */}
          {(["in_production", "ready_for_balance", "completed"].includes(order.status)) && (
            <Reveal>
              <Card>
                <CardTitle>Production & delivery</CardTitle>
                {order.productionStage && (
                  <p className="rounded-2xl bg-cream-dark px-5 py-3 text-sm text-charcoal-soft">
                    Current stage: <strong>{order.productionStage}</strong>
                  </p>
                )}
                {order.status === "ready_for_balance" && !order.balancePaid && (
                  <div className="mt-5">
                    <p className="text-sm text-charcoal-muted">Your keepsake is ready! Clear the balance to ship it.</p>
                    <GoldButton disabled={busy} className="mt-3" onClick={() => setPayType("balance")}>Pay balance {inr(bal)}</GoldButton>
                  </div>
                )}
                {order.status === "completed" && (
                  <p className="mt-2 rounded-2xl bg-charcoal px-5 py-4 text-sm text-cream">
                    ✦ Delivered — thank you for trusting DIKOR with your memories.
                  </p>
                )}
              </Card>
            </Reveal>
          )}
        </div>

        {/* Timeline sidebar */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.1}>
            <Card>
              <CardTitle>Journey</CardTitle>
              <OrderTimeline status={order.status} />
              {order.events.length > 0 && (
                <div className="mt-6 border-t border-charcoal/10 pt-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted">Activity</p>
                  <ul className="space-y-3">
                    {[...order.events].reverse().slice(0, 6).map((e, i) => (
                      <li key={i} className="text-xs leading-relaxed text-charcoal-muted">
                        <span className="font-semibold text-charcoal-soft">{new Date(e.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        {e.note ? ` — ${e.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </Reveal>
        </div>
      </div>

      {payType && (
        <PayModal
          amount={payType === "advance" ? adv : bal}
          label={payType === "advance" ? "Advance payment" : "Balance payment"}
          onClose={() => setPayType(null)}
          onPaid={async () => {
            await act(() => api(`/api/orders/${id}/pay`, { method: "POST", body: JSON.stringify({ type: payType }) }));
            setPayType(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
