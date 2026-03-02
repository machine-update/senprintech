import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const design = await prisma.design.findUnique({ where: { id } });

  if (!design) return NextResponse.json({ error: "Design introuvable" }, { status: 404 });

  return NextResponse.json({ design });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const design = await prisma.design.update({
    where: { id },
    data: {
      name: body.name,
      canvasData: body.canvasData,
      previewUrl: body.previewUrl,
      qualityChecks: body.qualityChecks,
      moderationFlag: Boolean(body.moderationFlag),
    },
  });

  return NextResponse.json({ design });
}
