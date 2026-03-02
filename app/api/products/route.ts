import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
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

  return NextResponse.json({ products });
}
