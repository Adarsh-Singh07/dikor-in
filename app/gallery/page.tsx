"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Sparkle } from "@/components/ui";

const FILTERS = ["All", "Pets", "Couples", "Kids", "Religious", "Decor"] as const;

interface Piece { category: (typeof FILTERS)[number]; title: string; note: string; image: string; }

/** Real pieces — images from the DIKOR studio; captions echo @dikor_in's public posts. */
const PIECES: Piece[] = [
  { category: "Pets", title: "Hand-painted pet miniature", note: "5\" · with personalised name tag · from ₹1,500", image: "/images/hero-dog.webp" },
  { category: "Pets", title: "Pet minis, every breed", note: "Custom miniatures, delivered across India", image: "/images/pets-group.webp" },
  { category: "Couples", title: "A love in 3D", note: "Anniversary & wedding keepsakes", image: "/images/couple.webp" },
  { category: "Kids", title: "Mother & son keepsake", note: "Little moments, kept forever", image: "/images/kid.webp" },
  { category: "Religious", title: "Ganesha idol", note: "Hand-finished, devotional detail", image: "/images/ganesha.webp" },
  { category: "Decor", title: "Sculptural 3D vase", note: "Designed to elevate your space", image: "/images/decor.webp" },
  { category: "Decor", title: "Stackable jewelry tray", note: "Organize. Stack. Display.", image: "/images/decor.webp" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="The gallery"
          title={<>Keepsakes with <em className="text-rosegold-dark">a heartbeat</em></>}
          sub="Every piece below began as a customer's photograph — pets like Chivas (Mumbai) and Daisy (New Delhi), a Radha Krishna shipped to Assam, a custom piece all the way to Kanpur. Yours could be next."
        />
      </Reveal>
      <Reveal className="mb-10 flex flex-wrap justify-center gap-3">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`min-h-[2.75rem] rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
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
          <Reveal key={`${p.title}-${i}`} delay={(i % 3) * 0.08}>
            <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
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
        From @dikor_in — see the full collection on Instagram
      </p>
    </div>
  );
}
