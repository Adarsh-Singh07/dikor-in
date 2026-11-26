import Link from "next/link";
import { requireUser } from "@/lib/server-auth";
import { db, inr, advanceAmount } from "@/lib/store";
import { StatusPill, DemoBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await requireUser("customer");
  const orders = await db.getOrdersByUser(me.id, me.email);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            My studio <DemoBadge />
          </p>
          <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">
            Hello, {me.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-charcoal-muted">Track your keepsakes from photo to doorstep.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-cream"
        >
          + New order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-sm border border-dashed border-gold/50 bg-white/60 p-14 text-center">
          <h2 className="mt-4 font-display text-3xl text-charcoal">No keepsakes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-charcoal-muted">Share a few photos and our studio will craft something unforgettable.</p>
          <Link href="/dashboard/new" className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-cream">
            Place your first order
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <div key={o.id}>
              <Link
                href={`/dashboard/orders/${o.id}`}
                className="block h-full rounded-sm border border-charcoal/10 bg-white p-6 transition-colors hover:border-rosegold/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">{o.category}</p>
                    <h3 className="mt-1 font-display text-2xl leading-snug text-charcoal">{o.title}</h3>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <StatusPill status={o.status} />
                  <span className="shrink-0 font-display text-xl text-charcoal">
                    {o.totalPrice ? inr(o.totalPrice) : "On WhatsApp"}
                  </span>
                </div>

                {o.status === "approval_shared" && (
                  <p className="mt-4 rounded-sm bg-blush px-4 py-2.5 text-xs font-semibold text-rosegold-dark">
                    Your approval video is ready — tap to review
                  </p>
                )}

                {(!o.advancePaid || o.status === "photos_received") && o.totalPrice > 0 && (
                  <p className="mt-4 rounded-sm bg-cream-dark px-4 py-2.5 text-xs font-semibold text-gold-dark">
                    75% Advance: {inr(advanceAmount(o))} &bull; Tap to pay via Easebuzz
                  </p>
                )}

                {o.status === "delivered" && (
                  <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-3 text-xs font-bold text-emerald-800">
                    <span>✓ Delivered</span>
                    <span className="text-charcoal-muted underline">View Tax Invoice →</span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
