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

  const rows = [
    { label: "Buyback rate", value: `${token.buybackRate}%`, accent: true },
    { label: "Interval", value: timeframeLabel },
    ...(token.hasLP && token.lpFeeShare > 0 ? [{ label: "LP fee share", value: `${token.lpFeeShare}%` }] : []),
    { label: "Burns completed", value: fmt(token.buybacksCompleted) },
    { label: "Pending", value: fmt(token.buybacksPending) },
    { label: "Total burned", value: fmt(token.totalBurned) },
    { label: "Revenue", value: fmt(token.revenue) },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--line)" }}>
        <span className="text-xs font-medium" style={{ color: "var(--text2)" }}>Buyback agent</span>
        {token.buybackLocked && (
          <div className="flex items-center gap-1.5">
            <Lock size={11} style={{ color: "var(--green)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--green)" }}>Locked</span>
          </div>
        )}
      </div>

      <div>
        {rows.map((row, i) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
            <span className="text-[12px]" style={{ color: "var(--text3)" }}>{row.label}</span>
            <span className="text-[12px] font-mono font-medium"
              style={{ color: row.accent ? "var(--green)" : "var(--text)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {token.buybackLocked && (
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--line)", background: "var(--bg3)" }}>
          <p className="text-[11px]" style={{ color: "var(--text3)" }}>
            Parameters are permanently locked on-chain and cannot be modified.
          </p>
        </div>
      )}
    </div>
  );
}
