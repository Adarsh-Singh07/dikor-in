import Link from "next/link";
import { requireUser } from "@/lib/server-auth";
import { db, inr } from "@/lib/store";
import { Reveal } from "@/components/Reveal";
import { StatusPill, Sparkle, DemoBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const me = await requireUser("admin");
  const orders = db.getOrders();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 md:px-8">
      <Reveal>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark">
          <Sparkle className="h-3.5 w-3.5" /> Studio panel <DemoBadge />
        </p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">All orders</h1>
        <p className="mt-2 text-charcoal-muted">Welcome, {me.name} — {orders.length} order{orders.length === 1 ? "" : "s"} in the studio.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-xs uppercase tracking-[0.16em] text-charcoal-muted">
                <th className="px-6 py-4">Keepsake</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const u = db.getUser(o.userId);
                return (
                  <tr key={o.id} className="border-b border-charcoal/5 transition-colors last:border-0 hover:bg-cream/60">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-charcoal">{o.title}</p>
                      <p className="text-xs text-charcoal-muted">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-charcoal-soft">{u?.name}</p>
                      <p className="text-xs text-charcoal-muted">{u?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-charcoal-soft">{o.category}</td>
                    <td className="px-6 py-4 font-display text-lg text-charcoal">{o.price ? inr(o.price) : <span className="text-xs text-charcoal-muted">—</span>}</td>
                    <td className="px-6 py-4"><StatusPill status={o.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${o.id}`} className="rounded-full border border-gold/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark transition hover:bg-gold hover:text-charcoal">
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
