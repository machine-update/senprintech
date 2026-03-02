import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatFcfa } from "@/lib/currency";

export async function POST(req: Request) {
  const body = await req.json();
  const code = (body.code ?? "").trim().toUpperCase();
  const amount = Number(body.amount ?? 0);

  if (!code) return NextResponse.json({ valid: false, error: "Code requis" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) return NextResponse.json({ valid: false, error: "Coupon invalide" }, { status: 404 });

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: "Coupon expire" }, { status: 400 });
  }

  if (coupon.minAmount && amount < coupon.minAmount) {
    return NextResponse.json({ valid: false, error: `Montant minimum ${formatFcfa(coupon.minAmount)}` }, { status: 400 });
  }

  const discountAmount = coupon.type === "PERCENT" ? (amount * coupon.value) / 100 : coupon.value;

  return NextResponse.json({ valid: true, discountAmount: Number(discountAmount.toFixed(2)), coupon });
}
