import type { Category } from "@/lib/store";

export interface Piece {
  id: string;
  category: Category;
  title: string;
  note: string;
  from: number;
  tag?: "Bestseller" | "New" | "Festive";
}

export const PIECES: Piece[] = [
  { id: "p1", category: "Pets", title: "Signature Pet Replica", note: '4" hand-painted, name plinth', from: 1999, tag: "Bestseller" },
  { id: "p2", category: "Couples", title: "Anniversary Duo", note: "Couple miniature in your outfits", from: 2499, tag: "Bestseller" },
  { id: "p3", category: "Idols", title: "Radha Krishna", note: '6" antique gold finish', from: 2999, tag: "Festive" },
  { id: "p4", category: "Kids", title: "First Birthday Keepsake", note: "Playful pose, pastel base", from: 1999, tag: "New" },
  { id: "p5", category: "Decor", title: "Bloom Vase Trio", note: "Twisted, layer-lined showpieces", from: 1499, tag: "New" },
  { id: "p6", category: "Pets", title: "Pet & Photo Frame", note: "Replica beside a framed print", from: 2799 },
  { id: "p7", category: "Couples", title: "Wedding Day Cake Topper", note: "Bride & groom, gift-boxed", from: 2999, tag: "Festive" },
  { id: "p8", category: "Idols", title: "Blessing Ganesha", note: "Festive centrepiece, ivory or gold", from: 2499, tag: "Bestseller" },
  { id: "p9", category: "Decor", title: "Family Nameplate", note: "Hand-finished entryway piece", from: 1799 },
  { id: "p10", category: "Kids", title: "Sibling Set", note: "Two miniatures, one shared base", from: 3299 },
];

export const TESTIMONIALS = [
  {
    quote:
      "They turned three phone photos of our late Labrador into a figurine that honestly made my mother cry. The video preview before shipping gave us total confidence.",
    name: "Ritika S.",
    place: "Pune",
    piece: "Pet replica",
  },
  {
    quote:
      "Ordered an anniversary miniature for my parents. The quote was clear, the finish is gorgeous rose gold, and it arrived beautifully packed.",
    name: "Arjun M.",
    place: "Bengaluru",
    piece: "Couple miniature",
  },
  {
    quote:
      "The Ganesha idol has become the centre of our pooja room. Every detail was discussed with us, and the revisions were genuinely free.",
    name: "Neha & Vikram",
    place: "Jaipur",
    piece: "Devotional idol",
  },
];
