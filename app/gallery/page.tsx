"use client";
import { useState } from "react";
import { SectionHeading } from "@/components/ui";
import Cylinder from "@/components/Cylinder";

const FILTERS = ["All", "Pets", "Cats", "Kids", "Decor"] as const;

interface Piece { category: (typeof FILTERS)[number]; title: string; note: string; image: string; }

/** Real pieces from the DIKOR studio — upstream's eight, remapped to the
    Pets / Cats / Kids / Decor taxonomy, plus the decor pieces. */
const PIECES: Piece[] = [
  { category: "Pets", title: "Hand-painted Golden dog miniature", note: "5-inch on a walnut plinth, engraved brass name tag, from ₹1,500", image: "/images/hero-dog.webp" },
  { category: "Pets", title: "Sculpted Indie & Beagle likeness", note: "Printed from your phone photos, hand-detailed muzzle", image: "/images/dog-figurine.jpg" },
  { category: "Pets", title: "Studio pet minis collection", note: "Every breed, finished and ready to ship across India", image: "/images/pets-group.webp" },
  { category: "Pets", title: "Atelier hand-painting booth", note: "Acrylic highlights, applied coat by coat in Jalandhar", image: "/images/process-painting.webp" },
  { category: "Pets", title: "Client reference vs final figurine", note: "Our fidelity check — your photo against the finished piece", image: "/images/dog-real.webp" },
  { category: "Cats", title: "Persian & Indie cat miniature", note: "Hand-painted glazes, true eye colour and coat markings, from ₹1,500", image: "/images/cat-figurine-card.jpg" },
  { category: "Cats", title: "Fine detailing & acrylic glazing", note: "Close-up — feline markings, whiskers, natural colour", image: "/images/artisan-painting.jpg" },
  { category: "Kids", title: "Child milestone portrait miniature", note: "Sculpted in fine resin from front and side portraits", image: "/images/kid.webp" },
  { category: "Decor", title: "Sculptural 3D vase", note: "Printed to order, finished by hand", image: "/images/decor.webp" },
  { category: "Decor", title: "Stackable jewelry tray", note: "A tray for the things you reach for every day.", image: "/images/decor.webp" },
];

/** The collection ring — the gallery's one living moment (drag to spin). */
const RING_IMAGES = [
  { src: "/images/hero-dog.webp", label: "Pet miniature" },
  { src: "/images/pets-group.webp", label: "Pet minis" },
  { src: "/images/kid.webp", label: "Child miniature" },
  { src: "/images/decor.webp", label: "Home decor" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <SectionHeading
        title="Keepsakes with a heartbeat"
        sub="Every piece below began as a customer's photograph — pets like Chivas (Mumbai) and Daisy (New Delhi), a custom piece all the way to Kanpur. Yours could be next."
      />
      {/* the collection ring — drag to spin, the gallery's one living moment */}
      <div className="mb-14 border-b border-charcoal/10 pb-14">
        <Cylinder
          items={RING_IMAGES}
          itemWidth={200}
          itemHeight={235}
          ariaLabel="DIKOR collection preview"
          render={(it) => (
            <div className="flex h-full w-full flex-col overflow-hidden rounded-sm border border-charcoal/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.label} className="min-h-0 w-full flex-1 object-cover" loading="lazy" draggable={false} />
              <span className="bg-charcoal px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
                {it.label}
              </span>
            </div>
          )}
        />
      </div>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`min-h-[2.75rem] rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] ${
              filter === c
                ? "bg-gold text-charcoal"
                : "border border-charcoal/15 bg-white/60 text-charcoal-soft hover:border-rosegold hover:text-rosegold-dark"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <div key={`${p.title}-${i}`} className="border-t border-charcoal/15 pt-5">
            <div className="overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">{p.category}</p>
            <h3 className="mt-1 font-display text-2xl text-charcoal">{p.title}</h3>
            <p className="mt-1 text-sm text-charcoal-muted">{p.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">
        From @dikor_in — see the full collection on Instagram
      </p>
    </div>
  );
}
