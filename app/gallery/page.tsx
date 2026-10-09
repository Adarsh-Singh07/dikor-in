"use client";
import { useState } from "react";
import Artwork from "@/components/Artwork";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Sparkle } from "@/components/ui";
import type { Category } from "@/lib/store";

const ALL: Category[] = ["Pets", "Couples", "Kids", "Idols", "Decor"];

const PIECES: { category: Category; title: string; note: string }[] = [
  { category: "Pets", title: "Gappu — Golden Retriever", note: "4\" hand-painted replica" },
  { category: "Pets", title: "Casper — Indie Pup", note: "Sitting pose, name base" },
  { category: "Pets", title: "Dido — Beagle", note: "Beside his framed photo" },
  { category: "Couples", title: "Aarav & Meera", note: "First-anniversary miniature" },
  { category: "Couples", title: "Wedding Day Duo", note: "Bride & groom keepsake" },
  { category: "Kids", title: "Little Aarush", note: "First-birthday keepsake" },
  { category: "Kids", title: "Saanvi's Giggle", note: "Playful pose miniature" },
  { category: "Idols", title: "Radha Krishna", note: "6\" antique gold finish" },
  { category: "Idols", title: "Blessing Ganesha", note: "Festive centrepiece" },
  { category: "Decor", title: "Bloom Vase Set", note: "Custom showpiece trio" },
  { category: "Decor", title: "Nameplate — Sharma Villa", note: "Hand-finished entryway piece" },
  { category: "Decor", title: "Milestone '10 Orders'", note: "Studio celebration piece" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="The gallery"
          title={<>Keepsakes with <em className="text-rosegold-dark">a heartbeat</em></>}
          sub="Every piece below began as a customer's photograph. Yours could be next."
        />
      </Reveal>
      <Reveal className="mb-10 flex flex-wrap justify-center gap-3">
        {(["All", ...ALL] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
              filter === c
                ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-charcoal shadow-gold"
                : "border border-charcoal/15 bg-white/60 text-charcoal-soft hover:border-rosegold hover:text-rosegold-dark"
            }`}
          >
            {c}
          </button>
        ))}
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.08}>
            <div className="group overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft">
              <div className="relative overflow-hidden">
                <Artwork category={p.category} title={p.title} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light backdrop-blur">
                  <Sparkle className="h-3 w-3" /> {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-charcoal">{p.title}</h3>
                <p className="mt-1 text-sm text-charcoal-muted">{p.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">
        Artwork shown is illustrative — real pieces are crafted from your photos
      </p>
    </div>
  );
}
