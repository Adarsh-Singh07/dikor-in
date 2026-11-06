import crypto from "crypto";

export function verifyPassword(providedPassword: string, storedHash?: string | null): boolean {
  if (!storedHash || !providedPassword) return false;
  if (storedHash === providedPassword) return true;

  if (storedHash.startsWith("scrypt$")) {
    const parts = storedHash.split("$");
    if (parts.length === 3) {
      const salt = parts[1];
      const expected = parts[2];
      try {
        const derived = crypto.scryptSync(providedPassword, salt, 64).toString("hex");
        return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(expected, "hex"));
      } catch {
        return false;
      }
    }
  }

  return false;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}
