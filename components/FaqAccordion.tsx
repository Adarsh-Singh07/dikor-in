"use client";
import { useState } from "react";
import { FAQS } from "@/lib/catalog";

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-charcoal/15 border-y border-charcoal/15">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-2">
            <button
              type="button"
              className="flex min-h-[48px] w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark rounded-lg px-2"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-serif text-lg sm:text-xl font-bold text-charcoal">{f.q}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-base transition-transform duration-300 ${
                  isOpen ? "rotate-45 border-charcoal bg-charcoal text-white" : "border-charcoal/20 text-charcoal"
                }`}
              >
                +
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-2 pb-5 text-sm sm:text-base leading-relaxed text-charcoal-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
