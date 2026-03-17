export type BuybackTimeframe = "instant" | "hourly" | "daily" | "weekly";

export interface Token {
  id: string;
  mint: string;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string | null;
  creatorWallet: string;
  createdAt: Date;
  // Buyback config (locked forever)
  buybackRate: number; // 1-100
  buybackTimeframe: BuybackTimeframe;
  buybackLocked: boolean;
  buybackLockedAt: Date | null;
  // Stats (updated by agent)
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  revenue: number;
  buybacksCompleted: number;
  buybacksPending: number;
  totalBurned: number;
  // Bonding curve
  bondingCurveProgress: number; // 0-100
}

export interface BuybackEvent {
  id: string;
  tokenMint: string;
  amount: number;
  txSignature: string;
  executedAt: Date;
}

export interface LaunchFormData {
  name: string;
  ticker: string;
  description: string;
  imageFile: File | null;
  buybackRate: number;
  buybackTimeframe: BuybackTimeframe;
}
