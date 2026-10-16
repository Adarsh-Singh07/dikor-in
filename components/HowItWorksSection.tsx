"use client";
import { useEffect, useRef, useState } from "react";
import { FLOW_STEPS } from "@/lib/catalog";
import { SectionHeading, Sparkle } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

/** Mobile: clean vertical stepper. */
function VerticalSteps() {
  return (
    <div className="mx-auto max-w-xl px-5 md:hidden">
      <ol className="relative space-y-2">
        {FLOW_STEPS.map((s) => (
          <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
            {s.n < FLOW_STEPS.length && (
              <span className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-px bg-gold/50" />
            )}
            <span className="z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-display text-2xl text-charcoal shadow-gold">
              {s.n}
            </span>
            <div className="pt-1">
              <h3 className="font-display text-2xl text-charcoal">{s.title}</h3>
              <p className="mt-1 text-charcoal-muted">{s.copy}</p>
              {s.eta && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
                  ⏱ {s.eta}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Desktop: pinned horizontal scroll — one tall section, content travels sideways. */
function HorizontalScroll() {
  const outer = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = outer.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const n = FLOW_STEPS.length;
  const shift = progress * 100 * (n - 1);

  return (
    <div ref={outer} className="relative hidden h-[380vh] md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8">
          <SectionHeading
            eyebrow="How it works"
            title={<>Five steps to your <em className="text-rosegold-dark">keepsake</em></>}
            sub="Scroll — the journey moves sideways. One promise runs through it: you approve everything before it ships."
          />
        </div>
        <div
          className="flex w-max gap-8 px-[8vw] will-change-transform"
          style={{ transform: `translateX(calc(-${shift} * (100vw / ${n})))` }}
        >
          {FLOW_STEPS.map((s) => (
            <article
              key={s.n}
              className="flex w-[68vw] max-w-[560px] shrink-0 flex-col justify-between rounded-[2rem] border border-gold/25 bg-white/80 p-10 shadow-card backdrop-blur"
            >
              <div>
                <p className="font-display text-7xl text-gold/40">0{s.n}</p>
                <h3 className="mt-4 font-display text-4xl text-charcoal">{s.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-charcoal-muted">{s.copy}</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                {s.eta ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
                    ⏱ {s.eta}
                  </span>
                ) : <span />}
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-muted">
                  <Sparkle className="h-3.5 w-3.5 text-gold" /> Step {s.n} of {n}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 w-48">
          <div className="h-1 overflow-hidden rounded-full bg-charcoal/10">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-dark to-rosegold" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 md:py-0" aria-label="How it works">
      <div className="md:hidden">
        <Reveal className="px-5">
          <SectionHeading
            eyebrow="How it works"
            title={<>Five steps to your <em className="text-rosegold-dark">keepsake</em></>}
            sub="One promise runs through it all: you approve everything before it ships."
          />
        </Reveal>
        <VerticalSteps />
      </div>
      <HorizontalScroll />
    </section>
  );
}
