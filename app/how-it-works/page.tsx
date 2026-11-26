import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { FLOW_STEPS, INCLUDED_ALWAYS } from "@/lib/catalog";

/* How it works (round 3): the steps live in lib/catalog now — one source of
   truth, shared with the homepage craft line (step 5 is "We ship", not a
   second "Approve"). The scroll-jacked horizontal carousel is gone; the
   steps are a plain 5-column layout. The AI-looking hand-painting photo
   is gone too; the one studio image is a real photo of finished pieces.
   Per-step photos need a reshoot — no photo is shown where none exists. */
const DETAILS = [
  {
    t: "Made to order, just for you",
    d: "Every piece is printed and painted for one person — you. Nothing is stocked, nothing is mass-made. Payment steps appear in your dashboard after you sign in.",
  },
  {
    t: "You approve before we ship",
    d: "We share photos or a video of your finished piece for approval. Didn't love something? Tell us what to change and we'll rework it. We ship only when you say it's perfect.",
  },
  {
    t: "Timelines you can trust",
    d: "Printing and hand-painting take 4–5 days; delivery usually takes 7–10 days after that, depending on your location. Track every stage from your dashboard.",
  },
  {
    t: "Packed like a gift",
    d: "Every order ships pan-India in protective, gift-ready packaging — shipping is included in your price, along with the personalised name tag.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <SectionHeading
        title="Five steps to your keepsake"
        sub="A process designed around one promise: you approve everything before it ships."
      />

      <div className="grid gap-10 md:grid-cols-5 md:gap-6">
        {FLOW_STEPS.map((s) => (
          <div key={s.n} className="border-t-2 border-charcoal pt-6">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-charcoal font-display text-2xl text-cream">
              {s.n}
            </span>
            <h3 className="mt-4 font-display text-2xl leading-snug text-charcoal">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{s.copy}</p>
            {s.eta && (
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">
                {s.eta}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <div className="overflow-hidden rounded-sm bg-cream-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/pets-group.webp" alt="Finished DIKOR pet miniatures, ready to ship" className="aspect-[16/9] w-full object-contain" loading="lazy" />
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">Finished pieces, ready to ship</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
        {DETAILS.map((d) => (
          <div key={d.t} className="border-t border-charcoal/10 pt-6">
            <h3 className="font-display text-2xl text-charcoal">{d.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{d.d}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl border-t border-charcoal/10 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Always included</p>
        <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="mt-12 text-center">
        <Link href="/order" className="inline-block rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition hover:bg-black">
          Start your custom order
        </Link>
      </div>
    </div>
  );
}
