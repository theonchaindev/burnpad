import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import { prisma } from "@/lib/db";
import { decryptKeypair, encryptKeypair } from "@/lib/agentKey";
import { createPumpToken } from "@/lib/pumpfun";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    const name          = fd.get("name")          as string;
    const ticker        = fd.get("ticker")        as string;
    const description   = fd.get("description")   as string;
    const buybackRate   = parseInt(fd.get("buybackRate")   as string, 10);
    const buybackTimeframe = fd.get("buybackTimeframe")    as string;
    const twitter       = (fd.get("twitter")      as string) || undefined;
    const telegram      = (fd.get("telegram")     as string) || undefined;
    const website       = (fd.get("website")      as string) || undefined;
    const createLP      = fd.get("createLP")      === "true";
    const lpSolAmount   = parseFloat(fd.get("lpSolAmount") as string || "0");
    const lpFeeShare    = parseInt(fd.get("lpFeeShare")    as string || "0", 10);
    const agentAddress  = fd.get("agentAddress")  as string | null;
    const imageFile     = fd.get("image")         as File | null;

    if (!name || !ticker || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (buybackRate < 1 || buybackRate > 100) {
      return NextResponse.json({ error: "Buyback rate must be 1–100" }, { status: 400 });
    }
    if (!agentAddress) {
      return NextResponse.json({ error: "Agent wallet address required" }, { status: 400 });
    }

    // Retrieve the pre-generated agent keypair
    const pending = await prisma.pendingAgent.findUnique({
      where: { address: agentAddress },
    });

    if (!pending || pending.used || pending.expiresAt < new Date()) {
      return NextResponse.json({ error: "Agent wallet expired or not found. Please refresh and try again." }, { status: 400 });
    }

    const agentKeypair  = decryptKeypair(pending.encKey);
    const mintKeypair   = Keypair.generate();

    // Upload metadata and create token on pump.fun
    const mint = await createPumpToken(
      agentKeypair,
      mintKeypair,
      {
        name,
        symbol: ticker,
        description,
        imageFile: imageFile ?? new Blob([], { type: "image/png" }),
        twitter,
        telegram,
        website,
      },
      0n, // no dev buy — agent accumulates creator fees for buybacks
    );

    // Persist to DB; encrypt key under new storage (agentEncKey on Token)
    const [token] = await prisma.$transaction([
      prisma.token.create({
        data: {
          mint,
          name,
          ticker,
          description,
          imageUrl: null, // pump.fun hosts it via IPFS
          creatorWallet: agentAddress,
          agentEncKey: encryptKeypair(agentKeypair),
          twitter,
          telegram,
          website,
          buybackRate,
          buybackTimeframe,
          buybackLocked: true,
          buybackLockedAt: new Date(),
          hasLP: createLP,
          lpFeeShare,
          agentActive: true,
        },
      }),
      prisma.pendingAgent.update({
        where: { address: agentAddress },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ mint: token.mint, id: token.id });
  } catch (err: unknown) {
    console.error("Launch error:", err);
    const message = err instanceof Error ? err.message : "Failed to launch token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
