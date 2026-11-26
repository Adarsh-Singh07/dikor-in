"use client";

import Link from "next/link";
import OrderBuilder from "@/components/OrderBuilder";
import { DemoBadge } from "@/components/ui";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
      <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-rosegold-dark">
        ← Back to Dashboard
      </Link>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
          New keepsake <DemoBadge />
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Create your next keepsake</h1>
        <p className="mt-2 text-charcoal-muted">
          Configure your subject, select a size with live 3D preview, and upload reference photos.
        </p>
      </div>

      <div className="mt-8">
        <OrderBuilder />
      </div>
    </div>
  );
}
