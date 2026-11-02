import { NextRequest } from "next/server";
import { db, type Category } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

const CATS: Category[] = ["Pets", "Couples", "Kids", "Idols", "Decor"];

// GET /api/orders — customer: own orders · admin: all
export async function GET(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);

  const orders = me.role === "admin" ? await db.getOrders() : await db.getOrdersByUser(me.id, me.email);
  return json({ orders });
}

// POST /api/orders — customer or guest creates an order, or admin creates manual order
export async function POST(req: NextRequest) {
  const me = await getSessionUser(req);
  const body = await req.json().catch(() => ({}));

  const {
    title,
    category,
    description,
    photos,
    size,
    price,
    city,
    customerName,
    customerEmail,
    customerPhone,
    source,
    subjectName,
    tagText,
    advancePct,
  } = body;

  if (!title || !String(title).trim()) return err("Give your keepsake a title", 400);
  if (!CATS.includes(category)) return err("Pick a valid category", 400);

  const priceNum = Number(price);
  const validPrice = Number.isFinite(priceNum) && priceNum >= 500 ? Math.round(priceNum) : 1500;

  // Determine owner details
  const name = customerName || (me ? me.name : "Guest Customer");
  const email = customerEmail || (me ? me.email : null);
  const phone = customerPhone || (me ? me.phone : null);
  const orderSource = source || (me?.role === "admin" ? "manual_admin" : "web");

  const order = await db.createOrder({
    userId: me ? me.id : null,
    customerName: String(name).trim(),
    customerEmail: email ? String(email).trim().toLowerCase() : null,
    customerPhone: phone ? String(phone).trim() : null,
    source: orderSource,
    title: String(title).trim().slice(0, 100),
    category,
    subjectName: subjectName ? String(subjectName).trim() : "",
    tagText: tagText ? String(tagText).trim() : "",
    description: String(description || "").slice(0, 3000),
    photos: Array.isArray(photos) ? photos.slice(0, 8) : [],
    size: String(size || '5" Standard'),
    price: validPrice,
    city: String(city || "Pan India").slice(0, 80),
  });

  return json({ order }, 201);
}
