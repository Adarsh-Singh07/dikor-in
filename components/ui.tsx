import Link from "next/link";
import type { ReactNode } from "react";
import { STATUS_LABELS, type OrderStatus } from "@/lib/store";

/* ---------- Brand logo: cream badge, rose-gold "Dikor" ---------- */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <span className="relative grid place-items-center w-11 h-11 rounded-full bg-cream-dark border border-gold/40 shadow-soft shrink-0">
        <span className="font-display italic text-rosegold-dark text-lg leading-none pt-0.5">D</span>
        <span className="absolute -top-1 -right-1 text-gold text-xs">✦</span>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-2xl tracking-wide text-charcoal">DIKOR</span>
          <span className="block text-[10px] uppercase tracking-[0.22em] text-charcoal-muted">dikor.in</span>
        </span>
      )}
    </Link>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.7 6.5 5.5 11.3 12 12-6.5.7-11.3 5.5-12 12-.7-6.5-5.5-11.3-12-12C6.5 11.3 11.3 6.5 12 0z" />
    </svg>
  );
}

/* ---------- Buttons ---------- */
export function GoldButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal backdrop-blur transition-all duration-300 hover:border-rosegold hover:text-rosegold-dark disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: ReactNode; sub?: string; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a} mb-12`}>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark mb-4 justify-center">
        <Sparkle className="w-3.5 h-3.5 text-gold" /> {eyebrow} <Sparkle className="w-3.5 h-3.5 text-gold" />
      </p>
      <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-charcoal-muted leading-relaxed">{sub}</p>}
      <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
    </div>
  );
}

/* ---------- Status pill ---------- */
const PILL: Record<OrderStatus, string> = {
  submitted: "bg-blush text-rosegold-dark border-rosegold/30",
  quoted: "bg-cream-dark text-gold-dark border-gold/40",
  advance_paid: "bg-cream-dark text-charcoal border-charcoal/20",
  demo_shared: "bg-rosegold/10 text-rosegold-dark border-rosegold/40",
  approved: "bg-green-50 text-green-800 border-green-300",
  in_production: "bg-amber-50 text-amber-800 border-amber-300",
  ready_for_balance: "bg-gold/15 text-gold-dark border-gold/50",
  completed: "bg-charcoal text-cream border-charcoal",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${PILL[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-charcoal py-4 border-y border-gold/30">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-0">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-cream/90 text-sm uppercase tracking-[0.2em] whitespace-nowrap">
            {t} <Sparkle className="w-3.5 h-3.5 text-gold" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

/* ---------- Demo badge ---------- */
export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
      Demo
    </span>
  );
}

/* ---------- Field ---------- */
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft mb-2">{label}</span>
      {children}
      {hint && <span className="block mt-1.5 text-xs text-charcoal-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-2xl border border-charcoal/15 bg-white/80 px-4 py-3 text-charcoal placeholder:text-charcoal-muted/60 outline-none transition focus:border-rosegold focus:ring-2 focus:ring-rosegold/20";
