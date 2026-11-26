"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, api, fileToDataURL } from "@/lib/client";
import { GoldButton, GhostButton, Field, inputCls } from "@/components/ui";
import {
  CATEGORIES,
  PET_SIZES,
  inr,
  splitFor,
  priceFor,
  whatsappOrderLink,
  catalogKeyToStoreCategory,
} from "@/lib/catalog";

export interface BuilderSummary {
  category: string;
  size: string;
  price: string;
}

/* ---------- photo dropzone (redesign styling, upstream 10MB limit) ---------- */
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
      const urls = await Promise.all(list.map((f) => fileToDataURL(f, 10 * 1024 * 1024)));
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
        className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed p-6 text-center transition ${
          drag ? "border-rosegold bg-blush/60" : "border-gold/50 bg-cream/60 hover:border-rosegold"
        }`}
        role="button" tabIndex={0} aria-label="Upload reference photos"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") input.current?.click(); }}
      >
        <p className="font-semibold text-charcoal">Drag & drop your photos here</p>
        <p className="mt-1 text-sm text-charcoal-muted">or tap to browse. JPG or PNG. 4–5 photos are best.</p>
        <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />
      </div>
      <div className="mt-3 border-t border-charcoal/10 px-1 py-4 text-sm leading-relaxed text-charcoal-soft">
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
              <img src={p} alt={`Reference photo ${i + 1}`} className="aspect-square w-full rounded-sm border border-charcoal/10 object-cover" />
              <button
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-charcoal text-cream"
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

/* ---------- the builder ----------
   Categories: Pets, Cats, Kids, Decor only.
   Order/auth/payment logic is upstream's real flow (create order via
   /api/orders, Easebuzz via the dashboard order page, WhatsApp fallback).
   The 75% payment split is shown ONLY when signed in (`me`); guests see
   only the total and "Payment details appear after you sign in." ---------- */
export default function OrderBuilder({ onConfig, compact = false }: {
  onConfig?: (s: BuilderSummary) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const { me, loading } = useAuth();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string>("Pets");
  const [sizeId, setSizeId] = useState("dog-5-slim");
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [tagText, setTagText] = useState("");
  const [ownerName, setOwnerName] = useState(me?.name || "");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState(me?.email || "");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string; trackingToken: string } | null>(null);

  const price = useMemo(() => priceFor(category, sizeId), [category, sizeId]);
  const split = useMemo(() => (price ? splitFor(price) : null), [price]);
  const sizeLabel = useMemo(() => {
    if (category !== "Pets" && category !== "Cats") return "Standard keepsake";
    return PET_SIZES.find((s) => s.id === sizeId)?.label || "5-inch keepsake";
  }, [category, sizeId]);

  // Size options are per subject in the catalog (Dogs for Pets, Cats for Cats);
  // Kids/Decor have no size step and use "Standard keepsake".
  const sizeOptions = useMemo(() => {
    const sc = category === "Pets" ? "Dogs" : category === "Cats" ? "Cats" : null;
    return sc ? PET_SIZES.filter((s) => s.category === sc) : [];
  }, [category]);
  const firstSizeIdFor = (key: string) => {
    const sc = key === "Pets" ? "Dogs" : key === "Cats" ? "Cats" : null;
    return sc ? PET_SIZES.find((s) => s.category === sc)?.id ?? "" : "";
  };

  const pushConfig = (c: string, s: string, p: string) => onConfig?.({ category: c, size: s, price: p });

  const handleCategorySelect = (key: string) => {
    setCategory(key);
    const sid = firstSizeIdFor(key);
    setSizeId(sid);
    const cat = CATEGORIES.find((c) => c.key === key);
    pushConfig(key, sid ? (PET_SIZES.find((s) => s.id === sid)?.label || "5-inch keepsake") : "Standard keepsake", cat?.fromPrice || "");
  };

  const waSummary = () => {
    const lines = [
      "Hi DIKOR! I'd like to place an order:",
      `• Category: ${category}`,
      `• Size: ${sizeLabel}`,
      price ? (me ? `• Total: ${inr(price)} (75% = ${inr(split!.advance)} advance now, ${inr(split!.balance)} before shipping)` : `• Total: ${inr(price)}`) : "• Price: please confirm the price for me",
      name ? `• Name: ${name}` : null,
      tagText ? `• Name tag text: ${tagText}` : null,
      notes ? `• Notes: ${notes}` : null,
      city ? `• City: ${city}` : null,
      `• Photos: I'll send ${Math.max(photos.length, 4)} clear photos here`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const canContinue = (n: number) => {
    if (n === 2) return category === "Pets" || category === "Cats" ? !!sizeId : true;
    if (n === 3) return photos.length >= 1;
    if (n === 4) return name.trim().length > 0;
    return true;
  };

  const handleCreateOrder = async (payMethod: "easebuzz" | "whatsapp") => {
    setError("");
    if (!ownerName.trim()) {
      setError("Please provide your name.");
      setStep(4);
      return;
    }
    if (!ownerPhone.trim() && !ownerEmail.trim()) {
      setError("Please provide at least a phone number or email address.");
      setStep(4);
      return;
    }

    setBusy(true);

    try {
      const payload = {
        title: `${name || category} ${category === "Pets" ? "pet" : category === "Cats" ? "cat" : "custom"} figurine`.trim().slice(0, 80),
        category: catalogKeyToStoreCategory(category),
        description: [`Name tag: ${tagText || "—"}`, notes].filter(Boolean).join("\n"),
        photos,
        price,
        size: sizeLabel,
        city: city.trim() || undefined,
        customerName: ownerName.trim(),
        customerPhone: ownerPhone.trim() || undefined,
        customerEmail: ownerEmail.trim() || undefined,
        subjectName: name.trim() || undefined,
        tagText: tagText.trim() || undefined,
        advancePct: 75,
      };

      const res = await api<{ order: { id: string; trackingToken: string } }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setOrderConfirmed(res.order);

      if (payMethod === "easebuzz") {
        router.push(`/dashboard/orders/${res.order.id}?token=${res.order.trackingToken}&init=advance`);
      } else {
        const waMsg = `Hi DIKOR Atelier! I just configured an order (#${res.order.id}) for a ${category} figurine.\nSize: ${sizeLabel}\nName on Plaque: ${tagText || name || "None"}\nCustomer: ${ownerName}\nPhone: ${ownerPhone}\nTracking: ${window.location.origin}/dashboard/orders/${res.order.id}?token=${res.order.trackingToken}`;
        window.open(whatsappOrderLink(waMsg), "_blank");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not create order");
    } finally {
      setBusy(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="rounded-sm border border-charcoal/10 bg-white p-8 text-center md:p-12">
        <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
          Order Reserved
        </span>
        <h3 className="mt-3 font-display text-4xl text-charcoal">
          Order #{orderConfirmed.id} Created
        </h3>
        <p className="mx-auto mt-3 max-w-md text-charcoal-muted">
          {me
            ? "Your custom miniature is logged in our studio queue. Next step is paying the 75% advance reservation to begin 3D modeling and resin printing."
            : "Your custom miniature is logged in our studio queue. Sign in to see payment details and track your order."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {me && split && (
            <Link href={`/dashboard/orders/${orderConfirmed.id}?token=${orderConfirmed.trackingToken}`}>
              <GoldButton>Proceed to 75% Advance ({inr(split.advance)})</GoldButton>
            </Link>
          )}
          {!me && (
            <Link href="/auth">
              <GoldButton>Sign in to track</GoldButton>
            </Link>
          )}
          <a
            href={whatsappOrderLink(`Hi DIKOR! Order #${orderConfirmed.id} is created. Connecting about details.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-charcoal/20 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal hover:border-rosegold"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="order-builder" className="rounded-sm border border-charcoal/10 bg-white p-6 md:p-10">
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
              <span className={`whitespace-nowrap ${cur ? "text-charcoal" : "hidden text-charcoal-muted sm:inline"}`}>{label}</span>
              {n < 5 && <span className="h-px flex-1 bg-charcoal/10" />}
            </li>
          );
        })}
      </ol>

      {error && <p className="mb-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* STEP 1 — category */}
      {step === 1 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">What should we craft?</h3>
          <div className="mt-5 space-y-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCategorySelect(c.key)}
                className={`flex w-full items-center gap-4 rounded-sm border-2 p-3 text-left transition ${category === c.key ? "border-rosegold bg-blush/50" : "border-charcoal/10 bg-cream/50 hover:border-rosegold/60"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.key} className="h-20 w-20 shrink-0 rounded-sm object-cover" loading="lazy" />
                <span className="flex-1">
                  <span className="block font-semibold text-charcoal">{c.key}</span>
                  <span className="block text-sm text-charcoal-muted">{c.tagline}</span>
                </span>
                <span className="text-right text-sm font-bold text-gold-dark">
                  {c.priceConfirmed ? c.fromPrice : <span className="text-xs font-semibold text-charcoal-muted">Price confirmed on WhatsApp</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <GoldButton onClick={() => setStep(2)}>Continue</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 2 — size */}
      {step === 2 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">Pick a size</h3>
          <p className="mt-1 text-sm text-charcoal-muted">Every size includes your personalised name tag and shipping across India. Delivery in 7–10 days.</p>
          <div className="mt-5 space-y-3">
            {category === "Pets" || category === "Cats" ? sizeOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSizeId(s.id); pushConfig(category, s.label, s.price ? inr(s.price) : "On WhatsApp"); }}
                className={`flex w-full items-center justify-between rounded-sm border-2 px-5 py-4 text-left transition ${sizeId === s.id ? "border-rosegold bg-blush/50" : "border-charcoal/10 bg-cream/50 hover:border-rosegold/60"}`}
              >
                <span className="font-semibold text-charcoal">{s.label}</span>
                <span className="font-display text-xl text-gold-dark">{s.price ? inr(s.price) : "On WhatsApp"}</span>
              </button>
            )) : (
              <div className="rounded-sm border-2 border-rosegold bg-blush/50 px-5 py-4">
                <p className="font-semibold text-charcoal">Standard keepsake</p>
                <p className="mt-1 text-sm text-charcoal-muted">Sized to your photos — we confirm the exact price with you personally on WhatsApp before you pay anything.</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <GhostButton onClick={() => setStep(1)}>Back</GhostButton>
            <GoldButton disabled={!canContinue(2)} onClick={() => setStep(3)}>Continue</GoldButton>
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
            <GhostButton onClick={() => setStep(2)}>Back</GhostButton>
            <GoldButton disabled={!canContinue(3)} onClick={() => setStep(4)}>Continue</GoldButton>
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
            <input className={inputCls} value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="e.g. Bruno" maxLength={40} />
          </Field>
          <Field label="Your full name *">
            <input className={inputCls} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Rahul Sharma" maxLength={80} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="WhatsApp / Phone *">
              <input className={inputCls} value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="e.g. 98765 43210" maxLength={20} />
            </Field>
            <Field label="Email address">
              <input className={inputCls} value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="e.g. rahul@example.com" maxLength={80} />
            </Field>
          </div>
          <Field label="Delivery city & PIN code">
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai 400001" maxLength={60} />
          </Field>
          <Field label="Studio notes (special markings, collar details)">
            <textarea className={`${inputCls} min-h-24`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. white patch on the chest, sitting pose, blue collar" maxLength={1000} />
          </Field>
          <div className="flex justify-between pt-1">
            <GhostButton onClick={() => setStep(3)}>Back</GhostButton>
            <GoldButton disabled={!canContinue(4)} onClick={() => setStep(5)}>Review & Reserve</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 5 — review & confirm */}
      {step === 5 && (
        <div>
          <h3 className="font-display text-3xl text-charcoal">Review & confirm</h3>
          <div className="mt-5 space-y-3 rounded-sm border border-charcoal/10 bg-cream/70 p-5 text-sm">
            <p className="flex justify-between"><span className="text-charcoal-muted">What</span><span className="font-semibold text-charcoal">{category} figurine, {sizeLabel}</span></p>
            <p className="flex justify-between"><span className="text-charcoal-muted">For</span><span className="font-semibold text-charcoal">{name}{tagText ? `, tag: “${tagText}”` : ""}</span></p>
            <p className="flex justify-between"><span className="text-charcoal-muted">Photos</span><span className="font-semibold text-charcoal">{photos.length} uploaded</span></p>
            <p className="flex justify-between"><span className="text-charcoal-muted">Delivery</span><span className="font-semibold text-charcoal">7–10 days</span></p>
            <div className="border-t border-charcoal/10 pt-3">
              {price ? (
                <>
                  <p className="flex justify-between text-base"><span className="font-semibold text-charcoal">Total</span><span className="font-display text-2xl text-charcoal">{inr(price)}</span></p>
                  {loading ? (
                    <p className="mt-1 text-xs text-charcoal-muted">Checking your sign-in…</p>
                  ) : me && split ? (
                    <>
                      <p className="mt-1 rounded-sm bg-gold/15 px-3 py-2 text-xs font-semibold text-gold-dark">
                        Pay {inr(split.advance)} now (75% advance), {inr(split.balance)} before shipping
                      </p>
                      <p className="mt-2 text-xs text-charcoal-muted">Personalised name tag included, shipping included, approval video before dispatch.</p>
                    </>
                  ) : (
                    <p className="mt-1 rounded-sm bg-cream-dark px-3 py-2 text-xs font-semibold text-charcoal-soft">
                      Payment details appear after you sign in.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-charcoal-muted">We&apos;ll confirm your exact price with you personally on WhatsApp — you pay nothing until you approve it.</p>
              )}
            </div>
          </div>

          {price ? (
            loading ? <p className="mt-5 text-sm text-charcoal-muted">Checking your sign-in…</p> : me ? (
              <div className="mt-6 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <GoldButton disabled={busy} className="flex-1" onClick={() => handleCreateOrder("easebuzz")}>
                    {busy ? "Reserving..." : `Pay 75% Advance (${inr(split!.advance)}) via Easebuzz`}
                  </GoldButton>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleCreateOrder("whatsapp")}
                    className="min-h-[44px] px-6 py-2.5 rounded-full border border-charcoal/25 bg-white text-xs font-bold uppercase tracking-wider text-charcoal hover:border-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark"
                  >
                    Order via WhatsApp Direct
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-sm border border-charcoal/15 bg-cream p-5 text-center">
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
            <button onClick={() => setStep(4)} className="text-sm text-charcoal-muted underline">Edit details</button>
          </div>
        </div>
      )}
    </div>
  );
}
