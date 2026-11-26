"use client";
import OrderBuilder from "@/components/OrderBuilder";
import DesignShowcase from "@/components/DesignShowcase";
import PhotoGuide from "@/components/PhotoGuide";
import { INCLUDED_ALWAYS } from "@/lib/catalog";

/* Order page (round 3): the whole ordering experience lives here and only
   here — the homepage no longer carries a builder, a configurator, or a
   second "Always included". The showcase above is the one example image
   plus the price; the aside beside the form is the compact summary of
   price, timeline, and what happens next. */
export default function OrderPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
          Start an order
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Build your keepsake.</h1>
        <p className="mt-3 max-w-xl text-charcoal-muted">
          Five short steps. You see the full price up front — and you approve photos of the finished piece before it ships.
        </p>
      </div>

      <DesignShowcase />
      <PhotoGuide />

      <div id="order-builder" className="mt-16 grid scroll-mt-24 items-start gap-10 lg:grid-cols-[1fr_320px]">
        <OrderBuilder />
        <aside className="rounded-sm border border-charcoal/10 bg-white/70 p-6 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">What happens next</p>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal-soft">
            <li><span className="font-semibold text-charcoal">1. You send 4–5 photos</span> and pick a size.</li>
            <li><span className="font-semibold text-charcoal">2. We print and hand-paint</span> — 4–5 days in the studio.</li>
            <li><span className="font-semibold text-charcoal">3. You approve the video</span> of the finished piece.</li>
            <li><span className="font-semibold text-charcoal">4. We ship</span> — 7–10 days to your door.</li>
          </ol>
          <div className="mt-6 border-t border-charcoal/10 pt-4">
            <p className="font-display text-2xl text-gold-dark">From ₹1,500</p>
            <p className="mt-1 text-xs text-charcoal-muted">
              Name tag and insured delivery included. 7-inch bulky price confirmed on WhatsApp.
            </p>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-12 max-w-3xl border-t border-charcoal/10 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
        <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
