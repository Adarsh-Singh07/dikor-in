import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { db, publicUser } from "@/lib/store";

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const sess = await verifySession(token);
  if (!sess) return null;
  const user = db.getUser(sess.userId);
  if (!user) return null;
  return { ...publicUser(user), role: user.role as "customer" | "admin" };
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
