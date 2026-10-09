"use client";
import { STATUS_LABELS, type OrderStatus } from "@/lib/store";

const ORDER: OrderStatus[] = ["submitted", "quoted", "advance_paid", "demo_shared", "approved", "in_production", "ready_for_balance", "completed"];

export default function OrderTimeline({ status, compact = false }: { status: OrderStatus; compact?: boolean }) {
  const idx = ORDER.indexOf(status);
  return (
    <ol className={`relative ${compact ? "space-y-3" : "space-y-0"}`}>
      {ORDER.map((s, i) => {
        const done = i < idx;
        const cur = i === idx;
        return (
          <li key={s} className={`relative flex gap-4 ${compact ? "" : "pb-7"} last:pb-0`}>
            {!compact && i < ORDER.length - 1 && (
              <span className={`absolute left-[13px] top-8 h-[calc(100%-2rem)] w-px ${done || cur ? "bg-gold" : "bg-charcoal/15"}`} />
            )}
            <span
              className={`z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                done ? "border-gold bg-gold text-charcoal" : cur ? "border-rosegold bg-rosegold text-cream" : "border-charcoal/20 bg-white text-charcoal-muted"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <div className={compact ? "" : "pt-0.5"}>
              <p className={`text-sm font-semibold ${cur ? "text-rosegold-dark" : done ? "text-charcoal" : "text-charcoal-muted"}`}>
                {STATUS_LABELS[s]}
                {cur && <span className="ml-2 rounded-full bg-blush px-2 py-0.5 text-[10px] uppercase tracking-wider">current</span>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
