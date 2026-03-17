export type BuybackTimeframe = "instant" | "hourly" | "daily" | "weekly";
export type FeedFilter = "trending" | "new" | "graduating" | "graduated";

export interface Token {
  id: string;
  mint: string;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string | null;
  creatorWallet: string;
  creatorName: string;
  createdAt: Date;
  // Social links
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  // Buyback config
  buybackRate: number;
  buybackTimeframe: BuybackTimeframe;
  buybackLocked: boolean;
  buybackLockedAt: Date | null;
  // Market data
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  // Buyback stats
  revenue: number;
  buybacksCompleted: number;
  buybacksPending: number;
  totalBurned: number;
  // Community
  replies: number;
  bondingCurveProgress: number;
}

export interface LaunchFormData {
  name: string;
  ticker: string;
  description: string;
  imageFile: File | null;
  twitter: string;
  telegram: string;
  website: string;
  buybackRate: number;
  buybackTimeframe: BuybackTimeframe;
}
