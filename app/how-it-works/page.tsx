import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Sparkle, GoldButton } from "@/components/ui";
import { PIPELINE_STEPS } from "@/lib/store";

const DETAILS = [
  {
    t: "Payments, split fairly",
    d: "A 40% advance confirms your slot. The remaining 60% is due only when your keepsake is finished and ready to ship. This is a demo site — payments here are simulated and no real money moves.",
  },
  {
    t: "Revisions are included",
    d: "Didn't love something in the demo video? Tell us what to change — colour, pose, finish — and we'll rework it and share a fresh demo. We ship only when you say it's perfect.",
  },
  {
    t: "Timelines you can trust",
    d: "Most keepsakes deliver in 10–15 days. Your quotation states an exact timeline, and your dashboard tracks every stage from printing to doorstep.",
  },
  {
    t: "Packed like a gift",
    d: "Every order ships pan-India in protective, gift-ready packaging — because most DIKOR pieces are surprises for someone loved.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title={<>Five steps to your <em className="text-rosegold-dark">keepsake</em></>}
          sub="A process designed around one promise: you approve everything before it ships."
        />
      </Reveal>

      <div className="mx-auto max-w-4xl space-y-6">
        {PIPELINE_STEPS.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.06}>
            <div className="flex gap-6 rounded-3xl border border-gold/25 bg-white/70 p-7 shadow-card backdrop-blur transition-all duration-500 hover:shadow-soft md:p-8">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-display text-3xl text-charcoal shadow-gold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl text-charcoal md:text-3xl">{s.label}</h3>
                <p className="mt-2 leading-relaxed text-charcoal-muted">{s.blurb}</p>
                {i === 3 && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-rosegold-dark">
                    <Sparkle className="h-3.5 w-3.5 text-gold-dark" /> Revisions included — free
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
        {DETAILS.map((d, i) => (
          <Reveal key={d.t} delay={i * 0.07}>
            <div className="h-full rounded-3xl bg-cream-dark p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
              <h3 className="font-display text-2xl text-charcoal">{d.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">{d.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <Link href="/auth">
          <GoldButton>Start your custom order</GoldButton>
        </Link>
      </Reveal>
    </div>
  );
}
