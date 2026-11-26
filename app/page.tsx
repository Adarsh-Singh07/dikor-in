"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SectionHeading, GoldButton, GhostButton } from "@/components/ui";
import Cylinder from "@/components/Cylinder";
import OrderBuilder, { type BuilderSummary } from "@/components/OrderBuilder";
import HowItWorksSection from "@/components/HowItWorksSection";
import BeforeAfter from "@/components/BeforeAfter";
import StudioViewer3D from "@/components/StudioViewer3D";
import FaqAccordion from "@/components/FaqAccordion";
import { CATEGORIES, INCLUDED_ALWAYS, WHATSAPP_LINK, INSTAGRAM_HANDLE, inr, whatsappOrderLink } from "@/lib/catalog";
import { REVIEWS } from "@/lib/reviews";

const RING_IMAGES = [
  { src: "/images/hero-dog.webp", label: "Pet miniature" },
  { src: "/images/pets-group.webp", label: "Pet minis" },
  { src: "/images/kid.webp", label: "Child miniature" },
  { src: "/images/decor.webp", label: "Home decor" },
];

/* ---------- hero: 100svh editorial poster (skill steps 1–6) ----------
   z-0 key light · z-1 monumental DIKOR wordmark · z-2 real product photo
   (the golden retriever figurine cut out of hero-dog.webp, transparent PNG)
   · z-3 corner specs + glass dock. One living moment: the photo's slow
   6s float. Nothing else on the page moves. */
