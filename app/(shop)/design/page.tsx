import { prisma } from "@/lib/prisma";
import DesignerCanvas from "@/components/designer/DesignerCanvas";
import TrustProofBar from "@/components/shop/TrustProofBar";

export default async function DesignPage({ searchParams }: { searchParams: Promise<{ productId?: string }> }) {
  const params = await searchParams;
  const firstProduct = await prisma.product.findFirst({ include: { options: true }, orderBy: { popularity: "desc" } });
  const product = params.productId
    ? await prisma.product.findUnique({ where: { id: params.productId }, include: { options: true } })
    : firstProduct;

  if (!product) return <main style={{ padding: 20 }}>Aucun produit disponible pour le configurateur.</main>;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 20px 48px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Configurateur produit</h1>
      <p style={{ margin: "8px 0 0", color: "#475569" }}>Zone de sécurité, édition texte/image, export et ajout au panier.</p>
      <TrustProofBar />
      <div className="surface-card" style={{ marginTop: 14, padding: 10 }}>
      <DesignerCanvas product={product} />
      </div>
    </main>
  );
}
