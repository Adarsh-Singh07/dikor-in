"use client";
// Shared client helpers: auth context + api fetch + file->dataURL.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Me {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

const AuthCtx = createContext<{ me: Me | null; loading: boolean; refresh: () => void }>({
  me: null,
  loading: true,
  refresh: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setMe(d?.user ?? null))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  };
  useEffect(refresh, []);
  return <AuthCtx.Provider value={{ me, loading, refresh }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

export async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export function fileToDataURL(file: File, maxBytes = 6 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) return reject(new Error(`File too large (max ${Math.round(maxBytes / 1024 / 1024)} MB for demo)`));
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export const WHATSAPP_URL = "https://wa.me/919878070123";
export const INSTAGRAM_URL = "https://www.instagram.com/dikor_in/";
