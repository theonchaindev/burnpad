/**
 * Server-side only. Wraps pumpdotfun-sdk for token creation and buybacks.
 */
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PumpFunSDK } from "pumpdotfun-sdk";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
import { getConnection } from "./rpc";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  imageFile: File | Blob;
  twitter?: string;
  telegram?: string;
  website?: string;
}

function makeSdk(signer: Keypair, connection: Connection) {
  const wallet = new NodeWallet(signer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });
  return new PumpFunSDK(provider);
}

/**
 * Creates a new pump.fun token and optionally does a small dev buy.
 * Returns the mint address.
 */
export async function createPumpToken(
  agentKeypair: Keypair,
  mintKeypair: Keypair,
  metadata: TokenMetadata,
  devBuySol = 0n,
): Promise<string> {
  const connection = getConnection();
  const sdk = makeSdk(agentKeypair, connection);

  const result = await sdk.createAndBuy(
    agentKeypair,
    mintKeypair,
    {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      file: metadata.imageFile,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
    },
    devBuySol,
    500n, // 5% slippage
    { unitLimit: 250_000, unitPrice: 250_000 },
    "finalized",
  );

  if (!result.success) {
    throw new Error("pump.fun token creation failed");
  }

  return mintKeypair.publicKey.toBase58();
}

/**
 * Buys a token with all available SOL (minus reserve for fees).
 * Returns the transaction signature.
 */
export async function buybackToken(
  agentKeypair: Keypair,
  mintAddress: string,
  solAmount: bigint,
): Promise<string> {
  const connection = getConnection();
  const sdk = makeSdk(agentKeypair, connection);
  const mint = new PublicKey(mintAddress);

  const result = await sdk.buy(
    agentKeypair,
    mint,
    solAmount,
    500n, // 5% slippage
    { unitLimit: 250_000, unitPrice: 250_000 },
    "confirmed",
  );

  if (!result.success) throw new Error("buyback transaction failed");
  return result.signature ?? "";
}

/**
 * Burns all tokens held by the agent wallet for a given mint.
 * Uses the SPL token burn instruction.
 */
export async function burnAgentTokens(
  agentKeypair: Keypair,
  mintAddress: string,
): Promise<string | null> {
  const { getAssociatedTokenAddress, createBurnInstruction, getAccount } = await import("@solana/spl-token");
  const { Transaction, sendAndConfirmTransaction } = await import("@solana/web3.js");
  const connection = getConnection();
  const mint = new PublicKey(mintAddress);

  const ata = await getAssociatedTokenAddress(mint, agentKeypair.publicKey);

  let tokenBalance: bigint;
  try {
    const account = await getAccount(connection, ata);
    tokenBalance = account.amount;
  } catch {
    return null; // no token account, nothing to burn
  }

  if (tokenBalance === 0n) return null;

  const ix = createBurnInstruction(ata, mint, agentKeypair.publicKey, tokenBalance);
  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [agentKeypair]);
  return sig;
}

/** Returns agent wallet SOL balance in lamports */
export async function getAgentBalance(address: string): Promise<number> {
  const connection = getConnection();
  return connection.getBalance(new PublicKey(address));
}

/** Minimum SOL needed in agent wallet before executing a buyback (0.005 SOL = 5000000 lamports) */
export const MIN_BUYBACK_LAMPORTS = 5_000_000;
/** SOL kept as reserve for transaction fees per operation */
export const FEE_RESERVE_LAMPORTS = 2_000_000;
