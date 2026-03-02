import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = consumeRateLimit(`register:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Trop de tentatives. Reessayez plus tard." }, { status: 429 });
  }

  const body = await req.json();
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";
  const acceptedTerms = Boolean(body.acceptedTerms);

  if (firstName.length < 2 || lastName.length < 2) {
    return NextResponse.json({ error: "Prenom et nom requis." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caracteres." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "La confirmation du mot de passe ne correspond pas." }, { status: 400 });
  }

  if (!acceptedTerms) {
    return NextResponse.json({ error: "Vous devez accepter les CGU." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Un compte existe deja avec cet email." }, { status: 409 });
  }

  await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
      name: `${firstName} ${lastName}`.trim(),
      role: "USER",
    },
  });

  return NextResponse.json({ success: true });
}
