import { prisma } from "@/lib/prisma";
import PromoCreateForm from "@/components/admin/PromoCreateForm";

export default async function AdminPromosPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Promos / Coupons</h1>
      <PromoCreateForm />

      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {coupons.map((coupon) => (
          <article key={coupon.id} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 12 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{coupon.code} • {coupon.type} {coupon.value}</p>
            <p style={{ margin: "4px 0 0", color: "#475569" }}>{coupon.active ? "Actif" : "Inactif"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
