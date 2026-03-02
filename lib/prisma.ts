import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const localDatabaseUrl = "file:./prisma/dev.db";
const configuredDatabaseUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const tursoUrl =
  configuredDatabaseUrl?.startsWith("libsql://") || configuredDatabaseUrl?.startsWith("file:")
    ? configuredDatabaseUrl
    : localDatabaseUrl;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoUrl.startsWith("libsql://") ? tursoAuthToken : undefined,
    }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
