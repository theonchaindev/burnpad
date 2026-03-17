"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Search, TrendingUp, MessageCircle, Pencil } from "lucide-react";
import { MOCK_TOKENS, seedColour } from "@/lib/constants";
import TokenCard from "@/components/TokenCard";
import type { FeedFilter } from "@/lib/types";

const KING = MOCK_TOKENS[2];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

const FILTER_TABS: { key: FeedFilter; label: string }[] = [
  { key: "trending", label: "trending" },
  { key: "new", label: "new" },
  { key: "graduating", label: "graduating" },
  { key: "graduated", label: "graduated" },
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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/launch"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shrink-0 transition-all"
            style={{ background: "var(--green)", color: "#06060c", boxShadow: "0 0 16px rgba(0,255,148,0.15)" }}
          >
            <Pencil size={13} />
            start a new coin
          </Link>
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search for token"
              className="w-full py-2 rounded-lg text-sm transition-colors focus:outline-none"
              style={{
                paddingLeft: 36, paddingRight: 12,
                background: "var(--bg3)",
                border: "1px solid var(--line)",
                color: "var(--text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>
        </div>

        {/* King of the Hill */}
        {!search && (
          <div className="mb-5 rounded-2xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>
            <div className="flex items-center gap-2 px-4 py-2.5"
              style={{ background: "var(--green-bg)", borderBottom: "1px solid var(--green-bdr)" }}>
              <span className="text-sm">👑</span>
              <span className="text-xs font-bold" style={{ color: "var(--green)" }}>king of the hill</span>
              <span className="text-[11px] ml-1" style={{ color: "var(--text3)" }}>— highest market cap</span>
            </div>
            <div className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <KingAvatar />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold" style={{ color: "var(--text)" }}>{KING.name}</span>
                    <span className="text-xs font-mono" style={{ color: "var(--text3)" }}>${KING.ticker}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                      style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
                      <Lock size={8} style={{ color: "var(--green)" }} />
                      <span className="text-[9px] font-mono font-bold" style={{ color: "var(--green)" }}>
                        {KING.buybackRate}% BURN AGENT
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono" style={{ color: "var(--text)" }}>{fmt(KING.marketCap)}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <TrendingUp size={10} style={{ color: "var(--green)" }} />
                      <span className="text-[11px] font-mono" style={{ color: "var(--green)" }}>
                        +{KING.priceChange24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] mb-1.5" style={{ color: "var(--text3)" }}>
                  created by <span style={{ color: "var(--green-dim)" }}>{KING.creatorName}</span>
                </p>
                <p className="text-[12px] leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text3)" }}>
                  {KING.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg4)" }}>
                      <div className="h-full rounded-full" style={{ width: `${KING.bondingCurveProgress}%`, background: "var(--green)" }} />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: "var(--green-dim)" }}>{KING.bondingCurveProgress}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={11} style={{ color: "var(--text3)" }} />
                    <span className="text-[11px] font-mono" style={{ color: "var(--text3)" }}>{KING.replies}</span>
                  </div>
                  <Link href={`/token/${KING.mint}`}
                    className="text-[11px] transition-colors"
                    style={{ color: "var(--text3)" }}>
                    view →
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
                  background: filter === tab.key ? "var(--green-bg)" : "transparent",
                  border: `1px solid ${filter === tab.key ? "var(--green-bdr)" : "var(--line)"}`,
                  color: filter === tab.key ? "var(--green)" : "var(--text3)",
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
            <p className="text-xs font-mono" style={{ color: "var(--text3)" }}>// no tokens found</p>
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
