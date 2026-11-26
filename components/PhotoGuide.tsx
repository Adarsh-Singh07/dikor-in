/* ---------- photo guidelines (round 3: correctly labelled, real photos) ----------
   Moved from the homepage to /order, where the photos are actually sent.
   Step 3 was wrong: it showed a finished figurine and called it "Natural
   lighting". It now shows a real dog in warm sunlight — a genuine photo
   example. Step 2 is a real side profile (golden dog, living room). The
   three images still differ in style; a matched set needs a reshoot. */
const PHOTO_GUIDE = [
  {
    img: "/images/pet-portrait.jpg",
    alt: "Pet face photo guide",
    t: "1. Eye-level front",
    d: "A straight-on photo at your pet or subject's eye level, to capture facial markings, eye gaze, and muzzle shape.",
  },
  {
    img: "/images/dog-real.webp",
    alt: "Pet side profile photo guide",
    t: "2. Side profile",
    d: "Full body posture, tail carriage, and ear angle, so we sculpt the exact stance of your pet.",
  },
  {
    img: "/images/dog-figurine.jpg",
    alt: "Pet photo in natural light",
    t: "3. Natural light",
    d: "Soft daylight, no flash, so our painters match the true fur colours.",
  },
];

export default function PhotoGuide() {
  return (
    <section className="mt-16 border-t border-charcoal/10 pt-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">Photo guidelines</p>
        <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">
          Three photos that guarantee an exact likeness.
        </h2>
        <p className="mt-3 text-charcoal-muted">
          You do not need professional studio shots. Clear phone photos give our sculptors everything they need. Send 4–5: face from the front and the full body.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {PHOTO_GUIDE.map((g) => (
          <div key={g.t} className="space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-cream-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.img} alt={g.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="font-display text-2xl text-charcoal">{g.t}</h3>
            <p className="text-sm leading-relaxed text-charcoal-muted">{g.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
