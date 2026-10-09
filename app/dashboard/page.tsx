import Link from "next/link";
import { requireUser } from "@/lib/server-auth";
import { db, inr, advanceAmount } from "@/lib/store";
import { Reveal } from "@/components/Reveal";
import { StatusPill, Sparkle, DemoBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await requireUser("customer");
  const orders = db.getOrdersByUser(me.id);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
              <Sparkle className="h-3.5 w-3.5 text-gold" /> My studio <DemoBadge />
            </p>
            <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Hello, {me.name.split(" ")[0]}.</h1>
            <p className="mt-2 text-charcoal-muted">Track your keepsakes from photo to doorstep.</p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-105"
          >
            + New order
          </Link>
        </div>
      </Reveal>

      {orders.length === 0 ? (
        <Reveal>
          <div className="rounded-[2rem] border border-dashed border-gold/50 bg-white/60 p-14 text-center">
            <Sparkle className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-4 font-display text-3xl text-charcoal">No keepsakes yet</h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal-muted">Share a few photos and our studio will craft something unforgettable.</p>
            <Link href="/dashboard/new" className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-105">
              Place your first order
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o, i) => (
            <Reveal key={o.id} delay={(i % 3) * 0.08}>
              <Link
                href={`/dashboard/orders/${o.id}`}
                className="block h-full rounded-3xl bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">{o.category}</p>
                    <h3 className="mt-1 font-display text-2xl leading-snug text-charcoal">{o.title}</h3>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <StatusPill status={o.status} />
                  {o.price ? (
                    <span className="font-display text-xl text-charcoal">{inr(o.price)}</span>
                  ) : (
                    <span className="text-xs uppercase tracking-[0.16em] text-charcoal-muted">Awaiting quote</span>
                  )}
                </div>
                {o.status === "demo_shared" && (
                  <p className="mt-4 rounded-2xl bg-blush px-4 py-2.5 text-xs font-semibold text-rosegold-dark">
                    ✦ Your video demo is ready — tap to review
                  </p>
                )}
                {o.status === "quoted" && !o.advancePaid && (
                  <p className="mt-4 rounded-2xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-gold-dark">
                    Quote ready: {inr(o.price!)} · advance {inr(advanceAmount(o))} to begin
                  </p>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
