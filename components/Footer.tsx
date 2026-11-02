import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { Sparkle } from "./ui";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <BrandLogo variant="full" size="md" theme="dark" />
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              Custom decor, gifts & 3D creations — made with precision, hand-painted by studio artists, and delivered with love across India.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gold px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30">
                Official Studio Store
              </span>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/order" className="hover:text-gold-light">Start a 3D Keepsake</Link></li>
              <li><Link href="/gallery" className="hover:text-gold-light">Gallery & Reviews</Link></li>
              <li><Link href="/how-it-works" className="hover:text-gold-light">Craft & Approval Process</Link></li>
              <li><Link href="/auth" className="hover:text-gold-light">Customer Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-light">Live Order Tracker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Connect With Studio</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light">
                  <span className="text-base">💬</span> WhatsApp: +91 98780 70123
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light">
                  <span className="text-base">📸</span> Instagram: @dikor_in
                </a>
              </li>
              <li>
                <span className="text-xs text-cream/60">Email: Dikorgifts@gmail.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Studio & Dispatch</h4>
            <ul className="space-y-2.5 text-sm text-cream/60">
              <li>Jalandhar, Punjab, India &bull; PIN 144001</li>
              <li>Mon – Sat &bull; 10:00 AM – 7:30 PM IST</li>
              <li className="flex items-start gap-2 pt-1 text-gold">
                <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                Insured Pan-India shipping included on all figurines
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row">
          <span>&copy; {new Date().getFullYear()} DIKOR Atelier &bull; dikor.in &bull; By @sainirajatrs &amp; @sheetal__83</span>
          <span>Crafted with Precision in India ✦</span>
        </div>
      </div>
    </footer>
  );
}
