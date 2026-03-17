"use client";

import { useState, useEffect } from "react";
import { Search, Flame, Filter, SortDesc } from "lucide-react";
import TokenCard from "@/components/TokenCard";
import type { Token, BuybackTimeframe } from "@/lib/types";
import { MOCK_TOKENS } from "@/lib/constants";

type SortKey = "newest" | "marketCap" | "revenue" | "buybackRate";

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Explore Tokens</h1>
          <p className="text-sm text-[#888]">{tokens.length} tokens with locked buyback &amp; burn</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <Flame size={13} className="text-orange-400" />
          <span className="text-xs text-orange-400 font-medium">All settings locked</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-sm text-[#f5f5f5] placeholder:text-[#333] focus:border-orange-500/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortDesc size={13} className="text-[#555] shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-sm text-[#f5f5f5] focus:outline-none focus:border-orange-500/40 transition-colors appearance-none"
          >
            <option value="newest">Newest first</option>
            <option value="marketCap">Market cap</option>
            <option value="revenue">Revenue</option>
            <option value="buybackRate">Buyback rate</option>
          </select>
        </div>

        {/* Timeframe filter */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#555] shrink-0" />
          <select
            value={filterTimeframe}
            onChange={(e) => setFilterTimeframe(e.target.value as BuybackTimeframe | "all")}
            className="px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-sm text-[#f5f5f5] focus:outline-none focus:border-orange-500/40 transition-colors appearance-none"
          >
            <option value="all">All frequencies</option>
            <option value="instant">Instant</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Token grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Flame size={32} className="text-[#222] mx-auto mb-3" />
          <p className="text-[#555]">No tokens found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
