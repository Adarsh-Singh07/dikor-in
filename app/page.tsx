"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";
import Artwork from "@/components/Artwork";
import { Reveal, FadeIn } from "@/components/Reveal";
import { SectionHeading, Marquee, Sparkle, GoldButton, GhostButton, DemoBadge } from "@/components/ui";
import { CATEGORIES, PIPELINE_STEPS } from "@/lib/store";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden />,
});

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* warm gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,#F7E8E4_0%,#FAF5EC_55%,#F3EAD9_100%)]" />
      <Hero3D />
      <div className="hero-vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-20 md:grid-cols-2 md:px-8">
        <div className="flex flex-col justify-center">
          <FadeIn>
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark backdrop-blur">
              <Sparkle className="h-3 w-3" /> Custom 3D-printed gifting studio <DemoBadge />
            </p>
          </FadeIn>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-[1.05] text-charcoal md:text-7xl"
          >
            Turn your favourite photo into a <em className="text-shimmer not-italic font-semibold">keepsake</em>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-charcoal-muted"
          >
            Hand-finished 3D figurines of your pets, your people, your deities — crafted from your photos,
            reviewed by you on video, shipped across India.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link href="/auth">
              <GoldButton>Start your custom order</GoldButton>
            </Link>
            <Link href="/how-it-works">
              <GhostButton>See how it works</GhostButton>
            </Link>
          </motion.div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-charcoal/10 pt-6">
            {[
              ["01", "Made to order"],
              ["02", "You approve the demo"],
              ["03", "Clear quote first"],
            ].map(([n, label]) => (
              <div key={n}>
                <p className="font-display text-xl text-rosegold-dark">{n}</p>
                <p className="mt-1 text-[11px] font-medium leading-snug text-charcoal-muted sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* right column intentionally breathes — the 3D sculpture lives behind */}
        <div className="hidden md:block" />
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-charcoal-muted"
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
      </motion.div>
    </section>
  );
}

/* ---------------- CATEGORIES ---------------- */
function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="What we craft"
          title={<>Made for the moments <em className="text-rosegold-dark">you treasure</em></>}
          sub="Every piece starts from your photos and is hand-finished by our studio artists."
        />
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.08}>
            <Link
              href="/gallery"
              className="group block overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft"
            >
              <div className="overflow-hidden">
                <Artwork
                  category={c.key}
                  className="aspect-square w-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-charcoal">{c.key}</h3>
                <p className="mt-1 text-sm text-charcoal-muted">{c.tagline}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">from {c.from}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FEATURED WORK ---------------- */
const FEATURED = [
  { category: "Pets" as const, title: "Custom pet figurine", note: "A keepsake shaped from your photos" },
  { category: "Couples" as const, title: "Couple miniature", note: "Made for anniversaries and weddings" },
  { category: "Idols" as const, title: "Devotional figurine", note: "Personalised size and finish" },
  { category: "Kids" as const, title: "Little moments, made tangible", note: "A custom piece for a milestone" },
];

