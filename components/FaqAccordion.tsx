"use client";
import { useState } from "react";
import { FAQS } from "@/lib/catalog";

/** Accessible accordion — a direct answer to Doppel's 12-card wall. */
export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`mb-3 overflow-hidden rounded-2xl border bg-white/80 shadow-card transition ${isOpen ? "border-gold/50" : "border-charcoal/10"}`}>
            <button
              className="flex min-h-[4rem] w-full items-center justify-between gap-4 px-6 py-4 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display text-xl text-charcoal md:text-2xl">{f.q}</span>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl transition-transform duration-300 ${isOpen ? "rotate-45 border-rosegold bg-rosegold text-cream" : "border-charcoal/15 text-charcoal"}`}>
                +
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-charcoal-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
