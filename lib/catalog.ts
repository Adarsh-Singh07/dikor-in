// DIKOR v2: single source of truth for the public site.
// Focused exclusively on custom 3D miniatures: Dogs, Cats, Humans.

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

  // Cats
  { id: "cat-5-standard", label: '5" · Cat (Standard Pose)', category: "Cats", price: 1500 },
  { id: "cat-7-collector", label: '7" · Cat (Collector Scale)', category: "Cats", price: 1700 },

  // Humans
  { id: "human-5-portrait", label: '5" · Human Miniature (Individual Portrait)', category: "Humans", price: 1999 },
  { id: "human-7-collector", label: '7" · Human Miniature (Collector Scale)', category: "Humans", price: 2499 },
];

// Backward-compatible alias for existing imports
export const PET_SIZES = PRODUCT_SIZES;

export interface Category {
  key: "Dogs" | "Cats" | "Humans";
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
    key: "Dogs",
    title: "Custom Dog Miniature",
    tagline: "Your dog, sculpted and hand-painted",
    fromPrice: "₹1,500",
    priceConfirmed: true,
    image: "/images/hero-dog.webp",
    copy: "Hand-sculpted from 4-5 clear photos of your dog. We match coat markings, ear angles, and facial expressions in high-precision resin.",
    cta: "Customise Dog Miniature",
  },
  {
    key: "Cats",
    title: "Custom Cat Miniature",
    tagline: "Lifelike feline detail from your photos",
    fromPrice: "₹1,500",
    priceConfirmed: true,
    image: "/images/cat-figurine.jpg",
    copy: "From Persian to Indie cats, our studio artists hand-layer acrylic colors and fine details to honor your cat in physical form.",
    cta: "Customise Cat Miniature",
  },
  {
    key: "Humans",
    title: "Custom Human Miniature",
    tagline: "Individual portraits and milestone keepsakes",
    fromPrice: "₹1,999",
    priceConfirmed: true,
    image: "/images/kid.webp",
    copy: "Preserve a child's milestone or a personal portrait. 3D-sculpted directly from photographs and individually hand-detailed in Jalandhar.",
    cta: "Customise Human Miniature",
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

/** FAQ content addressing pet and human miniature craftsmanship */
export const FAQS: Faq[] = [
  {
    q: "What is the price and size of a custom miniature?",
    a: "Our custom 3D miniatures include an engraved brass plaque and free pan-India courier shipping. A 5-inch dog or cat miniature is ₹1,500 for slim breeds and ₹2,000 for bulky breeds. A 7-inch dog miniature starts at ₹1,700 for slim breeds. 5-inch human portrait miniatures start at ₹1,999.",
  },
  {
    q: "How does payment work?",
    a: "You pay 75% advance to confirm your order and reserve your 3D sculpting slot. The remaining 25% balance is due only after you inspect and approve the finished 360-degree craft video of your piece.",
  },
  {
    q: "How do I place an order?",
    a: "Simply upload 4-5 clear photos (front face, side angles, full standing pose) on this page or send them directly via our WhatsApp link. We guide you through size selection, posture, and plaque text.",
  },
  {
    q: "How long does delivery take?",
    a: "3D CAD sculpting, resin printing, and hand-painting take 4-5 days. Pan-India courier delivery takes 6-7 days after your video approval.",
  },
  {
    q: "What kind of photos work best?",
    a: "Clear, well-lit photos taken at eye level. Show the face straight-on and full body views so we accurately replicate fur patterns, colors, and proportions.",
  },
  {
    q: "Will I see the figurine before it ships?",
    a: "Yes. Every single order includes an approval step: our studio records a 360-degree turntable video of your completed piece and only ships after you confirm it looks right.",
  },
  {
    q: "Why is Cash on Delivery not available?",
    a: "Because each figurine is permanently personalized and bespoke to your photos. The 75% advance covers raw resin and artist allocation, and the 360-degree video proof guarantees your satisfaction before final dispatch.",
  },
];

/** Customer-facing journey */
export interface FlowStep {
  n: number;
  title: string;
  copy: string;
  eta?: string;
}

export const FLOW_STEPS: FlowStep[] = [
  { n: 1, title: "Send 4-5 clear photos", copy: "Share front, side, and standing photos of your dog, cat, or portrait subject." },
  { n: 2, title: "Pay 75% advance", copy: "Confirms your order and locks in studio sculpting and printing time." },
  { n: 3, title: "We 3D-sculpt & hand-paint", copy: "Layer-by-layer resin 3D printing followed by acrylic hand-detailing by Jalandhar artists.", eta: "4-5 days" },
  { n: 4, title: "Approve 360-degree video", copy: "Inspect every angle of the finished piece. We only ship once you give approval." },
  { n: 5, title: "Pay 25% balance & courier ships", copy: "Clear the remaining 25% and your keepsake is couriered in an insured wooden crate.", eta: "6-7 days delivery" },
];

/** Map public catalogue keys to database categories */
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
  if (categoryKey === "Humans") return 1999;
  return 1500;
}

export const inr = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");

export function splitFor(total: number) {
  const advance = Math.round((total * ADVANCE_PCT) / 100);
  return { advance, balance: total - advance };
}

/** Prefilled WhatsApp message for an order, or a generic enquiry */
export function whatsappOrderLink(summary: string) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(summary)}`;
}
