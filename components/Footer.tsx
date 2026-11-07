import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/client";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90 border-t border-charcoal">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Atelier Brand Identity */}
          <div>
            <BrandLogo variant="full" size="md" theme="dark" />
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Bespoke 3D miniature atelier based in Jalandhar, Punjab. Sculpted from your photographs,
              individually hand-painted by studio artists, and delivered safely across India.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gold px-3 py-1 rounded-full bg-gold/15 border border-gold/30">
                Official Studio Store
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">
              Explore
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/order"
                  className="min-h-[36px] flex items-center text-cream/80 hover:text-white transition"
                >
                  Start a 3D Keepsake
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="min-h-[36px] flex items-center text-cream/80 hover:text-white transition"
                >
                  Gallery &amp; Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="min-h-[36px] flex items-center text-cream/80 hover:text-white transition"
                >
                  Craft &amp; Approval Process
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="min-h-[36px] flex items-center text-cream/80 hover:text-white transition"
                >
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="min-h-[36px] flex items-center text-cream/80 hover:text-white transition"
                >
                  Live Order Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Studio Connect */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">
              Connect With Studio
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[36px] inline-flex items-center gap-2 text-cream/85 hover:text-gold-light transition"
                >
                  <span className="text-base" aria-hidden>💬</span> WhatsApp: +91 98780 70123
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[36px] inline-flex items-center gap-2 text-cream/85 hover:text-gold-light transition"
                >
                  <span className="text-base" aria-hidden>📸</span> Instagram: @dikor_in
                </a>
              </li>
              <li>
                <span className="text-xs text-cream/70">Email: Dikorgifts@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Studio & Dispatch */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">
              Studio &amp; Dispatch
            </h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>Jalandhar, Punjab, India &bull; PIN 144001</li>
              <li>Mon - Sat &bull; 10:00 AM - 7:30 PM IST</li>
              <li className="pt-2 text-gold text-xs leading-relaxed">
                Insured pan-India courier shipping and custom engraved brass plaque included on all figurines.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 md:flex-row">
          <span>&copy; {new Date().getFullYear()} DIKOR Atelier &bull; dikor.in &bull; By @sainirajatrs &amp; @sheetal__83</span>
          <span>Precision 3D Crafting &amp; Hand-Finishing in India</span>
        </div>
      </div>
    </footer>
  );
}
