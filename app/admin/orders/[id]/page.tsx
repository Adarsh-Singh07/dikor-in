import { requireUser } from "@/lib/server-auth";
import AdminOrderDetail from "@/components/AdminOrderDetail";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  await requireUser("admin");
  return <AdminOrderDetail id={params.id} />;
}
