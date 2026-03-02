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
const sql = await readFile(schemaPath, "utf8");
const client = createClient(
  url.startsWith("libsql://")
    ? { url, authToken }
    : { url },
);

try {
  await client.executeMultiple(sql);
  console.log(`Schema applied from ${schemaPath} to ${url}`);
} finally {
  client.close();
}
