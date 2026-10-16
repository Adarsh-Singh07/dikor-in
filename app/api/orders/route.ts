import { NextRequest } from "next/server";
import { db, type Category } from "@/lib/store";
import { getSessionUser, json, err } from "@/lib/api-lib";

const CATS: Category[] = ["Pets", "Couples", "Kids", "Idols", "Decor"];

// GET /api/orders — customer: own orders · admin: all (with customer names)
export async function GET(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  const orders = me.role === "admin" ? db.getOrders() : db.getOrdersByUser(me.id);
  const out = orders.map((o) => ({
    ...o,
    customer: me.role === "admin" ? db.getUser(o.userId) && { name: db.getUser(o.userId)!.name, email: db.getUser(o.userId)!.email } : undefined,
  }));
  return json({ orders: out });
}

// POST /api/orders — customer creates an order
export async function POST(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  if (me.role !== "customer") return err("Only customers can place orders", 403);
  const body = await req.json().catch(() => ({}));
  const { title, category, description, photos, size, material, city } = body;
  if (!title || !String(title).trim()) return err("Give your keepsake a title");
  if (!CATS.includes(category)) return err("Pick a category");
  if (!Array.isArray(photos) || photos.length === 0) return err("Upload at least one reference photo");
  if (photos.length > 8) return err("Max 8 photos for the demo");
  const priceNum = Number(body.price);
  const order = db.createOrder({
    userId: me.id,
    title: String(title).trim().slice(0, 80),
    category,
    description: String(description || "").slice(0, 2000),
    photos: photos.map(String).slice(0, 8),
    price: Number.isFinite(priceNum) && priceNum >= 100 ? Math.round(priceNum) : null,
    size: String(size || "5 inch"),
    material: String(material || "PLA + hand-painted finish"),
    city: String(city || "").slice(0, 60),
  });
  return json({ order }, 201);
}
