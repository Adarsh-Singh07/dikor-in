"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { GoldButton, GhostButton, Field, inputCls, Sparkle, DemoBadge } from "@/components/ui";
import { api, fileToDataURL } from "@/lib/client";
import { CATEGORIES, type Category } from "@/lib/store";

const SIZES = ["3 inch", "4 inch", "6 inch", "8 inch"];
const MATERIALS = ["PLA + hand-painted finish", "Resin + matte finish", "Resin + antique gold finish"];

export default function NewOrderPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Pets");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState(SIZES[1]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [city, setCity] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    setError("");
    try {
      const list = Array.from(files).slice(0, 6 - photos.length);
      const urls = await Promise.all(list.map((f) => fileToDataURL(f, 4 * 1024 * 1024)));
      setPhotos((p) => [...p, ...urls].slice(0, 6));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read photos");
    }
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { order } = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ title, category, description, photos, size, material, city }),
      });
      router.push(`/dashboard/orders/${order.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rosegold-dark">
          <Sparkle className="h-3.5 w-3.5 text-gold" /> New keepsake <DemoBadge />
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Tell us what you dream of.</h1>
        <p className="mt-3 text-charcoal-muted">Share reference photos — our studio replies with a clear quote and timeline.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={submit} className="mt-10 space-y-6 rounded-[2rem] bg-white p-7 shadow-card md:p-10">
          <Field label="Keepsake title">
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bruno — my Beagle, sitting pose" required maxLength={80} />
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                    category === c.key
                      ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-charcoal shadow-gold"
                      : "border border-charcoal/15 bg-cream text-charcoal-soft hover:border-rosegold"
                  }`}
                >
                  {c.key}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Reference photos" hint="Clear, well-lit photos from 2–3 angles work best. Up to 6 (demo).">
            <div
              onClick={() => document.getElementById("photo-input")?.click()}
              className="cursor-pointer rounded-3xl border-2 border-dashed border-gold/50 bg-cream/60 p-8 text-center transition hover:border-gold hover:bg-cream"
            >
              <input id="photo-input" type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              <p className="text-3xl">📸</p>
              <p className="mt-2 text-sm font-semibold text-charcoal">Tap to upload photos</p>
              <p className="text-xs text-charcoal-muted">JPG / PNG, stored as demo data</p>
            </div>
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl border border-charcoal/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt={`Reference ${i + 1}`} className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos((x) => x.filter((_, j) => j !== i))}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-charcoal/80 text-xs text-cream"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="Describe your keepsake" hint="Pose, colours, expressions, occasion — anything that matters.">
            <textarea className={`${inputCls} min-h-28`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sitting pose, tongue out, wearing his red collar…" maxLength={2000} />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Size">
              <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
                {SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Finish">
              <select className={inputCls} value={material} onChange={(e) => setMaterial(e.target.value)}>
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Delivery city" hint="We ship pan-India.">
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" maxLength={60} />
          </Field>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-wrap gap-4 pt-2">
            <GoldButton type="submit" disabled={busy}>{busy ? "Placing…" : "Place order"}</GoldButton>
            <GhostButton type="button" onClick={() => router.back()}>Cancel</GhostButton>
          </div>
        </form>
      </Reveal>
    </div>
  );
}
