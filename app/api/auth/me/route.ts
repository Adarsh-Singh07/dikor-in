import { NextRequest } from "next/server";
import { getSessionUser, json, err } from "@/lib/api-lib";

export async function GET(req: NextRequest) {
  const me = await getSessionUser(req);
  if (!me) return err("Not signed in", 401);
  return json({ user: me });
}
