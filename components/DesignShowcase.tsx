"use client";
import { useState } from "react";
import { WHATSAPP_LINK } from "@/lib/catalog";

/* ---------- design showcase (round 3: the old Configurator, fixed) ----------
   What changed and why:
   - The "3D TURNTABLE" tab is GONE. It crashed the whole site (blank cream
     page, "Application error: a client-side exception has occurred") when
     clicked. The StudioViewer3D component is no longer rendered anywhere.
     It stays off until a real 3D viewer ships.
   - The "Photo vs Figurine" compare tab is GONE. The before/after pair was
     broken (living room with no dog visible; an extreme close-up of a nose
     and bandana). No matched pair exists, so no slider until one does.
   - Photos only: four finished pieces, full frame, object-contain so the
     whole figurine is visible — never a cropped face. The two mislabelled
     images are out: dog-figurine.jpg is a real dog photo, not a figurine,
     and artisan-painting.jpg is a stone carver's workshop, not our studio.
   - No subject/size/name selectors here: they duplicate the builder below.
     The showcase shows the pieces; the builder takes the order.
   - Specs are an atelier spec sheet (hairline rows), not a dry small-type
     list. One restrained dark CTA; WhatsApp is a quiet text link. */
const SHOWCASE_IMAGES = [
  { id: "hero-dog", src: "/images/hero-dog.webp", label: "Golden Dog Miniature" },
  { id: "cat-fig", src: "/images/cat-figurine-card.jpg", label: "Simba Cat Miniature" },
  { id: "kid-fig", src: "/images/kid.webp", label: "Child Milestone Keepsake" },
  { id: "pets-group", src: "/images/pets-group.webp", label: "Border Collie & Pug Minis" },
];

const SPECS = [
  { k: "Material", v: "SLA resin, hand-painted acrylic" },
  { k: "Plinth", v: "Walnut stone plinth, gold name plaque" },
  { k: "Approval", v: "360° video proof before dispatch" },
  { k: "Shipping", v: "Free insured courier, 7–10 days" },
];

export default function DesignShowcase() {
  const [selected, setSelected] = useState(SHOWCASE_IMAGES[0]);

  return (
    <section className="mt-12 border-t border-charcoal/10 pt-12">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* media: full figurine, large thumbnails */}
        <div className="min-w-0 lg:col-span-7">
          <div className="overflow-hidden rounded-sm bg-cream-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selected.id}
              src={selected.src}
              alt={selected.label}
              className="h-[320px] w-full object-contain md:h-[420px]"
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {SHOWCASE_IMAGES.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelected(img)}
                aria-label={`Show ${img.label}`}
                aria-pressed={selected.id === img.id}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-cream-dark transition sm:h-20 sm:w-20 ${
                  selected.id === img.id ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-charcoal-muted">{selected.label}</p>
        </div>

        {/* spec sheet + price + one CTA */}
        <div className="min-w-0 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">Design your miniature</p>
          <h2 className="mt-2 font-display text-4xl text-charcoal">Made from your photos.</h2>
          <p className="mt-3 leading-relaxed text-charcoal-muted">
            Pick a piece below, then build your order. Every miniature is printed and painted by hand.
          </p>
          <dl className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/15">
            {SPECS.map((s) => (
              <div key={s.k} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal-muted">{s.k}</dt>
                <dd className="text-right text-sm text-charcoal">{s.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-4xl text-gold-dark">From ₹1,500</span>
            <span className="text-sm text-charcoal-muted">all-inclusive</span>
          </div>
          <p className="mt-1 text-xs text-charcoal-muted">Name tag and insured delivery included.</p>
          <a
            href="#order-builder"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition hover:bg-black"
          >
            Customise &amp; upload photos
          </a>
          <p className="mt-4 text-sm">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="font-semibold text-rosegold-dark underline">
              Order via WhatsApp
            </a>
            <span className="text-charcoal-muted"> — payment steps appear in your dashboard after you sign in.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
