import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const isJson = req.headers.get("content-type")?.includes("application/json");
  const body = isJson
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());
  const category = await prisma.category.findFirst({ where: { slug: body.categorySlug ?? "vetements" } });

  if (!category) return NextResponse.json({ error: "Categorie introuvable" }, { status: 404 });

  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description,
      shortDesc: body.shortDesc,
      basePrice: Number(body.basePrice ?? 0),
      images: body.images ?? [],
      categoryId: category.id,
      isCustomizable: body.isCustomizable ?? true,
      leadTimeDays: Number(body.leadTimeDays ?? 4),
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
