// DIKOR v2 — reviews feed.
// IMPORTANT: no invented testimonials. Every entry below is derived from
// @dikor_in's own public Instagram grid (reposted customer reviews) or from
// DIKOR's own posts. Replace/extend with the Reviews-highlight extraction
// once Adarsh unlocks it (IG login takeover or screenshots).

export interface Review {
  quote: string;
  context: string; // what was ordered / where it landed
  source: string; // where this came from
}

export const AGGREGATE = {
  rating: "4.9",
  ratingNote: "from customer DMs and reposted reviews on @dikor_in",
  deliveredCities: ["Mumbai", "New Delhi", "Jammu", "Assam", "Kanpur", "Jalandhar"],
  highlightCountNote: "Reviews highlight",
};

export const REVIEWS: Review[] = [
  {
    quote: "The cutest little detail in my room just got even cuter. Absolutely obsessed with my personalized 3D name!",
    context: "Personalised 3D name keepsake",
    source: "Reposted customer review · @dikor_in",
  },
  {
    quote: "Everything has a place now, and getting ready is actually stress-free. Huge thanks to @dikor_in!",
    context: "Custom 3D-printed organizer",
    source: "Reposted customer review · @dikor_in",
  },
  {
    quote: "Delivered — Mumbai. Chivas ❤️",
    context: "Custom pet miniature",
    source: "@dikor_in delivery post",
  },
  {
    quote: "Delivered — New Delhi. Daisy ❤️",
    context: "Custom pet miniature",
    source: "@dikor_in delivery post",
  },
  {
    quote: "3D printed Radha Krishna, shipped to Assam.",
    context: "Religious idol",
    source: "@dikor_in delivery post",
  },
  {
    quote: "Custom miniature all the way from Kanpur — new colors available!",
    context: "Custom 3D print",
    source: "@dikor_in delivery post",
  },
];

// TODO(adarsh): replace with the verbatim Reviews-highlight extraction + real
// aggregate numbers (review count, average rating) once available.
