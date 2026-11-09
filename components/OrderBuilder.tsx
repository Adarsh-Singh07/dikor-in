"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, api, fileToDataURL } from "@/lib/client";
import { GoldButton, GhostButton } from "@/components/ui";
import StudioViewer3D from "@/components/StudioViewer3D";
import {
  PRODUCT_SIZES,
  inr,
  splitFor,
  whatsappOrderLink,
  catalogKeyToStoreCategory,
} from "@/lib/catalog";

export interface BuilderSummary {
  category: string;
  size: string;
  price: string;
}

const SUBJECT_OPTIONS = [
  {
    id: "Dogs",
    title: "Dog Miniature",
    desc: "Golden Retriever, Indie, GSD, Lab, Beagle, Shih Tzu",
  },
  {
    id: "Cats",
    title: "Cat Miniature",
    desc: "Persian, Indie, Tabby, Calico, Siamese",
  },
  {
    id: "Humans",
    title: "Human Miniature",
    desc: "Individual portrait, child milestone, keepsake sculpture",
  },
];

export default function OrderBuilder({
  onConfig,
  compact = false,
}: {
  onConfig?: (s: BuilderSummary) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const { me } = useAuth();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<"Dogs" | "Cats" | "Humans">("Dogs");
  const [sizeId, setSizeId] = useState("dog-5-slim");
  const [photos, setPhotos] = useState<string[]>([]);
  const [petName, setPetName] = useState("");
  const [tagText, setTagText] = useState("");
  const [ownerName, setOwnerName] = useState(me?.name || "");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState(me?.email || "");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string; trackingToken: string } | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Filter available sizes for current category
  const availableSizes = useMemo(() => {
    return PRODUCT_SIZES.filter((s) => s.category === category);
  }, [category]);

  // Current selected size option
  const selectedSizeOpt = useMemo(() => {
    return availableSizes.find((s) => s.id === sizeId) || availableSizes[0];
  }, [availableSizes, sizeId]);

  const price = selectedSizeOpt?.price || 1500;
  const split = useMemo(() => splitFor(price), [price]);

  const handleCategorySelect = (cat: "Dogs" | "Cats" | "Humans") => {
    setCategory(cat);
    const firstSize = PRODUCT_SIZES.find((s) => s.category === cat);
    if (firstSize) {
      setSizeId(firstSize.id);
      onConfig?.({
        category: cat,
        size: firstSize.label,
        price: firstSize.price ? inr(firstSize.price) : "Custom",
      });
    }
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    setError("");
    const maxFiles = 8;
    const remaining = maxFiles - photos.length;
    if (remaining <= 0) {
      setError("Maximum 8 reference photos allowed.");
      return;
    }

    const toProcess = Array.from(files).slice(0, remaining);
    try {
      const dataUrls = await Promise.all(
        toProcess.map((f) => fileToDataURL(f, 10 * 1024 * 1024))
      );
      setPhotos((prev) => [...prev, ...dataUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error reading photos");
    }
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
        title: `${category} Miniature (${selectedSizeOpt?.label || "5 Inch"})`,
        category: catalogKeyToStoreCategory(category),
        customerName: ownerName.trim(),
        customerPhone: ownerPhone.trim() || undefined,
        customerEmail: ownerEmail.trim() || undefined,
        petName: petName.trim() || undefined,
        tagText: tagText.trim() || undefined,
        city: city.trim() || undefined,
        notes: notes.trim() || undefined,
        photos,
        sizeId,
        totalPrice: price,
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
        const waMsg = `Hi DIKOR Atelier! I just configured an order (#${res.order.id}) for a ${category} Miniature.\nSize: ${selectedSizeOpt?.label}\nName on Plaque: ${tagText || petName || "None"}\nCustomer: ${ownerName}\nPhone: ${ownerPhone}\nTracking: ${window.location.origin}/dashboard/orders/${res.order.id}?token=${res.order.trackingToken}`;
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
      <div className="rounded-2xl border border-charcoal/15 bg-white p-8 text-center sm:p-10">
        <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
          Order Reserved
        </span>
        <h3 className="mt-3 font-serif text-3xl font-bold text-charcoal">
          Order #{orderConfirmed.id} Created
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted leading-relaxed">
          Your custom {category} miniature is logged in our studio queue. Next step is paying the 75% advance reservation to begin 3D modeling and resin printing.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/dashboard/orders/${orderConfirmed.id}?token=${orderConfirmed.trackingToken}`}>
            <GoldButton>Proceed to 75% Advance ({inr(split.advance)})</GoldButton>
          </Link>
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
    <div id="order-builder" className="rounded-2xl border border-charcoal/15 bg-white p-6 shadow-sm sm:p-8">
      {/* Step Header */}
      <div className="mb-6 flex items-center justify-between border-b border-charcoal/10 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rosegold-dark">
            Custom Atelier Studio
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            {step === 1 && "1. Choose Your Subject"}
            {step === 2 && "2. Scale, Dimensions & 3D Preview"}
            {step === 3 && "3. Upload 4-5 Reference Photos"}
            {step === 4 && "4. Personalisation & Plaque Text"}
            {step === 5 && "5. Review & Split Payment"}
          </h2>
        </div>

        {/* Step Numbers (Accessible 44px touch targets) */}
        <div className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Step Navigation">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              key={s}
              disabled={s > step}
              onClick={() => s <= step && setStep(s)}
              aria-label={`Step ${s}`}
              className={`min-h-[44px] min-w-[44px] rounded-lg grid place-items-center text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
                s === step
                  ? "bg-charcoal text-white"
                  : s < step
                  ? "bg-[#FAF7F2] text-charcoal border border-charcoal/20 hover:border-charcoal"
                  : "text-charcoal-muted/40 cursor-not-allowed"
              }`}
            >
              {s < step ? "✓" : s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      {/* STEP 1: SUBJECT PICKER */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {SUBJECT_OPTIONS.map((opt) => {
              const isSelected = category === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleCategorySelect(opt.id as any)}
                  className={`min-h-[88px] p-5 rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark flex flex-col justify-between ${
                    isSelected
                      ? "border-charcoal bg-[#FAF7F2] shadow-sm"
                      : "border-charcoal/15 bg-white hover:border-charcoal/40"
                  }`}
                >
                  <span className="font-serif text-lg font-bold text-charcoal">{opt.title}</span>
                  <span className="text-xs text-charcoal-muted mt-1 leading-snug">{opt.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <GoldButton onClick={() => setStep(2)}>Continue to Sizing</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 2: SIZES & 3D STUDIO VIEWER */}
      {step === 2 && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6">
            <StudioViewer3D
              category={category}
              petName={petName || "Your Miniature"}
              tagText={tagText || "DIKOR ATELIER"}
              sizeInches={sizeId.includes("7") ? 7 : 5}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Select Display Scale</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Includes wooden presentation base, engraved brass nameplate, and insured pan-India delivery.
              </p>
            </div>

            <div className="space-y-2.5">
              {availableSizes.map((s) => {
                const isSelected = sizeId === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSizeId(s.id)}
                    className={`min-h-[56px] w-full p-4 rounded-xl border text-left flex items-center justify-between transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosegold-dark ${
                      isSelected
                        ? "border-charcoal bg-[#FAF7F2] shadow-sm"
                        : "border-charcoal/15 bg-white hover:border-charcoal/40"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-charcoal text-sm block">{s.label}</span>
                      {s.build && (
                        <span className="text-[11px] text-charcoal-muted">
                          {s.build === "slim" ? "Slim & medium breeds" : "Bulky & muscular breeds"}
                        </span>
                      )}
                    </div>
                    <span className="font-serif text-base font-bold text-charcoal shrink-0">
                      {s.price ? inr(s.price) : "Confirmed on WA"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-charcoal/10">
              <GhostButton onClick={() => setStep(1)}>Back</GhostButton>
              <GoldButton onClick={() => setStep(3)}>Continue to Photos</GoldButton>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REFERENCE PHOTOS */}
      {step === 3 && (
        <div className="space-y-6">
          <div
            onClick={() => photoInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handlePhotoUpload(e.dataTransfer.files);
            }}
            className={`min-h-[12rem] cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center ${
              dragActive ? "border-rosegold bg-blush" : "border-charcoal/20 bg-[#FAF7F2] hover:border-charcoal"
            }`}
          >
            <span className="text-2xl mb-2 text-charcoal-muted">📷</span>
            <p className="font-semibold text-charcoal text-sm">Upload Reference Photos</p>
            <p className="text-xs text-charcoal-muted mt-1">
              4-5 clear photos: front face, side profile, and full standing posture
            </p>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
          </div>

          {photos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-charcoal mb-2">
                Uploaded Photos ({photos.length}/8)
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-charcoal/20 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-charcoal text-white text-xs flex items-center justify-center"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-[#FAF7F2] p-4 text-xs text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal block mb-0.5">Photo Advice:</strong>
            Eye-level photos taken in natural daylight help our sculptors match coat coloration, eye gaze, and posture precisely. If you do not have all photos right now, you can also send them via WhatsApp after booking.
          </div>

          <div className="flex justify-between pt-2 border-t border-charcoal/10">
            <GhostButton onClick={() => setStep(2)}>Back</GhostButton>
            <GoldButton onClick={() => setStep(4)}>Continue to Personalisation</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 4: PERSONALISATION & DELIVERY */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                {category === "Humans" ? "Subject Name" : "Pet Name"}
              </label>
              <input
                type="text"
                placeholder={category === "Humans" ? "e.g. Aarav" : "e.g. Babu / Leo"}
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Brass Plaque Engraving Text
              </label>
              <input
                type="text"
                placeholder="e.g. Leo · Always by our side"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                WhatsApp / Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Delivery City &amp; PIN Code
              </label>
              <input
                type="text"
                placeholder="Mumbai 400001"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-charcoal/20 px-3.5 text-sm text-charcoal focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Studio Notes (Special Markings, Collar Details)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please capture the small white patch on the left paw..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 p-3 text-sm text-charcoal focus:border-rosegold focus:outline-none"
            />
          </div>

          <div className="flex justify-between pt-3 border-t border-charcoal/10">
            <GhostButton onClick={() => setStep(3)}>Back</GhostButton>
            <GoldButton onClick={() => setStep(5)}>Review &amp; Reserve</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & CHECKOUT */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-charcoal/15 bg-[#FAF7F2] p-5">
            <div className="flex items-start justify-between border-b border-charcoal/10 pb-4">
              <div>
                <span className="font-serif text-xl font-bold text-charcoal">{category} Miniature</span>
                <p className="text-xs text-charcoal-muted mt-0.5">{selectedSizeOpt?.label}</p>
                {petName && <p className="text-xs text-charcoal mt-1">Subject: <strong>{petName}</strong></p>}
                {tagText && <p className="text-xs text-charcoal">Engraving: <strong>{tagText}</strong></p>}
              </div>
              <span className="font-serif text-2xl font-bold text-charcoal">{inr(price)}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-lg bg-white p-3 border border-charcoal/10">
                <span className="font-bold text-charcoal block">Step 1: 75% Advance Reservation</span>
                <span className="text-base font-serif font-bold text-rosegold-dark block mt-1">
                  {inr(split.advance)}
                </span>
                <span className="text-charcoal-muted mt-1 block">Due now to begin 3D CAD modeling &amp; resin printing.</span>
              </div>
              <div className="rounded-lg bg-white p-3 border border-charcoal/10">
                <span className="font-bold text-charcoal block">Step 2: 25% Balance on Approval</span>
                <span className="text-base font-serif font-bold text-charcoal block mt-1">
                  {inr(split.balance)}
                </span>
                <span className="text-charcoal-muted mt-1 block">Due only after you inspect and approve your 360° video.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row justify-between pt-2 border-t border-charcoal/10">
            <GhostButton onClick={() => setStep(4)} disabled={busy}>
              Back
            </GhostButton>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <GoldButton
                disabled={busy}
                onClick={() => handleCreateOrder("easebuzz")}
              >
                {busy ? "Reserving..." : `Pay 75% Advance (${inr(split.advance)}) via Easebuzz`}
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
        </div>
      )}
    </div>
  );
}
