export type BuybackTimeframe = "5m" | "15m" | "30m" | "1h";
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
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  buybackRate: number;
  buybackTimeframe: BuybackTimeframe;
  buybackLocked: boolean;
  buybackLockedAt: Date | null;
  hasLP: boolean;
  lpSolAmount: number;
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  revenue: number;
  buybacksCompleted: number;
  buybacksPending: number;
  totalBurned: number;
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
  createLP: boolean;
  lpSolAmount: number;
}

export interface AgentWallet {
  address: string;
  encryptedKey: {
    salt: number[];
    iv: number[];
    data: number[];
  };
}
