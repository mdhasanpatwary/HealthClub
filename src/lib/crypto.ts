import { scryptSync, randomBytes, timingSafeEqual, createCipheriv, createDecipheriv } from "crypto";

const ENCRYPTION_KEY = process.env.SESSION_SECRET
  ? scryptSync(process.env.SESSION_SECRET, "healthclub_staff_salt", 32)
  : Buffer.from("0123456789abcdef0123456789abcdef", "utf-8"); // 32-byte key

/**
 * Encrypts a reversible credential text using AES-256-GCM.
 * Formatted as "enc:iv:authTag:ciphertext".
 */
export function encryptSecret(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `enc:${iv.toString("hex")}:${tag}:${encrypted}`;
}

/**
 * Decrypts a secret formatted as "enc:iv:authTag:ciphertext".
 * If not formatted or decryption fails, returns null.
 */
export function decryptSecret(encryptedText: string): string | null {
  if (!encryptedText || !encryptedText.startsWith("enc:")) {
    return null;
  }
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 4) return null;
    const [, ivHex, tagHex, cipherHex] = parts;
    const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    let decrypted = decipher.update(cipherHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return null;
  }
}

/**
 * Hashes a plain text password using scrypt with a unique salt.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain text password against a stored "salt:hash" or "enc:..." string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) {
    return false;
  }
  if (storedHash.startsWith("enc:")) {
    const decrypted = decryptSecret(storedHash);
    return decrypted === password;
  }
  if (!storedHash.includes(":")) {
    return false;
  }
  const [salt, hash] = storedHash.split(":");
  const verifyHash = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verifyHash, "hex"));
}
