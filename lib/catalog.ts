// DIKOR v2: single source of truth for the public site.
// Round-2 editorial categories only: Pets, Cats, Kids, Decor.
// Pricing facts come from DIKOR's Instagram Q&A (2026-10-16). Values flagged
// PENDING_ADARSH are placeholders Adarsh will confirm — do not present them as
// DIKOR's real prices in any quote/checkout until confirmed.

export const WHATSAPP_NUMBER = "919878070123";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_HANDLE = "@dikor_in";

export const ADVANCE_PCT = 75;
export const BALANCE_PCT = 25;

/** Pet and Human sizes in inches. `price: null` => confirmed on WhatsApp. */
export interface PetSizeOption {
  id: string;
  label: string;
  category: "Dogs" | "Cats" | "Humans" | "Pets";
  build?: "slim" | "bulky";
  price: number | null;
}

export const PRODUCT_SIZES: PetSizeOption[] = [
  // Dogs
  { id: "dog-5-slim", label: '5" · Dog (Slim Breed: Indie, Beagle, Shih Tzu)', category: "Dogs", build: "slim", price: 1500 },
  { id: "dog-5-bulky", label: '5" · Dog (Bulky Breed: Golden, Lab, GSD, Pug)', category: "Dogs", build: "bulky", price: 2000 },
  { id: "dog-7-slim", label: '7" · Dog (Slim Breed: Indie, Beagle, Spaniel)', category: "Dogs", build: "slim", price: 1700 },
  { id: "dog-7-bulky", label: '7" · Dog (Bulky Breed: Large Breeds)', category: "Dogs", build: "bulky", price: null },

  // Cats — same pet miniature rates as dogs (round-2 redesign)
  { id: "cat-5-standard", label: '5" · Cat (Standard Pose)', category: "Cats", price: 1500 },
  { id: "cat-7-collector", label: '7" · Cat (Collector Scale)', category: "Cats", price: 1700 },

  // Humans — single-person portraits / child milestones
  { id: "human-5-portrait", label: '5" · Human Miniature (Individual Portrait)', category: "Humans", price: 1999 },
  { id: "human-7-collector", label: '7" · Human Miniature (Collector Scale)', category: "Humans", price: 2499 },
];

// Backward-compatible alias for existing imports
export const PET_SIZES = PRODUCT_SIZES;

export interface Category {
  key: "Pets" | "Cats" | "Kids" | "Decor";
  title: string;
  tagline: string;
  fromPrice: string;
  priceConfirmed: boolean;
  image: string;
  copy: string;
  cta: string;
}

export const CATEGORIES: Category[] = [
  {
    key: "Pets",
    title: "Custom Pet Miniature",
    tagline: "Your pet, frozen in miniature",
    fromPrice: "₹1,500",
    priceConfirmed: true,
    image: "/images/hero-dog.webp",
    copy: "Hand-painted replicas of your dog from 4–5 clear photos. Lifelike enough that friends will do a double take.",
    cta: "Start a pet figurine",
  },
  {
    key: "Cats",
    title: "Custom Cat Miniature",
    tagline: "Your cat, frozen in miniature",
    fromPrice: "₹1,500",
    priceConfirmed: true,
    image: "/images/cat-figurine-card.jpg",
    copy: "Hand-painted replicas of your cat from 4–5 clear photos — same sizes and prices as our pet miniatures.",
    cta: "Start a cat figurine",
  },
  {
    key: "Kids",
    title: "Custom Kid Miniature",
    tagline: "Little moments, kept forever",
    fromPrice: "From ₹1,999",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/kid.webp",
    copy: "A child's favourite pose or a family's newest member, turned into a keepsake you'll hold for decades.",
    cta: "Start a kid figurine",
  },
  {
    key: "Decor",
    title: "Custom Decor",
    tagline: "Showpieces for warm homes",
    fromPrice: "From ₹1,499",
    priceConfirmed: false, // PENDING_ADARSH
    image: "/images/decor.webp",
    copy: "Sculptural vases, stackable trays and custom decor — designed for your space, printed to order.",
    cta: "Browse decor",
  },
];

/** What is always included with every DIKOR order */
export const INCLUDED_ALWAYS = [
  "Personalised laser-engraved brass name plaque",
  "Free insured pan-India courier delivery",
  "360-degree craft proof video for your approval before shipping",
  "Shockproof velvet-lined wooden keepsake presentation box",
];

export interface Faq {
  q: string;
  a: string;
}

/** FAQ content — round-3 wording: five short questions only. Prices live in
 *  the pricing table on the homepage, photo guidance lives on /order. */
export const FAQS: Faq[] = [
  {
    q: "How does payment work?",
    a: "Sign in to your dashboard and you will see the payment steps for your order there. We share photos or a video of the finished piece for your approval before it ships.",
  },
  {
    q: "How long does delivery take?",
    a: "Printing and hand-painting take 4–5 days. Delivery usually takes 7–10 days after that, depending on your location. We ship across India.",
  },
  {
    q: "Will I see the figurine before it ships?",
    a: "Yes. We share photos or a video of your finished piece and only ship it once you love it.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "No. Every piece is made to order just for you, so we take payment online. The approval photos are your guarantee.",
  },
  {
    q: "What is a DIKOR figurine made of?",
    a: "Your piece is 3D-printed layer by layer and then hand-painted by our studio artists. It is a display keepsake, not a toy. Keep it dry and handle it with care.",
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
  { n: 2, title: "Confirm your order", copy: "Your order is confirmed and your production slot is reserved. Payment details appear in your dashboard after you sign in." },
  { n: 3, title: "We print & hand-paint", copy: "Your piece is 3D-printed layer by layer, then hand-painted by our artists.", eta: "4–5 days" },
  { n: 4, title: "Approve your video", copy: "We send photos or a video of the finished piece. We only ship it when you say it's perfect." },
  { n: 5, title: "We ship", copy: "Say it's perfect and your keepsake ships to your doorstep, packed with care.", eta: "7–10 days delivery" },
];

/** Map public catalogue keys to database categories.
 *  Kept from upstream: the builder works in Dogs / Cats / Humans and the API
 *  stores Pets / Cats / Kids, so Dogs -> Pets and Humans -> Kids. */
export function catalogKeyToStoreCategory(key: string): string {
  switch (key) {
    case "Dogs":
    case "Cats":
      return "Pets";
    case "Humans":
      return "Kids";
    default:
      return key;
  }
}

/** Resolve the unit price for a builder selection */
export function priceFor(categoryKey: string, sizeId?: string): number | null {
  if (sizeId) {
    const opt = PRODUCT_SIZES.find((s) => s.id === sizeId);
    if (opt && opt.price !== null) return opt.price;
  }
  if (categoryKey === "Dogs" || categoryKey === "Cats" || categoryKey === "Pets") return 1500;
  if (categoryKey === "Humans" || categoryKey === "Kids") return 1999;
  return 1500;
}

export const inr = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");

export function splitFor(total: number) {
  const advance = Math.round((total * ADVANCE_PCT) / 100);
  return { advance, balance: total - advance };
}

/** Prefilled WhatsApp message for an order, or a generic enquiry. */
export function whatsappOrderLink(summary: string) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(summary)}`;
}
