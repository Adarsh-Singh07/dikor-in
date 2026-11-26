import { Logo } from "./ui";

interface BrandLogoProps {
  variant?: "full" | "mark" | "compact" | "invoice";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  theme?: "light" | "dark" | "print";
}

/**
 * Back-compat export for the invoice watermark / seal slots.
 * Now renders the single DIKOR mark (public/brand/dikor-mark.svg) instead of
 * the old gradient atelier seal, so there is exactly one logo system.
 */
export function DikorSeal({ size = 44, theme = "light" }: { size?: number; theme?: "light" | "dark" | "print" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={theme === "dark" ? "/brand/dikor-mark-light.svg" : "/brand/dikor-mark.svg"}
      alt="DIKOR"
      width={size}
      height={size}
      className="shrink-0"
      draggable={false}
    />
  );
}

/**
 * Single logo system: delegates to Logo from ./ui (the new DIKOR mark).
 * Props are kept for existing consumers (Navbar, Footer, AdminDashboardView,
 * auth, payment-gateway, invoice):
 * - variant "mark" -> mark only; "full" / "compact" / "invoice" -> mark + wordmark
 * - theme "dark" -> light mark on dark; "light" / "print" -> standard mark
 * - size / href are accepted for API compat; Logo renders at its fixed size
 *   and already links home (href "" on the invoice just means "no extra link").
 */
export default function BrandLogo({
  variant = "full",
  className = "",
  size = "md",
  href = "/",
  theme = "light",
}: BrandLogoProps) {
  void size;
  void href;
  return (
    <span className={`inline-flex ${className}`}>
      <Logo compact={variant === "mark"} dark={theme === "dark"} />
    </span>
  );
}
