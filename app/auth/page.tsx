"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { GoldButton, Field, inputCls, DemoBadge } from "@/components/ui";
import { api, useAuth } from "@/lib/client";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fill = (e: string, p: string) => {
    setIdentifier(e);
    setPassword(p);
    setMode("login");
    setError("");
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError("");
    try {
      const isEmail = identifier.includes("@");
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login"
          ? {
              email: isEmail ? identifier : undefined,
              phone: !isEmail ? identifier : undefined,
              password,
            }
          : {
              name,
              email: isEmail ? identifier : undefined,
              phone: !isEmail ? identifier : phone,
              password,
            };

      const data = await api(path, { method: "POST", body: JSON.stringify(body) });
      refresh();
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 pb-20 pt-32 md:px-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-sm border border-charcoal/10 bg-white md:grid-cols-2">
        {/* brand panel */}
        <div className="relative hidden flex-col justify-between bg-charcoal p-10 text-cream md:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dikor-logo-light.svg" alt="DIKOR" className="h-12 w-auto shrink-0 self-start" draggable={false} />
          <div>
            <h2 className="mt-8 font-display text-4xl leading-tight">Your keepsake journey begins here.</h2>
            <p className="mt-4 text-cream/70">
              Track print progress, approve your video proof, and download tax invoices — all from your dashboard.
            </p>
            <div className="mt-6 border border-white/10 bg-white/5 p-4 text-xs text-cream/80">
              <p className="font-semibold text-gold-light">Placed a Guest WhatsApp Order?</p>
              <p className="mt-1 text-cream/60">
                Enter the same mobile number or email you used on WhatsApp — all your orders will be instantly linked to your account.
              </p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">dikor.in — made with precision</p>
        </div>

        {/* Form panel */}
        <div className="p-8 md:p-10">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <h1 className="font-display text-4xl text-charcoal">
                {mode === "login" ? "Welcome back" : "Join DIKOR"}
              </h1>
              <DemoBadge />
            </div>
            <p className="mb-6 text-xs text-charcoal-muted">
              {mode === "login"
                ? "Access your studio dashboard and orders"
                : "Sign up to track and approve your 3D miniature"}
            </p>

            <div className="mb-6 grid grid-cols-2 rounded-full bg-cream-dark p-1">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  className={`rounded-full py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                    mode === m ? "border border-charcoal/10 bg-white text-charcoal" : "text-charcoal-muted"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <Field label="Your Full Name">
                  <input
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adarsh Singh"
                    required
                  />
                </Field>
              )}

              <Field label="Mobile Number or Email Address">
                <input
                  type="text"
                  className={inputCls}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="9878070123 or you@example.com"
                  required
                />
              </Field>

              {mode === "signup" && identifier.includes("@") && (
                <Field label="WhatsApp Phone Number (Optional)">
                  <input
                    type="tel"
                    className={inputCls}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </Field>
              )}

              <Field
                label="Password"
                hint={mode === "signup" ? "Minimum 4 characters." : undefined}
              >
                <input
                  type="password"
                  className={inputCls}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </Field>

              {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <GoldButton type="submit" disabled={busy} className="w-full">
                {busy ? "Authorizing..." : mode === "login" ? "Sign In to Dashboard" : "Create My Account"}
              </GoldButton>
            </form>

            <div className="mt-8 rounded-sm border border-charcoal/10 bg-cream-dark p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-soft">Try the demo — one tap</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fill("customer@demo.in", "demo123")}
                  className="rounded-full border border-rosegold/40 bg-white px-4 py-2 text-xs font-semibold text-rosegold-dark transition hover:bg-blush"
                >
                  Customer demo
                </button>
                <button
                  type="button"
                  onClick={() => fill("admin@demo.in", "admin123")}
                  className="rounded-full border border-gold/50 bg-white px-4 py-2 text-xs font-semibold text-gold-dark transition hover:bg-cream"
                >
                  Studio admin demo
                </button>
              </div>
              <p className="mt-3 text-xs text-charcoal-muted">customer@demo.in / demo123, admin@demo.in / admin123</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
