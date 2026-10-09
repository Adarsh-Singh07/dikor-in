import { NextRequest, NextResponse } from "next/server";
import { signSession, sessionCookie } from "@/lib/auth";
import { db, publicUser } from "@/lib/store";
import { err } from "@/lib/api-lib";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return err("Email and password are required");
  const user = db.findUserByEmail(String(email));
  if (!user || user.password !== String(password)) return err("Invalid email or password", 401);
  const token = await signSession(user.id, user.role);
  const res = NextResponse.json({ user: publicUser(user) });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
