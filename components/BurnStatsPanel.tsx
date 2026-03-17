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
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
        <span className="text-[10px] font-mono tracking-widest" style={{ color: "var(--text3)" }}>BUYBACK AGENT</span>
        {token.buybackLocked ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded"
            style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
            <Lock size={9} style={{ color: "var(--green)" }} />
            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: "var(--green)" }}>IMMUTABLE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--green)" }} />
            <span className="text-[10px] font-mono" style={{ color: "var(--green)" }}>ACTIVE</span>
          </div>
        )}
      </div>

      {/* Agent status */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="2" fill="var(--green)" />
            <circle cx="6" cy="6" r="4.5" stroke="var(--green)" strokeWidth="0.75" opacity="0.4" />
            <line x1="6" y1="0" x2="6" y2="1.5" stroke="var(--green)" strokeWidth="1.2" />
            <line x1="12" y1="6" x2="10.5" y2="6" stroke="var(--green)" strokeWidth="1.2" />
            <line x1="6" y1="12" x2="6" y2="10.5" stroke="var(--green)" strokeWidth="1.2" />
            <line x1="0" y1="6" x2="1.5" y2="6" stroke="var(--green)" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-medium" style={{ color: "var(--text)" }}>Automated buyback &amp; burn</p>
          <span className="text-[11px] font-mono mt-0.5 block" style={{ color: "var(--text3)" }}>
            interval: {timeframeLabel.toLowerCase()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-mono font-bold" style={{ color: "var(--green)" }}>{token.buybackRate}%</p>
          <p className="text-[10px]" style={{ color: "var(--text3)" }}>rate</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3" style={{ borderBottom: "1px solid var(--line)" }}>
        {[
          { label: "buyback_rate", val: `${token.buybackRate}%`, highlight: true },
          { label: "completed", val: fmt(token.buybacksCompleted), highlight: false },
          { label: "pending", val: fmt(token.buybacksPending), highlight: false },
        ].map((s, i) => (
          <div key={s.label} className="px-3 py-3" style={{ borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
            <p className="text-[10px] font-mono mb-1" style={{ color: "var(--text3)" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: s.highlight ? "var(--green)" : "var(--text)" }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {[
          { label: "revenue", val: fmt(token.revenue) },
          { label: "unclaimed", val: "$0.00" },
          { label: "total_burned", val: fmt(token.totalBurned) },
        ].map((s, i) => (
          <div key={s.label} className="px-3 py-3" style={{ borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
            <p className="text-[10px] font-mono mb-1" style={{ color: "var(--text3)" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: "var(--text)" }}>{s.val}</p>
          </div>
        ))}
      </div>

      {token.buybackLocked && (
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="flex items-start gap-2">
            <Lock size={11} className="mt-0.5 shrink-0" style={{ color: "var(--text3)" }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text3)" }}>
              Protocol parameters are permanently locked on-chain. Rate and interval cannot be modified by any party.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
