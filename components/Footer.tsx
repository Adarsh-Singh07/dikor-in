import Link from "next/link";
import { Logo } from "./ui";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

/**
 * Footer (round 3): proper columns — Shop / Help / Contact — plus the
 * facts a buyer needs before ordering. No Sign in link here: the navbar
 * is the one sign-in on the site. The giant wordmark is fully visible
 * (leading-none, no crop). Copyright with proper spacing.
 */
export default function Footer() {
  return (
    <footer className="bg-charcoal pb-28 text-cream/80">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              Custom decor, gifts and 3D creations — made with precision, delivered with love across India.
            </p>
          </div>
          <nav aria-label="Shop">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Shop</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/order" className="hover:text-gold-light">Start an order</Link></li>
              <li><Link href="/gallery" className="hover:text-gold-light">Gallery</Link></li>
              <li><Link href="/how-it-works" className="hover:text-gold-light">How it works</Link></li>
            </ul>
          </nav>
          <nav aria-label="Help">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Help</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/#faq" className="hover:text-gold-light">Prices and questions</Link></li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
                  Instagram — @dikor_in
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
                  WhatsApp — +91 98780 70123
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold-light">
                  Instagram — @dikor_in
                </a>
              </li>
              <li className="text-cream/60">Studio in Jalandhar, Punjab</li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-cream/50">
              Every piece is made to order. You approve photos or a video before it ships. Delivery 7–10 days.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row">
          <span>© {new Date().getFullYear()} DIKOR — dikor.in</span>
          <span>Made in India</span>
        </div>
      </div>
      <p aria-hidden className="select-none whitespace-nowrap text-center font-grotesk text-[14vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-cream/10">
        DIKOR
      </p>
    </footer>
  );
}
