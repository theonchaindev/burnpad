"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { Token } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function TokenAvatar({ name }: { name: string }) {
  const hues = [160, 200, 280, 320];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs font-mono"
      style={{
        background: `hsl(${hue}, 60%, 8%)`,
        border: `1px solid hsl(${hue}, 60%, 15%)`,
        color: `hsl(${hue}, 80%, 60%)`,
      }}
    >
      {name[0]}
    </div>
  );
}

export default function TokenCard({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;
  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === token.buybackTimeframe)?.label ?? "";
  const timeAgo = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 60000);
  const timeStr = timeAgo < 60 ? `${timeAgo}m` : `${Math.floor(timeAgo / 60)}h`;

  return (
    <Link href={`/token/${token.mint}`}>
      <div
        className="group p-4 rounded-xl transition-all cursor-pointer"
        style={{ background: "#080808", border: "1px solid #181818" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,110,0.2)";
          (e.currentTarget as HTMLDivElement).style.background = "#0a0a0a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#181818";
          (e.currentTarget as HTMLDivElement).style.background = "#080808";
        }}
      >
        {/* Top */}
        <div className="flex items-start gap-2.5 mb-3">
          <TokenAvatar name={token.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#e8e8e8] truncate">{token.name}</span>
              <span className="text-[11px] font-mono" style={{ color: "#555" }}>{token.ticker}</span>
              {token.buybackLocked && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
                  style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.15)" }}>
                  <Lock size={8} style={{ color: "#00ff6e" }} />
                  <span className="text-[9px] font-mono tracking-wide" style={{ color: "#00ff6e" }}>LOCKED</span>
                </div>
              )}
            </div>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: "#444" }}>{token.description}</p>
          </div>
          <span className="text-[10px] font-mono shrink-0" style={{ color: "#333" }}>{timeStr}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "mcap", val: fmt(token.marketCap) },
            { label: "24h", val: `${up ? "+" : ""}${token.priceChange24h.toFixed(1)}%`, color: up ? "#00ff6e" : "#ff4455" },
            { label: "revenue", val: fmt(token.revenue), color: "#00cc57" },
          ].map((s) => (
            <div key={s.label} className="px-2 py-1.5 rounded-md" style={{ background: "#0a0a0a", border: "1px solid #181818" }}>
              <p className="text-[9px] font-mono mb-0.5" style={{ color: "#444" }}>{s.label}</p>
              <p className="text-[12px] font-mono font-semibold" style={{ color: s.color || "#e8e8e8" }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#181818]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff6e", boxShadow: "0 0 4px #00ff6e" }} />
            <span className="text-[11px] font-mono" style={{ color: "#555" }}>
              {token.buybackRate}% buyback
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: "#333" }}>{timeframeLabel.toLowerCase()}</span>
        </div>

        {/* Bonding curve */}
        <div className="mt-2.5">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "#151515" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${token.bondingCurveProgress}%`,
                background: "linear-gradient(90deg, rgba(0,255,110,0.4), rgba(0,255,110,0.7))",
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
