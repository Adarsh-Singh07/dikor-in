"use client";
import { useEffect, useRef, useState } from "react";
import { FLOW_STEPS } from "@/lib/catalog";
import { SectionHeading } from "@/components/ui";

/** Mobile: clean vertical stepper. Numbers mark a genuine sequence — kept. */
function VerticalSteps() {
  return (
    <div className="mx-auto max-w-xl px-5 md:hidden">
      <ol className="relative space-y-4">
        {FLOW_STEPS.map((s) => (
          <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
            {s.n < FLOW_STEPS.length && (
              <span className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-px bg-charcoal/20" />
            )}
            <span className="z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold font-display text-2xl text-charcoal">
              {s.n}
            </span>
            <div className="pt-1">
              <h3 className="font-serif font-bold text-2xl text-charcoal">{s.title}</h3>
              <p className="mt-1 text-sm text-charcoal-muted leading-relaxed">{s.copy}</p>
              {s.eta && (
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
                  {s.eta}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Desktop: pinned horizontal scroll — one tall section, content travels sideways.
   Scroll-linked (moves only when the user scrolls), not ambient motion. */
function HorizontalScroll() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  /* How far the track must travel so the LAST card ends flush with the
     viewport's right edge: track width minus viewport width, measured live.
     (The old formula multiplied the shift by 100 twice, flinging the row
     thousands of vw off-screen at even 2% progress — the cards were invisible
     for the whole section. Fixed 2026-11-25.) */
  const [maxShift, setMaxShift] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setMaxShift(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = FLOW_STEPS.length;
  const shiftPx = progress * maxShift;

  return (
    <div ref={outer} className="relative hidden h-[380vh] md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8">
          <SectionHeading
            title="Five steps to your keepsake"
            sub="Scroll — the journey moves sideways. One promise runs through it: you approve everything before it ships."
          />
        </div>
        <div
          ref={track}
          className="flex w-max gap-8 px-[8vw] will-change-transform"
          style={{ transform: `translateX(${-shiftPx}px)` }}
        >
          {FLOW_STEPS.map((s) => (
            <article
              key={s.n}
              className="flex w-[68vw] max-w-[560px] shrink-0 flex-col justify-between border-t border-charcoal/15 pt-8"
            >
              <div>
                <h3 className="font-display text-4xl text-charcoal">{s.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-charcoal-muted">{s.copy}</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                {s.eta ? (
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">
                    {s.eta}
                  </span>
                ) : <span />}
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-muted">
                  Step {s.n} of {n}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 w-48">
          <div className="h-1 overflow-hidden rounded-full bg-charcoal/10">
            <div className="h-full rounded-full bg-gold" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 md:py-0">
      <div className="md:hidden">
        <div className="px-5">
          <SectionHeading
            title="Five steps to your keepsake"
            sub="One promise runs through it all: you approve everything before it ships."
          />
        </div>
        <VerticalSteps />
      </div>
      <HorizontalScroll />
    </section>
  );
}
