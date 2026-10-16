"use client";
import OrderBuilder from "@/components/OrderBuilder";
import { Reveal } from "@/components/Reveal";
import { Sparkle } from "@/components/ui";
import { INCLUDED_ALWAYS } from "@/lib/catalog";

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
          <Sparkle className="h-3.5 w-3.5 text-gold" /> Start an order
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Build your keepsake.</h1>
        <p className="mt-3 max-w-xl text-charcoal-muted">
          Five short steps. You always see the total and the 75/25 split before paying anything —
          and you approve photos of the finished piece before it ships.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <OrderBuilder />
      </Reveal>
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white/70 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
        <ul className="mt-2 grid gap-1.5 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => <li key={t} className="flex gap-2"><span className="text-gold">✦</span>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
