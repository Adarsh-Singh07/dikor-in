"use client";
import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, GoldButton } from "@/components/ui";

const FILTERS = ["All", "Dogs", "Cats", "Humans"] as const;

interface Piece {
  category: "Dogs" | "Cats" | "Humans";
  title: string;
  note: string;
  image: string;
}

const PIECES: Piece[] = [
  {
    category: "Dogs",
    title: "Hand-Painted Golden Dog Miniature",
    note: "5 Inch scale on dark walnut plinth with engraved brass nameplate. Hand-layered acrylic coat.",
    image: "/images/hero-dog.webp",
  },
  {
    category: "Dogs",
    title: "Sculpted Indie & Beagle Likeness",
    note: "Precision 3D resin printed directly from customer smartphone photos. Hand-detailed muzzle.",
    image: "/images/dog-figurine.jpg",
  },
  {
    category: "Cats",
    title: "Persian & Indie Cat Miniature",
    note: "Hand-painted acrylic glazes capturing distinct eye color, coat markings, and feline posture.",
    image: "/images/cat-figurine.jpg",
  },
  {
    category: "Dogs",
    title: "Studio Pet Minis Collection",
    note: "Multiple custom pet miniatures finished and prepared for insured pan-India courier dispatch.",
    image: "/images/pets-group.webp",
  },
  {
    category: "Humans",
    title: "Child Milestone Portrait Miniature",
    note: "Individual human keepsake sculpted in fine resin from front and side portrait references.",
    image: "/images/kid.webp",
  },
  {
    category: "Dogs",
    title: "Atelier Hand-Painting Booth",
    note: "Studio artists in Jalandhar applying acrylic highlights and texture coat by coat.",
    image: "/images/process-painting.webp",
  },
  {
    category: "Cats",
    title: "Fine Detailing & Acrylic Glazing",
    note: "Close-up artisan painting of feline markings, whiskers, and natural coloration.",
    image: "/images/artisan-painting.jpg",
  },
  {
    category: "Dogs",
    title: "Client Reference vs Final Figurine",
    note: "Studio fidelity check comparing reference photo to completed physical miniature.",
    image: "/images/dog-real.webp",
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? PIECES : PIECES.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Atelier Gallery"
          title={<>Real miniatures sculpted from <span className="text-rosegold-dark italic font-normal">real photos</span></>}
          sub="Every piece began as smartphone photos sent by pet parents: dogs like Chivas in Mumbai, Dido and Babu, and custom portrait keepsakes across India."
        />
      </Reveal>

      {/* Filter Tabs */}
      <Reveal className="mb-12 flex flex-wrap justify-center gap-2">
        {FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`min-h-[44px] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
              filter === c
                ? "bg-charcoal text-white shadow-sm"
                : "border border-charcoal/20 bg-white/70 text-charcoal hover:border-charcoal hover:bg-white"
            }`}
          >
            {c}
          </button>
        ))}
      </Reveal>

      {/* Gallery Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={`${p.title}-${i}`} delay={(i % 3) * 0.05}>
            <div className="overflow-hidden rounded-2xl border border-charcoal/15 bg-white transition hover:border-charcoal/40">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-charcoal/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold text-charcoal">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal-muted">{p.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link href="/order">
          <GoldButton>Order Your Custom Miniature</GoldButton>
        </Link>
      </div>
    </div>
  );
}
