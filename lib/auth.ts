// Demo session handling — HMAC-signed cookie. Demo only, not production auth.
import type { Role } from "./store";

export const COOKIE_NAME = "dikor_session";
const SECRET = process.env.DIKOR_SESSION_SECRET || "dikor-demo-secret-change-me";
const MAX_AGE = 7 * 24 * 3600; // 7 days

function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

export interface Session {
  userId: string;
  role: Role;
  exp: number;
}

export async function signSession(userId: string, role: Role): Promise<string> {
  const payload = b64urlEncode(new TextEncoder().encode(JSON.stringify({ userId, role, exp: Date.now() + MAX_AGE * 1000 })));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlDecode(payload))) as Session;
    if (data.exp < Date.now()) return null;
    if (!data.userId || (data.role !== "customer" && data.role !== "admin")) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
