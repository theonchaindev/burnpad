"use client";

import { Lock } from "lucide-react";
import type { Token } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export default function BurnStatsPanel({ token }: { token: Token }) {
  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === token.buybackTimeframe)?.label ?? "";

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #1a1a1a" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#181818]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest" style={{ color: "#444" }}>BUYBACK AGENT</span>
        </div>
        {token.buybackLocked ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm"
            style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.15)" }}>
            <Lock size={9} style={{ color: "#00ff6e" }} />
            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: "#00ff6e" }}>IMMUTABLE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff6e" }} />
            <span className="text-[10px] font-mono" style={{ color: "#00ff6e" }}>ACTIVE</span>
          </div>
        )}
      </div>

      {/* Agent status */}
      <div className="px-4 py-3 border-b border-[#181818] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.15)" }}>
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="2" fill="#00ff6e" />
            <circle cx="6" cy="6" r="4.5" stroke="#00ff6e" strokeWidth="0.75" opacity="0.4" />
            <line x1="6" y1="0" x2="6" y2="1.5" stroke="#00ff6e" strokeWidth="1.2" />
            <line x1="12" y1="6" x2="10.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
            <line x1="6" y1="12" x2="6" y2="10.5" stroke="#00ff6e" strokeWidth="1.2" />
            <line x1="0" y1="6" x2="1.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-[#e8e8e8]">Automated buyback &amp; burn</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] font-mono" style={{ color: "#555" }}>
              interval: {timeframeLabel.toLowerCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-mono font-bold" style={{ color: "#00ff6e" }}>{token.buybackRate}%</p>
          <p className="text-[10px]" style={{ color: "#444" }}>rate</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 border-b border-[#181818]">
        {[
          { label: "buyback_rate", val: `${token.buybackRate}%`, highlight: true },
          { label: "completed", val: fmt(token.buybacksCompleted), highlight: false },
          { label: "pending", val: fmt(token.buybacksPending), highlight: false },
        ].map((s) => (
          <div key={s.label} className="px-3 py-3 border-r border-[#181818] last:border-r-0">
            <p className="text-[10px] font-mono mb-1" style={{ color: "#444" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: s.highlight ? "#00ff6e" : "#e8e8e8" }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {[
          { label: "revenue", val: fmt(token.revenue), highlight: false },
          { label: "unclaimed", val: "$0.00", highlight: false },
          { label: "total_burned", val: fmt(token.totalBurned), highlight: false },
        ].map((s) => (
          <div key={s.label} className="px-3 py-3 border-r border-[#181818] last:border-r-0">
            <p className="text-[10px] font-mono mb-1" style={{ color: "#444" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono text-[#e8e8e8]">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Lock notice */}
      {token.buybackLocked && (
        <div className="px-4 py-3 border-t border-[#181818]">
          <div className="flex items-start gap-2">
            <Lock size={11} className="mt-0.5 shrink-0" style={{ color: "#333" }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "#444" }}>
              Protocol parameters are permanently locked on-chain. Rate and interval cannot be modified by any party.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
