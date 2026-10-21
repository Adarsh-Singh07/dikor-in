"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Marquee, Sparkle, GoldButton, GhostButton } from "@/components/ui";
import Cylinder from "@/components/Cylinder";
import OrderBuilder, { type BuilderSummary } from "@/components/OrderBuilder";
import HowItWorksSection from "@/components/HowItWorksSection";
import BeforeAfter from "@/components/BeforeAfter";
import FaqAccordion from "@/components/FaqAccordion";
import { CATEGORIES, INCLUDED_ALWAYS, WHATSAPP_LINK, INSTAGRAM_HANDLE } from "@/lib/catalog";
import { REVIEWS, AGGREGATE } from "@/lib/reviews";

const RING_IMAGES = [
  { src: "/images/hero-dog.webp", label: "Pet miniature" },
  { src: "/images/couple.webp", label: "Couple miniature" },
  { src: "/images/ganesha.webp", label: "Ganesha idol" },
  { src: "/images/kid.webp", label: "Child miniature" },
  { src: "/images/decor.webp", label: "Home decor" },
  { src: "/images/pets-group.webp", label: "Pet minis" },
];

/* ---------- pointer-tilting 3D pedestal card ---------- */
function TiltCard() {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-md"
        style={{ transformStyle: "preserve-3d", transform: `rotateX(${-t.y * 8}deg) rotateY(${t.x * 10}deg)` }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
      >
        {/* pedestal glow */}
        <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_50%_60%,rgba(201,162,39,0.28),rgba(183,110,121,0.14)_55%,transparent_75%)]" aria-hidden />
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-white shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-dog.webp" alt="Hand-painted DIKOR dog miniature on a wooden base" className="aspect-[4/5] w-full object-cover" fetchPriority="high" />
          <div className="flex items-center justify-between bg-cream/90 px-6 py-4 backdrop-blur">
            <div>
              <p className="font-display text-xl text-charcoal">Pet miniature · 5 inch</p>
              <p className="text-xs uppercase tracking-[0.18em] text-charcoal-muted">Hand-painted · name tag included</p>
            </div>
            <p className="font-display text-2xl text-gold-dark">₹1,500</p>
          </div>
        </div>
        {/* floating chips */}
        <div className="absolute -left-4 top-8 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-rosegold-dark shadow-card backdrop-blur" style={{ transform: "translateZ(60px)" }}>
          ✦ Made from your photos
        </div>
        <div className="absolute -right-3 bottom-24 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark shadow-card backdrop-blur" style={{ transform: "translateZ(60px)" }}>
          ✦ 75% advance · 25% later
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_70%_20%,#F7E8E4_0%,#FAF5EC_55%,#F3EAD9_100%)]" aria-hidden />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-10 md:grid-cols-2 md:px-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark backdrop-blur"
          >
            <Sparkle className="h-3 w-3" /> Custom 3D-printed gifting studio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-[1.04] text-charcoal md:text-7xl"
          >
            Your pet, turned into a <em className="text-shimmer not-italic font-semibold">mini statue</em>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.26 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-charcoal-muted"
          >
            Send 4–5 clear photos — we 3D-print and hand-paint a figurine that looks just like them,
            then share photos or a video for your approval before it ships.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#order"><GoldButton className="w-full sm:w-auto">Start your order</GoldButton></a>
            <a href="#how-it-works"><GhostButton className="w-full sm:w-auto">See how it works</GhostButton></a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="mt-5 text-sm font-medium text-charcoal-muted"
          >
            From ₹1,500 · personalised name tag & shipping included · pan-India
          </motion.p>
        </div>
        <TiltCard />
      </div>
      {/* 3D ring of the collection — ThreeUI Volta-style */}
      <div className="relative z-10 pb-16 pt-4">
        <Cylinder
          items={RING_IMAGES}
          itemWidth={180}
          itemHeight={210}
          ariaLabel="DIKOR collection preview"
          render={(it, i, active) => (
            <div className="h-full w-full overflow-hidden rounded-3xl border border-gold/30 bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.label} className="h-full w-full object-cover" loading="lazy" draggable={false} />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light backdrop-blur">
                {it.label}
              </span>
            </div>
          )}
        />
      </div>
    </section>
  );
}

