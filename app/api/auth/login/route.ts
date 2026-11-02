import { NextRequest, NextResponse } from "next/server";
import { signSession, sessionCookie } from "@/lib/auth";
import { db, publicUser } from "@/lib/store";
import { err } from "@/lib/api-lib";

export async function POST(req: NextRequest) {
  const { email, password, phone } = await req.json().catch(() => ({}));

  if ((!email && !phone) || !password) {
    return err("Email/Phone and password are required", 400);
  }

  let user = null;
  if (email) {
    user = await db.findUserByEmail(String(email).trim());
  } else if (phone) {
    user = await db.findUserByPhone(String(phone).trim());
  }

  if (!user || user.password !== String(password)) {
    return err("Invalid credentials. For demo: admin@demo.in / admin123 or customer@demo.in / demo123", 401);
  }

  // Claim any guest orders placed via WhatsApp or Web matching this email or phone
  await db.claimGuestOrders(user.id, user.email, user.phone);

  const token = await signSession(user.id, user.role);
  const res = NextResponse.json({ user: publicUser(user) });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
