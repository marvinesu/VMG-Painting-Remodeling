/**
 * AES-256-GCM encryption for secrets stored in the CMS (SMTP password).
 * Key material comes from the server-only SMTP_ENCRYPTION_KEY environment
 * variable (any strong passphrase; it is SHA-256-derived to 32 bytes).
 *
 * Stored format: "iv:authTag:ciphertext" (hex).
 * The same utility exists in cms/src/lib/crypto.ts — both apps must share the
 * same SMTP_ENCRYPTION_KEY value.
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function getKey(): Buffer {
  const secret = process.env.SMTP_ENCRYPTION_KEY;
  if (!secret) {
    // Fail safely with a clear server-side error; never log key material.
    throw new Error("SMTP_ENCRYPTION_KEY is not set — cannot encrypt/decrypt SMTP secrets.");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptSecret(encryptedValue: string): string {
  const [ivHex, tagHex, dataHex] = encryptedValue.split(":");
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error("Stored secret has an invalid format.");
  }
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}
