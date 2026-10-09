"use client";
import type { Category } from "@/lib/store";

/** Elegant SVG placeholder artwork per category — warm gradients + line motifs. */
const ART: Record<Category, { bg: [string, string]; motif: JSX.Element; label: string }> = {
  Pets: {
    bg: ["#F3EAD9", "#E8B4B8"],
    label: "Pet replicas",
    motif: (
      <g fill="none" stroke="#96555F" strokeWidth="7" strokeLinecap="round">
        <ellipse cx="100" cy="118" rx="30" ry="25" />
        <ellipse cx="58" cy="80" rx="13" ry="16" />
        <ellipse cx="86" cy="60" rx="13" ry="16" />
        <ellipse cx="114" cy="60" rx="13" ry="16" />
        <ellipse cx="142" cy="80" rx="13" ry="16" />
      </g>
    ),
  },
  Couples: {
    bg: ["#F7E8E4", "#E9CE7A"],
    label: "Couple miniatures",
    motif: (
      <g fill="none" stroke="#A8861B" strokeWidth="7" strokeLinecap="round">
        <circle cx="78" cy="80" r="20" />
        <circle cx="122" cy="80" r="20" />
        <path d="M78 104 v44 M122 104 v44 M60 148 h80" />
        <path d="M100 60 c-6-10-22-8-22 4 0 9 12 16 22 24 10-8 22-15 22-24 0-12-16-14-22-4z" fill="#B76E79" stroke="none" />
      </g>
    ),
  },
  Kids: {
    bg: ["#FAF5EC", "#E9CE7A"],
    label: "Kid keepsakes",
    motif: (
      <g fill="none" stroke="#B76E79" strokeWidth="7" strokeLinecap="round">
        <circle cx="100" cy="72" r="24" />
        <path d="M100 100 v52 M100 116 l-28 16 M100 116 l28 16 M100 152 l-22 28 M100 152 l22 28" />
        <circle cx="100" cy="34" r="8" fill="#C9A227" stroke="none" />
      </g>
    ),
  },
  Idols: {
    bg: ["#EDE0C8", "#C9A227"],
    label: "Sacred idols",
    motif: (
      <g fill="none" stroke="#7A5B12" strokeWidth="7" strokeLinecap="round">
        <circle cx="100" cy="66" r="20" />
        <circle cx="100" cy="34" r="9" />
        <path d="M100 90 v58 M100 108 l-30 20 M100 108 l30 20 M100 148 l-24 32 M100 148 l24 32" />
        <path d="M64 180 h72" />
      </g>
    ),
  },
  Decor: {
    bg: ["#F3EAD9", "#FAF5EC"],
    label: "Home decor",
    motif: (
      <g fill="none" stroke="#96555F" strokeWidth="7" strokeLinecap="round">
        <path d="M100 40 l36 60 h-72 z" />
        <path d="M100 112 v48 M76 160 h48" />
        <circle cx="100" cy="72" r="10" fill="#C9A227" stroke="none" />
      </g>
    ),
  },
};

export default function Artwork({ category, className = "", title }: { category: Category; className?: string; title?: string }) {
  const a = ART[category];
  const gid = `g-${category}`;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title || a.label}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.bg[0]} />
          <stop offset="100%" stopColor={a.bg[1]} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      <circle cx="100" cy="100" r="72" fill="#FAF5EC" opacity="0.55" />
      {a.motif}
    </svg>
  );
}
