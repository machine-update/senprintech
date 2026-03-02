import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatFcfa } from "@/lib/currency";

export default async function AdminDashboard() {
  const [ordersCount, usersCount, productsCount, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const cards = [
    { title: "CA total", value: formatFcfa(revenue._sum.total ?? 0) },
    { title: "Commandes", value: String(ordersCount) },
    { title: "Clients", value: String(usersCount) },
    { title: "Produits", value: String(productsCount) },
  ];

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 36 }}>Admin</h1>
      <p style={{ margin: "6px 0 16px", color: "#475569" }}>Back-office operationnel: produits, commandes, clients, promos.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {cards.map((card) => (
          <article key={card.title} style={cardStyle}>
            <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>{card.title}</p>
            <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 800 }}>{card.value}</p>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        <Link href="/admin/orders" style={linkCard}>Gestion commandes</Link>
        <Link href="/admin/products" style={linkCard}>CRUD produits</Link>
        <Link href="/admin/customers" style={linkCard}>Clients & entreprises</Link>
        <Link href="/admin/promos" style={linkCard}>Promos / coupons</Link>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe4f0",
  borderRadius: 14,
  padding: 14,
};

const linkCard: React.CSSProperties = {
  display: "block",
  background: "#fff",
  border: "1px solid #dbe4f0",
  borderRadius: 14,
  padding: 14,
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 700,
};
