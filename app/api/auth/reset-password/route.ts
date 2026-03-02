import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { consumeResetToken } from "@/lib/password-reset-store";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = consumeRateLimit(`reset-password:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Reessayez plus tard." }, { status: 429 });
  }

  const body = await req.json();
  const token = (body.token ?? "").trim();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!token) {
    return NextResponse.json({ error: "Jeton invalide." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caracteres." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "La confirmation du mot de passe ne correspond pas." }, { status: 400 });
  }

  const record = consumeResetToken(token);

  if (!record) {
    return NextResponse.json({ error: "Lien expire ou invalide." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashPassword(password) },
  });

  return NextResponse.json({
    success: true,
    message: "Mot de passe reinitialise avec succes.",
  });
}
