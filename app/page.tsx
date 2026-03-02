import { prisma } from "@/lib/prisma";
import PremiumHomeClient from "@/components/shop/home/PremiumHomeClient";
import { reviewHighlights, uspItems } from "@/lib/mocks";

const categoryVisuals: Record<string, string> = {
  textile: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80&fm=webp",
  vetements: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80&fm=webp",
  objets: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80&fm=webp",
  goodies: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80&fm=webp",
  print: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80&fm=webp",
  flyers: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80&fm=webp",
};

const fallbackCategoryImage =
  "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80&fm=webp";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 6,
    }),
  ]);

  const homeProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.shortDesc ?? product.description,
    category: product.category.name,
    price: product.basePrice,
    isNew: product.isNew,
    leadTimeDays: product.leadTimeDays,
    image: product.images[0],
  }));

  const homeCategories = categories.map((cat) => {
    const key = cat.slug.toLowerCase();
    const image = Object.entries(categoryVisuals).find(([match]) => key.includes(match))?.[1] ?? fallbackCategoryImage;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image,
    };
  });

  return (
    <PremiumHomeClient
      products={homeProducts}
      categories={homeCategories}
      uspItems={uspItems}
      reviewHighlights={reviewHighlights}
    />
  );
}
