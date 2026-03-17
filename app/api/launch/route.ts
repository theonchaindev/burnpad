import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const name = fd.get("name") as string;
    const ticker = fd.get("ticker") as string;
    const description = fd.get("description") as string;
    const buybackRate = parseInt(fd.get("buybackRate") as string, 10);
    const buybackTimeframe = fd.get("buybackTimeframe") as string;

    if (!name || !ticker || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (buybackRate < 1 || buybackRate > 100) {
      return NextResponse.json({ error: "Buyback rate must be 1-100" }, { status: 400 });
    }

    // Generate a new mint keypair (in production: use pump.fun SDK to create the token)
    const mint = Keypair.generate();
    const mintAddress = mint.publicKey.toBase58();

    // TODO: Call pump.fun SDK here to actually create the token on-chain
    // with the tokenized agent enabled at buybackRate%
    // const pumpResult = await createPumpFunToken({ name, ticker, description, buybackRate, buybackTimeframe });

    // Save to DB
    const token = await prisma.token.create({
      data: {
        mint: mintAddress,
        name,
        ticker,
        description,
        imageUrl: null, // TODO: upload image to storage
        creatorWallet: "demo_wallet", // TODO: get from wallet signature
        buybackRate,
        buybackTimeframe,
        buybackLocked: true,
        buybackLockedAt: new Date(),
      },
    });

    return NextResponse.json({ mint: token.mint, id: token.id });
  } catch (err: unknown) {
    console.error("Launch error:", err);
    return NextResponse.json({ error: "Failed to launch token" }, { status: 500 });
  }
}
