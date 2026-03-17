"use client";

import Link from "next/link";
import { Lock, MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { Token } from "@/lib/types";
import { seedColour } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h`;
  return `${Math.floor(mins / 1440)}d`;
}

function TokenImage({ token }: { token: Token }) {
  if (token.imageUrl) {
    return <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />;
  }
  const col = seedColour(token.name);
  return (
    <div className="w-full h-full flex items-center justify-center font-black text-2xl"
      style={{ background: col.bg, color: col.text }}>
      {token.name[0]}
    </div>
  );
}

export default function TokenCard({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;
  const ago = timeAgo(new Date(token.createdAt));

  return (
    <Link href={`/token/${token.mint}`}>
      <div
        className="flex gap-3 p-3 rounded-xl cursor-pointer transition-colors"
        style={{ background: "#080808", border: "1px solid #161616" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#242424")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#161616")}
      >
        {/* Coin image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0d0d0d]">
          <TokenImage token={token} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Row 1: name + market cap */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="font-semibold text-[#e8e8e8] text-sm leading-tight truncate">{token.name}</span>
              <span className="text-[11px] font-mono shrink-0" style={{ color: "#555" }}>${token.ticker}</span>
              {token.buybackLocked && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.15)" }}>
                  <Lock size={8} style={{ color: "#00ff6e" }} />
                  <span className="text-[9px] font-mono font-bold" style={{ color: "#00ff6e" }}>BURN AGENT</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold font-mono text-[#e8e8e8]">{fmt(token.marketCap)}</p>
              <div className="flex items-center gap-0.5 justify-end mt-0.5">
                {up ? <TrendingUp size={9} style={{ color: "#00ff6e" }} /> : <TrendingDown size={9} style={{ color: "#ff4455" }} />}
                <span className="text-[10px] font-mono" style={{ color: up ? "#00ff6e" : "#ff4455" }}>
                  {up ? "+" : ""}{token.priceChange24h.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: created by */}
          <p className="text-[11px] mb-1.5" style={{ color: "#555" }}>
            created by{" "}
            <span style={{ color: "#00cc57" }}>{token.creatorName}</span>
            {" "}· {ago} ago
          </p>

          {/* Row 3: description */}
          <p className="text-[11px] leading-relaxed line-clamp-2 mb-2" style={{ color: "#555" }}>
            {token.description}
          </p>

          {/* Row 4: stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageCircle size={10} style={{ color: "#333" }} />
                <span className="text-[10px] font-mono" style={{ color: "#444" }}>{token.replies}</span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "#444" }}>
                {token.buybackRate}% burn rate
              </span>
            </div>
            {/* Bonding curve */}
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "#161616" }}>
                <div className="h-full rounded-full"
                  style={{
                    width: `${token.bondingCurveProgress}%`,
                    background: token.bondingCurveProgress >= 80
                      ? "#00ff6e"
                      : "rgba(0,255,110,0.5)",
                  }}
                />
              </div>
              <span className="text-[10px] font-mono" style={{ color: "#333" }}>
                {token.bondingCurveProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
