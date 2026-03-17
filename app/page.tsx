"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Search, TrendingUp, MessageCircle, ExternalLink, Pencil } from "lucide-react";
import { MOCK_TOKENS, seedColour } from "@/lib/constants";
import TokenCard from "@/components/TokenCard";
import type { FeedFilter } from "@/lib/types";

const KING = MOCK_TOKENS[2]; // DailyBurn — highest mcap

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

const FILTER_TABS: { key: FeedFilter; label: string }[] = [
  { key: "trending", label: "🔥 trending" },
  { key: "new", label: "🆕 new" },
  { key: "graduating", label: "📈 about to graduate" },
  { key: "graduated", label: "🎓 graduated" },
];

function KingAvatar() {
  const col = seedColour(KING.name);
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl font-black"
      style={{ background: col.bg, color: col.text }}>
      {KING.name[0]}
    </div>
  );
}

export default function HomePage() {
  const [filter, setFilter] = useState<FeedFilter>("trending");
  const [search, setSearch] = useState("");

  const filtered = MOCK_TOKENS.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q);
    }
    if (filter === "graduating") return t.bondingCurveProgress >= 60 && t.bondingCurveProgress < 100;
    if (filter === "graduated") return t.bondingCurveProgress >= 100;
    if (filter === "new") return Date.now() - new Date(t.createdAt).getTime() < 3 * 60 * 60 * 1000;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-16">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/launch"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shrink-0 transition-all"
            style={{ background: "#00ff6e", color: "#050505", boxShadow: "0 0 16px rgba(0,255,110,0.2)" }}
          >
            <Pencil size={13} />
            start a new coin
          </Link>
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search for token"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#0d0d0d] border border-[#222] placeholder:text-[#333] text-[#e8e8e8] focus:border-[rgba(0,255,110,0.2)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* King of the Hill */}
        {!search && (
          <div className="mb-5 rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #1a1a1a" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#141414]"
              style={{ background: "rgba(0,255,110,0.03)" }}>
              <span className="text-sm">👑</span>
              <span className="text-xs font-bold" style={{ color: "#00ff6e" }}>king of the hill</span>
              <span className="text-[11px] ml-1" style={{ color: "#333" }}>— highest market cap</span>
            </div>
            <div className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <KingAvatar />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#e8e8e8]">{KING.name}</span>
                    <span className="text-xs font-mono" style={{ color: "#555" }}>${KING.ticker}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.15)" }}>
                      <Lock size={8} style={{ color: "#00ff6e" }} />
                      <span className="text-[9px] font-mono font-bold" style={{ color: "#00ff6e" }}>
                        {KING.buybackRate}% BURN AGENT
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono text-[#e8e8e8]">{fmt(KING.marketCap)}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <TrendingUp size={10} style={{ color: "#00ff6e" }} />
                      <span className="text-[11px] font-mono" style={{ color: "#00ff6e" }}>
                        +{KING.priceChange24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] mb-1.5" style={{ color: "#555" }}>
                  created by <span style={{ color: "#00cc57" }}>{KING.creatorName}</span>
                </p>
                <p className="text-[12px] leading-relaxed line-clamp-2 mb-3" style={{ color: "#555" }}>
                  {KING.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "#161616" }}>
                      <div className="h-full rounded-full" style={{ width: `${KING.bondingCurveProgress}%`, background: "#00ff6e" }} />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: "#00cc57" }}>{KING.bondingCurveProgress}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={11} style={{ color: "#444" }} />
                    <span className="text-[11px] font-mono" style={{ color: "#444" }}>{KING.replies}</span>
                  </div>
                  <Link href={`/token/${KING.mint}`} className="flex items-center gap-1 text-[11px] transition-colors"
                    style={{ color: "#444" }}>
                    view <ExternalLink size={9} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {!search && (
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: filter === tab.key ? "rgba(0,255,110,0.07)" : "transparent",
                  border: `1px solid ${filter === tab.key ? "rgba(0,255,110,0.18)" : "#1a1a1a"}`,
                  color: filter === tab.key ? "#00ff6e" : "#555",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Feed */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs font-mono" style={{ color: "#333" }}>// no tokens found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
