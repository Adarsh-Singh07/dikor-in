"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * ThreeUI-style 3D cylinder carousel using CSS 3D transforms (no WebGL cost).
 * Drag horizontally to spin, auto-rotates when idle, keyboard arrows supported,
 * pauses on interaction, and respects prefers-reduced-motion.
 */
export default function Cylinder<T>({
  items,
  render,
  itemWidth = 300,
  itemHeight = 380,
  className = "",
  ariaLabel = "carousel",
}: {
  items: T[];
  render: (item: T, i: number, active: boolean) => ReactNode;
  itemWidth?: number;
  itemHeight?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const n = items.length;
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const vel = useRef(0);
  const reduceMotion = useRef(false);
  const pauseTimer = useRef<number | null>(null);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const radius = useMemo(() => {
    if (n < 2) return 0;
    return Math.round(itemWidth / 2 / Math.tan(Math.PI / n)) + 40;
  }, [n, itemWidth]);

  const step = 360 / Math.max(n, 1);

  const poke = useCallback(() => {
    setPaused(true);
    if (pauseTimer.current) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setPaused(false), 4000);
  }, []);

  // idle auto-rotation
  useEffect(() => {
    if (paused || reduceMotion.current || n < 2) return;
    let raf = 0;
    const tick = () => {
      setAngle((a) => a + 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, n]);

  // inertia after drag release
  useEffect(() => {
    if (dragging.current || reduceMotion.current) return;
    let raf = 0;
    const tick = () => {
      if (Math.abs(vel.current) > 0.05) {
        setAngle((a) => a + vel.current);
        vel.current *= 0.95;
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const onDown = (x: number) => {
    dragging.current = true;
    lastX.current = x;
    vel.current = 0;
    poke();
  };
  const onMove = (x: number) => {
    if (!dragging.current) return;
    const dx = x - lastX.current;
    lastX.current = x;
    vel.current = dx * 0.25;
    setAngle((a) => a + dx * 0.25);
  };
  const onUp = () => {
    dragging.current = false;
  };

  const activeIndex = useMemo(() => {
    if (n < 1) return 0;
    const norm = ((angle % 360) + 360) % 360;
    return Math.round(norm / step) % n;
  }, [angle, step, n]);

  return (
    <div className={className}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        className="relative mx-auto select-none outline-none"
        style={{ width: itemWidth, height: itemHeight, perspective: 1400, touchAction: "pan-y" }}
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { setAngle((a) => a + step); poke(); }
          if (e.key === "ArrowLeft") { setAngle((a) => a - step); poke(); }
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(-6deg) rotateY(${angle}deg)`,
            transition: dragging.current ? "none" : "transform 0.1s linear",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: itemWidth,
                height: itemHeight,
                marginLeft: -itemWidth / 2,
                marginTop: -itemHeight / 2,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
                opacity: i === activeIndex ? 1 : 0.72,
                filter: i === activeIndex ? "none" : "saturate(0.85)",
                transition: "opacity .4s, filter .4s",
              }}
            >
              {render(item, i, i === activeIndex)}
            </div>
          ))}
        </div>
      </div>
      {n > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 bg-white/70 text-xl text-charcoal transition hover:border-rosegold"
            onClick={() => { setAngle((a) => a - step); poke(); }}
            tabIndex={-1}
          >←</button>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-muted">
            {activeIndex + 1} / {n} · drag to spin
          </p>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/15 bg-white/70 text-xl text-charcoal transition hover:border-rosegold"
            onClick={() => { setAngle((a) => a + step); poke(); }}
            tabIndex={-1}
          >→</button>
        </div>
      )}
    </div>
  );
}
