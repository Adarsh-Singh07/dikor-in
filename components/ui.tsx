import Link from "next/link";
import type { ReactNode } from "react";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";

/* ---------- Brand logo: the DIKOR mark ----------
   Original SVG monogram (public/brand/dikor-mark.svg): a geometric "D" — charcoal
   stem, rose-gold bowl — standing on a thin gold plinth rule, the pedestal every
   DIKOR figurine stands on. Solid colours only, no sparkle, no gradient, no emoji.
   The wordmark is set in Inter Tight ExtraBold to match the monumental hero type. */
export function Logo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/brand/dikor-mark-light.svg" : "/brand/dikor-mark.svg"}
        alt="DIKOR"
        className="h-11 w-11 shrink-0"
        draggable={false}
      />
      {!compact && (
        <span className="leading-tight">
          <span className={`block font-grotesk text-2xl font-extrabold tracking-[0.08em] ${dark ? "text-cream" : "text-charcoal"}`}>DIKOR</span>
          <span className={`block text-[10px] uppercase tracking-[0.22em] ${dark ? "text-cream/60" : "text-charcoal-muted"}`}>dikor.in</span>
        </span>
      )}
    </Link>
  );
}

/* ---------- Buttons: solid colours only, no gradients, no arrows ----------
   Redesign's solid styling, plus upstream's explicit `disabled` pass-through,
   44px minimum tap target and focus-visible ring.
   Round 3: ONE restrained dark CTA everywhere — the mustard-gold pill read as
   cheap, so gold is now reserved for tiny accents (prices, micro-labels,
   the D-mark, hairlines). GhostButton stays the outlined secondary. */
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
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream transition-colors duration-200 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors duration-200 hover:border-rosegold hover:text-rosegold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Section heading: no eyebrow (tell 03), left-aligned (tell 21),
   plain title, one-line sub max, solid hairline (no gradient).
   Redesign's signature (title, sub, align = "left"). `eyebrow` is accepted as
   an optional prop only so older callers that still pass it keep compiling;
   when present it renders as one plain line, never with decoration. ---------- */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a} mb-12`}>
      {eyebrow && <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-rosegold-dark">{eyebrow}</p>}
      <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-charcoal-muted leading-relaxed">{sub}</p>}
      <div className={`mt-6 h-px w-24 bg-gold ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}

/* ---------- Status pill: upstream's full 12-status map (DBOrder statuses),
   with a fallback class/label so a status the map misses still renders. ---------- */
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

/* ---------- Official Studio badge (upstream name + label; DemoBadge alias kept
   because dashboard/admin/order pages import DemoBadge). ---------- */
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
  "w-full rounded-sm border border-charcoal/15 bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal-muted/60 outline-none transition focus:border-rosegold focus:ring-2 focus:ring-rosegold/20";
