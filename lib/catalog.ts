// DIKOR v2 — single source of truth for the public site.
// Pricing facts come from DIKOR's Instagram Q&A (2026-10-16). Values flagged
// PENDING_ADARSH are placeholders Adarsh will confirm — do not present them as
// DIKOR's real prices in any quote/checkout until confirmed.

export const WHATSAPP_NUMBER = "919878070123";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_HANDLE = "@dikor_in";

export const ADVANCE_PCT = 75;
export const BALANCE_PCT = 25;

/** Pet sizes in inches. `price: null` => price confirmed personally (e.g. 7" bulky). */
export interface PetSizeOption {
  id: string;
  label: string;
  build: "slim" | "bulky";
  price: number | null;
}
export const PET_SIZES: PetSizeOption[] = [
  { id: "5-slim", label: '5" · Slim breeds', build: "slim", price: 1500 },
  { id: "5-bulky", label: '5" · Bulky breeds', build: "bulky", price: 2000 },
  { id: "7-slim", label: '7" · Slim breeds', build: "slim", price: 1700 },
  // 7-inch bulky price was cut off in DIKOR's IG Q&A screenshot — Adarsh to confirm.
  { id: "7-bulky", label: '7" · Bulky breeds', build: "bulky", price: null },
];

export interface Category {
  key: string;
  tagline: string;
  /** "from" price shown in the catalogue. PET pricing is exact per size; others are placeholders. */
  fromPrice: string;
  /** true => exact DIKOR pricing; false => PENDING_ADARSH placeholder */
  priceConfirmed: boolean;
  image: string;
  copy: string;
  cta: string;
}

export const CATEGORIES: Category[] = [
  {
    key: "Pets",
    tagline: "Your pet, frozen in miniature",
    fromPrice: "₹1,500",
    priceConfirmed: true,
    image: "/images/hero-dog.webp",
    copy: "Hand-painted replicas of your dog or cat from 4–5 clear photos. Lifelike enough that friends will do a double take.",
    cta: "Start a pet figurine",
  },
  {
    key: "Couples",
    tagline: "The two of you, keepsake-sized",
    fromPrice: "From ₹1,999",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/couple.webp",
    copy: "Anniversary, wedding, or just-because — a miniature of the two of you, finished by hand.",
    cta: "Start a couple figurine",
  },
  {
    key: "Kids",
    tagline: "Little moments, kept forever",
    fromPrice: "From ₹1,999",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/kid.webp",
    copy: "A child's favourite pose or a family's newest member, turned into a keepsake you'll hold for decades.",
    cta: "Start a kid figurine",
  },
  {
    key: "Religious",
    tagline: "Deities, hand-finished with care",
    fromPrice: "From ₹2,999",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/ganesha.webp",
    copy: "Idols like Radha Krishna and Ganesha, printed in fine detail and finished in rich, devotional colours.",
    cta: "Order an idol",
  },
  {
    key: "Decor",
    tagline: "Showpieces for warm homes",
    fromPrice: "From ₹1,499",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/decor.webp",
    copy: "Sculptural vases, stackable trays and custom decor — designed for your space, printed to order.",
    cta: "Browse decor",
  },
];

/** What's always included — from the IG Q&A: name tag + shipping included. */
export const INCLUDED_ALWAYS = [
  "Personalised name tag on every figurine",
  "Shipping across India included in the price",
  "Photos / video of the finished piece for your approval before shipping",
  "Carefully packed, made-to-order just for you",
];

export interface Faq {
  q: string;
  a: string;
}

/** FAQ content taken verbatim in substance from DIKOR's Instagram Q&A (Oct 2026). */
export const FAQS: Faq[] = [
  {
    q: "What is the price and size of a custom pet miniature?",
    a: "Our custom 3D pet miniatures come with a personalised name tag, and shipping is included. A 5-inch miniature is ₹1,500 for slim breeds and ₹2,000 for bulky breeds. A 7-inch miniature starts at ₹1,700 for slim breeds — the 7-inch bulky price is confirmed with you personally on WhatsApp.",
  },
  {
    q: "How does payment work?",
    a: "You pay 75% in advance to start your order, and the remaining 25% before shipping, since every piece is custom-made for you. We share pictures or a video of the finished product with you for approval before it ships.",
  },
  {
    q: "How do I place an order?",
    a: "It's simple: send us 4–5 clear photos of your pet (or the person/subject), and we'll guide you through the rest — size, name tag text, pose and colour details.",
  },
  {
    q: "How long does delivery take?",
    a: "Printing and hand-painting take 4–5 days. Delivery usually takes 6–8 days after that, depending on your location. We ship across India.",
  },
  {
    q: "What kind of photos should I send?",
    a: "Clear, well-lit photos work best — show the face from the front and the full body so we can match markings, colours and proportions. The more angles, the better the likeness.",
  },
  {
    q: "Will I see the figurine before it ships?",
    a: "Yes. Every order includes an approval step: we share photos or a video of your finished piece and only ship it once you love it.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Every DIKOR piece is made to order just for you, so we work on a 75% advance and 25% before shipping. The approval photos are your guarantee.",
  },
  {
    q: "What is a DIKOR figurine made of?",
    a: "Your piece is 3D-printed layer by layer and then hand-painted by our studio artists — a display keepsake, not a toy. Keep it dry and handle it with care.",
  },
];

/** Customer-facing journey, in plain language — mirrors the real order states. */
export interface FlowStep {
  n: number;
  title: string;
  copy: string;
  eta?: string;
}
export const FLOW_STEPS: FlowStep[] = [
  { n: 1, title: "Send 4–5 clear photos", copy: "Start here — share photos of your pet or subject. We'll guide you on size, pose and the name tag text." },
  { n: 2, title: "Pay 75% advance", copy: "A 75% advance confirms your order and reserves your production slot. The rest is only due before shipping." },
  { n: 3, title: "We print & hand-paint", copy: "Your piece is 3D-printed layer by layer, then hand-painted by our artists.", eta: "4–5 days" },
  { n: 4, title: "Approve your video", copy: "We send photos or a video of the finished piece. We only ship it when you say it's perfect." },
  { n: 5, title: "Pay 25% & we ship", copy: "Clear the remaining 25% and your keepsake ships to your doorstep, packed with care.", eta: "6–8 days delivery" },
];

/** Map public catalogue keys to the demo store categories. */
export function catalogKeyToStoreCategory(key: string): "Pets" | "Couples" | "Kids" | "Idols" | "Decor" {
  switch (key) {
    case "Religious": return "Idols";
    default: return key as "Pets" | "Couples" | "Kids" | "Idols" | "Decor";
  }
}

/** Resolve the unit price for a builder selection. null => needs WhatsApp confirmation. */
export function priceFor(categoryKey: string, sizeId?: string): number | null {
  if (categoryKey === "Pets" && sizeId) {
    const opt = PET_SIZES.find((s) => s.id === sizeId);
    return opt ? opt.price : null;
  }
  const cat = CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return null;
  if (!cat.priceConfirmed) return null;
  const m = cat.fromPrice.replace(/[₹,\s]/g, "").match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function splitFor(total: number) {
  const advance = Math.round((total * ADVANCE_PCT) / 100);
  return { advance, balance: total - advance };
}

/** Prefilled WhatsApp message for an order, or a generic enquiry. */
export function whatsappOrderLink(summary: string) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(summary)}`;
}
