import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "mark" | "compact" | "invoice";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  theme?: "light" | "dark" | "print";
}

export function DikorSeal({ size = 44, theme = "light" }: { size?: number; theme?: "light" | "dark" | "print" }) {
  const isPrint = theme === "print";
  const isDark = theme === "dark";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="DIKOR Atelier Seal"
    >
      <defs>
        {/* Luxury Gold Gradient */}
        <linearGradient id="dikorGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFC076" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="70%" stopColor="#EAD292" />
          <stop offset="100%" stopColor="#9C7716" />
        </linearGradient>

        {/* Rose Gold Gradient */}
        <linearGradient id="dikorRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D98A96" />
          <stop offset="50%" stopColor="#B76E79" />
          <stop offset="100%" stopColor="#8E4F58" />
        </linearGradient>

        {/* Outer Ring Rim */}
        <radialGradient id="dikorSealGlow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor={isDark ? "#2A2320" : "#FAF5EC"} />
          <stop offset="100%" stopColor={isDark ? "#1C1715" : "#F3EAD9"} />
        </radialGradient>
      </defs>

      {/* Outer Atelier Dial with Precision Gauge Marks */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="url(#dikorSealGlow)"
        stroke="url(#dikorGoldGrad)"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={isPrint ? "#2A2320" : "url(#dikorRoseGrad)"}
        strokeWidth="0.75"
        strokeDasharray="1.5 2.5"
        opacity="0.8"
      />

      {/* Four Precision Cardinal Diamonds */}
      <polygon points="50,7 52,10 50,13 48,10" fill="url(#dikorGoldGrad)" />
      <polygon points="50,87 52,90 50,93 48,90" fill="url(#dikorGoldGrad)" />
      <polygon points="7,50 10,48 13,50 10,52" fill="url(#dikorGoldGrad)" />
      <polygon points="87,50 90,48 93,50 90,52" fill="url(#dikorGoldGrad)" />

      {/* Inner Sculpted Monogram "D" with 3D Facets */}
      <path
        d="M34 26 H49 C63 26 71 35 71 50 C71 65 63 74 49 74 H34 V26 Z"
        fill="none"
        stroke="url(#dikorGoldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 36 H49 C57 36 62 41 62 50 C62 59 57 64 49 64 H43 V36 Z"
        fill={isDark ? "#382F2B" : "#F8EFE3"}
        stroke="url(#dikorRoseGrad)"
        strokeWidth="1.2"
      />

      {/* Precision 3D Layer Line Accent */}
      <line x1="34" y1="50" x2="62" y2="50" stroke="url(#dikorGoldGrad)" strokeWidth="0.75" opacity="0.6" />
      <line x1="39" y1="43" x2="57" y2="43" stroke="url(#dikorRoseGrad)" strokeWidth="0.5" opacity="0.4" />
      <line x1="39" y1="57" x2="57" y2="57" stroke="url(#dikorRoseGrad)" strokeWidth="0.5" opacity="0.4" />

      {/* Signature DIKOR Sparkle */}
      <path
        d="M75 22 C75.5 25.5 78.5 28.5 82 29 C78.5 29.5 75.5 32.5 75 36 C74.5 32.5 71.5 29.5 68 29 C71.5 28.5 74.5 25.5 75 22 Z"
        fill="url(#dikorGoldGrad)"
      />
    </svg>
  );
}

export default function BrandLogo({
  variant = "full",
  className = "",
  size = "md",
  href = "/",
  theme = "light",
}: BrandLogoProps) {
  const pixelSizes = {
    sm: 34,
    md: 44,
    lg: 56,
    xl: 72,
  };

  const px = pixelSizes[size];

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <DikorSeal size={px} theme={theme} />
      </div>

      {variant !== "mark" && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-[0.24em] font-bold uppercase transition-colors duration-200 ${
                theme === "dark"
                  ? "text-cream group-hover:text-gold"
                  : theme === "print"
                  ? "text-charcoal"
                  : "text-charcoal group-hover:text-rosegold-dark"
              } ${
                size === "sm"
                  ? "text-base tracking-[0.2em]"
                  : size === "lg"
                  ? "text-3xl"
                  : size === "xl"
                  ? "text-4xl"
                  : "text-2xl"
              }`}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              DIKOR
            </span>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-gold-dark uppercase px-1.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
              3D
            </span>
          </div>

          {(variant === "full" || variant === "invoice") && (
            <span
              className={`text-[9.5px] uppercase tracking-[0.28em] font-medium font-sans ${
                theme === "dark"
                  ? "text-cream/70"
                  : theme === "print"
                  ? "text-charcoal/70"
                  : "text-charcoal-muted"
              }`}
            >
              Atelier &bull; 3D Keepsakes
            </span>
          )}

          {variant === "compact" && (
            <span className="text-[9px] uppercase tracking-[0.22em] text-rosegold-dark font-sans font-medium">
              dikor.in
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl">
      {content}
    </Link>
  );
}
