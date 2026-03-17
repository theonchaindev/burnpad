"use client";

import Link from "next/link";
import { Lock, Flame, TrendingUp, TrendingDown, Clock } from "lucide-react";
import type { Token } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function TokenAvatar({ name }: { name: string }) {
  const colors = ["from-orange-500 to-red-600", "from-purple-500 to-blue-600", "from-green-500 to-teal-600", "from-pink-500 to-rose-600"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center shrink-0 font-bold text-white text-sm`}>
      {name[0]}
    </div>
  );
}

export default function TokenCard({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;
  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === token.buybackTimeframe)?.label ?? "";
  const timeAgo = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 60000);
  const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

  return (
    <Link href={`/token/${token.mint}`}>
      <div className="group p-4 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-orange-500/30 hover:fire-glow transition-all cursor-pointer">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          <TokenAvatar name={token.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#f5f5f5] truncate">{token.name}</span>
              <span className="text-xs text-[#555] font-mono">{token.ticker}</span>
              {token.buybackLocked && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                  <Lock size={9} className="text-orange-400" />
                  <span className="text-[10px] font-bold text-orange-400">LOCKED</span>
                </div>
              )}
            </div>
            <p className="text-xs text-[#555] mt-0.5 truncate">{token.description}</p>
          </div>
          <span className="text-xs text-[#555] shrink-0">{timeStr}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
            <p className="text-xs text-[#555] mb-0.5">Market Cap</p>
            <p className="text-sm font-bold text-[#f5f5f5]">{fmt(token.marketCap)}</p>
          </div>
          <div className="p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
            <p className="text-xs text-[#555] mb-0.5">24h Change</p>
            <div className="flex items-center gap-1">
              {up ? <TrendingUp size={11} className="text-green-400" /> : <TrendingDown size={11} className="text-red-400" />}
              <p className={`text-sm font-bold ${up ? "text-green-400" : "text-red-400"}`}>
                {up ? "+" : ""}{token.priceChange24h.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
            <p className="text-xs text-[#555] mb-0.5">Revenue</p>
            <p className="text-sm font-bold text-orange-400">{fmt(token.revenue)}</p>
          </div>
        </div>

        {/* Buyback info */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs text-[#888]">{token.buybackRate}% buyback rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-[#555]" />
            <span className="text-xs text-[#555]">{timeframeLabel}</span>
          </div>
        </div>

        {/* Bonding curve */}
        <div className="mt-2">
          <div className="h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-600/50 to-orange-400/50 group-hover:from-orange-600 group-hover:to-orange-400 transition-colors duration-300"
              style={{ width: `${token.bondingCurveProgress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
