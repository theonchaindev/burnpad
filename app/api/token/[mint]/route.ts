import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_TOKENS } from "@/lib/constants";
import { fetchMarketData, fetchBondingCurveProgress } from "@/lib/market";
import { getAgentBalance } from "@/lib/pumpfun";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mint: string }> },
) {
  const { mint } = await params;

  try {
    const token = await prisma.token.findUnique({ where: { mint } });
    if (!token) throw new Error("not found");

    // Fetch live data in parallel — ignore individual failures
    const [market, curveProgress, agentBalance] = await Promise.allSettled([
      fetchMarketData(mint),
      fetchBondingCurveProgress(mint),
      token.creatorWallet ? getAgentBalance(token.creatorWallet) : Promise.resolve(0),
    ]);

    const marketData     = market.status      === "fulfilled" ? market.value      : null;
    const curveVal       = curveProgress.status === "fulfilled" ? curveProgress.value : null;
    const agentLamports  = agentBalance.status  === "fulfilled" ? agentBalance.value  : 0;

    return NextResponse.json({
      ...token,
      agentEncKey: undefined,            // never expose the encrypted key
      price:               marketData?.price          ?? token.price,
      priceChange24h:      marketData?.priceChange24h ?? token.priceChange24h,
      marketCap:           marketData?.marketCap      ?? token.marketCap,
      volume24h:           marketData?.volume24h      ?? token.volume24h,
      bondingCurveProgress: curveVal                  ?? token.bondingCurveProgress,
      agentSolBalance:     agentLamports / 1_000_000_000,
    });
  } catch {
    // DB not configured or token not in DB — fall back to mock
  }

  const mock = MOCK_TOKENS.find((t) => t.mint === mint);
  if (mock) return NextResponse.json(mock);

  return NextResponse.json({ error: "Token not found" }, { status: 404 });
}
