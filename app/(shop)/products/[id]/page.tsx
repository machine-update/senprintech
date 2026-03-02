import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { normalizeProduct, normalizeProducts } from "@/lib/products";
import ProductDesigner from "@/components/designer/ProductDesigner";
import ProductConfigurator from "@/components/shop/ProductConfigurator";
import ProductCard from "@/components/shop/ProductCard";
import ProductMediaGallery from "@/components/shop/product/ProductMediaGallery";
import { formatFcfa } from "@/lib/currency";
import TrustProofBar from "@/components/shop/TrustProofBar";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      options: { include: { values: true } },
      reviews: { orderBy: { createdAt: "desc" } },
      faqs: true,
    },
  });

  if (!product) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "30px 20px" }}>
        <h1>Produit introuvable</h1>
        <Link href="/catalogue">Retour catalogue</Link>
      </main>
    );
  }
  const normalizedProduct = normalizeProduct(product);

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
  const normalizedRelatedProducts = normalizeProducts(relatedProducts);

  const avgRating =
    normalizedProduct.reviews.length > 0
      ? normalizedProduct.reviews.reduce((acc, review) => acc + review.rating, 0) / normalizedProduct.reviews.length
      : null;

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 52px" }}>
      <div style={{ marginBottom: 10, fontSize: 13, color: "#64748b" }}>
        <Link href="/catalogue" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
          Catalogue
        </Link>{" "}
        / <span>{normalizedProduct.category.name}</span> / <span>{normalizedProduct.name}</span>
      </div>

      <TrustProofBar />

      <section className="mobile-stack" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <ProductMediaGallery name={normalizedProduct.name} images={normalizedProduct.images} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
            {[
              { title: "Production locale au Senegal", text: "Atelier certifie - Controle qualite international" },
              { title: "Livraison rapide", text: `${normalizedProduct.leadTimeDays} jours en moyenne` },
              { title: "Satisfaction client", text: "Support dedie avant/apres commande" },
            ].map((item) => (
              <article key={item.title} className="surface-card hover-lift" style={{ padding: 12 }}>
                <p style={{ margin: 0, fontWeight: 800 }}>{item.title}</p>
                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 14 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="mobile-sticky-aside" style={{ position: "sticky", top: 92, display: "grid", gap: 12 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #dbe4f0",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 12px 25px -22px rgba(2,6,23,0.55)",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={chipStyle}>{normalizedProduct.category.name}</span>
              <span style={chipStyle}>{normalizedProduct.stockStatus.replaceAll("_", " ")}</span>
              {normalizedProduct.isNew ? <span style={{ ...chipStyle, background: "#dcfce7", color: "#166534" }}>Nouveau</span> : null}
            </div>

            <h1 style={{ margin: "0 0 8px", fontSize: 42, lineHeight: 1.05 }}>{normalizedProduct.name}</h1>
            <p style={{ margin: "0 0 10px", color: "#334155", lineHeight: 1.5 }}>{normalizedProduct.shortDesc ?? normalizedProduct.description}</p>
            <p style={{ margin: "0 0 10px", fontSize: 31, fontWeight: 900, color: "#0b1f3a" }}>{formatFcfa(normalizedProduct.basePrice)}</p>
            <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
              {avgRating ? `★ ${avgRating.toFixed(1)} / 5 (${normalizedProduct.reviews.length} avis)` : "Nouveau produit"} • Delai estime: {normalizedProduct.leadTimeDays} jours
            </p>
          </div>

          <ProductConfigurator
            product={{
              id: normalizedProduct.id,
              name: normalizedProduct.name,
              basePrice: normalizedProduct.basePrice,
              options: normalizedProduct.options,
              images: normalizedProduct.images,
            }}
          />

          <div className="surface-card" style={{ borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: "0 0 8px" }}>Guide fichiers d'impression</h3>
            <p style={{ margin: 0, color: "#334155" }}>
              {normalizedProduct.guide ?? "Formats PNG/SVG/PDF acceptes. 300 DPI recommandes. Transparence et marges controlees."}
            </p>
            <p style={{ margin: "10px 0 0" }}>
              <Link href={`/design?productId=${normalizedProduct.id}`} style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 700 }}>
                Ouvrir le configurateur avancé
              </Link>
            </p>
          </div>
        </aside>
      </section>

      <section style={{ marginTop: 22, display: "grid", gap: 14 }}>
        <div className="surface-card" style={{ borderRadius: 12, padding: 16 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 28 }}>Personnalisation rapide</h2>
          <ProductDesigner product={normalizedProduct} />
        </div>

        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14 }}>
          <div className="surface-card" style={{ borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 24 }}>FAQ produit</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {normalizedProduct.faqs.length === 0 ? <p style={{ margin: 0, color: "#475569" }}>FAQ a venir.</p> : null}
              {normalizedProduct.faqs.map((faq) => (
                <article key={faq.id} style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: 10 }}>
                  <p style={{ margin: 0, fontWeight: 800 }}>{faq.question}</p>
                  <p style={{ margin: "4px 0 0", color: "#334155" }}>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-card" style={{ borderRadius: 12, padding: 16 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 24 }}>Avis clients</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {normalizedProduct.reviews.length === 0 ? <p style={{ margin: 0, color: "#475569" }}>Aucun avis pour le moment.</p> : null}
              {normalizedProduct.reviews.map((review) => (
                <article key={review.id} style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: 10 }}>
                  <p style={{ margin: 0, fontWeight: 800 }}>
                    {review.author} • {"★".repeat(review.rating)}
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#334155" }}>
                    <strong>{review.title}</strong> — {review.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 30 }}>Produits similaires</h2>
            <Link href={`/search?category=${encodeURIComponent(normalizedProduct.category.slug)}`} style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
              Voir toute la categorie
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {normalizedRelatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.shortDesc ?? item.description}
                category={item.category.name}
                price={item.basePrice}
                isNew={item.isNew}
                leadTimeDays={item.leadTimeDays}
                image={item.images[0]}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

const chipStyle: React.CSSProperties = {
  padding: "5px 10px",
  borderRadius: 999,
  border: "1px solid #cbd5e1",
  fontSize: 12,
  color: "#334155",
  fontWeight: 700,
  background: "#f8fafc",
};
