import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, GoldButton } from "@/components/ui";
import { FLOW_STEPS, INCLUDED_ALWAYS } from "@/lib/catalog";

const DETAILS = [
  {
    t: "Split Payments via Easebuzz",
    d: "A 75% advance reservation deposit confirms your order and starts 3D CAD modeling. The remaining 25% balance is due only before shipping, after you have inspected and approved the finished craft video proof.",
  },
  {
    t: "You Approve Before We Ship",
    d: "We share high-resolution photos and a 360° turntable video of your finished piece for approval. Didn't love something? Tell us what to tweak and our artists will rework it. We ship only when you say it's perfect.",
  },
  {
    t: "Timelines You Can Trust",
    d: "Printing and hand-painting take 4-5 days; pan-India courier delivery usually takes 6-7 days after that. Track every milestone live from your studio dashboard.",
  },
  {
    t: "Gift-Ready Protective Packaging",
    d: "Every order ships pan-India in a shockproof, velvet-lined wooden keepsake crate: shipping is complimentary on every figurine, along with the laser-engraved brass plaque.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Craft &amp; Approval Journey"
          title={<>Five Steps to Your <span className="text-rosegold-dark italic font-normal">3D Keepsake</span></>}
          sub="A luxury artisan process designed around one promise: you approve the physical sculpture before anything leaves our studio."
        />
      </Reveal>

      <div className="mx-auto max-w-4xl space-y-6">
        {FLOW_STEPS.map((s) => (
          <Reveal key={s.n} delay={s.n * 0.05}>
            <div className="flex gap-6 rounded-3xl border border-charcoal/15 bg-white p-7 shadow-card transition-all duration-500 hover:shadow-soft md:p-8">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#E2CA76] font-serif font-bold text-3xl text-charcoal shadow-gold">
                {s.n}
              </span>
              <div>
                <h3 className="font-serif font-bold text-2xl text-charcoal md:text-3xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-charcoal-muted text-sm md:text-base">{s.copy}</p>
                {s.eta && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FAF7F2] border border-charcoal/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-rosegold-dark">
                    ⏱ {s.eta}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-16 max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-charcoal/10 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/process-painting.webp"
            alt="DIKOR artists hand-painting a 3D-printed figurine"
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">
          Inside the DIKOR Jalandhar Studio: hand-painted, layer by layer
        </p>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
        {DETAILS.map((d, i) => (
          <Reveal key={d.t} delay={i * 0.07}>
            <div className="h-full rounded-3xl bg-[#FAF7F2] p-8 border border-charcoal/10 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
              <h3 className="font-serif font-bold text-2xl text-charcoal">{d.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{d.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 border border-charcoal/10 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold-dark">
          Always Included in Every Order
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-charcoal-soft sm:grid-cols-2">
          {INCLUDED_ALWAYS.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="text-gold-dark font-bold">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-12 text-center">
        <Link href="/order">
          <GoldButton>Start Your 3D Keepsake</GoldButton>
        </Link>
      </Reveal>
    </div>
  );
}
