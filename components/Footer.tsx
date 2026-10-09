import Link from "next/link";
import { Logo, Sparkle, DemoBadge } from "./ui";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="[&_span]:!text-cream">
              <Logo />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              Custom decor, gifts & 3D creations — made with precision, delivered with love across India.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <DemoBadge />
              <span className="text-xs text-cream/50">Concept demo website</span>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/gallery" className="hover:text-gold-light">Gallery</Link></li>
              <li><Link href="/how-it-works" className="hover:text-gold-light">How it works</Link></li>
              <li><Link href="/auth" className="hover:text-gold-light">Sign in / Start order</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-light">My orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Talk to us</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light">
                  <span className="text-base">💬</span> WhatsApp — +91 98780 70123
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
                  Instagram — @dikor_in
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Studio hours</h4>
            <ul className="space-y-2.5 text-sm text-cream/60">
              <li>Mon – Sat · 10am – 7pm IST</li>
              <li>Sunday · 11am – 5pm IST</li>
              <li className="flex items-start gap-2 pt-1">
                <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                Pan-India shipping on every keepsake
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row">
          <span>© {new Date().getFullYear()} DIKOR · dikor.in — crafted with precision</span>
          <span>Made in India ✦</span>
        </div>
      </div>
    </footer>
  );
}
