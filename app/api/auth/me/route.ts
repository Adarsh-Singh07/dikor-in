import { NextRequest } from "next/server";
import { getSessionUser, json } from "@/lib/api-lib";

export async function GET(req: NextRequest) {
  const me = await getSessionUser(req);
  // Signed-out is a normal state, not an error: respond 200 with user=null
  if (!me) return json({ user: null });
  return json({ user: me });
}
