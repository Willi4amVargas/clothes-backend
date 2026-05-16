import { scryptSync, randomBytes, timingSafeEqual, createHash } from "node:crypto";

/**
 * Hashes a password using scrypt.
 * Returns a string in the format: salt:hash
 */
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
};

/**
 * Verifies a password against a hash.
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey);
};

/**
 * Simple SHA256 hash for short-lived recovery codes.
 */
export const hashRecoveryCode = (code: string): string => {
  return createHash("sha256").update(code).digest("hex");
};

/**
 * Verifies a recovery code against a hash.
 */
export const verifyRecoveryCode = (code: string, hash: string): boolean => {
  const hashedCode = hashRecoveryCode(code);
  return hashedCode === hash;
};
