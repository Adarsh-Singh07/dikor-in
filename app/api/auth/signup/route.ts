import { NextRequest, NextResponse } from "next/server";
import { signSession, sessionCookie } from "@/lib/auth";
import { db, publicUser } from "@/lib/store";
import { err } from "@/lib/api-lib";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json().catch(() => ({}));
  if (!name || !email || !password) return err("Name, email and password are required");
  if (String(password).length < 6) return err("Password must be at least 6 characters");
  if (db.findUserByEmail(String(email))) return err("An account with this email already exists", 409);
  const user = db.createUser(String(name).trim(), String(email).trim(), String(password));
  const token = await signSession(user.id, user.role);
  const res = NextResponse.json({ user: publicUser(user) });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
