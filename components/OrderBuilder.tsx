"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth, api, fileToDataURL } from "@/lib/client";
import { GoldButton, GhostButton, Field, inputCls, Sparkle } from "@/components/ui";
import {
  CATEGORIES, PET_SIZES, INCLUDED_ALWAYS, inr, splitFor, priceFor,
  whatsappOrderLink, catalogKeyToStoreCategory, type Category,
} from "@/lib/catalog";

export interface BuilderSummary {
  category: string;
  size: string;
  price: string;
}

/* ---------- photo dropzone ---------- */
function PhotoDrop({ photos, setPhotos, error, setError }: {
  photos: string[]; setPhotos: (p: string[]) => void; error: string; setError: (e: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const add = async (files: FileList | File[] | null) => {
    if (!files) return;
    setError("");
    try {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 8 - photos.length);
      const urls = await Promise.all(list.map((f) => fileToDataURL(f, 5 * 1024 * 1024)));
      setPhotos([...photos, ...urls].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read photos");
    }
  };

  return (
    <div>
      <div
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition ${
          drag ? "border-rosegold bg-blush/60" : "border-gold/50 bg-cream/60 hover:border-rosegold"
        }`}
        role="button" tabIndex={0} aria-label="Upload reference photos"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") input.current?.click(); }}
      >
        <Sparkle className="h-8 w-8 text-gold" />
        <p className="mt-3 font-semibold text-charcoal">Drag & drop your photos here</p>
        <p className="mt-1 text-sm text-charcoal-muted">or tap to browse · JPG/PNG · 4–5 photos are best</p>
        <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />
      </div>
      <div className="mt-3 rounded-2xl bg-cream-dark/70 px-5 py-4 text-sm leading-relaxed text-charcoal-soft">
        <p className="font-semibold text-charcoal">What makes a good reference photo?</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-5">
          <li>Clear and well-lit — no heavy filters</li>
          <li>Face from the front <em>and</em> the full body</li>
          <li>Different angles help us match markings & colours</li>
        </ul>
      </div>
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt={`Reference photo ${i + 1}`} className="aspect-square w-full rounded-2xl border border-charcoal/10 object-cover" />
              <button
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-charcoal text-cream shadow-card"
                aria-label={`Remove photo ${i + 1}`}
              >✕</button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

/* ---------- the builder ---------- */
export default function OrderBuilder({ onConfig, compact = false }: {
  onConfig?: (s: BuilderSummary) => void;
  compact?: boolean;
}) {
  const { me, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Pets");
  const [sizeId, setSizeId] = useState("5-slim");
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [tagText, setTagText] = useState("");
  const [notes, setNotes] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const price = useMemo(() => priceFor(category, sizeId), [category, sizeId]);
  const split = useMemo(() => (price ? splitFor(price) : null), [price]);
  const sizeLabel = useMemo(() => {
    if (category !== "Pets") return "Standard keepsake";
    return PET_SIZES.find((s) => s.id === sizeId)?.label || "";
  }, [category, sizeId]);

  const pushConfig = (c: string, s: string, p: string) => onConfig?.({ category: c, size: s, price: p });

  const waSummary = () => {
    const lines = [
      "Hi DIKOR! I'd like to place an order:",
      `• Category: ${category}`,
      `• Size: ${sizeLabel}`,
      price ? `• Total: ${inr(price)} (75% = ${inr(split!.advance)} advance now, ${inr(split!.balance)} before shipping)` : "• Price: please confirm the price for me",
      name ? `• Name: ${name}` : null,
      tagText ? `• Name tag text: ${tagText}` : null,
      notes ? `• Notes: ${notes}` : null,
      city ? `• City: ${city}` : null,
      `• Photos: I'll send ${Math.max(photos.length, 4)} clear photos here`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const placeOrder = async () => {
    setBusy(true); setError("");
    try {
      const { order } = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          title: `${name || category} ${category === "Pets" ? "pet" : "custom"} figurine`.trim().slice(0, 80),
          category: catalogKeyToStoreCategory(category),
          description: [`Name tag: ${tagText || "—"}`, notes].filter(Boolean).join("\n"),
          photos,
          price,
          size: sizeLabel,
          city,
        }),
      });
      await api(`/api/orders/${order.id}/pay`, { method: "POST", body: JSON.stringify({ type: "advance" }) });
      setOrderId(order.id);
      setPaid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const canContinue = (n: number) => {
    if (n === 2) return category === "Pets" ? !!sizeId : true;
    if (n === 3) return photos.length >= 1;
    if (n === 4) return name.trim().length > 0;
    return true;
  };

  if (paid && orderId) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-card md:p-12">
        <Sparkle className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 font-display text-4xl text-charcoal">Order confirmed!</h3>
        <p className="mx-auto mt-3 max-w-md text-charcoal-muted">
          Your 75% advance ({price ? inr(split!.advance) : ""}) is in and your photos are with our studio.
          We&apos;ll start printing & painting within a day — and share photos or a video for your approval before anything ships.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/dashboard/orders/${orderId}`}>
            <GoldButton>Track my order</GoldButton>
          </Link>
          <a href={whatsappOrderLink(`Hi DIKOR! I just placed order ${orderId} on the website.`)} target="_blank" rel="noreferrer">
            <GhostButton>Chat on WhatsApp</GhostButton>
          </a>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === category)!;

  return (
    <div id="order-builder" className="rounded-[2rem] bg-white p-6 shadow-card md:p-10">
      {/* numbered steps */}
      <ol className="mb-8 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] sm:gap-2 sm:text-xs">
        {["Craft", "Size", "Photos", "Details", "Confirm"].map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const cur = n === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs ${done ? "border-gold bg-gold text-charcoal" : cur ? "border-rosegold bg-rosegold text-cream" : "border-charcoal/20 bg-cream text-charcoal-muted"}`}>
                {done ? "✓" : n}
              </span>
              <span className={`${cur ? "text-charcoal" : "text-charcoal-muted"} ${n > 3 ? "hidden sm:inline" : ""}`}>{label}</span>
              {n < 5 && <span className="h-px flex-1 bg-charcoal/10" />}
            </li>
          );
        })}
      </ol>

      {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* STEP 1 — category */}
      {step === 1 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">What should we craft?</h3>
          <div className="mt-5 space-y-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => { setCategory(c.key); pushConfig(c.key, category === "Pets" ? sizeLabel : "Standard keepsake", c.fromPrice); }}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3 text-left transition ${category === c.key ? "border-rosegold bg-blush/50 shadow-soft" : "border-charcoal/10 bg-cream/50 hover:border-rosegold/60"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.key} className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
                <span className="flex-1">
                  <span className="block font-semibold text-charcoal">{c.key}</span>
                  <span className="block text-sm text-charcoal-muted">{c.tagline}</span>
                </span>
                <span className="text-right text-sm font-bold text-gold-dark">{c.fromPrice}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <GoldButton onClick={() => setStep(2)}>Continue →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 2 — size */}
      {step === 2 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">Pick a size</h3>
          <p className="mt-1 text-sm text-charcoal-muted">Every size includes your personalised name tag and shipping across India.</p>
          <div className="mt-5 space-y-3">
            {category === "Pets" ? PET_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSizeId(s.id); pushConfig(category, s.label, s.price ? inr(s.price) : "On WhatsApp"); }}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition ${sizeId === s.id ? "border-rosegold bg-blush/50 shadow-soft" : "border-charcoal/10 bg-cream/50 hover:border-rosegold/60"}`}
              >
                <span className="font-semibold text-charcoal">{s.label}</span>
                <span className="font-display text-xl text-gold-dark">{s.price ? inr(s.price) : "On WhatsApp"}</span>
              </button>
            )) : (
              <div className="rounded-2xl border-2 border-rosegold bg-blush/50 px-5 py-4">
                <p className="font-semibold text-charcoal">Standard keepsake</p>
                <p className="mt-1 text-sm text-charcoal-muted">Sized to your photos — we confirm the exact price with you personally on WhatsApp before you pay anything.</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <GhostButton onClick={() => setStep(1)}>← Back</GhostButton>
            <GoldButton disabled={!canContinue(2)} onClick={() => setStep(3)}>Continue →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 3 — photos */}
      {step === 3 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">Share 4–5 clear photos</h3>
          <p className="mt-1 text-sm text-charcoal-muted">This is the step that decides the likeness — good photos, great figurine.</p>
          <div className="mt-5">
            <PhotoDrop photos={photos} setPhotos={setPhotos} error={error} setError={setError} />
          </div>
          <div className="mt-6 flex justify-between">
            <GhostButton onClick={() => setStep(2)}>← Back</GhostButton>
            <GoldButton disabled={!canContinue(3)} onClick={() => setStep(4)}>Continue →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 4 — details */}
      {step === 4 && (
        <div className="space-y-5">
          <h3 className="font-display text-3xl text-charcoal">The little details</h3>
          <Field label="Name (pet / person / subject)">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bruno" maxLength={60} />
          </Field>
          <Field label="Name tag text" hint="Engraved on the base — leave blank if you don't want one.">
            <input className={inputCls} value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="e.g. Bruno ❤" maxLength={40} />
          </Field>
          <Field label="Anything we shouldn't miss?" hint="Collar colour, markings, expression, pose, a deadline…">
            <textarea className={`${inputCls} min-h-24`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. white patch on the chest, sitting pose, blue collar" maxLength={1000} />
          </Field>
          <Field label="Your city">
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bengaluru" maxLength={60} />
          </Field>
          <div className="flex justify-between pt-1">
            <GhostButton onClick={() => setStep(3)}>← Back</GhostButton>
            <GoldButton disabled={!canContinue(4)} onClick={() => setStep(5)}>Review order →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 5 — confirm */}
      {step === 5 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">Review & confirm</h3>
          <div className="mt-5 space-y-3 rounded-2xl bg-cream/70 p-5 text-sm">
            <p className="flex justify-between"><span className="text-charcoal-muted">What</span><span className="font-semibold text-charcoal">{cat.key} figurine · {sizeLabel}</span></p>
            <p className="flex justify-between"><span className="text-charcoal-muted">For</span><span className="font-semibold text-charcoal">{name}{tagText ? ` · tag: “${tagText}”` : ""}</span></p>
            <p className="flex justify-between"><span className="text-charcoal-muted">Photos</span><span className="font-semibold text-charcoal">{photos.length} uploaded</span></p>
            <div className="border-t border-charcoal/10 pt-3">
              {price ? (
                <>
                  <p className="flex justify-between text-base"><span className="font-semibold text-charcoal">Total</span><span className="font-display text-2xl text-charcoal">{inr(price)}</span></p>
                  <p className="mt-1 rounded-xl bg-gold/15 px-3 py-2 text-xs font-semibold text-gold-dark">
                    Pay {inr(split!.advance)} now (75% advance) · {inr(split!.balance)} before shipping
                  </p>
                  <p className="mt-2 text-xs text-charcoal-muted">✓ Personalised name tag included · ✓ Shipping included · ✓ Approval video before dispatch</p>
                </>
              ) : (
                <p className="text-sm text-charcoal-muted">We&apos;ll confirm your exact price with you personally on WhatsApp — you pay nothing until you approve it.</p>
              )}
            </div>
          </div>

          {price ? (
            loading ? <p className="mt-5 text-sm text-charcoal-muted">Checking your sign-in…</p> : me ? (
              <div className="mt-6 space-y-3">
                <GoldButton disabled={busy} className="w-full" onClick={placeOrder}>
                  {busy ? "Placing your order…" : `Place order · pay ${inr(split!.advance)} advance`}
                </GoldButton>
                <p className="text-center text-xs text-charcoal-muted">Demo payment — no real money moves.</p>
                <a href={whatsappOrderLink(waSummary())} target="_blank" rel="noreferrer" className="block">
                  <GhostButton className="w-full">Prefer WhatsApp? Send this order there</GhostButton>
                </a>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-gold/40 bg-cream p-5 text-center">
                <p className="text-sm text-charcoal">One quick step: <strong>sign in</strong> to place your order and track it in your studio.</p>
                <Link href="/auth" className="mt-4 inline-block">
                  <GoldButton>Sign in to finish</GoldButton>
                </Link>
                <p className="mt-3 text-xs text-charcoal-muted">Or skip the form —</p>
                <a href={whatsappOrderLink(waSummary())} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-rosegold-dark underline">send this order on WhatsApp instead</a>
              </div>
            )
          ) : (
            <div className="mt-6">
              <a href={whatsappOrderLink(waSummary())} target="_blank" rel="noreferrer" className="block">
                <GoldButton className="w-full">Continue on WhatsApp</GoldButton>
              </a>
              <p className="mt-2 text-center text-xs text-charcoal-muted">Your photos and details go with you — nothing to retype.</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <button onClick={() => setStep(4)} className="text-sm text-charcoal-muted underline">← Edit details</button>
          </div>
        </div>
      )}
    </div>
  );
}
