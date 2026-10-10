"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Artwork from "@/components/Artwork";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Marquee, Sparkle, DemoBadge } from "@/components/ui";
import { CATEGORIES, PIPELINE_STEPS, inr, type Category } from "@/lib/store";
import { PIECES, TESTIMONIALS } from "@/lib/catalog";
import { FINISHES, type FinishKey } from "@/lib/finishes";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

/* link-styled buttons (avoid nesting <button> inside <a>) */
const goldBtnCls =
  "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]";
const ghostBtnCls =
  "inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal backdrop-blur transition-all duration-300 hover:border-rosegold hover:text-rosegold-dark";

/* =========================================================
 * HERO — editorial headline + live 3D print + finish picker
 * ========================================================= */
function Hero() {
  const [finish, setFinish] = useState<FinishKey>("rosegold");
  const progress = useRef<HTMLSpanElement>(null);
  const active = FINISHES.find((f) => f.key === finish)!;

  return (
    <section className="min-h-hero relative overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,#F7E8E4_0%,#FAF5EC_55%,#F3EAD9_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.35]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 px-5 pb-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24">
        {/* copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark backdrop-blur"
          >
            <Sparkle className="h-3 w-3" /> Custom 3D-printed keepsakes <DemoBadge />
          </motion.p>

          <h1 className="font-display text-[2.6rem] leading-[1.02] text-charcoal sm:text-6xl xl:text-[5.2rem]">
            {["Your memories,", "printed in"].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: 0.1 + i * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-2">
              <motion.em
                className="text-shimmer block font-semibold not-italic"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.95, delay: 0.34, ease: EASE }}
              >
                gold &amp; grace.
              </motion.em>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-charcoal-muted sm:text-lg"
          >
            Pets, couples, little ones and deities — sculpted from your photos, printed at 0.08&nbsp;mm precision,
            hand-finished in our studio and approved by you on video before it ever ships.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Link href="/auth" className={`${goldBtnCls} w-full sm:w-auto`}>
              Start your custom order
            </Link>
            <Link href="/gallery" className={`${ghostBtnCls} w-full sm:w-auto`}>
              Explore collections
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-charcoal/10 pt-6"
          >
            {[
              ["0.08mm", "Print precision"],
              ["10–15", "Days to doorstep"],
              ["100%", "Video-approved"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl text-rosegold-dark sm:text-3xl">{v}</dd>
                <dd className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal-muted">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* 3D stage */}
        <div>
          <div className="relative mx-auto aspect-square w-full max-w-[520px] lg:aspect-[4/5]">
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#ffffff_0%,rgba(255,255,255,0)_70%)]" />
            <Hero3D finish={finish} progressRef={progress} />

            {/* live print status chip */}
            <div className="absolute left-2 top-4 flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/80 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal shadow-card backdrop-blur sm:left-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-dark" />
              </span>
              <span ref={progress}>Preparing print</span>
            </div>
            <div className="absolute right-2 top-4 hidden rounded-2xl border border-charcoal/10 bg-white/80 px-4 py-3 text-right shadow-card backdrop-blur sm:block sm:right-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">Layer height</p>
              <p className="font-display text-xl text-charcoal">0.08 mm</p>
            </div>

            {/* finish picker */}
            <div className="absolute inset-x-0 bottom-2 mx-auto w-fit max-w-full rounded-full border border-charcoal/10 bg-white/85 p-1.5 shadow-card backdrop-blur">
              <div role="radiogroup" aria-label="Choose a finish" className="flex items-center gap-1">
                {FINISHES.map((f) => (
                  <button
                    key={f.key}
                    role="radio"
                    aria-checked={finish === f.key}
                    aria-label={f.name}
                    title={f.name}
                    onClick={() => setFinish(f.key)}
                    className={`grid h-10 w-10 place-items-center rounded-full transition ${
                      finish === f.key ? "ring-2 ring-gold ring-offset-2 ring-offset-white" : "hover:scale-105"
                    }`}
                  >
                    <span className="h-7 w-7 rounded-full shadow-inner" style={{ background: f.swatch }} />
                  </button>
                ))}
                <span className="hidden whitespace-nowrap px-3 text-xs font-semibold text-charcoal-soft sm:inline">{active.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 * SHOP BY CATEGORY — circular tiles
 * ========================================================= */
function ShopByCategory() {
  return (
    <section id="collections" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by moment"
          title={<>Made for the moments <em className="text-rosegold-dark">you treasure</em></>}
          sub="Every piece starts from your photos and is hand-finished by our studio artists."
        />
      </Reveal>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.06} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
            <Link href="/gallery" className="group flex flex-col items-center text-center focus-visible:outline-none">
              <span className="relative block aspect-square w-full max-w-[200px] rounded-full p-1.5 transition-transform duration-500 group-hover:-translate-y-1.5">
                <span className="absolute inset-0 rounded-full border border-gold/40 transition-all duration-500 group-hover:scale-[1.04] group-hover:border-gold group-focus-visible:border-gold" />
                <span className="block h-full w-full overflow-hidden rounded-full shadow-card">
                  <Artwork category={c.key} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                </span>
              </span>
              <span className="mt-5 font-display text-2xl text-charcoal">{c.key}</span>
              <span className="mt-1 max-w-[16rem] text-sm text-charcoal-muted">{c.tagline}</span>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-dark">from {c.from}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 * PROCESS — 3 big steps (print-studio style)
 * ========================================================= */
const STEPS = [
  { n: "01", t: "Share your photos", d: "Upload 2–5 clear photos and tell us the size, pose and finish you love." },
  { n: "02", t: "Approve a video demo", d: "After a clear quote and 40% advance, we sculpt and send a video. Revisions included." },
  { n: "03", t: "Receive your keepsake", d: "Hand-finished, gift-boxed and shipped pan-India once you're delighted." },
];

function Process() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-cream md:py-28">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-rosegold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
                <Sparkle className="h-3.5 w-3.5" /> How it works
              </p>
              <h2 className="font-display text-4xl leading-tight md:text-6xl">
                From photo to keepsake, <em className="text-gold-light">beautifully simple.</em>
              </h2>
            </div>
            <p className="max-w-md text-cream/70 lg:justify-self-end">
              You see a clear price and timeline before paying anything, and you approve the finished piece on video before it ships.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] border border-cream/10 bg-white/[0.04] p-8 transition-colors duration-500 hover:border-gold/40 hover:bg-white/[0.07]">
                <span className="font-display text-7xl leading-none text-transparent [-webkit-text-stroke:1px_rgba(233,206,122,0.6)]">{s.n}</span>
                <h3 className="mt-6 font-display text-2xl text-cream">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/65">{s.d}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-rosegold-light transition-all duration-700 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8 text-xs uppercase tracking-[0.18em] text-cream/55">
          {PIPELINE_STEPS.map((p, i) => (
            <span key={p.key} className="flex items-center gap-2">
              <span className="text-gold-light">{String(i + 1).padStart(2, "0")}</span> {p.label}
            </span>
          ))}
          <Link href="/how-it-works" className="ml-auto font-semibold text-gold-light hover:text-gold">
            Full details →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
 * BESTSELLERS — tabbed product grid
 * ========================================================= */
const TABS: ("All" | Category)[] = ["All", "Pets", "Couples", "Idols", "Kids", "Decor"];

function Bestsellers() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const items = (tab === "All" ? PIECES : PIECES.filter((p) => p.category === tab)).slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
              <Sparkle className="h-3.5 w-3.5 text-gold" /> Most loved
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-5xl">
              Bestselling <em className="text-rosegold-dark">keepsakes</em>
            </h2>
          </div>
          <div role="tablist" aria-label="Filter by category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                  tab === t
                    ? "bg-charcoal text-cream shadow-card"
                    : "border border-charcoal/15 bg-white/60 text-charcoal-soft hover:border-rosegold hover:text-rosegold-dark"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <motion.div layout className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-card transition-shadow duration-500 hover:shadow-soft"
            >
              <div className="relative overflow-hidden">
                <Artwork category={p.category} title={p.title} className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-105" />
                {p.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-rosegold-dark shadow-card">
                    {p.tag}
                  </span>
                )}
                <div className="absolute inset-x-4 bottom-4 translate-y-0 opacity-100 transition-all duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                  <Link
                    href="/auth"
                    className="block rounded-full bg-charcoal/90 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cream backdrop-blur hover:bg-charcoal"
                  >
                    Customise this
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">{p.category}</p>
                <h3 className="mt-1.5 font-display text-xl leading-snug text-charcoal">{p.title}</h3>
                <p className="mt-1 text-sm text-charcoal-muted">{p.note}</p>
                <p className="mt-auto pt-4 text-sm font-semibold text-charcoal">
                  from <span className="text-rosegold-dark">{inr(p.from)}</span>
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <Reveal className="mt-12 text-center">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-rosegold-dark hover:text-rosegold">
          View the full gallery <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </section>
  );
}

