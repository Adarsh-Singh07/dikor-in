import Link from "next/link";
import type { ReactNode } from "react";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { DikorSeal } from "./BrandLogo";

/* ---------- Brand logo: authentic atelier seal ---------- */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 rounded-xl"
      aria-label="DIKOR Atelier Home"
    >
      <DikorSeal size={compact ? 36 : 42} />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-serif text-2xl tracking-wide text-charcoal font-bold">DIKOR</span>
          <span className="block text-[10px] uppercase tracking-[0.24em] text-charcoal-muted font-medium">dikor.in</span>
        </span>
      )}
    </Link>
  );
}

/* Subtle architectural diamond accent */
export function AtelierDiamond({ className = "w-2.5 h-2.5 text-gold-dark" }: { className?: string }) {
  return (
    <span className={`inline-block ${className}`} aria-hidden>
      ◆
    </span>
  );
}

/* Backward-compatible minimal sparkle placeholder for legacy references */
export function Sparkle({ className = "w-3 h-3 text-gold-dark" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

/* ---------- Buttons (Anti-Slop: Minimum 44px tap target, WCAG AA, clear states) ---------- */
export function GoldButton({
  children,
  className = "",
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#E2CA76] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-all duration-300 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full border border-charcoal/25 bg-white/80 px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal backdrop-blur-sm transition-all duration-300 hover:border-rosegold hover:text-rosegold-dark hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Section heading (Editorial, craft-grounded, zero decorative sparkle noise) ---------- */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : "text-left"} mb-12`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-rosegold-dark mb-3">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold leading-tight">
        {title}
      </h2>
      {sub && <p className="mt-3.5 text-base text-charcoal-muted leading-relaxed">{sub}</p>}
      <div
        className={`mt-5 h-[2px] w-14 rounded-full bg-rosegold/40 ${
          isCenter ? "mx-auto" : "ml-0"
        }`}
        aria-hidden
      />
    </div>
  );
}

/* ---------- Status pill (Accessible contrast, clear borders) ---------- */
const PILL: Record<OrderStatus, string> = {
  photos_received: "bg-blush text-rosegold-dark border-rosegold/30",
  advance_pending: "bg-amber-50 text-amber-900 border-amber-300",
  advance_paid: "bg-emerald-50 text-emerald-900 border-emerald-300",
  in_production: "bg-amber-50 text-amber-900 border-amber-300",
  approval_shared: "bg-rosegold/15 text-rosegold-dark border-rosegold/40",
  changes_requested: "bg-rose-50 text-rose-900 border-rose-300",
  approved: "bg-green-50 text-green-900 border-green-300",
  balance_pending: "bg-amber-50 text-amber-900 border-amber-300",
  balance_paid: "bg-sky-50 text-sky-900 border-sky-300",
  shipped: "bg-blue-50 text-blue-900 border-blue-300",
  delivered: "bg-charcoal text-white border-charcoal",
  cancelled: "bg-red-50 text-red-900 border-red-300",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
        PILL[status] || "bg-cream text-charcoal border-charcoal/20"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

/* ---------- Marquee: respectful rhythm, pause on hover ---------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];
  return (
    <div className="group overflow-hidden bg-charcoal py-4 border-y border-gold/30">
      <div className="flex w-max animate-[marquee_36s_linear_infinite] group-hover:[animation-play-state:paused] gap-0">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 text-cream/90 text-xs sm:text-sm uppercase tracking-[0.2em] whitespace-nowrap"
          >
            {t} <span className="text-gold text-xs" aria-hidden>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

/* ---------- Official Studio badge ---------- */
export function StudioBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light border border-gold/40">
      Official Atelier
    </span>
  );
}
export const DemoBadge = StudioBadge;

/* ---------- Form Field with Accessible Label ---------- */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft mb-2">
        {label}
      </span>
      {children}
      {hint && <span className="block mt-1.5 text-xs text-charcoal-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full min-h-[44px] rounded-2xl border border-charcoal/20 bg-white/90 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-muted/60 outline-none transition focus:border-rosegold focus:ring-2 focus:ring-rosegold/25";
