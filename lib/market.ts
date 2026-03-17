/**
 * Fetches live price / market data from DexScreener (no API key required).
 * Falls back to null on any error so callers can use cached DB values.
 */

export interface MarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  bondingCurveProgress?: number;
  liquidity?: number;
}

interface DexScreenerPair {
  priceUsd?: string;
  priceChange?: { h24?: number };
  fdv?: number;
  volume?: { h24?: number };
  liquidity?: { usd?: number };
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}

export async function fetchMarketData(mint: string): Promise<MarketData | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      { next: { revalidate: 60 } }, // cache 60s in Next.js
    );
    if (!res.ok) return null;

    const data: DexScreenerResponse = await res.json();
    const pair = data.pairs?.[0];
    if (!pair) return null;

    return {
      price: parseFloat(pair.priceUsd ?? "0"),
      priceChange24h: pair.priceChange?.h24 ?? 0,
      marketCap: pair.fdv ?? 0,
      volume24h: pair.volume?.h24 ?? 0,
      liquidity: pair.liquidity?.usd,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches bonding curve progress from pump.fun's public API.
 * Returns 0–100 or null if unavailable.
 */
export async function fetchBondingCurveProgress(mint: string): Promise<number | null> {
  try {
    const res = await fetch(`https://pump.fun/api/coins/${mint}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    // pump.fun returns virtualSolReserves / totalSolRequired as progress
    if (typeof data.virtual_sol_reserves === "number") {
      const progress = Math.min(100, (data.virtual_sol_reserves / 85) * 100);
      return Math.round(progress * 10) / 10;
    }
    return null;
  } catch {
    return null;
  }
}
