import { getUserOptional } from "@/lib/server-auth";
import OrderDetail from "@/components/OrderDetail";

export const dynamic = "force-dynamic";

export default async function CustomerOrderPage({ params }: { params: { id: string } }) {
  const me = await getUserOptional();
  return <OrderDetail id={params.id} backHref={me ? "/dashboard" : "/"} />;
}
