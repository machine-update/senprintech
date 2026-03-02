import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { saveResetToken } from "@/lib/password-reset-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = consumeRateLimit(`forgot-password:${ip}`, { limit: 6, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Reessayez plus tard." }, { status: 429 });
  }

  const body = await req.json();
  const email = (body.email ?? "").trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const resetToken = randomBytes(32).toString("hex");
    saveResetToken(resetToken, user.id, 60 * 60 * 1000);

    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetLink = `${appUrl}/reinitialiser-mot-de-passe?token=${resetToken}`;
    console.log(`[AUTH][RESET_LINK] ${email} -> ${resetLink}`);

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        success: true,
        message: "Lien de reinitialisation genere.",
        debugResetLink: resetLink,
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Si un compte existe, un lien de reinitialisation vient d'etre envoye.",
  });
}
