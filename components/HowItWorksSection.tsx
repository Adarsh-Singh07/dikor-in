"use client";
import { useEffect, useRef, useState } from "react";
import { FLOW_STEPS } from "@/lib/catalog";
import { SectionHeading } from "@/components/ui";

/** Mobile: clean vertical stepper with 44px tap targets. */
function VerticalSteps() {
  return (
    <div className="mx-auto max-w-xl px-5 md:hidden">
      <ol className="relative space-y-4">
        {FLOW_STEPS.map((s) => (
          <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
            {s.n < FLOW_STEPS.length && (
              <span className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-px bg-charcoal/20" />
            )}
            <span className="z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#E2CA76] font-serif font-bold text-2xl text-charcoal shadow-gold">
              {s.n}
            </span>
            <div className="pt-1">
              <h3 className="font-serif font-bold text-2xl text-charcoal">{s.title}</h3>
              <p className="mt-1 text-sm text-charcoal-muted leading-relaxed">{s.copy}</p>
              {s.eta && (
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rosegold-dark border border-rosegold/30">
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

/** Desktop: pinned horizontal scroll: one tall section, content travels sideways. */
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = FLOW_STEPS.length;
  const shift = progress * 100 * (n - 1);

  return (
    <div ref={outer} className="relative hidden h-[380vh] md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8">
          <SectionHeading
            eyebrow="Craft Workflow"
            title={<>Five steps to your <span className="text-rosegold-dark italic font-normal">heirloom</span></>}
            sub="Scroll: the journey moves sideways. One promise runs through it: you approve everything before it ships."
          />
        </div>
        <div
          className="flex w-max gap-8 px-[8vw] will-change-transform"
          style={{ transform: `translateX(calc(-${shift} * (100vw / ${n})))` }}
        >
          {FLOW_STEPS.map((s) => (
            <article
              key={s.n}
              className="flex w-[68vw] max-w-[560px] shrink-0 flex-col justify-between rounded-3xl border border-charcoal/15 bg-white p-10 shadow-card"
            >
              <div>
                <p className="font-serif text-6xl text-gold-dark/40 font-bold">0{s.n}</p>
                <h3 className="mt-4 font-serif text-3xl text-charcoal font-bold">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-charcoal-muted">{s.copy}</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                {s.eta ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rosegold-dark border border-rosegold/30">
                    ⏱ {s.eta}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-muted">
                  Step {s.n} of {n}
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 w-48">
          <div className="h-1.5 overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-dark to-rosegold-dark"
              style={{ width: `${(progress * 100).toFixed(1)}%` }}
            />
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
        <SectionHeading
          eyebrow="Craft Workflow"
          title={<>Five steps to your <span className="text-rosegold-dark italic font-normal">heirloom</span></>}
          sub="One promise runs through it: you inspect and approve everything before it leaves our studio."
        />
        <VerticalSteps />
      </div>
      <HorizontalScroll />
    </section>
  );
}
