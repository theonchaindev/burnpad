import { Keypair } from "@solana/web3.js";
import type { AgentWallet } from "./types";

const WALLETS_KEY  = "burnpad_wallets";
const ACTIVE_KEY   = "burnpad_active_wallet";
const LEGACY_KEY   = "burnpad_agent_wallet";

// ── crypto helpers ──────────────────────────────────────────────────────────

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

// ── storage helpers ──────────────────────────────────────────────────────────

function loadWallets(): AgentWallet[] {
  try {
    // Migrate legacy single-wallet format
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      const migrated: AgentWallet = { id: "default", name: "Wallet 1", ...old };
      localStorage.setItem(WALLETS_KEY, JSON.stringify([migrated]));
      localStorage.setItem(ACTIVE_KEY, "default");
      localStorage.removeItem(LEGACY_KEY);
    }
    const raw = localStorage.getItem(WALLETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWallets(wallets: AgentWallet[]): void {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
}

// ── public API ───────────────────────────────────────────────────────────────

export function getWallets(): AgentWallet[] {
  if (typeof window === "undefined") return [];
  return loadWallets();
}

export function hasWallet(): boolean {
  if (typeof window === "undefined") return false;
  return loadWallets().length > 0;
}

export function getActiveWallet(): AgentWallet | null {
  const wallets = getWallets();
  if (wallets.length === 0) return null;
  const activeId = localStorage.getItem(ACTIVE_KEY);
  return wallets.find((w) => w.id === activeId) ?? wallets[0];
}

/** @deprecated use getActiveWallet */
export function getStoredWallet(): AgentWallet | null {
  return getActiveWallet();
}

export function setActiveWallet(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export async function createAgentWallet(password: string, name?: string): Promise<AgentWallet> {
  const keypair = Keypair.generate();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    keypair.secretKey as BufferSource
  );

  const wallets = loadWallets();
  const wallet: AgentWallet = {
    id: crypto.randomUUID(),
    name: name ?? `Wallet ${wallets.length + 1}`,
    address: keypair.publicKey.toBase58(),
    encryptedKey: {
      salt: Array.from(salt),
      iv:   Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    },
  };

  wallets.push(wallet);
  saveWallets(wallets);
  localStorage.setItem(ACTIVE_KEY, wallet.id);
  return wallet;
}

export function renameWallet(id: string, name: string): void {
  const wallets = loadWallets();
  const w = wallets.find((w) => w.id === id);
  if (w) { w.name = name; saveWallets(wallets); }
}

export function removeWallet(id: string): void {
  const wallets = loadWallets().filter((w) => w.id !== id);
  saveWallets(wallets);
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    localStorage.setItem(ACTIVE_KEY, wallets[0]?.id ?? "");
  }
}

export function clearWallet(): void {
  localStorage.removeItem(WALLETS_KEY);
  localStorage.removeItem(ACTIVE_KEY);
}

// Returns keypair in memory only — never stored, never logged, never exported
export async function unlockWallet(id: string, password: string): Promise<Keypair> {
  const wallet = getWallets().find((w) => w.id === id);
  if (!wallet) throw new Error("Wallet not found");

  const salt = new Uint8Array(wallet.encryptedKey.salt);
  const iv   = new Uint8Array(wallet.encryptedKey.iv);
  const data = new Uint8Array(wallet.encryptedKey.data);

  const key = await deriveKey(password, salt);
  try {
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return Keypair.fromSecretKey(new Uint8Array(decrypted));
  } catch {
    throw new Error("Incorrect password");
  }
}

// Private key is intentionally never exposed — no export function
