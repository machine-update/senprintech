import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ designs: [] }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ designs: [] });

  const designs = await prisma.design.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ designs });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user) return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });

  const design = await prisma.design.create({
    data: {
      name: body.name ?? `Design ${new Date().toISOString()}`,
      userId: user.id,
      productId: body.productId,
      canvasData: body.canvasData ?? {},
      previewUrl: body.previewUrl ?? "/mock/design-preview.png",
      qualityChecks: body.qualityChecks ?? { minDpi: true, outOfBounds: false },
    },
  });

  return NextResponse.json({ design });
}
