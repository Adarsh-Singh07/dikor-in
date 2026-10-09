"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { GoldButton, Field, inputCls, DemoBadge, Sparkle } from "@/components/ui";
import { api, useAuth } from "@/lib/client";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setMode("login");
    setError("");
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login" ? { email, password } : { name, email, password };
      const data = await api(path, { method: "POST", body: JSON.stringify(body) });
      refresh();
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 pb-20 pt-32 md:px-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-soft md:grid-cols-2">
        {/* brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-rosegold-dark via-rosegold to-gold-dark p-10 text-cream md:flex">
          <Sparkle className="h-8 w-8 text-gold-light" />
          <div>
            <h2 className="font-display text-4xl leading-tight">Your keepsake journey begins here.</h2>
            <p className="mt-4 text-cream/80">Upload photos, get a clear quote, approve the video demo — all from your dashboard.</p>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-cream/70">dikor.in · made with precision</p>
        </div>
        {/* form panel */}
        <div className="p-8 md:p-10">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <h1 className="font-display text-4xl text-charcoal">{mode === "login" ? "Welcome back" : "Join DIKOR"}</h1>
              <DemoBadge />
            </div>
            <div className="mb-6 grid grid-cols-2 rounded-full bg-cream-dark p-1">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`rounded-full py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                    mode === m ? "bg-white text-charcoal shadow-card" : "text-charcoal-muted"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <Field label="Your name">
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" required />
                </Field>
              )}
              <Field label="Email">
                <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </Field>
              <Field label="Password" hint={mode === "signup" ? "Min 6 characters. Demo only — don't reuse a real password." : undefined}>
                <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </Field>
              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <GoldButton type="submit" disabled={busy} className="w-full">
                {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </GoldButton>
            </form>
            <div className="mt-8 rounded-2xl bg-cream-dark p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-soft">Try the demo — one tap</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => fill("customer@demo.in", "demo123")}
                  className="rounded-full border border-rosegold/40 bg-white px-4 py-2 text-xs font-semibold text-rosegold-dark transition hover:bg-blush"
                >
                  Customer demo
                </button>
                <button
                  onClick={() => fill("admin@demo.in", "admin123")}
                  className="rounded-full border border-gold/50 bg-white px-4 py-2 text-xs font-semibold text-gold-dark transition hover:bg-cream"
                >
                  Studio admin demo
                </button>
              </div>
              <p className="mt-3 text-xs text-charcoal-muted">customer@demo.in / demo123 · admin@demo.in / admin123</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
