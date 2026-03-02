import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@libsql/client/node";

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
  .replace(/^--.*$/gm, "")
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
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const [index, statement] of statements.entries()) {
    try {
      await client.execute(`${statement};`);
    } catch (error) {
      console.error(`Failed SQL statement #${index + 1}:`);
      console.error(statement);
      throw error;
    }
  }

  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;",
  );
  console.log(
    "Turso tables:",
    tables.rows.map((row) => String(row.name)),
  );
  console.log(`Schema applied from ${schemaPath} to ${url}`);
} finally {
  client.close();
}
