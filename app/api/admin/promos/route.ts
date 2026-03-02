import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  const isJson = req.headers.get("content-type")?.includes("application/json");
  const body = isJson
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());
  const coupon = await prisma.coupon.create({
    data: {
      code: String(body.code ?? "").trim().toUpperCase(),
      type: body.type ?? "PERCENT",
      value: Number(body.value ?? 0),
      minAmount: body.minAmount ? Number(body.minAmount) : null,
      active: body.active ?? true,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