function FeaturedWork() {
  return (
    <section className="bg-cream-dark/60 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Featured work"
            title={<>Fresh from the <em className="text-rosegold-dark">studio</em></>}
            sub="Illustrative concepts only. Visit the studio&apos;s Instagram to see real pieces and process videos."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft">
                <div className="relative overflow-hidden">
                  <Artwork category={f.category} title={f.title} className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light backdrop-blur">
                    {f.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-charcoal">{f.title}</h3>
                  <p className="mt-1 text-sm text-charcoal-muted">{f.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-rosegold-dark hover:text-rosegold">
            View full gallery <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS (5 steps) ---------------- */
function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="The DIKOR process"
          title={<>From photo to keepsake, <em className="text-rosegold-dark">in five steps</em></>}
          sub="Transparent at every stage — you approve the video demo before anything ships."
        />
      </Reveal>
      <div className="relative grid gap-6 md:grid-cols-5">
        <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent md:block" />
        {PIPELINE_STEPS.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.1}>
            <div className="relative rounded-3xl border border-gold/25 bg-white/70 p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft">
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-display text-2xl text-charcoal shadow-gold">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl leading-snug text-charcoal">{s.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{s.blurb}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-rosegold-dark hover:text-rosegold">
          Full details <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </section>
  );
}

/* ---------------- FROM THE STUDIO ---------------- */
const INSTAGRAM_FEATURES = [
  {
    category: "HOME DECOR",
    title: "Custom 3D-printed jewellery tray",
    href: "https://www.instagram.com/reel/DZo781Eo1oU/",
    tone: "from-[#ead9d2] to-[#f5eadc]",
  },
  {
    category: "PERSONALISED GIFTS",
    title: "A miniature made from your favourite photo",
    href: "https://www.instagram.com/dikor_in/reel/DbsYFEFolkW/",
    tone: "from-[#e2d5c6] to-[#f0e4d9]",
  },
  {
    category: "PET KEEPSAKES",
    title: "A little 3D-printed lookalike for your best friend",
    href: "https://www.instagram.com/dikor_in/",
    tone: "from-[#d9ded1] to-[#eee8d8]",
  },
];

function FromTheStudio() {
  return (
    <section className="bg-charcoal py-24 text-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
                <Sparkle className="h-3.5 w-3.5" /> From the studio
              </p>
              <h2 className="font-display text-4xl md:text-5xl">Made by DIKOR, seen on Instagram.</h2>
              <p className="mt-4 max-w-2xl text-cream/70">Concept thumbnails below link to Dikor&apos;s real Instagram posts—watch finished prints and the making process there.</p>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold text-gold-light underline-offset-4 hover:underline">
              Follow @dikor_in <span aria-hidden>↗</span>
            </a>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {INSTAGRAM_FEATURES.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <a href={item.href} target="_blank" rel="noreferrer" className="group block h-full overflow-hidden rounded-3xl border border-cream/10 bg-white/[0.04] transition-transform duration-300 hover:-translate-y-1">
                <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br ${item.tone}`}>
                  <Artwork category={index === 0 ? "Decor" : index === 1 ? "Couples" : "Pets"} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-cream backdrop-blur">CONCEPT ILLUSTRATION</span>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-cream text-charcoal transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold-light">{item.category}</p>
                  <h3 className="mt-2 font-display text-xl text-cream">{item.title}</h3>
                  <p className="mt-3 text-xs font-semibold text-cream/60">Watch on Instagram ↗</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AUDIENCES ---------------- */
const AUDIENCES = [
  { t: "Pet parents", d: "Immortalise your furry family member in miniature." },
  { t: "Weddings & anniversaries", d: "Couple keepsakes guests will remember." },
  { t: "Festive gifting", d: "Diwali, housewarmings, birthdays — thoughtful & personal." },
  { t: "Devotees & decor lovers", d: "Idols and showpieces for warm, sacred spaces." },
];

function Audiences() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="Who it's for" title={<>Made for <em className="text-rosegold-dark">your people</em></>} />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.t} delay={i * 0.08}>
            <div className="h-full rounded-3xl bg-gradient-to-br from-blush to-cream-dark p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft">
              <Sparkle className="h-5 w-5 text-gold-dark" />
              <h3 className="mt-4 font-display text-2xl text-charcoal">{a.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{a.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PRICING HINT ---------------- */
function PricingHint() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rosegold-dark via-rosegold to-gold-dark p-10 text-center text-cream shadow-soft md:p-14">
          <Sparkle className="mx-auto h-6 w-6 text-gold-light" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Custom keepsakes from ₹1,499</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/85">
            Every piece is quoted individually — you always see a clear price and timeline before paying anything.
            Advance is just 40% to begin.
          </p>
          <Link href="/auth" className="mt-8 inline-block">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-105">
              Get my free quote
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  { q: "How is the price decided?", a: "Share your photos and tell us the size and finish you want. Our studio replies with a clear quotation — price plus delivery timeline — before you pay anything. Custom keepsakes start at ₹1,499; most pet replicas are ₹1,999–₹3,499." },
  { q: "How do payments work?", a: "A 40% advance green-lights your order. We craft your piece and share a video demo. Only after you approve do we finish production — the remaining 60% is paid when your keepsake is ready to ship." },
  { q: "What if I don't like the demo video?", a: "Revisions are included. Tell us what to tweak and we'll rework the piece and share a fresh demo. We ship only when you love it." },
  { q: "How long does it take?", a: "Most orders deliver in 10–15 days from advance payment, depending on size and finish. Your quotation always includes an exact timeline." },
  { q: "Do you ship across India?", a: "Yes — pan-India shipping with careful, gift-ready packaging. Shipping cost is included in your quote." },
  { q: "What photos should I share?", a: "Clear, well-lit photos from a couple of angles work best. The more detail we can see — markings, colours, expressions — the more lifelike your keepsake." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="Good to know" title={<>Questions, <em className="text-rosegold-dark">answered</em></>} />
      </Reveal>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <div className={`overflow-hidden rounded-2xl border transition-colors ${open === i ? "border-gold/50 bg-white shadow-card" : "border-charcoal/10 bg-white/60"}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-display text-xl text-charcoal">{f.q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-dark transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-charcoal-muted leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CONTACT CTA ---------------- */
function ContactCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
      <Reveal>
        <div className="grid gap-8 rounded-[2.5rem] bg-cream-dark p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">Say hello</p>
            <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">Let&apos;s make something <em className="text-rosegold-dark">unforgettable</em>.</h2>
            <p className="mt-4 text-charcoal-muted">Prefer chatting first? Message us — we reply within studio hours.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <GoldButton>💬 WhatsApp us</GoldButton>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                <GhostButton>Instagram @dikor_in</GhostButton>
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-white/70 p-8 shadow-card">
            <h3 className="font-display text-2xl text-charcoal">Start online instead</h3>
            <p className="mt-2 text-sm text-charcoal-muted">Create an account, upload photos, and track your keepsake from demo to doorstep.</p>
            <Link href="/auth" className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-rosegold-dark hover:text-rosegold">
              Create free account <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={["Pet replicas", "Couple miniatures", "Sacred idols", "Kid keepsakes", "Home decor", "Made with precision"]} />
      <Categories />
      <FeaturedWork />
      <HowItWorks />
      <FromTheStudio />
      <Audiences />
      <PricingHint />
      <Faq />
      <ContactCta />
    </>
  );
}
