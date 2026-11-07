"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, api, fileToDataURL } from "@/lib/client";
import { GoldButton, GhostButton, Sparkle } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import StudioViewer3D from "@/components/StudioViewer3D";
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

const SUBJECT_OPTIONS = [
  { id: "dog", category: "Pets", title: "Dog Miniature", icon: "🐕", desc: "Golden, Indie, GSD, Lab, Beagle" },
  { id: "cat", category: "Pets", title: "Cat Miniature", icon: "🐈", desc: "Persian, Tabby, Indie, Calico" },
  { id: "couple", category: "Couples", title: "Human Couple", icon: "👫", desc: "Anniversary & Wedding Figurines" },
  { id: "kid", category: "Kids", title: "Child Keepsake", icon: "🧸", desc: "Cherished moments, captured forever" },
  { id: "idol", category: "Idols", title: "Radha Krishna / Deities", icon: "🪔", desc: "Hand-finished Devotional Idols" },
  { id: "decor", category: "Decor", title: "Custom Decor & Signs", icon: "✨", desc: "Vases, Name Signs & Trays" },
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
  const [subjectType, setSubjectType] = useState("dog");
  const [category, setCategory] = useState("Pets");
  const [sizeId, setSizeId] = useState("5-slim");
  const [photos, setPhotos] = useState<string[]>([]);
  const [petName, setPetName] = useState("");
  const [tagText, setTagText] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string; trackingToken: string } | null>(null);

  // Pre-fill if logged in
  useState(() => {
    if (me) {
      if (me.name) setOwnerName(me.name);
      if (me.email) setOwnerEmail(me.email);
    }
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Pricing calculations
  const price = useMemo(() => {
    if (category === "Pets") {
      const opt = PET_SIZES.find((s) => s.id === sizeId);
      return opt ? opt.price : 1500;
    }
    if (category === "Couples") return sizeId === "8-deluxe" ? 3499 : 2499;
    if (category === "Kids") return sizeId === "7-kid" ? 2799 : 1999;
    if (category === "Idols") return sizeId === "8-idol" ? 4499 : 2999;
    return 1499;
  }, [category, sizeId]);

  const split = useMemo(() => (price ? splitFor(price) : null), [price]);

  const sizeLabel = useMemo(() => {
    if (category === "Pets") {
      return PET_SIZES.find((s) => s.id === sizeId)?.label || '5" Standard';
    }
    if (category === "Couples") return sizeId === "8-deluxe" ? '8" Deluxe Couple' : '6" Studio Couple';
    if (category === "Kids") return sizeId === "7-kid" ? '7" Full Pose' : '5" Child Keepsake';
    if (category === "Idols") return sizeId === "8-idol" ? '8" Mandir Edition' : '6" Pooja Edition';
    return "Standard Accent";
  }, [category, sizeId]);

  // Delivery estimation (4-5 days crafting + 6-7 days pan-India courier = ~11-12 days)
  const estimatedDelivery = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }, []);

  const handleSubjectChange = (opt: typeof SUBJECT_OPTIONS[0]) => {
    setSubjectType(opt.id);
    setCategory(opt.category);
    if (opt.category === "Pets") setSizeId("5-slim");
    else if (opt.category === "Couples") setSizeId("6-standard");
    else if (opt.category === "Kids") setSizeId("5-kid");
    else if (opt.category === "Idols") setSizeId("6-idol");
    else setSizeId("standard-decor");

    onConfig?.({
      category: opt.category,
      size: sizeLabel,
      price: price ? inr(price) : "₹1,500",
    });
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    setError("");
    try {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 8 - photos.length);
      const urls = await Promise.all(list.map((f) => fileToDataURL(f, 5 * 1024 * 1024)));
      setPhotos((prev) => [...prev, ...urls].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error reading photos");
    }
  };

  // WhatsApp formatted order text
  const generateWhatsAppMessage = (orderId?: string) => {
    const lines = [
      `✨ *NEW DIKOR 3D ORDER ${orderId ? `#${orderId}` : ""}* ✨`,
      `• *Subject*: ${petName || subjectType.toUpperCase()} (${category})`,
      `• *Size*: ${sizeLabel}`,
      `• *Engraved Plaque*: "${tagText || petName || "DIKOR"}"`,
      price ? `• *Total*: ${inr(price)} (75% Advance: ${inr(split!.advance)}, 25% Balance: ${inr(split!.balance)})` : "• Price: confirmed on WhatsApp",
      ownerName ? `• *Customer*: ${ownerName}` : null,
      ownerPhone ? `• *Phone*: ${ownerPhone}` : null,
      city ? `• *City*: ${city}` : null,
      notes ? `• *Notes*: ${notes}` : null,
      `• *Photos*: ${photos.length > 0 ? `${photos.length} photos uploaded on site + attaching here` : "Sending 4-5 clear photos now"}`,
      `• *Estimated Delivery*: ${estimatedDelivery}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  // Option 1: One-tap WhatsApp guest order
  const handleWhatsAppGuestOrder = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          title: `${petName || subjectType} 3D Miniature (${sizeLabel})`,
          category: catalogKeyToStoreCategory(category),
          subjectName: petName,
          tagText: tagText,
          description: [`Plaque: "${tagText || petName}"`, notes].filter(Boolean).join("\n"),
          photos,
          price,
          size: sizeLabel,
          city: city || "India",
          customerName: ownerName || "WhatsApp Customer",
          customerEmail: ownerEmail || null,
          customerPhone: ownerPhone || null,
          source: "whatsapp",
        }),
      });

      const { order } = res;
      setOrderConfirmed({ id: order.id, trackingToken: order.trackingToken });

      // Open WhatsApp chat directly
      const waUrl = whatsappOrderLink(generateWhatsAppMessage(order.id));
      window.open(waUrl, "_blank");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to register WhatsApp order");
    } finally {
      setBusy(false);
    }
  };

  // Option 2: Place order with Easebuzz advance payment
  const handlePlaceOrderWithAdvance = async () => {
    if (!ownerName.trim()) {
      setError("Please provide your name to continue");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          title: `${petName || subjectType} 3D Miniature (${sizeLabel})`,
          category: catalogKeyToStoreCategory(category),
          subjectName: petName,
          tagText: tagText,
          description: [`Plaque: "${tagText || petName}"`, notes].filter(Boolean).join("\n"),
          photos,
          price,
          size: sizeLabel,
          city: city || "India",
          customerName: ownerName,
          customerEmail: ownerEmail || null,
          customerPhone: ownerPhone || null,
          source: "web",
        }),
      });

      const { order } = res;

      // Initiate Easebuzz checkout
      const payRes = await api(`/api/orders/${order.id}/pay`, {
        method: "POST",
        body: JSON.stringify({ type: "advance", initiate: true }),
      });

      if (payRes.paymentUrl) {
        router.push(payRes.paymentUrl);
      } else {
        setOrderConfirmed({ id: order.id, trackingToken: order.trackingToken });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to initiate order");
    } finally {
      setBusy(false);
    }
  };

  // Success view
  if (orderConfirmed) {
    return (
      <div className="rounded-[2.5rem] bg-white p-8 md:p-14 text-center shadow-card border border-gold/40">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center">
          <Sparkle className="w-8 h-8 text-gold" />
        </div>
        <span className="mt-4 inline-block text-xs uppercase tracking-widest text-rosegold-dark font-bold">
          Order Registered &bull; #{orderConfirmed.id}
        </span>
        <h3 className="mt-2 font-serif text-3xl md:text-4xl text-charcoal font-bold">Your Keepsake is Queued!</h3>
        <p className="mt-3 max-w-lg mx-auto text-charcoal-soft text-sm md:text-base leading-relaxed">
          We&apos;ve registered your 3D sculpture details. You can track its live progress, view the 360° approval video once printed, and claim this order at any time using your phone or email.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/dashboard/orders/${orderConfirmed.id}?token=${orderConfirmed.trackingToken}`}>
            <GoldButton>View Live Order Tracker</GoldButton>
          </Link>
          <a
            href={whatsappOrderLink(generateWhatsAppMessage(orderConfirmed.id))}
            target="_blank"
            rel="noreferrer"
          >
            <GhostButton>Chat on WhatsApp</GhostButton>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="order-builder" className="rounded-[2.5rem] bg-white/90 backdrop-blur-md p-6 md:p-10 shadow-card border border-gold/30">
      {/* Step Progress Header */}
      <div className="mb-8 flex items-center justify-between border-b border-charcoal/10 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.22em] text-rosegold-dark font-bold">
            Bespoke 3D Atelier Studio
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-bold">
            {step === 1 && "1. Choose Your Subject & Style"}
            {step === 2 && "2. Scale, Dimensions & 3D Preview"}
            {step === 3 && "3. Upload 4-5 Reference Photos"}
            {step === 4 && "4. Personalisation & Delivery Details"}
            {step === 5 && "5. Review & Split Payment Checkout"}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => s <= step && setStep(s)}
              className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold cursor-pointer transition ${
                s === step
                  ? "bg-rosegold text-white"
                  : s < step
                  ? "bg-gold text-charcoal"
                  : "bg-cream text-charcoal-muted"
              }`}
            >
              {s < step ? "✓" : s}
            </span>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800">{error}</div>}

      {/* STEP 1: SUBJECT PICKER */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {SUBJECT_OPTIONS.map((opt) => {
              const isSelected = subjectType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSubjectChange(opt)}
                  className={`p-4 md:p-5 rounded-2xl border-2 text-left transition duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "border-rosegold bg-blush/60 shadow-soft"
                      : "border-charcoal/10 bg-cream/30 hover:border-rosegold/50"
                  }`}
                >
                  <span className="text-3xl mb-3 block">{opt.icon}</span>
                  <div>
                    <h4 className="font-semibold text-charcoal text-base">{opt.title}</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-snug">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <GoldButton onClick={() => setStep(2)}>Continue to Sizing & 3D Studio →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 2: SIZES & 3D VIEWER */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive 3D Turntable */}
          <div className="lg:col-span-6">
            <StudioViewer3D
              category={category}
              petName={petName || "Your Keepsake"}
              tagText={tagText || "DIKOR"}
              sizeInches={sizeId.startsWith("7") ? 7 : sizeId.startsWith("8") ? 8 : 5}
            />
          </div>

          {/* Sizing Options */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-charcoal">Select Display Scale</h3>
            <p className="text-xs text-charcoal-muted">
              Every figurine includes a solid mahogany-finish plinth, personalized laser-engraved brass plaque, and insured pan-India delivery.
            </p>

            {category === "Pets" ? (
              <div className="space-y-3">
                {PET_SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSizeId(s.id)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition ${
                      sizeId === s.id
                        ? "border-rosegold bg-blush/60 shadow-soft"
                        : "border-charcoal/10 bg-cream/20 hover:border-rosegold/40"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-charcoal block">{s.label}</span>
                      <span className="text-xs text-charcoal-muted">
                        {s.build === "slim" ? "Ideal for Indies, Beagles, Cats" : "Recommended for Golden Retrievers, Labradors, GSDs"}
                      </span>
                    </div>
                    <span className="font-serif text-lg font-bold text-gold-dark">{s.price ? inr(s.price) : "Custom"}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onClick={() => setSizeId(category === "Couples" ? "6-standard" : "5-standard")}
                  className="p-4 rounded-2xl border-2 border-rosegold bg-blush/60 text-left cursor-pointer"
                >
                  <span className="font-semibold text-charcoal block">{sizeLabel}</span>
                  <span className="text-xs text-charcoal-muted">Studio Standard Display Keepsake</span>
                  <span className="font-serif text-lg font-bold text-gold-dark block mt-2">{price ? inr(price) : "₹2,499"}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <GhostButton onClick={() => setStep(1)}>← Back</GhostButton>
              <GoldButton onClick={() => setStep(3)}>Continue to Photos →</GoldButton>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: MULTI-ANGLE PHOTOS */}
      {step === 3 && (
        <div className="space-y-6">
          <div
            onClick={() => photoInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handlePhotoUpload(e.dataTransfer.files); }}
            className={`min-h-[14rem] cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center ${
              dragActive ? "border-rosegold bg-blush/60" : "border-gold/50 bg-cream/40 hover:border-rosegold"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-3">
              <Sparkle className="w-6 h-6 text-gold" />
            </div>
            <h4 className="font-semibold text-charcoal text-base">Drag & drop your reference photos</h4>
            <p className="text-xs text-charcoal-muted mt-1">4-5 clear photos are best &bull; Front face, sides, and full body</p>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
          </div>

          {/* Uploaded Gallery Grid */}
          {photos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-charcoal mb-2">Uploaded Reference Photos ({photos.length}/8)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden border border-charcoal/15 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-charcoal/80 text-cream text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-cream-dark/60 text-xs text-charcoal-soft space-y-1">
            <p className="font-semibold text-charcoal">Studio Pro-Tip for Best 3D Likeness:</p>
            <p>&bull; Clear daylight photos capture exact fur colorings and markings accurately.</p>
            <p>&bull; If you don&apos;t have all photos right now, you can send them directly on WhatsApp after booking!</p>
          </div>

          <div className="flex justify-between pt-4">
            <GhostButton onClick={() => setStep(2)}>← Back</GhostButton>
            <GoldButton onClick={() => setStep(4)}>Continue to Personalisation →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 4: DETAILS & PERSONALISATION */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Pet / Person Name <span className="text-rosegold">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Babu, Dido, Bella"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Brass Plaque Dedication Text
              </label>
              <input
                type="text"
                placeholder="e.g. Forever in our hearts • 2026"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Your Full Name <span className="text-rosegold">*</span>
              </label>
              <input
                type="text"
                placeholder="Adarsh Singh"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                WhatsApp Mobile Number <span className="text-rosegold">*</span>
              </label>
              <input
                type="tel"
                placeholder="9878070123"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address (for Invoice & Updates)
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Delivery City & Pincode
              </label>
              <input
                type="text"
                placeholder="Bengaluru, Karnataka - 560001"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Specific Posture / Marking Notes
              </label>
              <input
                type="text"
                placeholder="Sitting posture, white patch on left chest"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <GhostButton onClick={() => setStep(3)}>← Back</GhostButton>
            <GoldButton onClick={() => setStep(5)}>Proceed to Checkout →</GoldButton>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & CHECKOUT (EASEBUZZ OR WHATSAPP) */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-cream-dark/40 rounded-3xl p-6 border border-gold/30">
            <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Craft Order Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><span className="text-charcoal-muted">Subject:</span> <strong>{petName || subjectType}</strong> ({category})</p>
                <p><span className="text-charcoal-muted">Scale & Size:</span> <strong>{sizeLabel}</strong></p>
                <p><span className="text-charcoal-muted">Brass Plaque:</span> &ldquo;{tagText || petName || "DIKOR"}&rdquo;</p>
                <p><span className="text-charcoal-muted">Delivery Address:</span> {city || "Pan-India Free Express"}</p>
                <p><span className="text-charcoal-muted">Estimated Delivery:</span> <strong className="text-rosegold-dark">{estimatedDelivery}</strong></p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl border border-charcoal/10 space-y-2">
                <div className="flex justify-between text-charcoal">
                  <span>Total Crafting Price:</span>
                  <span className="font-bold">{price ? inr(price) : "Confirmed on WhatsApp"}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal-muted">
                  <span>Pan-India Shipping:</span>
                  <span className="text-green-700 font-bold">FREE</span>
                </div>
                <hr className="my-2 border-charcoal/10" />
                <div className="flex justify-between font-bold text-rosegold-dark">
                  <span>75% Advance Now:</span>
                  <span>{split ? inr(split.advance) : "₹1,125"}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal-soft">
                  <span>25% Balance on Approval Video:</span>
                  <span>{split ? inr(split.balance) : "₹375"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Checkout Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Easebuzz Advance Checkout Card */}
            <div className="p-6 rounded-3xl border-2 border-gold/50 bg-gradient-to-br from-cream to-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gold-dark block mb-1">
                  Instant Online Slot Booking
                </span>
                <h4 className="font-serif text-xl font-bold text-charcoal">Easebuzz Split Payment</h4>
                <p className="text-xs text-charcoal-soft mt-1 leading-relaxed">
                  Pay {split ? inr(split.advance) : "75%"} advance via UPI, Card, or NetBanking to start 3D modeling. Remaining balance paid only after you inspect and approve the 360° video.
                </p>
              </div>

              <div className="mt-6">
                <GoldButton
                  className="w-full"
                  disabled={busy}
                  onClick={handlePlaceOrderWithAdvance}
                >
                  {busy ? "Processing..." : `Pay ${split ? inr(split.advance) : "75% Advance"} via Easebuzz`}
                </GoldButton>
              </div>
            </div>

            {/* One-Tap WhatsApp Order Card */}
            <div className="p-6 rounded-3xl border-2 border-charcoal/15 bg-cream/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-rosegold-dark block mb-1">
                  Conversational Concierge
                </span>
                <h4 className="font-serif text-xl font-bold text-charcoal">One-Tap WhatsApp Guest Order</h4>
                <p className="text-xs text-charcoal-soft mt-1 leading-relaxed">
                  Pre-fills all your selections and opens directly in DIKOR WhatsApp chat. A guest order ID is generated so you can log in and track anytime!
                </p>
              </div>

              <div className="mt-6">
                <GhostButton
                  className="w-full hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-800"
                  disabled={busy}
                  onClick={handleWhatsAppGuestOrder}
                >
                  {busy ? "Queuing..." : "Order via WhatsApp Chat 💬"}
                </GhostButton>
              </div>
            </div>
          </div>

          <div className="flex justify-start pt-2">
            <GhostButton onClick={() => setStep(4)}>← Back to Details</GhostButton>
          </div>
        </div>
      )}
    </div>
  );
}
