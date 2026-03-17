/**
 * POST /api/agent/create
 * Generates a new Solana keypair for the buyback agent, stores it encrypted
 * in DB (as PendingAgent), and returns only the public address.
 * The pending record expires in 1 hour if unused.
 */
import { NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import { prisma } from "@/lib/db";
import { encryptKeypair } from "@/lib/agentKey";

export async function POST() {
  try {
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();
    const encKey = encryptKeypair(keypair);

    await prisma.pendingAgent.create({
      data: {
        address,
        encKey,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return NextResponse.json({ address });
  } catch (err) {
    console.error("agent/create error:", err);
    return NextResponse.json({ error: "Failed to create agent wallet" }, { status: 500 });
  }
}
