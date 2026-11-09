"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GoldButton, GhostButton } from "@/components/ui";
import BeforeAfter from "@/components/BeforeAfter";
import StudioViewer3D from "@/components/StudioViewer3D";
import FaqAccordion from "@/components/FaqAccordion";
import { WHATSAPP_LINK, INSTAGRAM_HANDLE, inr, splitFor, whatsappOrderLink } from "@/lib/catalog";
import { REVIEWS } from "@/lib/reviews";

const GALLERY_IMAGES = [
  { id: "hero-dog", src: "/images/hero-dog.webp", label: "Golden Dog Miniature", category: "Dogs" },
  { id: "dog-fig", src: "/images/dog-figurine.jpg", label: "Indie Dog Sculpt", category: "Dogs" },
  { id: "cat-fig", src: "/images/cat-figurine.jpg", label: "Persian Cat Miniature", category: "Cats" },
  { id: "kid-fig", src: "/images/kid.webp", label: "Child Milestone Keepsake", category: "Humans" },
  { id: "artisan", src: "/images/artisan-painting.jpg", label: "Hand-Painting Studio Detail", category: "Dogs" },
];

export default function HomePage() {
  // Configurator state
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "compare" | "3d">("photos");
  const [selectedImage, setSelectedImage] = useState(GALLERY_IMAGES[0]);
  const [subject, setSubject] = useState<"Dogs" | "Cats" | "Humans">("Dogs");
  const [sizeInches, setSizeInches] = useState<5 | 7>(5);
  const [dogBuild, setDogBuild] = useState<"slim" | "bulky">("slim");
  const [petName, setPetName] = useState("");
  const [plaqueText, setPlaqueText] = useState("");
  const [photoCount, setPhotoCount] = useState(0);

  // Price calculations
  const price = subject === "Humans"
    ? (sizeInches === 7 ? 2499 : 1999)
    : subject === "Cats"
    ? (sizeInches === 7 ? 1700 : 1500)
    : sizeInches === 7
    ? (dogBuild === "bulky" ? 2200 : 1700)
    : (dogBuild === "bulky" ? 2000 : 1500);

  const split = splitFor(price);

  const waOrderText = `Hi DIKOR Atelier! I want to order a custom 3D ${subject} Miniature.\nSize: ${sizeInches} Inch (${subject === "Dogs" ? `${dogBuild} breed` : "standard"})\nName on Plaque: ${plaqueText || petName || "None"}\nEstimated Price: ${inr(price)} (75% Advance: ${inr(split.advance)}).\nPlease guide me on sharing photos.`;

  return (
    <div className="bg-[#FAF7F2] text-charcoal">
      {/* ========================================================= */}
      {/* 1. ATELIER PRODUCT STUDIO & CONFIGURATOR (MakeDoppel style) */}
      {/* ========================================================= */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-charcoal/15">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Interactive Media Showcase */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-charcoal/15 bg-white p-3 shadow-sm">
                
                {/* Media Viewport Tabs */}
                <div className="flex items-center gap-1.5 border-b border-charcoal/10 pb-3 mb-3" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMediaTab === "photos"}
                    onClick={() => setActiveMediaTab("photos")}
                    className={`min-h-[44px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
                      activeMediaTab === "photos"
                        ? "bg-charcoal text-white"
                        : "bg-[#FAF7F2] text-charcoal hover:bg-charcoal/10"
                    }`}
                  >
                    Studio Photography
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMediaTab === "compare"}
                    onClick={() => setActiveMediaTab("compare")}
                    className={`min-h-[44px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
                      activeMediaTab === "compare"
                        ? "bg-charcoal text-white"
                        : "bg-[#FAF7F2] text-charcoal hover:bg-charcoal/10"
                    }`}
                  >
                    Photo vs Figurine
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMediaTab === "3d"}
                    onClick={() => setActiveMediaTab("3d")}
                    className={`min-h-[44px] px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
                      activeMediaTab === "3d"
                        ? "bg-charcoal text-white"
                        : "bg-[#FAF7F2] text-charcoal hover:bg-charcoal/10"
                    }`}
                  >
                    3D Turntable Studio
                  </button>
                </div>

                {/* Viewport Content */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#FAF7F2]">
                  {activeMediaTab === "photos" && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage.src}
                        alt={selectedImage.label}
                        className="h-full w-full object-cover transition duration-300"
                        fetchPriority="high"
                      />
                      <span className="absolute bottom-3 left-3 rounded-md bg-charcoal/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {selectedImage.label}
                      </span>
                    </>
                  )}

                  {activeMediaTab === "compare" && (
                    <BeforeAfter
                      before="/images/dog-real.webp"
                      after="/images/hero-dog.webp"
                      beforeLabel="Reference Photo"
                      afterLabel="DIKOR Handcrafted Figurine"
                    />
                  )}

                  {activeMediaTab === "3d" && (
                    <StudioViewer3D
                      category={subject}
                      petName={petName || (subject === "Humans" ? "Portrait" : "Your Pet")}
                      tagText={plaqueText || "DIKOR ATELIER"}
                      sizeInches={sizeInches}
                      className="h-full w-full border-none p-0 rounded-none bg-transparent"
                    />
                  )}
                </div>

                {/* Photo Thumbnails Strip */}
                {activeMediaTab === "photos" && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist">
                    {GALLERY_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className={`min-w-[64px] min-h-[64px] w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                          selectedImage.id === img.id ? "border-charcoal scale-105" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Craft Specifications List (Not a bento grid!) */}
              <div className="mt-6 border-t border-charcoal/15 pt-5 text-xs text-charcoal-muted grid sm:grid-cols-2 gap-3">
                <p><strong>Material:</strong> Solid SLA resin base with multi-layer acrylic paint glaze</p>
                <p><strong>Plinth:</strong> Solid wood plinth with laser-engraved brass plaque included</p>
                <p><strong>Approval:</strong> 360-degree video preview sent before courier packing</p>
                <p><strong>Shipping:</strong> Free insured delivery pan-India in wooden crate</p>
              </div>
            </div>

            {/* RIGHT COLUMN: Studio Order Configurator */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
                  Atelier Jalandhar &bull; Bespoke 3D Sculpting
                </span>
                <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  Custom 3D Miniature
                </h1>
                <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
                  Sculpted layer by layer from your smartphone photos and hand-painted by artists in Jalandhar, Punjab.
                </p>
              </div>

              {/* Pricing & Split Breakdown */}
              <div className="rounded-xl border border-charcoal/20 bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-3xl font-bold text-charcoal">{inr(price)}</span>
                    <span className="ml-2 text-xs text-charcoal-muted">all-inclusive</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    Insured Shipping Included
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-charcoal/10 pt-3">
                  <div>
                    <span className="text-charcoal-muted block">75% Advance Reservation</span>
                    <strong className="text-rosegold-dark font-serif text-sm">{inr(split.advance)}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-muted block">25% Balance on Approval</span>
                    <strong className="text-charcoal font-serif text-sm">{inr(split.balance)}</strong>
                  </div>
                </div>
              </div>

              {/* Step 1: Subject Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  1. Choose Subject
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Dogs", "Cats", "Humans"] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSubject(s)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark border ${
                        subject === s
                          ? "bg-charcoal text-white border-charcoal shadow-sm"
                          : "bg-white text-charcoal border-charcoal/20 hover:border-charcoal"
                      }`}
                    >
                      {s === "Dogs" ? "Dog" : s === "Cats" ? "Cat" : "Human"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Size & Build */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  2. Select Scale
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSizeInches(5)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark border text-left ${
                      sizeInches === 5
                        ? "bg-charcoal text-white border-charcoal shadow-sm"
                        : "bg-white text-charcoal border-charcoal/20 hover:border-charcoal"
                    }`}
                  >
                    <span className="block">5 Inch Standard</span>
                    <span className="text-[10px] opacity-80 font-normal">Desk &amp; Shelf scale</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSizeInches(7)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark border text-left ${
                      sizeInches === 7
                        ? "bg-charcoal text-white border-charcoal shadow-sm"
                        : "bg-white text-charcoal border-charcoal/20 hover:border-charcoal"
                    }`}
                  >
                    <span className="block">7 Inch Collector</span>
                    <span className="text-[10px] opacity-80 font-normal">Statement mantel scale</span>
                  </button>
                </div>

                {subject === "Dogs" && (
                  <div className="mt-3">
                    <span className="block text-xs text-charcoal-muted mb-1.5 font-medium">Breed Build:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDogBuild("slim")}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                          dogBuild === "slim"
                            ? "bg-[#FAF7F2] border-charcoal text-charcoal font-bold"
                            : "bg-white border-charcoal/20 text-charcoal-muted"
                        }`}
                      >
                        Slim (Indie, Beagle, Poodle)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDogBuild("bulky")}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                          dogBuild === "bulky"
                            ? "bg-[#FAF7F2] border-charcoal text-charcoal font-bold"
                            : "bg-white border-charcoal/20 text-charcoal-muted"
                        }`}
                      >
                        Bulky (Golden, Lab, GSD, Pug)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Plaque & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    {subject === "Humans" ? "Person's Name" : "Pet's Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Babu"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-charcoal/20 bg-white px-3 text-sm focus:border-rosegold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Brass Plaque Engraving
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Always by our side"
                    value={plaqueText}
                    onChange={(e) => setPlaqueText(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-charcoal/20 bg-white px-3 text-sm focus:border-rosegold focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 4: Quick Actions */}
              <div className="space-y-3 pt-2">
                <Link href="/order" className="block w-full">
                  <GoldButton className="w-full text-center">
                    Customise &amp; Upload Photos (Pay 75% Advance)
                  </GoldButton>
                </Link>

                <a
                  href={whatsappOrderLink(waOrderText)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-charcoal/30 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal hover:border-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark"
                >
                  Order via WhatsApp (Send Photos Directly)
                </a>

                <p className="text-center text-[11px] text-charcoal-muted">
                  3D modeling &amp; hand-painting take 4-5 days &bull; Pan-India courier delivery in 6-7 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE STUDIO CRAFT MONOGRAPH (Photographic, NO CARDS!)    */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 border-b border-charcoal/15">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Real Studio Workshop Photography */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-2xl border border-charcoal/15 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/process-painting.webp"
                  alt="Artists hand-painting custom 3D figurines in Jalandhar studio"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-charcoal-muted uppercase tracking-wider">
                Inside DIKOR Studio in Jalandhar, Punjab &bull; Hand-detailing coat markings
              </p>
            </div>

            {/* Editorial Craft Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
                  Physical Artisan Standard
                </span>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                  How our sculptors turn photos into heirloom miniatures.
                </h2>
              </div>

              <div className="space-y-5 text-sm text-charcoal-muted leading-relaxed">
                <div className="border-l-2 border-charcoal/30 pl-4">
                  <h3 className="font-serif font-bold text-base text-charcoal">01. 3D Digital Sculpting</h3>
                  <p className="mt-1">
                    Our CAD sculptors examine your photos from multiple angles, modeling ear posture, muzzle proportions, and fur contours before any printing begins.
                  </p>
                </div>

                <div className="border-l-2 border-charcoal/30 pl-4">
                  <h3 className="font-serif font-bold text-base text-charcoal">02. High-Precision SLA Resin Printing</h3>
                  <p className="mt-1">
                    Printed at 0.05mm ultra-fine layer thickness in solid, durable resin for structural stability and razor-sharp surface fidelity.
                  </p>
                </div>

                <div className="border-l-2 border-charcoal/30 pl-4">
                  <h3 className="font-serif font-bold text-base text-charcoal">03. Hand-Painting by Studio Artists</h3>
                  <p className="mt-1">
                    Every piece is painted with professional acrylic pigments, matching distinct coat patches, eye colors, and whisker pads, sealed with satin glaze.
                  </p>
                </div>

                <div className="border-l-2 border-charcoal/30 pl-4">
                  <h3 className="font-serif font-bold text-base text-charcoal">04. 360-Degree Video Approval</h3>
                  <p className="mt-1">
                    Before shipping, we send you a turntable video of the finished piece. If you want any color tweaked, our artists adjust it until you are completely satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. WHAT PHOTOS TO SEND (Visual Photographic Guide)         */}
      {/* ========================================================= */}
      <section id="photos" className="py-20 md:py-24 border-b border-charcoal/15 bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
              Photo Guidelines
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              Three photos that guarantee an exact likeness.
            </h2>
            <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
              You do not need professional studio shots. Clear phone photos taken at eye level give our sculptors everything they need.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-charcoal/15 bg-[#FAF7F2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/pet-portrait.jpg" alt="Pet face photo guide" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">1. Eye-Level Front</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Take a straight-on photo at your pet or subject&apos;s eye level to capture facial markings, eye gaze, and muzzle shape.
              </p>
            </div>

            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-charcoal/15 bg-[#FAF7F2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/dog-real.webp" alt="Pet side profile photo guide" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">2. Side Profile</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Show full body posture, tail carriage, and ear angle so we sculpt the exact stance of your pet.
              </p>
            </div>

            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-charcoal/15 bg-[#FAF7F2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero-dog.webp" alt="Finished miniature result" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">3. Natural Lighting</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Photos taken in outdoor or window daylight help our painters match natural fur tones without flash distortion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. VERBATIM CLIENT PROOF (Instagram Monograph, NO CYLINDER)*/}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 border-b border-charcoal/15">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
                Verified Client Proof
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                Real reactions from real pet parents.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/dikor_in/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-charcoal underline hover:text-rosegold-dark shrink-0"
            >
              See {INSTAGRAM_HANDLE} Reviews Highlight &rarr;
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-charcoal/15">
            <div className="pt-6 md:pt-0 md:pr-8">
              <p className="font-serif text-lg leading-relaxed italic text-charcoal">
                &ldquo;I loved it so much! The detailing is unbelievable, looks exactly like my dog Babu. Everyone at home was amazed.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-charcoal/10">
                <strong className="text-xs font-bold text-charcoal block">@prathamesh_k17</strong>
                <span className="text-[11px] text-charcoal-muted">Babu &bull; Custom Miniature &bull; Mumbai</span>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:px-8">
              <p className="font-serif text-lg leading-relaxed italic text-charcoal">
                &ldquo;Thank you for sending me these! I&apos;m really impressed with the quality: they&apos;re absolutely amazing. Highly recommended!&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-charcoal/10">
                <strong className="text-xs font-bold text-charcoal block">@bhuumiii0111</strong>
                <span className="text-[11px] text-charcoal-muted">Custom Keepsake &bull; Verified Client</span>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:pl-8">
              <p className="font-serif text-lg leading-relaxed italic text-charcoal">
                &ldquo;Anna&apos;s miniature arrived safely in Bangalore. The packaging was so protective and the brass plaque is lovely.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-charcoal/10">
                <strong className="text-xs font-bold text-charcoal block">@ritikagandhi_</strong>
                <span className="text-[11px] text-charcoal-muted">Anna &bull; 5-Inch Miniature &bull; Bangalore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. THE MAKERS & ATELIER PROMISE                            */}
      {/* ========================================================= */}
      <section className="py-20 md:py-24 border-b border-charcoal/15 bg-white">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
            Studio Founders
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Built by Rajat &amp; Sheetal in Jalandhar.
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-charcoal-muted">
            We are artists, not a dropshipping operation. Every figurine is individually CAD-modeled, resin 3D printed, and painted by hand right here in our Punjab workshop. We only dispatch your keepsake after you have personally reviewed and approved its 360-degree craft video.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/order">
              <GoldButton>Start Your Order</GoldButton>
            </Link>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-charcoal/25 bg-white px-6 text-xs font-bold uppercase tracking-wider text-charcoal hover:border-charcoal"
            >
              Talk to Our Sculptor
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. DIRECT ATELIER FAQ                                      */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-rosegold-dark">
              Common Inquiries
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
