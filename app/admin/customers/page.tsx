import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    include: { orders: true, quotes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Clients & Entreprises</h1>
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {users.map((user) => (
          <article key={user.id} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{user.name ?? "Sans nom"} • {user.role}</p>
            <p style={{ margin: "4px 0 0", color: "#475569" }}>{user.email}</p>
            <p style={{ margin: "4px 0 0", color: "#334155" }}>
              Commandes: {user.orders.length} • Devis: {user.quotes.length}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
