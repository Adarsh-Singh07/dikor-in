import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySession } from "./auth";
import { db, publicUser } from "./store";

export async function requireUser(role?: "customer" | "admin") {
  const token = cookies().get(COOKIE_NAME)?.value;
  const sess = await verifySession(token);
  const user = sess ? db.getUser(sess.userId) : undefined;
  if (!user) redirect("/auth");
  if (role && user.role !== role) redirect(user.role === "admin" ? "/admin" : "/dashboard");
  return publicUser(user);
}
