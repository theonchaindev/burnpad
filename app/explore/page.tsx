"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Pencil, SlidersHorizontal } from "lucide-react";
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
      .then((d) => setTokens(d.tokens || (MOCK_TOKENS as Token[])))
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

  const selStyle = {
    background: "#0d0d0d",
    border: "1px solid #222",
    color: "#666",
    outline: "none",
  } as React.CSSProperties;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 pb-16">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/launch"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shrink-0"
          style={{ background: "#00ff6e", color: "#050505", boxShadow: "0 0 16px rgba(0,255,110,0.2)" }}
        >
          <Pencil size={13} />
          start a new coin
        </Link>
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search for token"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#0d0d0d] border border-[#222] placeholder:text-[#333] text-[#e8e8e8] focus:border-[rgba(0,255,110,0.2)] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal size={12} style={{ color: "#444" }} />
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono" style={selStyle}>
          <option value="newest">newest</option>
          <option value="marketCap">market cap</option>
          <option value="revenue">revenue</option>
          <option value="buybackRate">buyback rate</option>
        </select>
        <select value={filterTimeframe}
          onChange={(e) => setFilterTimeframe(e.target.value as BuybackTimeframe | "all")}
          className="px-3 py-1.5 rounded-lg text-xs font-mono" style={selStyle}>
          <option value="all">all intervals</option>
          <option value="instant">instant</option>
          <option value="hourly">hourly</option>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
        </select>
        <span className="text-xs font-mono ml-auto" style={{ color: "#333" }}>
          {filtered.length} agents
        </span>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[104px] rounded-xl animate-pulse"
              style={{ background: "#080808", border: "1px solid #161616" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xs font-mono" style={{ color: "#333" }}>// no agents found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
