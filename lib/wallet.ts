import { Keypair } from "@solana/web3.js";
import type { AgentWallet } from "./types";

const STORAGE_KEY = "burnpad_agent_wallet";

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password) as BufferSource, { name: "PBKDF2" }, false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 200_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function createAgentWallet(password: string): Promise<AgentWallet> {
  const keypair = Keypair.generate();
  const privateKeyBytes = keypair.secretKey; // 64 bytes (private + public)

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    privateKeyBytes as BufferSource
  );

  const wallet: AgentWallet = {
    address: keypair.publicKey.toBase58(),
    encryptedKey: {
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

export function getStoredWallet(): AgentWallet | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasWallet(): boolean {
  return !!localStorage.getItem(STORAGE_KEY);
}

// Returns keypair in memory only — never stored, never logged, never exported
export async function unlockWallet(password: string): Promise<Keypair> {
  const wallet = getStoredWallet();
  if (!wallet) throw new Error("No wallet found");

  const salt = new Uint8Array(wallet.encryptedKey.salt);
  const iv = new Uint8Array(wallet.encryptedKey.iv);
  const data = new Uint8Array(wallet.encryptedKey.data);

  const key = await deriveKey(password, salt);
  let decrypted: ArrayBuffer;
  try {
    decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  } catch {
    throw new Error("Incorrect password");
  }

  return Keypair.fromSecretKey(new Uint8Array(decrypted));
}

export function clearWallet(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Private key is intentionally never exposed — no export function
