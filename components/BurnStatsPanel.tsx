"use client";

import { Lock, Flame, Clock, TrendingUp } from "lucide-react";
import type { Token } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-lg font-bold text-[#f5f5f5]">{value}</span>
      <span className="text-xs text-[#888]">{label}</span>
      {sub && <span className="text-xs text-[#555]">{sub}</span>}
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

interface Props {
  token: Token;
}

export default function BurnStatsPanel({ token }: Props) {
  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === token.buybackTimeframe)?.label ?? "";

  return (
    <div className="rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-orange-500" />
          <span className="text-sm font-semibold text-[#f5f5f5]">Buyback &amp; Burn</span>
        </div>
        {token.buybackLocked ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25">
            <Lock size={10} className="text-orange-400" />
            <span className="text-xs font-semibold text-orange-400">LOCKED</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/25">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-400">Active</span>
          </div>
        )}
      </div>

      {/* Agent badge */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
          <Flame size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#f5f5f5]">Automated buyback &amp; burn</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={10} className="text-[#888]" />
            <p className="text-xs text-[#888]">{timeframeLabel}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-[#1a1a1a]">
        <StatCard label="Buyback rate" value={`${token.buybackRate}%`} />
        <StatCard label="Completed" value={fmt(token.buybacksCompleted)} />
        <StatCard label="Pending" value={fmt(token.buybacksPending)} />
      </div>
      <div className="p-4 grid grid-cols-3 gap-4">
        <StatCard label="Revenue" value={fmt(token.revenue)} />
        <StatCard label="Unclaimed" value={"$0.00"} />
        <StatCard label="Total burned" value={fmt(token.totalBurned)} />
      </div>

      {/* Lock info */}
      {token.buybackLocked && (
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
            <div className="flex items-start gap-2">
              <Lock size={12} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-200/60 leading-relaxed">
                Settings permanently locked. Buyback rate and frequency can never be changed.
                Investors can trust this is permanent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress visual */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#888]">Total supply burned</span>
          <span className="text-xs font-mono text-orange-400">
            {token.buybacksCompleted > 0
              ? `${((token.totalBurned / (token.revenue || 1)) * 100).toFixed(1)}%`
              : "0%"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000"
            style={{
              width: `${Math.min(100, token.buybacksCompleted > 0 ? (token.totalBurned / (token.revenue || 1)) * 100 : 0)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
