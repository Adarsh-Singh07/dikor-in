"use client";
import OrderBuilder from "@/components/OrderBuilder";
import { Reveal } from "@/components/Reveal";
import { INCLUDED_ALWAYS } from "@/lib/catalog";

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-rosegold-dark mb-2">
          Atelier Custom Order
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal">
          Build your bespoke <span className="text-rosegold-dark italic font-normal">keepsake</span>.
        </h1>
        <p className="mt-3.5 max-w-xl text-base text-charcoal-muted leading-relaxed">
          Five simple steps with realtime 3D preview. You always see the total and the 75/25 split before paying anything,
          and our studio shares a 360° video proof for your approval before dispatch.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-8">
        <OrderBuilder />
      </Reveal>
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-6 border border-charcoal/10 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold-dark">
          Always Included With Every Figurine
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="text-gold-dark font-bold">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
