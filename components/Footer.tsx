import Link from "next/link";
import { Logo } from "./ui";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

/**
 * Footer (skill tell 31): giant wordmark, one line of links, one bottom line.
 * No 4-column link farm. WhatsApp and Instagram stay as the contact links.
 */
export default function Footer() {
  return (
    <footer className="overflow-hidden bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Logo dark />
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <Link href="/gallery" className="hover:text-gold-light">Gallery</Link>
            <Link href="/how-it-works" className="hover:text-gold-light">How it works</Link>
            <Link href="/order" className="hover:text-gold-light">Start an order</Link>
            <Link href="/auth" className="hover:text-gold-light">Sign in</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
              WhatsApp — +91 98780 70123
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
              Instagram — @dikor_in
            </a>
          </nav>
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/60">
          Custom decor, gifts and 3D creations — made with precision, delivered with love across India.
        </p>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row">
          <span>© {new Date().getFullYear()} DIKOR — dikor.in</span>
          <span>Made in India</span>
        </div>
      </div>
      <p aria-hidden className="select-none whitespace-nowrap text-center font-grotesk text-[18vw] font-extrabold uppercase leading-[0.75] tracking-[-0.04em] text-cream/10">
        DIKOR
      </p>
    </footer>
  );
}
