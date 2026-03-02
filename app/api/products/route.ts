import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeProducts } from "@/lib/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const max = Number(searchParams.get("max") ?? "0") || undefined;

  const products = await prisma.product.findMany({
    where: {
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
        max ? { basePrice: { lte: max } } : {},
      ],
    },
    include: { category: true, options: { include: { values: true } } },
    orderBy: { popularity: "desc" },
  });

  return NextResponse.json({ products: normalizeProducts(products) });
}
