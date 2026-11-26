import Link from "next/link";
import { SectionHeading } from "@/components/ui";

/**
 * Steps and included-items copy live here, not in lib/catalog: the catalog's
 * upstream versions still name the advance split and the old delivery window,
 * which must not appear on this pre-login page. Keep in sync with the redesign's
 * FLOW_STEPS copy (7–10 days, no advance split).
 */
const FLOW_STEPS = [
  { n: 1, title: "Send 4–5 clear photos", copy: "Start here — share photos of your pet or subject. We'll guide you on size, pose and the name tag text." },
  { n: 2, title: "Confirm your order", copy: "Your order is confirmed and your production slot is reserved. Payment details appear in your dashboard after you sign in." },
  { n: 3, title: "We print & hand-paint", copy: "Your piece is 3D-printed layer by layer, then hand-painted by our artists.", eta: "4–5 days" },
  { n: 4, title: "Approve your video", copy: "We send photos or a video of the finished piece. We only ship it when you say it's perfect." },
  { n: 5, title: "Approve & we ship", copy: "Say it's perfect and your keepsake ships to your doorstep, packed with care.", eta: "7–10 days delivery" },
];

const INCLUDED_ALWAYS = [
  "Personalised name tag on every figurine",
  "Shipping across India included in the price",
  "Photos / video of the finished piece for your approval before shipping",
  "Carefully packed, made-to-order just for you",
];

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

      <div className="mx-auto max-w-4xl">
        {FLOW_STEPS.map((s) => (
          <div key={s.n} className="flex gap-6 border-b border-charcoal/10 py-8 first:pt-0">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold font-display text-3xl text-charcoal">
              {s.n}
            </span>
            <div>
              <h3 className="font-display text-2xl text-charcoal md:text-3xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-charcoal-muted">{s.copy}</p>
              {s.eta && (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">
                  {s.eta}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <div className="overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/process-painting.webp" alt="DIKOR artists hand-painting a 3D-printed figurine" className="aspect-[16/9] w-full object-cover" loading="lazy" />
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-charcoal-muted">Inside the studio — hand-painted, layer by layer</p>
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
        <Link href="/order" className="inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition hover:bg-gold-light">
          Start your custom order
        </Link>
      </div>
    </div>
  );
}
