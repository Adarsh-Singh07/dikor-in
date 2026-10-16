"use client";
import { useRef, useState } from "react";

/** Draggable before/after slider: reference photo vs finished figurine. */
export default function BeforeAfter({
  before = "/images/dog-real.webp",
  after = "/images/hero-dog.webp",
  beforeLabel = "Your photo",
  afterLabel = "Your keepsake",
}: {
  before?: string;
  after?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-[2rem] shadow-soft md:aspect-[16/10]"
      style={{ touchAction: "pan-y" }}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onMouseMove={(e) => { if (drag.current) move(e.clientX); }}
      onMouseUp={() => (drag.current = false)}
      onMouseLeave={() => (drag.current = false)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 5));
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" style={{ width: box.current?.offsetWidth ? `${box.current.offsetWidth}px` : "100vw", maxWidth: "none" }} draggable={false} />
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light backdrop-blur">{beforeLabel}</span>
      <span className="absolute right-4 top-4 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light backdrop-blur">{afterLabel}</span>
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <span className="absolute inset-y-0 -left-px w-0.5 bg-white shadow" />
        <span className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-lg text-charcoal shadow-soft">⇔</span>
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 drop-shadow">Drag to compare</p>
    </div>
  );
}
