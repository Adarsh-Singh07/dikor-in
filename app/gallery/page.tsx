"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Sparkle } from "@/components/ui";

const FILTERS = ["All", "Pets", "Couples", "Kids", "Religious", "Decor"] as const;

interface Piece {
  category: (typeof FILTERS)[number];
  title: string;
  note: string;
  image: string;
}

/** Real pieces — images from the DIKOR studio and curated showcases */
const PIECES: Piece[] = [
  { category: "Pets", title: "Hand-Painted Golden Miniature", note: "5\" · with personalised brass plaque · from ₹1,500", image: "/images/hero-dog.webp" },
  { category: "Pets", title: "Sculpted Pet Silhouette", note: "Handcrafted likeness with natural markings", image: "/images/dog-figurine.jpg" },
  { category: "Pets", title: "Persian & Indie Cat Miniatures", note: "Satin acrylic hand-finish & glass eyes", image: "/images/cat-figurine.jpg" },
  { category: "Pets", title: "Pet Minis, Every Breed", note: "Custom miniatures, delivered across India", image: "/images/pets-group.webp" },
  { category: "Couples", title: "A Love in 3D Miniature", note: "Anniversary & wedding keepsakes with custom attire", image: "/images/couple.webp" },
  { category: "Couples", title: "Handcrafted Couple Plinth", note: "Dual-figure sculpted wedding keepsake", image: "/images/couple-figurine.jpg" },
  { category: "Kids", title: "Mother & Son Keepsake", note: "Little moments, kept forever in fine resin", image: "/images/kid.webp" },
  { category: "Religious", title: "Ganesha & Devotional Idols", note: "Hand-finished antique gold, rich devotional detail", image: "/images/ganesha.webp" },
  { category: "Decor", title: "Sculptural 3D Architectural Vase", note: "Designed to elevate warm modern spaces", image: "/images/decor.webp" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="The DIKOR Gallery"
          title={<>Keepsakes with <em className="text-rosegold-dark">a heartbeat</em></>}
          sub="Every piece below began as a customer's photograph — pets like Chivas (Mumbai), Dido and Babu, a Radha Krishna shipped to Assam, custom couples across India. Yours could be next."
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
            <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-card border border-charcoal/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-soft">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light backdrop-blur">
                  <Sparkle className="h-3 w-3" /> {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl text-charcoal font-bold">{p.title}</h3>
                <p className="mt-1 text-xs text-charcoal-muted leading-relaxed">{p.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">
        From @dikor_in &bull; Explore reels and highlights on Instagram
      </p>
    </div>
  );
}
