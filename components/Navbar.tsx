"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./ui";
import { useAuth, api, WHATSAPP_URL } from "@/lib/client";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Collections" },
  { href: "/how-it-works", label: "How it works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { me, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // close the mobile menu on route change / when resizing up to desktop
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const fn = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    refresh();
    router.push("/");
    setOpen(false);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* utility bar */}
      <div
        className={`overflow-hidden bg-charcoal text-cream/80 transition-[max-height] duration-300 ${
          scrolled ? "max-h-0" : "max-h-10"
        }`}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-5 text-[11px] uppercase tracking-[0.18em] md:justify-between md:px-8">
          <span className="truncate">✦ Free video preview before every dispatch</span>
          <span className="hidden items-center gap-6 md:flex">
            <span>Pan-India shipping</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-gold-light hover:text-gold">
              WhatsApp us
            </a>
          </span>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          solid ? "border-b border-charcoal/5 bg-cream/90 shadow-card backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8" aria-label="Main">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium tracking-wide transition-colors hover:text-rosegold-dark ${
                  isActive(l.href) ? "text-rosegold-dark" : "text-charcoal-soft"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-rosegold transition-all duration-300 ${
                    isActive(l.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
            <span className="h-5 w-px bg-charcoal/15" />
            {me ? (
              <>
                <Link
                  href={me.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-sm font-medium tracking-wide text-charcoal-soft hover:text-rosegold-dark"
                >
                  {me.role === "admin" ? "Studio panel" : "My orders"}
                </Link>
                <button onClick={logout} className="text-sm font-medium text-charcoal-muted hover:text-charcoal">
                  Sign out
                </button>
                <span className="rounded-full bg-blush px-4 py-2 text-xs font-semibold text-rosegold-dark">
                  Hi, {me.name.split(" ")[0]}
                </span>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-charcoal-soft hover:text-rosegold-dark">
                  Sign in
                </Link>
                <Link
                  href="/auth"
                  className="rounded-full bg-charcoal px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-cream shadow-card transition-all hover:bg-rosegold-dark"
                >
                  Start your order
                </Link>
              </>
            )}
          </div>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 bg-white/60 backdrop-blur md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-charcoal transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[1.5px] w-5 bg-charcoal transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={`grid transition-all duration-300 md:hidden ${open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-charcoal/10 px-5 pb-6 pt-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 font-display text-2xl ${isActive(l.href) ? "text-rosegold-dark" : "text-charcoal"}`}
                >
                  {l.label}
                </Link>
              ))}
              {me ? (
                <>
                  <Link href={me.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-charcoal-soft">
                    {me.role === "admin" ? "Studio panel" : "My orders"}
                  </Link>
                  <button onClick={logout} className="rounded-xl px-3 py-3 text-left text-charcoal-muted">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/auth" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-charcoal-soft">Sign in</Link>
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-full bg-charcoal px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-cream"
                  >
                    Start your order
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
