import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import TrustProofBar from "@/components/shop/TrustProofBar";

type SearchParams = Promise<{ sort?: string; page?: string }>;

const PAGE_SIZE = 12;

export default async function CataloguePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const sort = params.sort ?? "popular";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const [categories, products, totalProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy:
        sort === "price-asc"
          ? { basePrice: "asc" }
          : sort === "price-desc"
            ? { basePrice: "desc" }
            : sort === "new"
              ? { createdAt: "desc" }
              : [{ popularity: "desc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 20px 48px" }}>
      <div className="surface-card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1.2 }}>SENPRINTECH COLLECTION</p>
            <h1 style={{ margin: "4px 0 0", fontSize: 42, letterSpacing: -0.8, lineHeight: 1.04 }}>Catalogue produits</h1>
            <p style={{ margin: "8px 0 0", color: "#475569", maxWidth: 760 }}>
              Textile, flyers, supports graphiques et objets personnalises. Une selection optimisee pour la conversion.
            </p>
          </div>
          <Link
            href="/search"
            style={{
              textDecoration: "none",
              color: "#fff",
              background: "#0f172a",
              borderRadius: 11,
              padding: "10px 13px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              boxShadow: "0 14px 24px -20px rgba(2,6,23,0.75)",
            }}
          >
            <SlidersHorizontal size={14} />
            Filtres avancés
          </Link>
        </div>

        <form style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>Tri</span>
            <select
              name="sort"
              defaultValue={sort}
              style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: "8px 10px", background: "#fff", minWidth: 180 }}
            >
              <option value="popular">Popularité</option>
              <option value="new">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>
          <button
            type="submit"
            style={{ marginTop: 18, border: "none", borderRadius: 10, padding: "9px 12px", background: "#0f172a", color: "#fff", fontWeight: 700 }}
          >
            Appliquer
          </button>
          <span style={{ marginTop: 18, color: "#64748b", fontSize: 13 }}>{totalProducts} produits</span>
        </form>
      </div>

      <TrustProofBar />

      <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/search?category=${encodeURIComponent(cat.slug)}`}
            style={{
              textDecoration: "none",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: 999,
              padding: "7px 11px",
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <section className="surface-card" style={{ marginTop: 16, padding: 18 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>Aucun produit sur ce filtre</h2>
          <p style={{ margin: 0, color: "#475569" }}>Essaie un autre tri ou passe sur la recherche avancée.</p>
        </section>
      ) : null}

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.shortDesc ?? product.description}
            category={product.category.name}
            price={product.basePrice}
            isNew={product.isNew}
            leadTimeDays={product.leadTimeDays}
            image={product.images[0]}
          />
        ))}
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Page {page} / {totalPages}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href={`/catalogue?sort=${encodeURIComponent(sort)}&page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            style={{
              pointerEvents: page <= 1 ? "none" : "auto",
              opacity: page <= 1 ? 0.5 : 1,
              textDecoration: "none",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              padding: "8px 10px",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Précédent
          </Link>
          <Link
            href={`/catalogue?sort=${encodeURIComponent(sort)}&page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            style={{
              pointerEvents: page >= totalPages ? "none" : "auto",
              opacity: page >= totalPages ? 0.5 : 1,
              textDecoration: "none",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              padding: "8px 10px",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Suivant
          </Link>
        </div>
      </div>
    </main>
  );
}
