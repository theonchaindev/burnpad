/**
 * GET /api/cron/buyback
 * Called by Vercel Cron every 5 minutes.
 * For each active token, checks the agent wallet balance and executes a
 * buyback+burn if above the minimum threshold.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptKeypair } from "@/lib/agentKey";
import {
  getAgentBalance,
  buybackToken,
  burnAgentTokens,
  MIN_BUYBACK_LAMPORTS,
  FEE_RESERVE_LAMPORTS,
} from "@/lib/pumpfun";

export const maxDuration = 300; // 5-minute function timeout

export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET so only Vercel can call this
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await prisma.token.findMany({
    where: { agentActive: true, agentEncKey: { not: null } },
    select: {
      mint: true,
      name: true,
      agentEncKey: true,
      creatorWallet: true,
      buybackTimeframe: true,
      lastBuybackAt: true,
      buybacksCompleted: true,
      totalBurned: true,
    },
  });

  const results: { mint: string; status: string; detail?: string }[] = [];

  for (const token of tokens) {
    try {
      // Respect the buyback timeframe interval
      if (token.lastBuybackAt) {
        const intervalMs = timeframeToMs(token.buybackTimeframe);
        if (Date.now() - token.lastBuybackAt.getTime() < intervalMs) {
          results.push({ mint: token.mint, status: "skipped", detail: "interval not reached" });
          continue;
        }
      }

      const balance = await getAgentBalance(token.creatorWallet);

      if (balance < MIN_BUYBACK_LAMPORTS) {
        results.push({ mint: token.mint, status: "skipped", detail: "insufficient balance" });
        continue;
      }

      const agentKeypair = decryptKeypair(token.agentEncKey!);
      const buyAmountLamports = BigInt(balance - FEE_RESERVE_LAMPORTS);

      // Execute buy
      await buybackToken(agentKeypair, token.mint, buyAmountLamports);

      // Burn received tokens
      const burnSig = await burnAgentTokens(agentKeypair, token.mint);

      const solSpent = Number(buyAmountLamports) / 1_000_000_000;

      // Record the event and update stats
      await prisma.$transaction([
        prisma.buybackEvent.create({
          data: {
            tokenMint: token.mint,
            amount: solSpent,
            txSignature: burnSig ?? `burn-${Date.now()}`,
          },
        }),
        prisma.token.update({
          where: { mint: token.mint },
          data: {
            buybacksCompleted: { increment: 1 },
            totalBurned:       { increment: solSpent },
            lastBuybackAt:     new Date(),
          },
        }),
      ]);

      results.push({ mint: token.mint, status: "ok", detail: `${solSpent.toFixed(4)} SOL burned` });
    } catch (err) {
      console.error(`Buyback failed for ${token.mint}:`, err);
      results.push({
        mint: token.mint,
        status: "error",
        detail: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}

function timeframeToMs(tf: string): number {
  const map: Record<string, number> = {
    "5m":  5  * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h":  60 * 60 * 1000,
  };
  return map[tf] ?? 5 * 60 * 1000;
}
