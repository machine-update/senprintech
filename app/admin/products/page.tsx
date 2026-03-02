import { prisma } from "@/lib/prisma";
import ProductCreateForm from "@/components/admin/ProductCreateForm";
import { formatFcfa } from "@/lib/currency";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>CRUD Produits</h1>
      <p style={{ margin: "6px 0 14px", color: "#475569" }}>Creation rapide via endpoint admin.</p>

      <ProductCreateForm categories={categories} />

      <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
        {products.map((p) => (
          <article key={p.id} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 12 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{p.name} • {formatFcfa(p.basePrice)}</p>
            <p style={{ margin: "4px 0 0", color: "#475569" }}>{p.category.name} • {p.slug}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
