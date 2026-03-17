"use client";

import Link from "next/link";
import { Lock, MessageCircle, Droplets } from "lucide-react";
import type { Token } from "@/lib/types";
import { TIMEFRAME_OPTIONS, seedColour } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}
function timeAgo(d: Date) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function CoinImage({ token }: { token: Token }) {
  const col = seedColour(token.name);
  if (token.imageUrl) {
    return <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-xl font-bold"
      style={{ background: col.bg, color: col.text }}>
      {token.name[0]}
    </div>
  );
}

export default function TokenCard({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;
  const interval = TIMEFRAME_OPTIONS.find(o => o.value === token.buybackTimeframe)?.label ?? token.buybackTimeframe;

  return (
    <Link href={`/token/${token.mint}`}>
      <div
        className="flex gap-3 p-3 rounded-xl cursor-pointer transition-all"
        style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
      >
        {/* Image */}
        <div className="w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0">
          <CoinImage token={token} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Line 1: name + market cap */}
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                {token.name}
              </span>
              <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--text3)" }}>
                ${token.ticker}
              </span>
            </div>
            <span className="text-xs font-semibold font-mono shrink-0" style={{ color: "var(--text)" }}>
              {fmt(token.marketCap)}
            </span>
          </div>

          {/* Line 2: creator + time + change */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>
              by <span style={{ color: "var(--text2)" }}>{token.creatorName}</span>
              {" · "}{timeAgo(new Date(token.createdAt))} ago
            </p>
            <span className="text-[11px] font-mono font-semibold"
              style={{ color: up ? "var(--green)" : "var(--red)" }}>
              {up ? "+" : ""}{token.priceChange24h.toFixed(1)}%
            </span>
          </div>

          {/* Line 3: description */}
          <p className="text-[11px] leading-relaxed line-clamp-1 mb-2"
            style={{ color: "var(--text3)" }}>
            {token.description}
          </p>

          {/* Line 4: badges + curve */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Burn agent badge */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
              <Lock size={8} style={{ color: "var(--green)" }} />
              <span className="text-[9px] font-semibold" style={{ color: "var(--green)" }}>
                {token.buybackRate}% · {interval}
              </span>
            </div>

            {/* LP badge */}
            {token.hasLP && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--bg4)", border: "1px solid var(--line2)" }}>
                <Droplets size={8} style={{ color: "var(--text2)" }} />
                <span className="text-[9px]" style={{ color: "var(--text3)" }}>LP</span>
              </div>
            )}

            {/* Replies */}
            <div className="flex items-center gap-1">
              <MessageCircle size={10} style={{ color: "var(--text3)" }} />
              <span className="text-[10px]" style={{ color: "var(--text3)" }}>{token.replies}</span>
            </div>

            {/* Bonding curve — pushed right */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${token.bondingCurveProgress}%`,
                    background: token.bondingCurveProgress >= 80 ? "var(--green)" : "rgba(0,255,148,0.4)",
                  }}
                />
              </div>
              <span className="text-[10px] font-mono" style={{ color: "var(--text3)" }}>
                {token.bondingCurveProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
