import { NextRequest } from "next/server";
import { dikorDB } from "@/lib/db";
import { getSessionUser, json, err } from "@/lib/api-lib";

export async function GET(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me || me.role !== "admin") return err("Admin unauthorized", 403);
  const products = await dikorDB.getProducts();
  return json({ products });
}

export async function PATCH(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me || me.role !== "admin") return err("Admin unauthorized", 403);

  const { id, basePrice, advancePct, sizes, title, isActive } = await req.json().catch(() => ({}));
  if (!id) return err("Product ID required", 400);

  const ok = await dikorDB.updateProduct(id, {
    basePrice: basePrice !== undefined ? Number(basePrice) : undefined,
    advancePct: advancePct !== undefined ? Number(advancePct) : undefined,
    sizes: Array.isArray(sizes) ? sizes : undefined,
    title: title ? String(title) : undefined,
    isActive: isActive !== undefined ? Boolean(isActive) : undefined,
  });

  if (!ok) return err("Failed to update product", 500);
  return json({ success: true });
}
