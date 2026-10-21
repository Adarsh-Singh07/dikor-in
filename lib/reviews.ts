// DIKOR v2 — reviews feed.
// Verbatim customer words from @dikor_in's own public "Reviews ✨" highlight,
// transcribed from Adarsh's screen recording of the highlight on 2026-10-21
// (saved: workspace/dikor-in/research/dikor-reviews-highlight-2026-10-21.mp4).
// No invented testimonials: only slides with real customer text are included;
// photo-only slides (no review text) are left out. Months are as shown in the
// highlight; the year is inferred 2026 from the recording date. Stars are shown
// only where the slide itself displayed a 5-star rating. Ellipses mark a gap
// in a partially legible slide, never added words.

export interface Review {
  quote: string;
  handle?: string; // customer Instagram handle, as shown in the highlight
  context: string; // what was ordered
  date: string; // month shown in the highlight
  stars?: boolean; // true only where the slide showed a 5-star rating
}

export const AGGREGATE = {
  reviewNote: "customer reviews from our Reviews highlight on @dikor_in",
  deliveredCities: ["Mumbai", "New Delhi", "Jammu", "Assam", "Kanpur", "Jalandhar"],
};

export const REVIEWS: Review[] = [
  {
    quote:
      "Thank you tons @dikor_in .. now I have something to hold on to forever, thank you for giving me my baby back! ❤️🥺",
    handle: "niddhi_irl",
    context: "Custom pet miniature “Babu”",
    date: "Oct 2026",
  },
  {
    quote:
      "No words but gratitude. Feels like he is with us. 🙏❤️🥺 Thank you @dikor_in for this amazing miniature statue of my beloved dog Dido who left us in 2024.",
    handle: "dlinsvi9",
    context: "Custom pet miniature “Dido”",
    date: "Sep 2026",
  },
  {
    quote:
      "Thanks @dikor_in the way you all have crafted her so beautifully..thank you for everything 🙏",
    handle: "_florenceinbloom_",
    context: "Custom pet miniature “Anna”",
    date: "Oct 2026",
  },
  {
    quote: "Omg I am in love 😍 Get your 3D model now with @dikor_in ❤️",
    handle: "themeghamood",
    context: "Custom pet model (golden retriever)",
    date: "Aug 2026",
  },
  {
    quote:
      "Absolutely amazing product! The quality is excellent and it exceeded my expectations. Highly recommended to anyone looking for a reliable and worthwhile purchase.",
    handle: "_anjali_saini001",
    context: "Personalised 3D name sign “Anjali”",
    date: "Jun 2026",
    stars: true,
  },
  {
    quote:
      "I'm very happy with this product. The quality is really good, the design looks attractive, and it feels well made. The price is also very reasonable for the quality. Overall, a great product and definitely worth buying!",
    handle: "pov_daksh7",
    context: "Personalised 3D name sign “Daksh”",
    date: "Aug 2026",
  },
  {
    quote:
      "Thnku so much for this beautiful gift! Excellent quality and thoughtful design. It holds all my makeup products without taking up too much space. And is top notch highly recommended!",
    handle: "_priya_saini_05",
    context: "Custom makeup organizer",
    date: "Jun 2026",
  },
  {
    quote:
      "I absolutely love this organizer. It has a unique design and is very sturdy. It keeps all my products in one place and looks great… Super cute and perfect for daily essentials",
    handle: "komal.saini015",
    context: "Custom makeup organizer",
    date: "Jun 2026",
    stars: true,
  },
  {
    quote:
      "Thank you for sending me these! I'm really impressed with the quality—they're absolutely amazing. Do check out their account, follow them, and place your order. Highly recommended!",
    handle: "bhuumiii0111",
    context: "Heart jewellery tray",
    date: "Jun 2026",
  },
  {
    quote:
      "Highly recommend them if you're looking for personalized decor that feels truly special ✨",
    handle: "lavanya_saini2504",
    context: "Personalised 3D name sign “Lavanya”",
    date: "Jun 2026",
  },
  {
    quote:
      "Thank you for so amazing pieces. Loved them!! Can't wait to order again ❤️",
    handle: "aakrit_444",
    context: "Personalised name keychains",
    date: "Jun 2026",
  },
  {
    quote: "Thank you for this beautiful gift",
    handle: "shrutii.0202",
    context: "Personalised 3D name sign “Shruti”",
    date: "Jun 2026",
  },
  {
    quote:
      "Loved these 3D prints! Thanks for the thoughtful gift @dikor_in. Go check them out!",
    handle: "aadyasharma_",
    context: "Organizer + name keychain",
    date: "Jun 2026",
  },
  {
    quote: "Thankyou @dikor_in ♥",
    context: "Personalised keepsake basket “Avaanshika”",
    date: "Jul 2026",
    stars: true,
  },
  {
    quote:
      "If you want this type of decor just dm here nd order yours @dikor_in ✨",
    context: "Personalised decor sign “Mahi”",
    date: "Jul 2026",
  },
  {
    quote:
      "Thanku dikor for this lovely gift ..quality is also very nice I loved this gift ❤️❤️",
    handle: "simranmann951",
    context: "“Simran” heart sign",
    date: "Aug 2026",
  },
  {
    quote:
      "Thank you so much @dikor_in for the new perfume shelf! It makes my collection look so neat and pretty 🥰",
    handle: "chinusaini_",
    context: "Arch perfume shelf",
    date: "Sep 2026",
  },
  {
    quote:
      "Radha Krishna aaj mil gaye aur main bahut khush hu 😍 Aap logon ne itne pyaar aur mehnat se banaya hai… dekhte hi mann khush ho gaya. Finishing bhi kamaal ki hai aur packaging bhi bahut secure thi. Thank you so much 🙏 and wishing you both all the very best for the future, keep up the good work 😊",
    context: "3D printed Radha Krishna",
    date: "Oct 2026",
  },
  {
    quote: "THANK YOU SO MUCH!",
    handle: "rubysaini1560",
    context: "Personalised name signs",
    date: "Jun 2026",
  },
];
