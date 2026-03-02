import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderTimeline from "@/components/shared/OrderTimeline";
import { formatFcfa } from "@/lib/currency";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true, events: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 42px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36 }}>Commandes</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>Suivi production, expedition et livraison.</p>
        </div>
        <Link href="/admin" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>Retour dashboard</Link>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {orders.map((order) => (
          <article key={order.id} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 800 }}>#{order.id.slice(0, 12)} • {order.status}</p>
                <p style={{ margin: "4px 0 8px", color: "#475569" }}>{order.user.email} • {formatFcfa(order.total)}</p>
                {order.items.map((item) => (
                  <p key={item.id} style={{ margin: "0 0 4px", color: "#334155" }}>
                    {item.quantity} x {item.productName} ({formatFcfa(item.unitPrice)})
                  </p>
                ))}
              </div>
              <OrderTimeline events={order.events} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
