import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { hashPassword, verifyPassword, isPasswordHashed } from "@/lib/password";

function sanitizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        identifier: { label: "Email ou numero", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        const identifier = credentials?.identifier ? sanitizeIdentifier(credentials.identifier) : "";
        const password = credentials?.password ?? "";

        if (!identifier || !password) return null;

        const ip = req?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() ?? "unknown";
        const rateKey = `login:${ip}:${identifier}`;
        const rateLimit = consumeRateLimit(rateKey, { limit: 8, windowMs: 10 * 60 * 1000 });
        if (!rateLimit.allowed) return null;

        const normalizedPhone = normalizePhone(identifier);
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              {
                addresses: {
                  some: {
                    phone: normalizedPhone,
                  },
                },
              },
            ],
          },
        });

        if (!user) return null;

        const valid = verifyPassword(password, user.password);
        if (!valid) return null;

        if (!isPasswordHashed(user.password)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword(password) },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = typeof token.role === "string" ? token.role : "USER";
      }
      return session;
    },
  },
};
