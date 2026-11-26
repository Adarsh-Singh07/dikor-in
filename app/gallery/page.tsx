"use client";
import { useState } from "react";
import { SectionHeading } from "@/components/ui";
import { REVIEWS } from "@/lib/reviews";

const FILTERS = ["All", "Pets", "Cats", "Kids", "Decor"] as const;

interface Piece { category: (typeof FILTERS)[number]; title: string; note: string; image: string; }

/** Real pieces from the DIKOR studio (round 3) — one unique, correctly
    captioned, full-frame image per product. Removed: the AI-looking
    hand-painting photo, the stone-carver workshop mislabelled as feline
    detailing, the "reference vs figurine" tile that showed only a real
    dog, and the second decor tile reusing the same vase photo.
    The real-dog photo is labelled as what it is — a reference photo,
    not a figurine. The collection ring is gone (it duplicated the
    homepage); the grid is the gallery now. */
const PIECES: Piece[] = [
  { category: "Pets", title: "Hand-painted Golden dog miniature", note: "5-inch on a walnut plinth, engraved brass name tag, from ₹1,500", image: "/images/hero-dog.webp" },
  { category: "Pets", title: "Pet portrait — the reference photo", note: "A real pet photo, the kind you send us to start your miniature", image: "/images/dog-figurine.jpg" },
  { category: "Pets", title: "Studio pet minis collection", note: "Every breed, finished and ready to ship across India", image: "/images/pets-group.webp" },
  { category: "Cats", title: "Simba, the cat miniature", note: "Hand-painted ginger tabby, with his name tag on the plinth, from ₹1,500", image: "/images/cat-figurine-card.jpg" },
  { category: "Kids", title: "Child milestone portrait miniature", note: "Sculpted in fine resin from front and side portraits", image: "/images/kid.webp" },
  { category: "Decor", title: "Sculptural 3D vase", note: "Printed to order, finished by hand", image: "/images/decor.webp" },
];

/* The three reviews featured on the homepage stay there; the other 15
   live here. One-line shout-outs stay in the list, labelled by handle
   and context — no stars or photos are invented for them. */
const FEATURED_HANDLES = new Set(["niddhi_irl", "dlinsvi9", "themeghamood"]);
const MORE_REVIEWS = REVIEWS.filter((r) => !FEATURED_HANDLES.has(r.handle ?? ""));

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <SectionHeading
        title="Keepsakes with a heartbeat"
        sub="Every piece below began as a customer's photograph — pets like Chivas (Mumbai) and Daisy (New Delhi), a custom piece all the way to Kanpur. Yours could be next."
      />
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`min-h-[2.75rem] rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] ${
              filter === c
                ? "bg-charcoal text-cream"
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

      {/* reviews: the other 15, below the pieces */}
      <section id="reviews" className="mt-20 scroll-mt-24 border-t border-charcoal/10 pt-14">
        <SectionHeading
          title="What customers say"
          sub="The other 15 real reviews from our Reviews highlight on @dikor_in."
        />
        <ul className="mx-auto max-w-3xl space-y-8">
          {MORE_REVIEWS.map((r) => (
            <li key={r.handle ?? r.context} className="border-t border-charcoal/10 pt-6">
              <p className="text-lg leading-relaxed text-charcoal">“{r.quote}”</p>
              <p className="mt-3 text-sm text-charcoal-muted">
                {r.handle ? `@${r.handle} — ` : ""}
                {r.context}, {r.date}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
