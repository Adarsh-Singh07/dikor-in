"use client";
import type { Category } from "@/lib/types";

const ART: Record<string, { bg: [string, string]; motif: JSX.Element; label: string }> = {
  Dogs: {
    bg: ["#F3EAD9", "#E8B4B8"],
    label: "Dog miniatures",
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
  Cats: {
    bg: ["#FAF5EC", "#E9CE7A"],
    label: "Cat miniatures",
    motif: (
      <g fill="none" stroke="#B76E79" strokeWidth="7" strokeLinecap="round">
        <circle cx="100" cy="110" r="28" />
        <path d="M80 84 l-14 -20 l22 8 M120 84 l14 -20 l-22 8" />
        <circle cx="88" cy="108" r="4" fill="#B76E79" />
        <circle cx="112" cy="108" r="4" fill="#B76E79" />
      </g>
    ),
  },
  Humans: {
    bg: ["#F7E8E4", "#E9CE7A"],
    label: "Human miniatures",
    motif: (
      <g fill="none" stroke="#A8861B" strokeWidth="7" strokeLinecap="round">
        <circle cx="100" cy="72" r="24" />
        <path d="M100 100 v52 M100 116 l-28 16 M100 116 l28 16 M100 152 l-22 28 M100 152 l22 28" />
      </g>
    ),
  },
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
};

export default function Artwork({ category, className = "", title }: { category: Category; className?: string; title?: string }) {
  const a = ART[category] || ART.Dogs;
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
      <circle cx="100" cy="100" r="72" fill="#FAF7F2" opacity="0.55" />
      {a.motif}
    </svg>
  );
}
