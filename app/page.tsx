"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Marquee, GoldButton, GhostButton } from "@/components/ui";
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

/* ---------- Tactile Atelier Showcase Plinth ---------- */
function StudioPlinthCard() {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-md"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${-t.y * 6}deg) rotateY(${t.x * 8}deg)`,
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
      >
        {/* Physical Drop Shadow Base */}
        <div className="relative overflow-hidden rounded-3xl border border-charcoal/15 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.12)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-dog.webp"
            alt="Hand-painted DIKOR custom 3D pet figurine on wood plinth"
            className="aspect-[4/5] w-full object-cover"
            fetchPriority="high"
          />
          <div className="border-t border-charcoal/10 bg-[#FAF7F2] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-bold text-charcoal">Pet Miniature &bull; 5 Inch</p>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Hand-painted acrylic &bull; personalised brass plaque included
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-serif text-2xl font-bold text-charcoal">₹1,500</span>
                <span className="block text-[10px] uppercase tracking-wider text-rosegold-dark font-semibold">
                  All-Inclusive
                </span>
              </div>
            </div>

            {/* Atelier Craft Highlights */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-charcoal/10 pt-3 text-[11px] font-medium text-charcoal-soft">
              <span className="flex items-center gap-1.5">
                <span className="text-gold-dark">✓</span> Precision 3D resin print
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold-dark">✓</span> 360° approval video proof
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold-dark">✓</span> 75% advance reservation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold-dark">✓</span> Free insured pan-India delivery
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Hero Section ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 bg-[#FAF7F2]">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-12 md:grid-cols-2 md:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-rosegold-dark"
          >
            Atelier Jalandhar &bull; Bespoke 3D Sculpting
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-charcoal"
          >
            Your pet, sculpted into a <span className="text-rosegold-dark italic font-normal">heirloom</span> 3D miniature.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-charcoal-muted"
          >
            Send 4-5 photos of your pet. Our studio artists precision 3D-sculpt each unique contour,
            hand-paint every fur marking with fine acrylic glazes, and share a 360° craft video proof
            for your approval before dispatch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex flex-col gap-3.5 sm:flex-row"
          >
            <a href="#order" className="w-full sm:w-auto">
              <GoldButton className="w-full sm:w-auto">Start Your Order</GoldButton>
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <GhostButton className="w-full sm:w-auto">Explore Craft Process</GhostButton>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-5 text-xs sm:text-sm font-medium text-charcoal-muted"
          >
            From ₹1,500 &bull; Personalised brass plaque &amp; pan-India courier included
          </motion.p>
        </div>

        <StudioPlinthCard />
      </div>

      {/* 3D Ring of the Collection */}
      <div className="relative z-10 pb-16 pt-6">
        <Cylinder
          items={RING_IMAGES}
          itemWidth={180}
          itemHeight={210}
          ariaLabel="DIKOR handcrafted collection preview"
          render={(it) => (
            <div className="h-full w-full overflow-hidden rounded-3xl border border-charcoal/15 bg-white shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt={it.label}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cream">
                {it.label}
              </span>
            </div>
          )}
        />
      </div>
    </section>
  );
}

/* ---------- Category Editorial Rows ---------- */
function CategoryRows() {
  const NUMBERS = ["01", "02", "03", "04", "05"];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Atelier Collections"
          title={<>Made for the moments <span className="text-rosegold-dark italic font-normal">you treasure</span></>}
          sub="Five bespoke keepsake families, one promise: hand-finished from your photos, approved by you before dispatch."
        />
      </Reveal>
      <div className="space-y-16 md:space-y-24">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.key}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                i % 2 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className={`overflow-hidden rounded-3xl border border-charcoal/10 shadow-soft ${i % 2 ? "md:order-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={`${c.key} miniature by DIKOR Atelier`}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className={i % 2 ? "md:order-1" : ""}>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-rosegold-dark">
                  {NUMBERS[i]} / {c.key.toUpperCase()}
                </p>
                <h3 className="mt-3 font-serif text-3xl md:text-4xl text-charcoal font-bold">{c.tagline}</h3>
                <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-charcoal-muted">{c.copy}</p>
                <p className="mt-4 text-sm">
                  <span className="font-serif text-2xl text-charcoal font-bold">{c.fromPrice}</span>
                  {!c.priceConfirmed && (
                    <span className="ml-2 text-xs text-charcoal-muted">&bull; confirmed on WhatsApp</span>
                  )}
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

/* ---------- Verified Customer Reviews ---------- */
function Reviews() {
  return (
    <section className="bg-blush/40 py-20 md:py-28 border-y border-rosegold/20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Verified Client Proof"
            title={<>Real keepsakes, <span className="text-rosegold-dark italic font-normal">real reactions</span></>}
            sub={`${REVIEWS.length} verbatim client reviews from our official Instagram archive (@dikor_in). Shipped to pet parents across ${AGGREGATE.deliveredCities.slice(0, 5).join(", ")} and beyond.`}
          />
        </Reveal>
        <Cylinder
          items={REVIEWS}
          itemWidth={300}
          itemHeight={400}
          ariaLabel="Customer reviews"
          render={(r) => {
            const quoteSize = r.quote.length > 220 ? "text-base" : r.quote.length > 140 ? "text-lg" : "text-xl";
            return (
              <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-charcoal/15 bg-white p-7 shadow-card">
                <div>
                  {r.stars && (
                    <p className="text-base tracking-widest text-[#D4AF37]" aria-label="5 star review">
                      ★★★★★
                    </p>
                  )}
                  <p className={`mt-3 font-serif ${quoteSize} leading-snug text-charcoal italic`}>
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-5 border-t border-charcoal/10 pt-4">
                  <p className="text-sm font-semibold text-charcoal">{r.context}</p>
                  <p className="mt-0.5 text-xs text-charcoal-muted">
                    {r.handle ? `@${r.handle} &bull; ${r.date}` : `Reviews highlight &bull; ${r.date}`}
                  </p>
                </div>
              </div>
            );
          }}
        />
        <Reveal className="mt-10 text-center">
          <a
            href="https://www.instagram.com/dikor_in/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-[0.16em] text-rosegold-dark hover:underline"
          >
            View More on {INSTAGRAM_HANDLE} &bull; Reviews Story Highlight →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- The Makers: Jalandhar Studio ---------- */
function Makers() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-charcoal/10 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/process-painting.webp"
              alt="DIKOR artists hand-painting a 3D-printed miniature in Jalandhar studio"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-rosegold-dark">
            Atelier Founders
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold leading-tight">
            A boutique studio with <span className="text-rosegold-dark italic font-normal">reverence</span> for every detail.
          </h2>
          <p className="mt-4 leading-relaxed text-charcoal-muted text-sm sm:text-base">
            DIKOR is founded and operated by <strong className="text-charcoal font-semibold">@sainirajatrs</strong> and <strong className="text-charcoal font-semibold">@sheetal__83</strong> in Jalandhar, Punjab. We believe keepsakes should carry the true spirit of the pet or loved one they honor.
          </p>
          <p className="mt-3 leading-relaxed text-charcoal-muted text-sm sm:text-base">
            Every piece is 3D-sculpted, precision-printed in premium resin, individually hand-painted with acrylic pigments, and packaged in a gift-ready wooden box before insured courier dispatch across India.
          </p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="mt-6 inline-block">
            <GhostButton>Connect With Our Artists</GhostButton>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Sticky Mobile Buy Bar ---------- */
function StickyBuyBar({ summary }: { summary: BuilderSummary }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 750);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-charcoal/20 bg-[#FAF7F2]/95 py-2.5 pl-5 pr-2.5 shadow-lg backdrop-blur-md">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-charcoal">{summary.category} &bull; {summary.size}</p>
          <p className="text-xs font-bold text-rosegold-dark">{summary.price}</p>
        </div>
        <a
          href="#order"
          className="shrink-0 flex min-h-[44px] items-center rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#E2CA76] px-5 text-xs font-bold uppercase tracking-[0.12em] text-charcoal shadow-gold"
        >
          Start Order
        </a>
      </div>
    </div>
  );
}

const TRUST_ITEMS = [
  "Official Instagram: @dikor_in",
  "Precision 3D Resin Sculpting",
  "Hand-Painted By Studio Artists in Jalandhar",
  "Personalised Engraved Brass Plaque Included",
  "Free Insured Pan-India Courier Delivery",
  "75% Advance Reservation : 25% Balance Post-Approval",
  "360° Craft Video Review Before Dispatch",
];

export default function HomePage() {
  const [summary, setSummary] = useState<BuilderSummary>({
    category: "Pets",
    size: '5" · Slim breeds',
    price: "₹1,500",
  });

  return (
    <>
      <Hero />
      <Marquee items={TRUST_ITEMS} />

      <CategoryRows />

      {/* Order Builder */}
      <section id="order" className="scroll-mt-24 bg-[#F5EFEB] py-20 md:py-28 border-y border-charcoal/10">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Custom Studio Builder"
              title={<>Design your <span className="text-rosegold-dark italic font-normal">3D keepsake</span></>}
              sub="Five clear steps with live 3D preview. You always see the total and the 75/25 split before paying anything."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <OrderBuilder onConfig={setSummary} />
          </Reveal>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-6 border border-charcoal/10 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold-dark">Always Included With Every Order</p>
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
      </section>

      {/* Proof: Before / After */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Artisan Fidelity"
            title={<>From photograph <span className="text-rosegold-dark italic font-normal">to physical figurine</span></>}
            sub="One clear reference photo is all it takes. Drag the handle to inspect the studio likeness."
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
            eyebrow="Atelier Answers"
            title={<>Frequently Asked <span className="text-rosegold-dark italic font-normal">Questions</span></>}
            sub="Straightforward details about sizing, pricing, craft timelines, and delivery."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion />
        </Reveal>
      </section>

      {/* Final Call to Action */}
      <section className="bg-charcoal py-20 md:py-24 border-t border-charcoal">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-light mb-3">
              Crafted To Order
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight">
              Your cherished memories, <span className="text-rosegold-dark italic font-normal">preserved in 3D</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70 text-sm sm:text-base leading-relaxed">
              4-5 reference photos. 75% advance reservation. A 360° craft video proof before anything ships. That is our entire process.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
              <a href="#order" className="w-full sm:w-auto">
                <GoldButton className="w-full sm:w-auto">Start Your Order</GoldButton>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-cream/30 px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-cream transition hover:border-gold-light hover:text-white sm:w-auto"
              >
                <span>💬</span> WhatsApp Atelier
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyBuyBar summary={summary} />
    </>
  );
}
