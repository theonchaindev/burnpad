"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import TokenCard from "@/components/TokenCard";
import type { Token, BuybackTimeframe } from "@/lib/types";
import { MOCK_TOKENS } from "@/lib/constants";

type SortKey = "newest" | "marketCap" | "revenue" | "buybackRate";

const selStyle = {
  background: "#0a0a0a",
  border: "1px solid #1e1e1e",
  color: "#888",
  outline: "none",
  appearance: "none" as const,
};

export default function ExplorePage() {
  const [tokens, setTokens] = useState<Token[]>(MOCK_TOKENS as Token[]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [filterTimeframe, setFilterTimeframe] = useState<BuybackTimeframe | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((d) => setTokens(d.tokens || MOCK_TOKENS as Token[]))
      .catch(() => setTokens(MOCK_TOKENS as Token[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tokens
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        (!q || t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q)) &&
        (filterTimeframe === "all" || t.buybackTimeframe === filterTimeframe)
      );
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "marketCap") return b.marketCap - a.marketCap;
      if (sort === "revenue") return b.revenue - a.revenue;
      if (sort === "buybackRate") return b.buybackRate - a.buybackRate;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-mono tracking-widest mb-1.5" style={{ color: "#00cc57" }}>ACTIVE_AGENTS</p>
          <h1 className="text-2xl font-black text-[#e8e8e8]">Browse agents</h1>
          <p className="text-sm mt-1 font-mono" style={{ color: "#444" }}>
            {tokens.length} deployed · all parameters locked
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
          style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.12)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff6e" }} />
          <span className="text-[10px] font-mono" style={{ color: "#00cc57" }}>LIVE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search tokens..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-mono transition-all"
            style={{ ...selStyle, color: "#e8e8e8" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,110,0.2)")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={12} style={{ color: "#333" }} />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 rounded-lg text-xs font-mono" style={selStyle}>
            <option value="newest">sort: newest</option>
            <option value="marketCap">sort: market_cap</option>
            <option value="revenue">sort: revenue</option>
            <option value="buybackRate">sort: buyback_rate</option>
          </select>
        </div>

        <select value={filterTimeframe} onChange={(e) => setFilterTimeframe(e.target.value as BuybackTimeframe | "all")}
          className="px-3 py-2 rounded-lg text-xs font-mono" style={selStyle}>
          <option value="all">interval: all</option>
          <option value="instant">interval: instant</option>
          <option value="hourly">interval: hourly</option>
          <option value="daily">interval: daily</option>
          <option value="weekly">interval: weekly</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: "#080808", border: "1px solid #181818" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[11px] font-mono" style={{ color: "#333" }}>// no agents found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
