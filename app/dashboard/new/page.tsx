"use client";

import Link from "next/link";
import OrderBuilder from "@/components/OrderBuilder";
import { Reveal } from "@/components/Reveal";
import { Sparkle } from "@/components/ui";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-rosegold-dark">
          ← Back to Dashboard
        </Link>
        <div className="mt-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
            <Sparkle className="h-3.5 w-3.5 text-gold" /> Custom 3D Figurine Builder
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-5xl text-charcoal font-bold">
            Create Your Next Keepsake
          </h1>
          <p className="mt-2 text-xs md:text-sm text-charcoal-muted">
            Configure your subject, select size with live 3D studio preview, and upload reference photos.
          </p>
        </div>
      </Reveal>

      <div className="mt-8">
        <OrderBuilder />
      </div>
    </div>
  );
}
