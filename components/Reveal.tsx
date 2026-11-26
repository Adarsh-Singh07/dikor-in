"use client";
import type { ReactNode } from "react";

/**
 * Reveal is now a plain passthrough. The old version wrapped every section in a
 * framer-motion whileInView fade-up (tell 19: blanket scroll-reveal). Per the
 * premium-editorial-design skill the page is static except for the one living
 * hero moment, so this component renders its children immediately with no motion.
 * Kept as a named export so existing call sites need no changes.
 */
export function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
