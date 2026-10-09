import { requireUser } from "@/lib/server-auth";
import OrderDetail from "@/components/OrderDetail";

export const dynamic = "force-dynamic";

export default async function CustomerOrderPage({ params }: { params: { id: string } }) {
  await requireUser("customer");
  return <OrderDetail id={params.id} backHref="/dashboard" />;
}