/* =========================================================
 * BRAND STORY — editorial split
 * ========================================================= */
function Story() {
  return (
    <section className="bg-cream-dark/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative mx-auto max-w-lg">
            <div className="overflow-hidden rounded-t-[12rem] rounded-b-[2rem] shadow-soft">
              <Artwork category="Couples" title="Studio craftsmanship" className="aspect-[4/5] w-full" />
            </div>
            <div className="absolute -bottom-6 -right-2 w-40 overflow-hidden rounded-[1.5rem] border-4 border-cream shadow-soft sm:-right-8 sm:w-48">
              <Artwork category="Pets" title="Pet replica detail" className="aspect-square w-full" />
            </div>
            <div className="absolute -left-2 top-10 rounded-2xl bg-white px-5 py-4 shadow-card sm:-left-8">
              <p className="font-display text-3xl text-rosegold-dark">0.08mm</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">print precision</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> Our craft
          </p>
          <h2 className="font-display text-4xl leading-tight text-charcoal md:text-5xl">
            Technology prints it. <em className="text-rosegold-dark">Hands make it yours.</em>
          </h2>
          <p className="mt-6 leading-relaxed text-charcoal-muted">
            Every DIKOR keepsake begins as a digital sculpt shaped from your photographs. We print it in fine layers, then
            sand, prime and hand-paint each piece in our studio, so it looks less like a product and more like a memory.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Sculpted from your photos", "Pose, expression and markings, faithfully kept."],
              ["Premium finishes", "Rose gold, champagne, ivory matte or onyx satin."],
              ["Approve before shipping", "A video demo with revisions included."],
              ["Gift-ready packaging", "Pan-India delivery, safely boxed."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-[11px] text-charcoal">✓</span>
                <span>
                  <span className="block font-semibold text-charcoal">{t}</span>
                  <span className="block text-sm text-charcoal-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/how-it-works" className={ghostBtnCls}>
              Inside the studio
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
 * FINISHES — material library
 * ========================================================= */
function Finishes() {
  return (
    <section id="finishes" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Material library"
          title={<>Four finishes, <em className="text-rosegold-dark">endless stories</em></>}
          sub="Try them live on the sculpture at the top of the page, then choose your favourite when you order."
        />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FINISHES.map((f, i) => (
          <Reveal key={f.key} delay={i * 0.08}>
            <div className="group h-full rounded-[1.75rem] border border-charcoal/10 bg-white/70 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-soft">
              <span className="block aspect-[5/3] w-full rounded-2xl shadow-inner transition-transform duration-700 group-hover:scale-[1.02]" style={{ background: f.swatch }} />
              <h3 className="mt-5 font-display text-2xl text-charcoal">{f.name}</h3>
              <p className="mt-1 text-sm text-charcoal-muted">{f.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 * NUMBERS — animated counters
 * ========================================================= */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Numbers() {
  const items = [
    { to: 0.08, decimals: 2, suffix: "mm", l: "Layer precision" },
    { to: 40, suffix: "%", l: "Advance to begin" },
    { to: 15, suffix: " days", l: "Typical delivery" },
    { to: 100, suffix: "%", l: "Video-approved" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-gold/25 bg-gold/25 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.l} className="bg-cream px-6 py-10 text-center">
            <p className="font-display text-4xl text-charcoal md:text-5xl">
              <Counter to={it.to} suffix={it.suffix} decimals={it.decimals} />
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">{it.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 * TESTIMONIALS — auto-advancing, accessible
 * ========================================================= */
function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [paused, n]);
  const t = TESTIMONIALS[i];
  return (
    <section
      className="bg-gradient-to-b from-blush/60 to-cream py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> Kind words <Sparkle className="h-3.5 w-3.5 text-gold" />
          </p>
          <p className="mt-6 text-2xl tracking-[0.3em] text-gold" aria-label="5 out of 5 stars">★★★★★</p>
        </Reveal>
        <div className="relative mt-6 min-h-[15rem] sm:min-h-[12rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <blockquote className="font-display text-2xl leading-snug text-charcoal sm:text-3xl md:text-[2.2rem]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-charcoal-muted">
                <span className="font-semibold text-charcoal">{t.name}</span> · {t.place} · {t.piece}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setI((i - 1 + n) % n)}
            aria-label="Previous review"
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 bg-white/70 text-charcoal transition hover:border-rosegold hover:text-rosegold-dark"
          >
            ←
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Show review ${k + 1}`}
                aria-current={k === i}
                className="grid h-6 w-6 place-items-center"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-rosegold-dark" : "w-1.5 bg-charcoal/25"}`} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setI((i + 1) % n)}
            aria-label="Next review"
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 bg-white/70 text-charcoal transition hover:border-rosegold hover:text-rosegold-dark"
          >
            →
          </button>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-charcoal-muted/70">Illustrative reviews · demo content</p>
      </div>
    </section>
  );
}

/* =========================================================
 * INSTAGRAM
 * ========================================================= */
const INSTAGRAM_FEATURES: { category: Category; label: string; title: string; href: string }[] = [
  { category: "Decor", label: "Home decor", title: "Custom 3D-printed jewellery tray", href: "https://www.instagram.com/reel/DZo781Eo1oU/" },
  { category: "Couples", label: "Personalised gifts", title: "A miniature made from your favourite photo", href: "https://www.instagram.com/dikor_in/reel/DbsYFEFolkW/" },
  { category: "Pets", label: "Pet keepsakes", title: "A little lookalike for your best friend", href: "https://www.instagram.com/dikor_in/" },
];

function FromTheStudio() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
              <Sparkle className="h-3.5 w-3.5 text-gold" /> From the studio
            </p>
            <h2 className="font-display text-4xl text-charcoal md:text-5xl">Seen on Instagram</h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-[0.16em] text-rosegold-dark hover:text-rosegold">
            Follow @dikor_in ↗
          </a>
        </div>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {INSTAGRAM_FEATURES.map((item, k) => (
          <Reveal key={item.title} delay={k * 0.08}>
            <a href={item.href} target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-[1.75rem] shadow-card">
              <Artwork category={item.category} title={item.title} className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">{item.label}</p>
                <h3 className="mt-2 font-display text-2xl leading-snug text-cream">{item.title}</h3>
                <p className="mt-3 text-xs font-semibold text-cream/70">Watch on Instagram ↗</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
 * FAQ
 * ========================================================= */
const FAQS = [
  { q: "How is the price decided?", a: "Share your photos and tell us the size and finish you want. Our studio replies with a clear quotation — price plus delivery timeline — before you pay anything. Custom keepsakes start at ₹1,499; most pet replicas are ₹1,999–₹3,499." },
  { q: "How do payments work?", a: "A 40% advance green-lights your order. We craft your piece and share a video demo. Only after you approve do we finish production — the remaining 60% is paid when your keepsake is ready to ship." },
  { q: "What if I don't like the demo video?", a: "Revisions are included. Tell us what to tweak and we'll rework the piece and share a fresh demo. We ship only when you love it." },
  { q: "How long does it take?", a: "Most orders deliver in 10–15 days from advance payment, depending on size and finish. Your quotation always includes an exact timeline." },
  { q: "Do you ship across India?", a: "Yes — pan-India shipping with careful, gift-ready packaging. Shipping cost is included in your quote." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-cream-dark/50 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> Good to know
          </p>
          <h2 className="font-display text-4xl leading-tight text-charcoal md:text-5xl">
            Questions, <em className="text-rosegold-dark">answered</em>
          </h2>
          <p className="mt-4 max-w-sm text-charcoal-muted">Still curious? We usually reply on WhatsApp within studio hours.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={`${ghostBtnCls} mt-6`}>
            Ask on WhatsApp
          </a>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, k) => {
            const isOpen = open === k;
            return (
              <Reveal key={f.q} delay={k * 0.04}>
                <div className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-gold/50 bg-white shadow-card" : "border-charcoal/10 bg-white/60"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : k)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${k}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-xl text-charcoal">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-dark transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                      +
                    </span>
                  </button>
                  <div id={`faq-${k}`} className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 leading-relaxed text-charcoal-muted">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 * FINAL CTA
 * ========================================================= */
function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rosegold-dark via-rosegold to-gold-dark px-6 py-14 text-center text-cream shadow-soft sm:px-10 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gold-light/20 blur-2xl" />
          <Sparkle className="relative mx-auto h-6 w-6 text-gold-light" />
          <h2 className="relative mt-4 font-display text-4xl leading-tight md:text-6xl">Custom keepsakes from {inr(1499)}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-cream/85">
            Every piece is quoted individually. See a clear price and timeline first — start with just a 40% advance.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex w-full items-center justify-center rounded-full bg-cream px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-[1.03] sm:w-auto"
            >
              Get my free quote
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-cream/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-cream/10 sm:w-auto"
            >
              Chat on WhatsApp
            </a>
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
      <ShopByCategory />
      <Process />
      <Bestsellers />
      <Story />
      <Finishes />
      <Numbers />
      <Testimonials />
      <FromTheStudio />
      <Faq />
      <FinalCta />
    </>
  );
}
