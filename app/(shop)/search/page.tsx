import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { normalizeProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import TrustProofBar from "@/components/shop/TrustProofBar";
import SearchFiltersSidebar from "@/components/shop/SearchFiltersSidebar";
import { toFcfa } from "@/lib/currency";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  max?: string;
  sort?: string;
  new?: string;
  page?: string;
}>;

const PAGE_SIZE = 12;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const maxFcfa = Number(params.max ?? "0") || undefined;
  const maxEur = maxFcfa ? maxFcfa / 655.957 : undefined;
  const sort = params.sort ?? "popular";
  const onlyNew = params.new === "1";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const whereBase = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {},
      category ? { category: { slug: category } } : {},
      onlyNew ? { isNew: true } : {},
    ],
  };

  const whereFiltered = {
    AND: [
      ...whereBase.AND,
      maxEur ? { basePrice: { lte: maxEur } } : {},
    ],
  };

  const [products, totalProducts, categories, maxPrice] = await Promise.all([
    prisma.product.findMany({
      where: whereFiltered,
      include: { category: true },
      orderBy:
        sort === "price-asc"
          ? { basePrice: "asc" }
          : sort === "price-desc"
            ? { basePrice: "desc" }
            : sort === "new"
              ? { createdAt: "desc" }
              : { popularity: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: whereFiltered }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.aggregate({ where: whereBase, _max: { basePrice: true } }),
  ]);
  const normalizedProducts = normalizeProducts(products);

  const maxPriceCap = Math.max(toFcfa(maxPrice._max.basePrice ?? 150), 10000);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const paginationBase = new URLSearchParams({
    q,
    category,
    max: maxFcfa ? String(maxFcfa) : "",
    sort,
    new: onlyNew ? "1" : "0",
  });

  return (
    <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 20px 56px" }}>
      <h1 style={{ margin: 0, fontSize: 40, letterSpacing: -0.8 }}>Recherche produits</h1>
      <p style={{ margin: "8px 0 0", color: "#475569" }}>
        Explorez notre catalogue avec des filtres avancés et un tri premium.
      </p>
      <TrustProofBar />

      <section className="mobile-stack" style={{ marginTop: 18, display: "grid", gridTemplateColumns: "300px 1fr", gap: 14, alignItems: "start" }}>
        <SearchFiltersSidebar
          categories={categories}
          initial={{ q, category, max: maxFcfa, sort, onlyNew }}
          maxPriceCap={maxPriceCap}
        />

        <div>
          <div className="surface-card" style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, color: "#64748b", fontSize: 12, fontWeight: 700 }}>RÉSULTATS</p>
              <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 900, letterSpacing: -0.4 }}>{totalProducts.toLocaleString("fr-FR")}</p>
            </div>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Tri actuel:{" "}
              <strong style={{ color: "#334155" }}>
                {sort === "price-asc" ? "Prix croissant" : sort === "price-desc" ? "Prix décroissant" : sort === "new" ? "Nouveautés" : "Popularité"}
              </strong>
            </p>
          </div>

          {products.length === 0 ? (
            <section className="surface-card" style={{ marginTop: 14, padding: 18 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>Aucun résultat</h2>
              <p style={{ margin: 0, color: "#475569" }}>Ajustez vos filtres ou revenez au catalogue complet.</p>
            </section>
          ) : null}

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
            {normalizedProducts.map((product) => (
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

          <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Page {page} / {totalPages}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href={`/search?${paginationBase.toString()}&page=${Math.max(1, page - 1)}`}
                aria-disabled={page <= 1}
                style={{ ...pagerLink, pointerEvents: page <= 1 ? "none" : "auto", opacity: page <= 1 ? 0.5 : 1 }}
              >
                Précédent
              </Link>
              <Link
                href={`/search?${paginationBase.toString()}&page=${Math.min(totalPages, page + 1)}`}
                aria-disabled={page >= totalPages}
                style={{ ...pagerLink, pointerEvents: page >= totalPages ? "none" : "auto", opacity: page >= totalPages ? 0.5 : 1 }}
              >
                Suivant
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link href="/catalogue" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
              Retour catalogue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const pagerLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#fff",
  fontWeight: 600,
};
