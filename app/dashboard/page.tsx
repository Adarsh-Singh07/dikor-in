import Link from "next/link";
import { requireUser } from "@/lib/server-auth";
import { db, inr, advanceAmount } from "@/lib/store";
import { Reveal } from "@/components/Reveal";
import { StatusPill, Sparkle } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await requireUser("customer");
  const orders = await db.getOrdersByUser(me.id, me.email);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
              <Sparkle className="h-3.5 w-3.5 text-gold" /> DIKOR Keepsakes Dashboard
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl text-charcoal font-bold">
              Hello, {me.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-xs md:text-sm text-charcoal-muted">Track your handcrafted sculptures from 3D CAD modeling to doorstep delivery.</p>
          </div>
          <Link
            href="/order"
            className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-105"
          >
            + Start New Keepsake
          </Link>
        </div>
      </Reveal>

      {orders.length === 0 ? (
        <Reveal>
          <div className="rounded-[2.5rem] border border-dashed border-gold/50 bg-white/60 p-14 text-center">
            <Sparkle className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-4 font-serif text-3xl text-charcoal font-bold">No Keepsakes Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal-muted text-sm">
              Share 4-5 photos of your pet, family, or sacred deity, and our studio will craft something unforgettable.
            </p>
            <Link
              href="/order"
              className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-cream transition-transform hover:scale-105"
            >
              Start Your First Keepsake
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o, i) => (
            <Reveal key={o.id} delay={(i % 3) * 0.08}>
              <Link
                href={`/dashboard/orders/${o.id}`}
                className="block h-full rounded-3xl bg-white p-6 shadow-card border border-charcoal/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">{o.category} &bull; #{o.id}</p>
                    <h3 className="mt-1 font-serif text-2xl font-bold leading-snug text-charcoal">{o.title}</h3>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <StatusPill status={o.status} />
                  <span className="font-serif text-xl font-bold text-charcoal">
                    {o.totalPrice ? inr(o.totalPrice) : "On WhatsApp"}
                  </span>
                </div>

                {o.status === "approval_shared" && (
                  <p className="mt-4 rounded-2xl bg-blush px-4 py-2.5 text-xs font-semibold text-rosegold-dark">
                    ✦ 360° craft video ready — tap to inspect &amp; approve
                  </p>
                )}

                {(!o.advancePaid || o.status === "photos_received") && o.totalPrice > 0 && (
                  <p className="mt-4 rounded-2xl bg-cream-dark px-4 py-2.5 text-xs font-semibold text-gold-dark">
                    75% Advance: {inr(advanceAmount(o))} &bull; Tap to pay via Easebuzz
                  </p>
                )}

                {o.status === "delivered" && (
                  <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span>✓ Delivered</span>
                    <span className="underline text-charcoal-muted">View Tax Invoice →</span>
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
