import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function deriveKey(password: string, salt: string) {
  return scryptSync(password, salt, KEY_LENGTH);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = deriveKey(password, salt).toString("hex");
  return `spt1$${salt}$${hash}`;
}

export function isPasswordHashed(password: string): boolean {
  return password.startsWith("spt1$");
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  if (!isPasswordHashed(storedPassword)) {
    return storedPassword === password;
  }

  const [version, salt, expectedHash] = storedPassword.split("$");
  if (version !== "spt1" || !salt || !expectedHash) return false;

  const derived = deriveKey(password, salt);
  const expected = Buffer.from(expectedHash, "hex");

  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
