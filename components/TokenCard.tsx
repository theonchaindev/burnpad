"use client";

import Link from "next/link";
import type { Token } from "@/lib/types";
import { seedColour } from "@/lib/constants";

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
    <div className="w-full h-full flex items-center justify-center text-lg font-bold"
      style={{ background: col.bg, color: col.text }}>
      {token.name[0]}
    </div>
  );
}

const intervalLabel: Record<string, string> = {
  "5m": "5m", "15m": "15m", "30m": "30m", "1h": "1h",
};

export default function TokenCard({ token }: { token: Token }) {
  const up = token.priceChange24h >= 0;

  return (
    <Link href={`/token/${token.mint}`}>
      <div
        className="flex gap-3 p-3 rounded-xl cursor-pointer transition-colors"
        style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg3)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg2)"; }}
      >
        <div className="w-[56px] h-[56px] rounded-lg overflow-hidden shrink-0">
          <CoinImage token={token} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + mcap */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-medium text-sm truncate" style={{ color: "var(--text)" }}>{token.name}</span>
              <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--text3)" }}>{token.ticker}</span>
            </div>
            <span className="text-xs font-mono font-medium shrink-0" style={{ color: "var(--text)" }}>{fmt(token.marketCap)}</span>
          </div>

          {/* Creator + age + change */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>
              {token.creatorName} · {timeAgo(new Date(token.createdAt))} ago
            </p>
            <span className="text-[11px] font-mono font-medium"
              style={{ color: up ? "var(--green)" : "var(--red)" }}>
              {up ? "+" : ""}{token.priceChange24h.toFixed(1)}%
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] line-clamp-1 mb-2" style={{ color: "var(--text3)" }}>
            {token.description}
          </p>

          {/* Bottom row: burn info + curve */}
          <div className="flex items-center justify-between">
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>
              <span style={{ color: "var(--green)" }}>{token.buybackRate}% burn</span>
              {" · every "}
              {intervalLabel[token.buybackTimeframe] ?? token.buybackTimeframe}
              {token.hasLP && <span> · LP</span>}
            </p>

            <div className="flex items-center gap-1.5">
              <div className="w-14 h-[3px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                <div className="h-full rounded-full"
                  style={{ width: `${token.bondingCurveProgress}%`, background: "var(--green)" }} />
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
