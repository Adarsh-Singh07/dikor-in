"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";
import { useAuth, api } from "@/lib/client";

const LINKS = [
  { href: "/order", label: "Order Keepsake" },
  { href: "/gallery", label: "Gallery" },
  { href: "/how-it-works", label: "Craft Process" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { me, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    refresh();
    router.push("/");
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-card border-b border-charcoal/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <BrandLogo size="md" />

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`min-h-[44px] flex items-center text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:text-rosegold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2 rounded-lg px-2 ${
                pathname === l.href ? "text-rosegold-dark" : "text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {me ? (
            <div className="flex items-center gap-4">
              <Link
                href={me.role === "admin" ? "/admin" : "/dashboard"}
                className="min-h-[44px] flex items-center text-xs font-bold uppercase tracking-[0.14em] text-charcoal hover:text-rosegold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark rounded-lg px-2"
              >
                {me.role === "admin" ? "Studio Panel" : "My Orders"}
              </Link>
              <button
                onClick={logout}
                className="min-h-[44px] px-3 flex items-center text-xs font-bold uppercase tracking-[0.14em] text-charcoal-muted hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark rounded-lg"
              >
                Sign out
              </button>
              <span className="rounded-full bg-blush px-4 py-1.5 text-xs font-semibold text-rosegold-dark border border-rosegold/30">
                {me.name ? me.name.split(" ")[0] : "Account"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth"
                className="min-h-[44px] flex items-center text-xs font-bold uppercase tracking-[0.14em] text-charcoal hover:text-rosegold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark rounded-lg px-3"
              >
                Sign In
              </Link>
              <Link
                href="/order"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#E2CA76] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark focus-visible:ring-offset-2"
              >
                Start Order
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger: 44px by 44px min tap target */}
        <button
          className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border border-charcoal/20 bg-white/70 text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          <span className="text-xl font-bold leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-charcoal/10 bg-[#FAF7F2] px-6 py-5 shadow-lg md:hidden">
          <div className="flex flex-col space-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`min-h-[44px] flex items-center text-sm font-semibold tracking-wide px-2 rounded-xl transition ${
                  pathname === l.href ? "bg-blush text-rosegold-dark" : "text-charcoal hover:bg-cream-dark"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {me ? (
              <>
                <Link
                  href={me.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] flex items-center text-sm font-semibold tracking-wide text-charcoal px-2 hover:bg-cream-dark rounded-xl"
                >
                  {me.role === "admin" ? "Studio Panel" : "My Orders"}
                </Link>
                <button
                  onClick={logout}
                  className="min-h-[44px] flex items-center text-left text-sm font-semibold text-charcoal-muted px-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] flex items-center text-sm font-semibold text-charcoal px-2"
                >
                  Customer Sign In
                </Link>
                <div className="pt-2">
                  <Link
                    href="/order"
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#E2CA76] px-6 text-center text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold"
                  >
                    Start Order
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
