"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./ui";
import { useAuth, api } from "@/lib/client";

const LINKS = [
  { href: "/order", label: "Order Keepsake" },
  { href: "/gallery", label: "Gallery" },
  { href: "/how-it-works", label: "Craft Process" },
];

/**
 * Minimal nav (skill tell 28): wordmark left, 2–3 text links right, no blurry
 * background, no border, no shadow, no CTA button — the glass dock is the CTA.
 * Transparent over the dark hero (cream text on the home page at the top),
 * solid cream once scrolled.
 */
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

  const isHome = pathname === "/";
  const onDark = isHome && !scrolled;
  const linkCls = (active: boolean) =>
    `text-sm font-medium tracking-wide ${
      active
        ? onDark
          ? "text-gold-light"
          : "text-rosegold-dark"
        : onDark
          ? "text-cream/80 hover:text-gold-light"
          : "text-charcoal-soft hover:text-rosegold-dark"
    }`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${scrolled ? "bg-cream" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo dark={onDark} />
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(pathname === l.href)}>
              {l.label}
            </Link>
          ))}

          {me ? (
            <div className="flex items-center gap-4">
              <Link
                href={me.role === "admin" ? "/admin" : "/dashboard"}
                className={linkCls(pathname === (me.role === "admin" ? "/admin" : "/dashboard"))}
              >
                {me.role === "admin" ? "Studio Panel" : "My Orders"}
              </Link>
              <button
                onClick={logout}
                className={`text-sm font-medium ${onDark ? "text-cream/60 hover:text-cream" : "text-charcoal-muted hover:text-charcoal"}`}
              >
                Sign out
              </button>
              <span className="rounded-full bg-blush px-4 py-1.5 text-xs font-semibold text-rosegold-dark border border-rosegold/30">
                {me.name ? me.name.split(" ")[0] : "Account"}
              </span>
            </div>
          ) : (
            <Link href="/auth" className={linkCls(pathname === "/auth")}>
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu trigger: 44px by 44px min tap target */}
        <button
          className={`grid h-10 w-10 place-items-center rounded-full border md:hidden ${
            onDark ? "border-cream/30 text-cream" : "border-charcoal/15 text-charcoal"
          }`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
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
              <Link href="/auth" onClick={() => setOpen(false)} className="py-1 text-charcoal-soft">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