/* ---------- category editorial rows (NOT a card grid, NOT bento) ---------- */
function CategoryRows() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="What we craft"
          title={<>Made for the moments <em className="text-rosegold-dark">you treasure</em></>}
          sub="Five keepsake families, one promise: hand-finished from your photos, approved by you before dispatch."
        />
      </Reveal>
      <div className="space-y-16 md:space-y-24">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.key}>
            <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className={`overflow-hidden rounded-[2.5rem] shadow-soft ${i % 2 ? "md:order-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={`${c.key} figurine by DIKOR`} className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
              </div>
              <div className={i % 2 ? "md:order-1" : ""}>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
                  <Sparkle className="h-3.5 w-3.5 text-gold" /> {c.key}
                </p>
                <h3 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">{c.tagline}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-charcoal-muted">{c.copy}</p>
                <p className="mt-4 text-sm">
                  <span className="font-display text-2xl text-gold-dark">{c.fromPrice}</span>
                  {!c.priceConfirmed && <span className="ml-2 text-xs text-charcoal-muted">· exact price confirmed on WhatsApp</span>}
                </p>
                <Link href="/order" className="mt-6 inline-block">
                  <GoldButton>{c.cta}</GoldButton>
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- reviews: 3D cylinder + real highlight reviews ---------- */
function Reviews() {
  return (
    <section className="bg-blush/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Customer love"
            title={<>Real keepsakes, <em className="text-rosegold-dark">real reactions</em></>}
            sub={`${REVIEWS.length} ${AGGREGATE.reviewNote}. Delivered to ${AGGREGATE.deliveredCities.join(", ")} — and counting.`}
          />
        </Reveal>
        <Cylinder
          items={REVIEWS}
          itemWidth={300}
          itemHeight={400}
          ariaLabel="Customer reviews"
          render={(r, i, active) => {
            // Longer verbatim quotes get smaller type so every card fits its frame.
            const quoteSize = r.quote.length > 220 ? "text-base" : r.quote.length > 140 ? "text-lg" : "text-xl";
            return (
              <div className="flex h-full w-full flex-col justify-between rounded-[2rem] border border-gold/30 bg-white p-7 shadow-card">
                <div>
                  {r.stars && (
                    <p className="text-lg tracking-wider text-gold" aria-label="5 star review">★★★★★</p>
                  )}
                  <p className={`mt-3 font-display ${quoteSize} leading-snug text-charcoal`}>“{r.quote}”</p>
                </div>
                <div className="mt-5 border-t border-charcoal/10 pt-4">
                  <p className="text-sm font-semibold text-charcoal">{r.context}</p>
                  <p className="mt-0.5 text-xs text-charcoal-muted">
                    {r.handle ? `@${r.handle} · ${r.date}` : `Reviews highlight · ${r.date}`}
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Reveal className="mt-10 text-center">
          <a href="https://www.instagram.com/dikor_in/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-rosegold-dark underline">
            See more on {INSTAGRAM_HANDLE} — including our Reviews highlight
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- makers ---------- */
function Makers() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-[2.5rem] shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/process-painting.webp" alt="DIKOR artists hand-painting a 3D-printed figurine" className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> The makers
          </p>
          <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            A small studio with <em className="text-rosegold-dark">big love</em> for detail.
          </h2>
          <p className="mt-4 leading-relaxed text-charcoal-muted">
            DIKOR is run by <strong className="text-charcoal">@sainirajatrs</strong> and <strong className="text-charcoal">@sheetal__83</strong> —
            two makers who believe a gift should feel like the person it&apos;s for. Every piece is printed,
            painted and packed by hand, and a share of early orders went to Rahaat Foundation for strays.
          </p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="mt-6 inline-block">
            <GhostButton>Say hello on WhatsApp</GhostButton>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- sticky mobile buy bar ---------- */
function StickyBuyBar({ summary }: { summary: BuilderSummary }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 750);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-gold/40 bg-cream/95 py-2.5 pl-5 pr-2.5 shadow-soft backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-charcoal">{summary.category} · {summary.size}</p>
          <p className="text-xs text-gold-dark font-bold">{summary.price}</p>
        </div>
        <a href="#order" className="shrink-0 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold">
          Start order
        </a>
      </div>
    </div>
  );
}

const TRUST_ITEMS = [
  "✓ Verified Instagram — @dikor_in",
  "Pet reels up to 5.9M views",
  "Personalised name tag included",
  "Shipping across India included",
  "75% advance · 25% before shipping",
  "Approval photos before dispatch",
];

export default function HomePage() {
  const [summary, setSummary] = useState<BuilderSummary>({ category: "Pets", size: '5" · Slim breeds', price: "₹1,500" });

  return (
    <>
      <Hero />
      <Marquee items={TRUST_ITEMS} />

      <CategoryRows />

      {/* order builder */}
      <section id="order" className="scroll-mt-24 bg-cream-dark/50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Your custom order"
              title={<>Build your <em className="text-rosegold-dark">keepsake</em> in 2 minutes</>}
              sub="Five short steps. You always see the total and the 75/25 split before paying anything."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <OrderBuilder onConfig={setSummary} />
          </Reveal>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white/70 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
            <ul className="mt-2 grid gap-1.5 text-sm text-charcoal-soft sm:grid-cols-2">
              {INCLUDED_ALWAYS.map((t) => <li key={t} className="flex gap-2"><span className="text-gold">✦</span>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* proof: before / after */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="The proof"
            title={<>From photo <em className="text-rosegold-dark">to figurine</em></>}
            sub="One clear photo is all it takes. Drag the handle to compare."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <BeforeAfter />
        </Reveal>
      </section>

      <HowItWorksSection />

      <Reviews />

      <Makers />

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title={<>Everything you&apos;re <em className="text-rosegold-dark">wondering</em></>}
            sub="Straight answers — no fine print."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion />
        </Reveal>
      </section>

      {/* final CTA */}
      <section className="bg-charcoal py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
              <Sparkle className="h-3.5 w-3.5" /> Ready when you are <Sparkle className="h-3.5 w-3.5" />
            </p>
            <h2 className="mt-4 font-display text-4xl text-cream md:text-5xl">Your memories, <em className="text-shimmer not-italic">held forever</em>.</h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/60">4–5 photos. 75% advance. An approval video before anything ships. That&apos;s the whole process.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#order"><GoldButton className="w-full sm:w-auto">Start your order</GoldButton></a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-light sm:w-auto">
                💬 WhatsApp us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyBuyBar summary={summary} />
    </>
  );
}
