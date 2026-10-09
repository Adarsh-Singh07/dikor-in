"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./ui";
import { useAuth, api } from "@/lib/client";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
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
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-card" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-rosegold-dark ${
                pathname === l.href ? "text-rosegold-dark" : "text-charcoal-soft"
              }`}
            >
              {l.label}
            </Link>
          ))}
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
                className="rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-charcoal shadow-gold transition-transform hover:scale-105"
              >
                Start your order
              </Link>
            </>
          )}
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="text-xl text-charcoal">{open ? "✕" : "☰"}</span>
        </button>
      </nav>
      {open && (
        <div className="border-t border-charcoal/10 bg-cream px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1 text-charcoal-soft">
                {l.label}
              </Link>
            ))}
            {me ? (
              <>
                <Link href={me.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="py-1 text-charcoal-soft">
                  {me.role === "admin" ? "Studio panel" : "My orders"}
                </Link>
                <button onClick={logout} className="py-1 text-left text-charcoal-muted">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={() => setOpen(false)} className="py-1 text-charcoal-soft">Sign in</Link>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-charcoal"
                >
                  Start your order
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
