import { NextRequest, NextResponse } from "next/server";
import { signSession, sessionCookie } from "@/lib/auth";
import { db, publicUser } from "@/lib/store";
import { err } from "@/lib/api-lib";
import { hashPassword } from "@/lib/crypto-auth";

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json().catch(() => ({}));
  if (!name || (!email && !phone) || !password) {
    return err("Name, email or phone, and password are required", 400);
  }
  if (String(password).length < 4) {
    return err("Password must be at least 4 characters", 400);
  }

  if (email) {
    const existing = await db.findUserByEmail(String(email));
    if (existing) return err("An account with this email already exists", 409);
  }

  const hashedPassword = hashPassword(String(password));

  const user = await db.createUser(
    String(name).trim(),
    email ? String(email).trim() : undefined,
    hashedPassword,
    phone ? String(phone).trim() : undefined
  );

  // Link any previous guest orders
  await db.claimGuestOrders(user.id, user.email, user.phone);

  const token = await signSession(user.id, user.role);
  const res = NextResponse.json({ user: publicUser(user) });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
