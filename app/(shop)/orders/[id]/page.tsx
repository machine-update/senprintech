import { prisma } from "@/lib/prisma";
import OrderTimeline from "@/components/shared/OrderTimeline";
import { formatFcfa } from "@/lib/currency";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, events: { orderBy: { createdAt: "asc" } }, user: true },
  });

  if (!order) {
    return <main style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>Commande introuvable.</main>;
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Suivi commande</h1>
      <p style={{ margin: "6px 0 16px", color: "#475569" }}>#{order.id} • {order.user.email}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
        <section style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
          <h2 style={{ margin: "0 0 8px" }}>Articles</h2>
          {order.items.map((item) => (
            <p key={item.id} style={{ margin: "0 0 6px", color: "#334155" }}>
              {item.quantity} x {item.productName} ({formatFcfa(item.unitPrice)})
            </p>
          ))}
          <p style={{ margin: "10px 0 0", fontWeight: 700 }}>Total: {formatFcfa(order.total)}</p>
        </section>

        <section style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
          <h2 style={{ margin: "0 0 8px" }}>Timeline</h2>
          <OrderTimeline events={order.events} />
        </section>
      </div>
    </main>
  );
}
