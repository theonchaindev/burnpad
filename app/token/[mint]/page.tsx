"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Lock, Flame, TrendingUp, TrendingDown,
  Clock, Copy, Check, Share2, Star
} from "lucide-react";
import BurnStatsPanel from "@/components/BurnStatsPanel";
import type { Token } from "@/lib/types";
import { MOCK_TOKENS } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(4)}`;
}

function fmtPrice(n: number) {
  if (n < 0.0001) return n.toExponential(4);
  return n.toFixed(6);
}

function TokenAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const colors = ["from-orange-500 to-red-600", "from-purple-500 to-blue-600", "from-green-500 to-teal-600", "from-pink-500 to-rose-600"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center font-black text-white shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {name[0]}
    </div>
  );
}

function MiniChart({ positive }: { positive: boolean }) {
  // Simple SVG sparkline
  const h = 80;
  const w = 200;
  const points = positive
    ? [0, 60, 50, 45, 35, 30, 20, 10, 5, 0]
    : [0, 10, 20, 25, 30, 40, 50, 55, 65, 80];
  const pts = points.map((y, i) => `${(i / (points.length - 1)) * w},${y}`).join(" ");
  const fill = points.map((y, i) => `${(i / (points.length - 1)) * w},${y}`).join(" ") +
    ` ${w},${h} 0,${h}`;
  const color = positive ? "#22c55e" : "#ef4444";
  const fillColor = positive ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <polygon points={fill} fill={fillColor} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function TokenPage() {
  const params = useParams();
  const mint = params.mint as string;

  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");

  const up = (token?.priceChange24h ?? 0) >= 0;

  useEffect(() => {
    fetch(`/api/token/${mint}`)
      .then((r) => r.json())
      .then((d) => setToken(d))
      .catch(() => {
        const mock = MOCK_TOKENS.find((t) => t.mint === mint);
        if (mock) setToken(mock as Token);
      })
      .finally(() => setLoading(false));
  }, [mint]);

  function copyMint() {
    navigator.clipboard.writeText(mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-8 w-32 rounded bg-[#111] animate-pulse mb-6" />
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="h-96 rounded-2xl bg-[#0f0f0f] animate-pulse" />
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-[#0f0f0f] animate-pulse" />
            <div className="h-64 rounded-2xl bg-[#0f0f0f] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Flame size={40} className="text-[#222] mx-auto mb-3" />
        <p className="text-[#555] mb-4">Token not found</p>
        <Link href="/explore" className="text-orange-400 text-sm hover:text-orange-300">Browse tokens →</Link>
      </div>
    );
  }

  const timeAgo = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 60000);
  const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#888] mb-5 transition-colors">
        <ArrowLeft size={14} />
        Back to explore
      </Link>

      {/* Token header */}
      <div className="flex items-start gap-4 mb-6">
        <TokenAvatar name={token.name} size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black text-[#f5f5f5]">{token.name}</h1>
            <span className="text-sm text-[#555] font-mono">{token.ticker}</span>
            {token.buybackLocked && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25">
                <Lock size={10} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-400">LOCKED</span>
              </div>
            )}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111] border border-[#1a1a1a]">
              <Flame size={10} className="text-orange-500" />
              <span className="text-xs text-[#888]">Buyback Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <button
              onClick={copyMint}
              className="flex items-center gap-1.5 text-xs font-mono text-[#555] hover:text-[#888] transition-colors"
            >
              {mint.slice(0, 8)}...{mint.slice(-6)}
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            </button>
            <span className="text-xs text-[#333]">·</span>
            <span className="text-xs text-[#555]">by {token.creatorWallet}</span>
            <span className="text-xs text-[#333]">·</span>
            <span className="text-xs text-[#555]">{timeStr}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStarred(!starred)}
            className={`p-2 rounded-lg border transition-all ${starred ? "border-orange-500/40 text-orange-400 bg-orange-500/10" : "border-[#222] text-[#555] hover:border-[#333]"}`}
          >
            <Star size={15} fill={starred ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-lg border border-[#222] text-[#555] hover:border-[#333] transition-colors">
            <Share2 size={15} />
          </button>
          <a
            href={`https://pump.fun/coin/${mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#222] text-xs text-[#888] hover:border-[#333] hover:text-[#f5f5f5] transition-all"
          >
            pump.fun <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: Chart + info */}
        <div className="space-y-4">
          {/* Price panel */}
          <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-[#555] mb-1">Market Cap</p>
                <p className="text-3xl font-black text-[#f5f5f5]">{fmt(token.marketCap)}</p>
                <div className={`flex items-center gap-1.5 mt-1 ${up ? "text-green-400" : "text-red-400"}`}>
                  {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span className="text-sm font-semibold">
                    {up ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-xs text-[#555]">24hr</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#555] mb-1">Price</p>
                <p className="text-lg font-bold text-[#f5f5f5] font-mono">${fmtPrice(token.price)}</p>
                <p className="text-xs text-[#555] mt-1">ATH {fmt(token.marketCap * 1.35)}</p>
              </div>
            </div>

            {/* Mini chart */}
            <div className="rounded-xl bg-[#111] overflow-hidden p-3">
              <MiniChart positive={up} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
                <p className="text-xs text-[#555] mb-1">Volume 24h</p>
                <p className="text-sm font-bold text-[#f5f5f5]">{fmt(token.volume24h)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
                <p className="text-xs text-[#555] mb-1">Buybacks done</p>
                <p className="text-sm font-bold text-orange-400">{fmt(token.buybacksCompleted)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
                <p className="text-xs text-[#555] mb-1">Total burned</p>
                <p className="text-sm font-bold text-[#f5f5f5]">{fmt(token.totalBurned)}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5">
            <h3 className="text-sm font-bold text-[#f5f5f5] mb-2">About</h3>
            <p className="text-sm text-[#888] leading-relaxed">{token.description}</p>
          </div>

          {/* Bonding curve */}
          <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#f5f5f5]">Bonding curve progress</h3>
              <span className="text-sm font-bold text-orange-400">{token.bondingCurveProgress.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
                style={{ width: `${token.bondingCurveProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#555] mt-2">
              When the curve reaches 100%, liquidity is automatically deposited and the token graduates.
            </p>
          </div>
        </div>

        {/* Right: Buy/Sell + Burn stats */}
        <div className="space-y-4">
          {/* Buy/Sell */}
          <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] overflow-hidden">
            <div className="flex border-b border-[#1a1a1a]">
              <button className="flex-1 py-3 text-sm font-bold text-white bg-green-500/10 border-b-2 border-green-500">
                Buy
              </button>
              <button className="flex-1 py-3 text-sm text-[#888] hover:text-[#f5f5f5] transition-colors">
                Sell
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                {["0.1", "0.5", "1"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBuyAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      buyAmount === amt
                        ? "bg-orange-500/20 border border-orange-500/40 text-orange-400"
                        : "bg-[#111] border border-[#1a1a1a] text-[#888] hover:border-[#222]"
                    }`}
                  >
                    {amt} SOL
                  </button>
                ))}
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111] border border-[#1a1a1a] text-[#888] hover:border-[#222] transition-all">
                  Max
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-3 rounded-xl bg-[#111] border border-[#222] text-[#f5f5f5] text-lg font-bold focus:border-orange-500/40 focus:outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#555] font-medium">SOL</span>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm hover:from-green-400 hover:to-green-500 transition-all">
                Buy {token.ticker}
              </button>
              <p className="text-xs text-[#555] text-center">Connect wallet to trade on pump.fun</p>
            </div>
          </div>

          {/* Creator rewards */}
          <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#f5f5f5]">Creator rewards</h3>
              <Link href={`https://pump.fun/coin/${mint}`} target="_blank" className="text-xs text-orange-400 hover:text-orange-300">
                Timeline →
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <TokenAvatar name={token.creatorWallet} size={28} />
                <div>
                  <p className="text-xs font-mono text-[#f5f5f5]">{token.creatorWallet}</p>
                  <p className="text-xs text-green-400">{100 - token.buybackRate}% creator share</p>
                </div>
              </div>
              <button className="text-xs text-[#888] border border-[#222] px-2.5 py-1 rounded-lg hover:border-[#333] transition-colors">
                Follow
              </button>
            </div>
          </div>

          {/* Buyback & Burn stats */}
          <BurnStatsPanel token={token} />
        </div>
      </div>
    </div>
  );
}
