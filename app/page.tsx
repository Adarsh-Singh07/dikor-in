"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import FaqAccordion from "@/components/FaqAccordion";
import { CATEGORIES } from "@/lib/catalog";
import { REVIEWS } from "@/lib/reviews";

/* ---------- hero: 75svh editorial poster (was 100svh, round 3) ----------
   z-0 key light · z-1 monumental DIKOR wordmark · z-2 real product photo
   (the golden retriever figurine cut out of hero-dog.webp, transparent PNG)
   · z-3 corner specs + glass dock. One living moment: the photo's slow
   6s float. Nothing else on the page moves. The dock CTA goes to /order —
   the homepage no longer has its own order section. */
function Hero() {
  return (
    <section className="relative isolate grid min-h-[75svh] grid-rows-[1fr_auto] overflow-hidden bg-charcoal px-5 pb-6 pt-20 md:px-8">
      {/* step 3: ONE key light, warm, from 45° overhead */}
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,244,224,0.14),transparent_70%)]"
        aria-hidden
      />
      {/* micro-caption: pinned below the nav so the sculpture can never cover it */}
      <p className="pointer-events-none absolute left-1/2 top-[4.75rem] z-[3] -translate-x-1/2 select-none whitespace-nowrap text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light/80">
        Custom 3D-printed keepsakes
      </p>
      {/* stage */}
      <div className="relative">
        {/* step 1: monumental wordmark */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 select-none text-center">
          <h1 className="bg-[linear-gradient(180deg,#FFFFFF_10%,#D8C9A3_100%)] bg-clip-text font-grotesk text-[clamp(6rem,27vw,32rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] text-transparent">
            DIKOR
          </h1>
        </div>
        {/* step 2: the real figurine photo over the type — no card, no frame,
            no shadow: the cutout floats directly on the charcoal stage */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex translate-y-[9%] items-center justify-center md:translate-y-[11%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dikor-dog-cutout.png"
            alt="DIKOR golden retriever figurine with a red bandana, on a stone pedestal with a gold Buddy name plate"
            className="hero-float h-auto w-auto max-h-[44%] max-w-[38%] select-none object-contain md:max-h-[66%]"
            draggable={false}
          />
        </div>
      </div>
      {/* step 4: four real specs pinned to the corners */}
      <div className="relative z-[3] mt-4 grid grid-cols-2 items-end gap-x-6 gap-y-5 md:grid-cols-[1fr_auto_1fr]">
        <dl className="order-2 space-y-4 md:order-1 md:col-start-1 md:row-start-1">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">From</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">₹1,500</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Start with</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">4–5 photos</dd>
          </div>
        </dl>
        {/* step 5: ONE liquid-glass dock */}
        <div className="order-1 col-span-2 w-full justify-self-stretch md:order-2 md:col-span-1 md:col-start-2 md:row-start-1 md:w-auto">
          <div className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full border border-white/15 bg-[rgba(20,18,16,0.6)] py-2 pl-4 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 sm:justify-start sm:gap-4 sm:pl-5">
            <span className="text-xs font-semibold text-cream sm:text-sm">From ₹1,500</span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <span className="hidden text-xs text-cream/70 sm:inline sm:text-sm">Name tag included</span>
            <a
              href="/order"
              className="rounded-full bg-cream px-4 py-2.5 text-xs font-bold text-charcoal sm:px-5 sm:text-sm"
            >
              Start your order
            </a>
          </div>
        </div>
        <dl className="order-3 space-y-4 text-right md:col-start-3 md:row-start-1">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Name tag</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">Included</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Delivery</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">7–10 days</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ---------- category editorial rows (round 3) ----------
   One line of copy per category. The CTA is the restrained dark pill.
   Unconfirmed prices are NOT shown as a number: Kids and Decor show only
   "Price confirmed on WhatsApp" until the owner confirms a figure. */
function CategoryRows() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-[7.5rem]">
      <SectionHeading
        title="Made for the moments you treasure"
        sub="Your photos become a hand-painted keepsake, approved by you before it ships."
      />
      <div className="space-y-16 md:space-y-24">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.key}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className={`overflow-hidden rounded-sm ${i % 2 ? "md:order-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={`${c.key} figurine by DIKOR`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
            <div className={i % 2 ? "md:order-1" : ""}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">{c.key}</p>
              <h3 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">{c.tagline}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-charcoal-muted">{c.copy}</p>
              <p className="mt-4">
                {c.priceConfirmed ? (
                  <>
                    <span className="font-display text-2xl text-gold-dark">{c.fromPrice}</span>
                    <span className="block text-xs text-charcoal-muted">Name tag and delivery included</span>
                  </>
                ) : (
                  <span className="font-display text-2xl text-gold-dark">Price confirmed on WhatsApp</span>
                )}
              </p>
              <Link
                href="/order"
                className="mt-6 inline-block rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition hover:bg-black"
              >
                {c.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- best pieces: three finished miniatures, all visible at once ----------
   Replaces the old Collection ring (one small centred image in a void).
   object-contain, so the whole figurine is visible — never a cropped face. */
const BEST_PIECES = [
  {
    src: "/images/hero-dog.webp",
    alt: "Golden retriever figurine by DIKOR",
    name: "Golden Dog",
    kind: "Custom pet miniature",
    price: "₹1,500",
    copy: "A golden retriever, hand-painted on a stone plinth.",
  },
  {
    src: "/images/cat-figurine.jpg",
    alt: "Simba the cat, a ginger tabby figurine",
    name: "Simba",
    kind: "Custom cat miniature",
    price: "₹1,500",
    copy: "A ginger tabby, with his name tag on the plinth.",
  },
  {
    src: "/images/pets-group.webp",
    alt: "Border collie and pug figurines",
    name: "Border Collie & Pug",
    kind: "Studio pet minis",
    price: "From ₹1,500",
    copy: "Two studio favourites, finished and ready to ship.",
  },
];

function BestPieces() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
      <SectionHeading
        title="Best pieces"
        sub="Three finished miniatures. Every one starts from 4–5 photos."
      />
      <div className="grid gap-10 sm:grid-cols-3">
        {BEST_PIECES.map((p) => (
          <div key={p.name}>
            <div className="overflow-hidden rounded-sm bg-cream-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} className="aspect-[4/3] w-full object-contain" loading="lazy" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">{p.kind}</p>
            <h3 className="mt-2 font-display text-2xl text-charcoal">{p.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">{p.copy}</p>
            <p className="mt-3 font-display text-xl text-gold-dark">{p.price}</p>
            <Link href="/order" className="mt-3 inline-block text-sm font-semibold text-rosegold-dark underline">
              Order this piece
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- craft, one line (round 3) ----------
   The process lives on /how-it-works now. This is the whole craft story on
   the homepage: one sentence, one link, one quiet makers line. */
function CraftLine() {
  return (
    <section className="border-y border-charcoal/10 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="max-w-3xl font-display text-3xl leading-snug text-charcoal md:text-4xl">
          Every piece is printed layer by layer, hand-painted, and approved by you on video before it ships.
        </p>
        <p className="mt-4">
          <Link href="/how-it-works" className="text-sm font-semibold text-rosegold-dark underline">
            See how it is made
          </Link>
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
          Made by hand in Jalandhar — @sainirajatrs and @sheetal__83
        </p>
      </div>
    </section>
  );
}

/* ---------- reviews: the three best, one huge quote + two short ----------
   No stars, no cards, no invented photos. The featured quote is a pet
   miniature review (the old first quote was about a name sign). The other
   15 reviews live on the gallery page. */
function Reviews() {
  const featured = REVIEWS[0];
  const more = [REVIEWS[1], REVIEWS[3]];
  return (
    <section className="bg-blush/50 py-20 md:py-[7.5rem]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title="What customers say"
          sub={`${REVIEWS.length} real reviews from our Reviews highlight on @dikor_in.`}
        />
        <blockquote className="max-w-4xl">
          <p className="font-display text-3xl leading-snug text-charcoal md:text-5xl">“{featured.quote}”</p>
          <footer className="mt-6 text-sm text-charcoal-muted">
            @{featured.handle} — {featured.context}, {featured.date}
          </footer>
        </blockquote>
        <ul className="mt-16 space-y-8">
          {more.map((r) => (
            <li key={r.handle ?? r.context} className="border-t border-charcoal/10 pt-6">
              <p className="max-w-3xl text-lg leading-relaxed text-charcoal">“{r.quote}”</p>
              <p className="mt-3 text-sm text-charcoal-muted">
                {r.handle ? `@${r.handle} — ` : ""}
                {r.context}, {r.date}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link href="/gallery#reviews" className="text-sm font-semibold text-rosegold-dark underline">
            Read the other 15 reviews
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------- prices, plainly + short FAQ (round 3) ----------
   The one pricing table on the site. Confirmed prices only; every
   unconfirmed cell reads "Confirmed on WhatsApp" — no invented figures. */
const PRICES = [
  { label: "5-inch · Slim breeds", price: "₹1,500" },
  { label: "5-inch · Bulky breeds", price: "₹2,000" },
  { label: "7-inch · Slim breeds", price: "₹1,700" },
  { label: "7-inch · Bulky breeds", price: "Confirmed on WhatsApp" },
  { label: "Child milestone", price: "Confirmed on WhatsApp" },
  { label: "Custom decor", price: "Confirmed on WhatsApp" },
];

function PricesAndFaq() {
  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-8 md:py-[7.5rem]">
      <SectionHeading
        title="Prices and questions"
        sub="The full price, up front. The rest is answered below."
      />
      <div className="mx-auto max-w-3xl">
        <dl className="divide-y divide-charcoal/10 border-y border-charcoal/15">
          {PRICES.map((p) => (
            <div key={p.label} className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-charcoal">{p.label}</dt>
              <dd className={`shrink-0 font-display text-xl ${p.price.startsWith("₹") ? "text-gold-dark" : "text-sm text-charcoal-muted"}`}>
                {p.price}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-charcoal-muted">
          Every price includes the name tag and insured delivery across India.
        </p>
      </div>
      <div className="mt-16">
        <FaqAccordion />
      </div>
      <p className="mt-12 text-center">
        <Link href="/order" className="text-sm font-semibold text-rosegold-dark underline">
          Start your order
        </Link>
      </p>
    </section>
  );
}

/* ---------- sticky mobile buy bar: the dock, once the hero is off-screen ----------
   Never visible at the same time as the hero dock. Static copy now — the
   homepage has no builder to summarise. */
function StickyBuyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 750);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-white/15 bg-[rgba(20,18,16,0.6)] py-2.5 pl-5 pr-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-cream">Custom miniature</p>
          <p className="text-xs font-bold text-gold-light">From ₹1,500 · 7–10 days</p>
        </div>
        <a href="/order" className="shrink-0 rounded-full bg-cream px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
          Start order
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryRows />
      <BestPieces />
      <CraftLine />
      <Reviews />
      <PricesAndFaq />
      <StickyBuyBar />
    </>
  );
}
