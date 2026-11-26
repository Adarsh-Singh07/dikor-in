"use client";
import OrderBuilder from "@/components/OrderBuilder";
import { INCLUDED_ALWAYS } from "@/lib/catalog";

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
          Start an order
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Build your keepsake.</h1>
        <p className="mt-3 max-w-xl text-charcoal-muted">
          Five short steps. You see the full price up front — and you approve photos of the finished piece before it ships.
        </p>
      </div>
      <div className="mt-10">
        <OrderBuilder />
      </div>
      <div className="mx-auto mt-8 max-w-3xl border-t border-charcoal/10 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
        <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
