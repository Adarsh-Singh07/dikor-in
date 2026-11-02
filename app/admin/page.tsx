import { requireUser } from "@/lib/server-auth";
import { dikorDB } from "@/lib/db";
import AdminDashboardView from "@/components/AdminDashboardView";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const me = await requireUser("admin");
  const orders = await dikorDB.getOrders();
  const products = await dikorDB.getProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-28 pt-28 md:px-8">
      <AdminDashboardView
        initialOrders={orders}
        initialProducts={products}
        adminName={me.name}
      />
    </div>
  );
}
