import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

const defaultLocalUrl = "file:./prisma/dev.db";
const configuredUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const url =
  configuredUrl?.startsWith("libsql://") || configuredUrl?.startsWith("file:")
    ? configuredUrl
    : defaultLocalUrl;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (url.startsWith("libsql://") && !authToken) {
  console.error("Missing TURSO_AUTH_TOKEN.");
  process.exit(1);
}

const schemaPath = resolve("prisma/turso-init.sql");
const rawSql = await readFile(schemaPath, "utf8");
const sql = rawSql
  .replaceAll("JSONB", "TEXT")
  .replaceAll("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
  .replaceAll("CREATE UNIQUE INDEX ", "CREATE UNIQUE INDEX IF NOT EXISTS ");
const client = createClient(
  url.startsWith("libsql://")
    ? { url, authToken }
    : { url },
);

try {
  const statements = sql
    .split(/;\s*\n/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await client.execute(`${statement};`);
    } catch (error) {
      console.error("Failed SQL statement:");
      console.error(statement);
      throw error;
    }
  }

  console.log(`Schema applied from ${schemaPath} to ${url}`);
} finally {
  client.close();
}
