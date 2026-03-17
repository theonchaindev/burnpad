"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Search, TrendingUp, MessageCircle } from "lucide-react";
import { MOCK_TOKENS, seedColour } from "@/lib/constants";
import TokenCard from "@/components/TokenCard";
import type { FeedFilter } from "@/lib/types";

const KING = MOCK_TOKENS[2];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

const FILTERS: { key: FeedFilter; label: string }[] = [
  { key: "trending",  label: "Trending"   },
  { key: "new",       label: "New"        },
  { key: "graduating", label: "Graduating" },
  { key: "graduated", label: "Graduated"  },
];

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

  const col = seedColour(KING.name);
  const up = KING.priceChange24h >= 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 pt-14 pb-16">

        {/* Hero */}
        <div className="mb-12">
          <p className="text-xs font-medium mb-4 tracking-wide" style={{ color: "var(--green)" }}>
            Autonomous buyback &amp; burn
          </p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4" style={{ color: "var(--text)" }}>
            Launch your coin<br />with our agent
          </h1>
          <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: "var(--text2)" }}>
            Deploy a Pump.fun token with a permanent, on-chain buyback agent. Creator fees go straight to burns — locked forever.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/launch"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: "var(--green)", color: "#000" }}
            >
              Create a coin
            </Link>
            <Link
              href="/docs"
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--line)", color: "var(--text2)" }}
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens…"
              className="w-full py-2 rounded-lg text-sm focus:outline-none transition-colors"
              style={{ paddingLeft: 34, paddingRight: 12, background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--text)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.3)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>
        </div>

        {/* King of the Hill */}
        {!search && (
          <div className="mb-6 rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--text2)" }}>King of the hill</span>
              <span className="text-xs" style={{ color: "var(--text3)" }}>— highest market cap</span>
            </div>
            <div className="flex gap-4 p-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl font-bold"
                style={{ background: col.bg, color: col.text }}>
                {KING.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold truncate" style={{ color: "var(--text)" }}>{KING.name}</span>
                    <span className="text-xs font-mono shrink-0" style={{ color: "var(--text3)" }}>{KING.ticker}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: "rgba(0,232,124,0.08)", border: "1px solid rgba(0,232,124,0.12)" }}>
                      <Lock size={8} style={{ color: "var(--green)" }} />
                      <span className="text-[9px] font-medium" style={{ color: "var(--green)" }}>
                        {KING.buybackRate}% burn
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold font-mono text-sm" style={{ color: "var(--text)" }}>{fmt(KING.marketCap)}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <TrendingUp size={10} style={{ color: up ? "var(--green)" : "var(--red)" }} />
                      <span className="text-[11px] font-mono" style={{ color: up ? "var(--green)" : "var(--red)" }}>
                        +{KING.priceChange24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] mb-2" style={{ color: "var(--text3)" }}>
                  by {KING.creatorName}
                </p>
                <p className="text-[12px] line-clamp-1 mb-3" style={{ color: "var(--text3)" }}>
                  {KING.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-[3px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
                      <div className="h-full rounded-full" style={{ width: `${KING.bondingCurveProgress}%`, background: "var(--green)" }} />
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: "var(--text3)" }}>{KING.bondingCurveProgress}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={11} style={{ color: "var(--text3)" }} />
                    <span className="text-[11px]" style={{ color: "var(--text3)" }}>{KING.replies}</span>
                  </div>
                  <Link href={`/token/${KING.mint}`} className="text-[11px] ml-auto" style={{ color: "var(--text3)" }}>
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {!search && (
          <div className="flex items-center gap-1 mb-4">
            {FILTERS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  background: filter === tab.key ? "var(--bg3)" : "transparent",
                  border: `1px solid ${filter === tab.key ? "var(--line)" : "transparent"}`,
                  color: filter === tab.key ? "var(--text)" : "var(--text3)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Feed */}
        {filtered.length === 0 ? (
          <p className="text-center py-16 text-sm" style={{ color: "var(--text3)" }}>No tokens found</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map((token) => <TokenCard key={token.id} token={token} />)}
          </div>
        )}
      </div>
    </div>
  );
}
