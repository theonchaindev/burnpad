/**
 * Server-side only. Encrypts/decrypts Solana keypair private keys using
 * AES-256-GCM with a master key from the AGENT_MASTER_KEY env var.
 */
import { Keypair } from "@solana/web3.js";
import {
  createCipheriv, createDecipheriv, randomBytes, scryptSync,
} from "crypto";

function getMasterKey(): Buffer {
  const raw = process.env.AGENT_MASTER_KEY;
  if (!raw) throw new Error("AGENT_MASTER_KEY env var not set");
  // Derive a 32-byte key from the passphrase
  return scryptSync(raw, "burnpad-agent-v1", 32);
}

/** Returns iv:tag:ciphertext as a single hex string */
export function encryptKeypair(keypair: Keypair): string {
  const key = getMasterKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(keypair.secretKey),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
}

/** Decrypts an encryptKeypair() result back to a Keypair */
export function decryptKeypair(encoded: string): Keypair {
  const key = getMasterKey();
  const parts = encoded.split(":");
  if (parts.length !== 3) throw new Error("Invalid encoded key");
  const [ivHex, tagHex, dataHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return Keypair.fromSecretKey(new Uint8Array(decrypted));
}