function Hero() {
  return (
    <section className="relative isolate grid min-h-svh grid-rows-[1fr_auto] overflow-hidden bg-charcoal px-5 pb-6 pt-20 md:px-8">
      {/* step 3: ONE key light, warm, from 45° overhead */}
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,244,224,0.14),transparent_70%)]"
        aria-hidden
      />
      {/* micro-caption: pinned below the nav so the sculpture can never cover it */}
      <p className="pointer-events-none absolute left-1/2 top-[4.75rem] z-[3] -translate-x-1/2 select-none whitespace-nowrap text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light/80">
        Custom 3D-printed keepsakes
      </p>
      {/* stage */}
      <div className="relative">
        {/* step 1: monumental wordmark */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 select-none text-center">
          <h1 className="bg-[linear-gradient(180deg,#FFFFFF_10%,#D8C9A3_100%)] bg-clip-text font-grotesk text-[clamp(6rem,27vw,32rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] text-transparent">
            DIKOR
          </h1>
        </div>
        {/* step 2: the real figurine photo over the type — no card, no frame,
            no shadow: the cutout floats directly on the charcoal stage */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex translate-y-[9%] items-center justify-center md:translate-y-[11%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dikor-dog-cutout.png"
            alt="DIKOR golden retriever figurine with a red bandana, on a stone pedestal with a gold Buddy name plate"
            className="hero-float h-auto w-auto max-h-[44%] max-w-[38%] select-none object-contain md:max-h-[66%]"
            draggable={false}
          />
        </div>
      </div>
      {/* step 4: four real specs pinned to the corners */}
      <div className="relative z-[3] mt-4 grid grid-cols-2 items-end gap-x-6 gap-y-5 md:grid-cols-[1fr_auto_1fr]">
        <dl className="order-2 space-y-4 md:order-1 md:col-start-1 md:row-start-1">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">From</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">₹1,500</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Start with</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">4–5 photos</dd>
          </div>
        </dl>
        {/* step 5: ONE liquid-glass dock */}
        <div className="order-1 col-span-2 w-full justify-self-stretch md:order-2 md:col-span-1 md:col-start-2 md:row-start-1 md:w-auto">
          <div className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full border border-white/15 bg-[rgba(20,18,16,0.6)] py-2 pl-4 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 sm:justify-start sm:gap-4 sm:pl-5">
            <span className="text-xs font-semibold text-cream sm:text-sm">From ₹1,500</span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <span className="hidden text-xs text-cream/70 sm:inline sm:text-sm">Name tag included</span>
            <a
              href="#order"
              className="rounded-full bg-cream px-4 py-2.5 text-xs font-bold text-charcoal sm:px-5 sm:text-sm"
            >
              Start your order
            </a>
          </div>
        </div>
        <dl className="order-3 space-y-4 text-right md:col-start-3 md:row-start-1">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Name tag</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">Included</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/50">Delivery</dt>
            <dd className="mt-1 font-grotesk text-lg font-semibold text-cream">7–10 days</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ---------- static trust row (the marquee is gone: one motion only) ---------- */
const TRUST_ITEMS = [
  "✓ Verified Instagram — @dikor_in",
  "Pet reels up to 5.9M views",
  "Personalised name tag included",
  "Shipping across India included",
  "Hand-painted by our artists",
  "Approval photos before dispatch",
];

function TrustRow() {
  return (
    <section aria-label="Why DIKOR" className="border-b border-charcoal/10">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-5 md:justify-between md:px-8">
        {TRUST_ITEMS.map((t) => (
          <li key={t} className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-muted">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- one-sentence statement ---------- */
function Statement() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-[7.5rem]">
      <p className="max-w-4xl font-display text-4xl leading-tight text-charcoal md:text-6xl">
        Your photos become a hand-painted keepsake, approved by you before it ships.
      </p>
    </section>
  );
}

/* ---------- atelier configurator (upstream PDP, restyled flat editorial) ----------
   Kept from upstream: media tabs (photos / compare / 3D turntable), subject,
   size and build selectors, live price, name + plaque inputs, WhatsApp order.
   Removed for the pre-login surface: the advance/balance split display and any
   advance-payment CTA — the full price is shown, payment steps live in the
   dashboard after sign-in. 7-inch bulky dog price is unconfirmed (catalog:
   null), so it shows as confirmed on WhatsApp instead of a number. */
const GALLERY_IMAGES = [
  { id: "hero-dog", src: "/images/hero-dog.webp", label: "Golden Dog Miniature", category: "Dogs" },
  { id: "dog-fig", src: "/images/dog-figurine.jpg", label: "Indie Dog Sculpt", category: "Dogs" },
  { id: "cat-fig", src: "/images/cat-figurine-card.jpg", label: "Persian Cat Miniature", category: "Cats" },
  { id: "kid-fig", src: "/images/kid.webp", label: "Child Milestone Keepsake", category: "Humans" },
  { id: "artisan", src: "/images/artisan-painting.jpg", label: "Hand-Painting Studio Detail", category: "Dogs" },
];

function Configurator() {
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "compare" | "3d">("photos");
  const [selectedImage, setSelectedImage] = useState(GALLERY_IMAGES[0]);
  const [subject, setSubject] = useState<"Dogs" | "Cats" | "Humans">("Dogs");
  const [sizeInches, setSizeInches] = useState<5 | 7>(5);
  const [dogBuild, setDogBuild] = useState<"slim" | "bulky">("slim");
  const [petName, setPetName] = useState("");
  const [plaqueText, setPlaqueText] = useState("");

  // null = price confirmed on WhatsApp (7-inch bulky dog).
  const price: number | null =
    subject === "Humans"
      ? sizeInches === 7
        ? 2499
        : 1999
      : subject === "Cats"
        ? sizeInches === 7
          ? 1700
          : 1500
        : sizeInches === 7
          ? dogBuild === "bulky"
            ? null
            : 1700
          : dogBuild === "bulky"
            ? 2000
            : 1500;

  const waOrderText = `Hi DIKOR! I want to order a custom 3D ${subject} miniature.\nSize: ${sizeInches} inch (${subject === "Dogs" ? `${dogBuild} breed` : "standard"})\nName on plaque: ${plaqueText || petName || "None"}\nPrice: ${price ? inr(price) : "confirmed on WhatsApp"}.\nPlease guide me on sharing photos.`;

  const tabCls = (active: boolean) =>
    `min-h-[44px] rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
      active ? "bg-charcoal text-cream" : "border border-charcoal/15 bg-white text-charcoal-soft hover:border-charcoal"
    }`;

  return (
    <section className="border-b border-charcoal/10 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title="Design your miniature"
          sub="Pick a subject and size, preview it in 3D, and see the full price up front."
        />
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* media showcase */}
          <div className="lg:col-span-7">
            <div className="border border-charcoal/10 bg-white p-3 rounded-sm">
              <div className="mb-3 flex flex-wrap gap-2 border-b border-charcoal/10 pb-3" role="tablist">
                <button type="button" role="tab" aria-selected={activeMediaTab === "photos"} onClick={() => setActiveMediaTab("photos")} className={tabCls(activeMediaTab === "photos")}>
                  Studio photography
                </button>
                <button type="button" role="tab" aria-selected={activeMediaTab === "compare"} onClick={() => setActiveMediaTab("compare")} className={tabCls(activeMediaTab === "compare")}>
                  Photo vs figurine
                </button>
                <button type="button" role="tab" aria-selected={activeMediaTab === "3d"} onClick={() => setActiveMediaTab("3d")} className={tabCls(activeMediaTab === "3d")}>
                  3D turntable
                </button>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-cream">
                {activeMediaTab === "photos" && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.label}
                      className="h-full w-full object-cover"
                      fetchPriority="high"
                    />
                    <span className="absolute bottom-3 left-3 rounded-sm bg-charcoal/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
                      {selectedImage.label}
                    </span>
                  </>
                )}
                {activeMediaTab === "compare" && (
                  <BeforeAfter
                    before="/images/dog-real.webp"
                    after="/images/hero-dog.webp"
                    beforeLabel="Reference photo"
                    afterLabel="DIKOR figurine"
                  />
                )}
                {activeMediaTab === "3d" && (
                  <StudioViewer3D
                    category={subject}
                    petName={petName || (subject === "Humans" ? "Portrait" : "Your pet")}
                    tagText={plaqueText || "DIKOR"}
                    sizeInches={sizeInches}
                    className="h-full w-full border-none bg-transparent p-0 rounded-none"
                  />
                )}
              </div>

              {activeMediaTab === "photos" && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist">
                  {GALLERY_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition ${
                        selectedImage.id === img.id ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 border-t border-charcoal/10 pt-5 text-xs text-charcoal-muted sm:grid-cols-2">
              <p><strong className="text-charcoal">Material:</strong> Solid SLA resin base with multi-layer acrylic paint glaze</p>
              <p><strong className="text-charcoal">Plinth:</strong> Solid wood plinth with laser-engraved brass plaque included</p>
              <p><strong className="text-charcoal">Approval:</strong> 360-degree video preview sent before courier packing</p>
              <p><strong className="text-charcoal">Shipping:</strong> Free insured delivery pan-India in wooden crate</p>
            </div>
          </div>

          {/* configurator */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
                Atelier Jalandhar · Bespoke 3D sculpting
              </p>
              <h2 className="mt-2 font-display text-4xl text-charcoal">Custom 3D miniature</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                Sculpted layer by layer from your smartphone photos and hand-painted by artists in Jalandhar, Punjab.
              </p>
            </div>

            <div className="rounded-sm border border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  {price ? (
                    <>
                      <span className="font-display text-3xl text-charcoal">{inr(price)}</span>
                      <span className="ml-2 text-xs text-charcoal-muted">all-inclusive</span>
                    </>
                  ) : (
                    <span className="font-display text-2xl text-charcoal">Price confirmed on WhatsApp</span>
                  )}
                </div>
                <span className="rounded-full border border-charcoal/10 bg-cream px-2.5 py-1 text-[11px] font-bold text-charcoal-soft">
                  Insured shipping included
                </span>
              </div>
              <p className="mt-3 border-t border-charcoal/10 pt-3 text-xs text-charcoal-muted">
                You see the full price before you pay anything. Payment steps appear in your dashboard after you sign in.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-charcoal">1 · Choose subject</p>
              <div className="grid grid-cols-3 gap-2">
                {(["Dogs", "Cats", "Humans"] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition ${
                      subject === s
                        ? "bg-charcoal text-cream"
                        : "border border-charcoal/15 bg-white text-charcoal hover:border-charcoal"
                    }`}
                  >
                    {s === "Dogs" ? "Dog" : s === "Cats" ? "Cat" : "Human"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-charcoal">2 · Select scale</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSizeInches(5)}
                  className={`min-h-[44px] rounded-sm px-3 py-2 text-left text-xs font-bold transition ${
                    sizeInches === 5
                      ? "bg-charcoal text-cream"
                      : "border border-charcoal/15 bg-white text-charcoal hover:border-charcoal"
                  }`}
                >
                  <span className="block">5 inch · Standard</span>
                  <span className="text-[10px] font-normal opacity-80">Desk &amp; shelf scale</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSizeInches(7)}
                  className={`min-h-[44px] rounded-sm px-3 py-2 text-left text-xs font-bold transition ${
                    sizeInches === 7
                      ? "bg-charcoal text-cream"
                      : "border border-charcoal/15 bg-white text-charcoal hover:border-charcoal"
                  }`}
                >
                  <span className="block">7 inch · Collector</span>
                  <span className="text-[10px] font-normal opacity-80">Statement mantel scale</span>
                </button>
              </div>

              {subject === "Dogs" && (
                <div className="mt-3">
                  <span className="mb-1.5 block text-xs font-medium text-charcoal-muted">Breed build</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDogBuild("slim")}
                      className={`min-h-[44px] rounded-sm px-3 py-2 text-xs font-semibold transition ${
                        dogBuild === "slim"
                          ? "border border-charcoal bg-cream font-bold text-charcoal"
                          : "border border-charcoal/15 bg-white text-charcoal-muted"
                      }`}
                    >
                      Slim (Indie, Beagle, Poodle)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDogBuild("bulky")}
                      className={`min-h-[44px] rounded-sm px-3 py-2 text-xs font-semibold transition ${
                        dogBuild === "bulky"
                          ? "border border-charcoal bg-cream font-bold text-charcoal"
                          : "border border-charcoal/15 bg-white text-charcoal-muted"
                      }`}
                    >
                      Bulky (Golden, Lab, GSD, Pug)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal">
                  {subject === "Humans" ? "Person's name" : "Pet's name"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Babu"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="min-h-[44px] w-full rounded-sm border border-charcoal/15 bg-white px-3 text-sm focus:border-rosegold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal">
                  Brass plaque engraving
                </label>
                <input
                  type="text"
                  placeholder="e.g. Always by our side"
                  value={plaqueText}
                  onChange={(e) => setPlaqueText(e.target.value)}
                  className="min-h-[44px] w-full rounded-sm border border-charcoal/15 bg-white px-3 text-sm focus:border-rosegold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/order" className="block w-full">
                <GoldButton className="w-full text-center">Customise &amp; upload photos</GoldButton>
              </Link>
              <a
                href={whatsappOrderLink(waOrderText)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-charcoal/25 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-charcoal hover:border-charcoal"
              >
                Order via WhatsApp (send photos directly)
              </a>
              <p className="text-center text-[11px] text-charcoal-muted">
                3D modelling &amp; hand-painting take 4–5 days · Delivery in 7–10 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the craft, in four steps (upstream monograph, restyled flat) ---------- */
const CRAFT_STEPS = [
  {
    n: "01",
    t: "3D digital sculpting",
    d: "Our CAD sculptors examine your photos from multiple angles, modelling ear posture, muzzle proportions, and fur contours before any printing begins.",
  },
  {
    n: "02",
    t: "High-precision SLA resin printing",
    d: "Printed at 0.05mm ultra-fine layer thickness in solid, durable resin for structural stability and razor-sharp surface fidelity.",
  },
  {
    n: "03",
    t: "Hand-painting by studio artists",
    d: "Every piece is painted with professional acrylic pigments, matching distinct coat patches, eye colours, and whisker pads, sealed with satin glaze.",
  },
  {
    n: "04",
    t: "360-degree video approval",
    d: "Before shipping, we send you a turntable video of the finished piece. If you want any colour tweaked, our artists adjust it until you are completely satisfied.",
  },
];

function Craft() {
  return (
    <section className="border-b border-charcoal/10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/process-painting.webp"
                alt="Artists hand-painting custom 3D figurines in Jalandhar studio"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
              Inside DIKOR Studio in Jalandhar, Punjab · Hand-detailing coat markings
            </p>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">Physical artisan standard</p>
            <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">
              How our sculptors turn photos into heirloom miniatures.
            </h2>
            <div className="mt-8 space-y-6">
              {CRAFT_STEPS.map((s) => (
                <div key={s.n} className="border-l-2 border-gold pl-4">
                  <h3 className="font-display text-xl text-charcoal">{s.n}. {s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-muted">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- collection ring: its own section, below the hero ---------- */
function Collection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:px-8" aria-label="The collection">
      <SectionHeading
        title="The collection"
        sub="Four keepsake families, one promise: hand-finished from your photos, approved by you before dispatch."
      />
      <Cylinder
        items={RING_IMAGES}
        itemWidth={180}
        itemHeight={210}
        ariaLabel="DIKOR collection preview"
        render={(it) => (
          <div className="flex h-full w-full flex-col overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={it.label} className="min-h-0 w-full flex-1 object-cover" loading="lazy" draggable={false} />
            <span className="bg-charcoal px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
              {it.label}
            </span>
          </div>
        )}
      />
    </section>
  );
}

/* ---------- category editorial rows ---------- */
function CategoryRows() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-[7.5rem]">
      <SectionHeading
        title="Made for the moments you treasure"
        sub="Pets, cats, kids, and decor — each one printed and painted by hand."
      />
      <div className="space-y-16 md:space-y-24">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.key}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className={`overflow-hidden rounded-sm ${i % 2 ? "md:order-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={`${c.key} figurine by DIKOR`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
            <div className={i % 2 ? "md:order-1" : ""}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">{c.key}</p>
              <h3 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">{c.tagline}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-charcoal-muted">{c.copy}</p>
              <p className="mt-4">
                <span className="font-display text-2xl text-gold-dark">{c.fromPrice}</span>
                {!c.priceConfirmed && (
                  <span className="block text-xs text-charcoal-muted">Exact price confirmed on WhatsApp</span>
                )}
              </p>
              <Link
                href="/order"
                className="mt-6 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition hover:bg-gold-light"
              >
                {c.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- what photos to send (upstream guide, restyled flat) ---------- */
const PHOTO_GUIDE = [
  {
    img: "/images/pet-portrait.jpg",
    alt: "Pet face photo guide",
    t: "1. Eye-level front",
    d: "Take a straight-on photo at your pet or subject's eye level to capture facial markings, eye gaze, and muzzle shape.",
  },
  {
    img: "/images/dog-real.webp",
    alt: "Pet side profile photo guide",
    t: "2. Side profile",
    d: "Show full body posture, tail carriage, and ear angle so we sculpt the exact stance of your pet.",
  },
  {
    img: "/images/hero-dog.webp",
    alt: "Finished miniature result",
    t: "3. Natural lighting",
    d: "Photos taken in outdoor or window daylight help our painters match natural fur tones without flash distortion.",
  },
];

function PhotoGuide() {
  return (
    <section className="border-b border-charcoal/10 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">Photo guidelines</p>
          <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">
            Three photos that guarantee an exact likeness.
          </h2>
          <p className="mt-3 text-charcoal-muted">
            You do not need professional studio shots. Clear phone photos taken at eye level give our sculptors everything they need.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {PHOTO_GUIDE.map((g) => (
            <div key={g.t} className="space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">{g.t}</h3>
              <p className="text-sm leading-relaxed text-charcoal-muted">{g.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- reviews: one huge real quote + a static list (no cards, no stars) ---------- */
function Reviews() {
  const featured = REVIEWS[4];
  const more = [REVIEWS[0], REVIEWS[1], REVIEWS[2], REVIEWS[17]];
  return (
    <section className="bg-blush/50 py-20 md:py-[7.5rem]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          title="What customers say"
          sub={`${REVIEWS.length} real reviews from our Reviews highlight on @dikor_in.`}
        />
        <blockquote className="max-w-4xl">
          <p className="font-display text-3xl leading-snug text-charcoal md:text-5xl">“{featured.quote}”</p>
          <footer className="mt-6 text-sm text-charcoal-muted">
            @{featured.handle} — {featured.context}, {featured.date}
          </footer>
        </blockquote>
        <ul className="mt-16 space-y-8">
          {more.map((r) => (
            <li key={r.handle ?? r.context} className="border-t border-charcoal/10 pt-6">
              <p className="max-w-3xl text-lg leading-relaxed text-charcoal">“{r.quote}”</p>
              <p className="mt-3 text-sm text-charcoal-muted">
                {r.handle ? `@${r.handle} — ` : ""}
                {r.context}, {r.date}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <a href="https://www.instagram.com/dikor_in/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-rosegold-dark underline">
            See more on {INSTAGRAM_HANDLE} — including our Reviews highlight
          </a>
        </p>
      </div>
    </section>
  );
}

/* ---------- makers ---------- */
function Makers() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-[7.5rem]">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/process-painting.webp" alt="DIKOR artists hand-painting a 3D-printed figurine" className="aspect-[4/3] w-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">The makers</p>
          <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            A small studio with big love for detail.
          </h2>
          <p className="mt-4 leading-relaxed text-charcoal-muted">
            DIKOR is run by <strong className="text-charcoal">@sainirajatrs</strong> and <strong className="text-charcoal">@sheetal__83</strong> —
            two makers who believe a gift should feel like the person it&apos;s for. Every piece is printed,
            painted and packed by hand, and a share of early orders went to Rahaat Foundation for strays.
          </p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="mt-6 inline-block">
            <GhostButton>Say hello on WhatsApp</GhostButton>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- sticky mobile buy bar: the dock, once the hero is off-screen ----------
   Never visible at the same time as the hero dock. */
function StickyBuyBar({ summary }: { summary: BuilderSummary }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 750);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-white/15 bg-[rgba(20,18,16,0.6)] py-2.5 pl-5 pr-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-cream">{summary.category}, {summary.size}</p>
          <p className="text-xs font-bold text-gold-light">{summary.price}</p>
        </div>
        <a href="#order" className="shrink-0 rounded-full bg-cream px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
          Start order
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [summary, setSummary] = useState<BuilderSummary>({ category: "Pets", size: "5-inch Slim breeds", price: "₹1,500" });

  return (
    <>
      <Hero />
      <TrustRow />
      <Statement />
      <Configurator />
      <Craft />
      <Collection />
      <CategoryRows />
      <PhotoGuide />

      {/* order builder */}
      <section id="order" className="scroll-mt-24 bg-cream-dark/50 py-20 md:py-[7.5rem]">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <SectionHeading
            title="Build your keepsake in 2 minutes"
            sub="Five short steps. You see the full price before you pay anything."
          />
          <OrderBuilder onConfig={setSummary} />
          <div className="mx-auto mt-8 max-w-3xl border-t border-charcoal/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
            <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm text-charcoal-soft sm:grid-cols-2">
              {INCLUDED_ALWAYS.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* proof: before / after */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-[7.5rem]">
        <SectionHeading
          title="From photo to figurine"
          sub="One clear photo is all it takes. Drag the handle to compare."
        />
        <BeforeAfter />
      </section>

      <HowItWorksSection />

      <Reviews />

      <Makers />

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-[7.5rem]">
        <SectionHeading
          title="Everything you are wondering"
          sub="Straight answers — no fine print."
        />
        <FaqAccordion />
      </section>

      {/* final CTA — the one deliberate centred block on the page */}
      <section className="bg-charcoal py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="font-display text-4xl text-cream md:text-5xl">Keep the people you love in miniature, forever.</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/60">Send 4–5 photos, approve the video, and we ship it once you love it.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#order" className="inline-flex w-full items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition hover:bg-gold-light sm:w-auto">
              Start your order
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full border border-cream/25 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-gold-light sm:w-auto">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <StickyBuyBar summary={summary} />
    </>
  );
}
