"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Lock, TrendingUp, TrendingDown,
  Copy, Check, Share2, Star,
} from "lucide-react";
import BurnStatsPanel from "@/components/BurnStatsPanel";
import type { Token } from "@/lib/types";
import { MOCK_TOKENS } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(4)}`;
}
function fmtPrice(n: number) {
  if (n < 0.0001) return n.toExponential(4);
  return n.toFixed(6);
}

function TokenAvatar({ name, size = 44 }: { name: string; size?: number }) {
  const hues = [160, 200, 280, 320];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="rounded-xl flex items-center justify-center font-black font-mono shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.33,
        background: `hsl(${hue}, 60%, 6%)`,
        border: `1px solid hsl(${hue}, 60%, 12%)`,
        color: `hsl(${hue}, 80%, 55%)`,
      }}
    >
      {name[0]}
    </div>
  );
}

function Sparkline({ positive }: { positive: boolean }) {
  const pts = positive
    ? [70, 65, 60, 50, 40, 30, 25, 15, 10, 5]
    : [5, 10, 20, 25, 35, 45, 55, 60, 65, 75];
  const w = 100, h = 40;
  const path = pts
    .map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${(y / 80) * h}`)
    .join(" ");
  const fill = pts
    .map((y, i) => `${(i / (pts.length - 1)) * w},${(y / 80) * h}`)
    .join(" ") + ` ${w},${h} 0,${h}`;
  const color = positive ? "#00ff6e" : "#ff4455";
  const fillColor = positive ? "rgba(0,255,110,0.06)" : "rgba(255,68,85,0.06)";

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
      <polygon points={fill} fill={fillColor} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function TokenPage() {
  const params = useParams();
  const mint = params.mint as string;
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const [tab, setTab] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    fetch(`/api/token/${mint}`)
      .then((r) => r.json())
      .then((d) => setToken(d))
      .catch(() => {
        const mock = MOCK_TOKENS.find((t) => t.mint === mint);
        if (mock) setToken(mock as Token);
      })
      .finally(() => setLoading(false));
  }, [mint]);

  function copyMint() {
    navigator.clipboard.writeText(mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          <div className="h-96 rounded-xl animate-pulse" style={{ background: "#080808", border: "1px solid #181818" }} />
          <div className="space-y-3">
            <div className="h-48 rounded-xl animate-pulse" style={{ background: "#080808", border: "1px solid #181818" }} />
            <div className="h-60 rounded-xl animate-pulse" style={{ background: "#080808", border: "1px solid #181818" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center">
        <p className="text-[11px] font-mono mb-3" style={{ color: "#333" }}>// agent not found</p>
        <Link href="/explore" className="text-xs font-mono" style={{ color: "#00cc57" }}>← back to agents</Link>
      </div>
    );
  }

  const up = token.priceChange24h >= 0;
  const timeAgo = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 60000);
  const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

  return (
    <div className="max-w-7xl mx-auto px-5 py-6">
      {/* Back */}
      <Link href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-mono mb-5 transition-colors"
        style={{ color: "#444" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#666")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#444")}
      >
        <ArrowLeft size={12} />
        agents
      </Link>

      {/* Token header */}
      <div className="flex items-start gap-3.5 mb-5">
        <TokenAvatar name={token.name} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-black text-[#e8e8e8]">{token.name}</h1>
            <span className="text-xs font-mono" style={{ color: "#444" }}>{token.ticker}</span>
            {token.buybackLocked && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm"
                style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.18)" }}>
                <Lock size={9} style={{ color: "#00ff6e" }} />
                <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: "#00ff6e" }}>IMMUTABLE</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff6e", boxShadow: "0 0 4px #00ff6e" }} />
              <span className="text-[9px] font-mono" style={{ color: "#555" }}>AGENT ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <button onClick={copyMint}
              className="flex items-center gap-1.5 text-[11px] font-mono transition-colors"
              style={{ color: "#444" }}>
              {mint.slice(0, 8)}...{mint.slice(-6)}
              {copied ? <Check size={10} style={{ color: "#00ff6e" }} /> : <Copy size={10} />}
            </button>
            <span style={{ color: "#222" }}>·</span>
            <span className="text-[11px] font-mono" style={{ color: "#333" }}>by {token.creatorWallet}</span>
            <span style={{ color: "#222" }}>·</span>
            <span className="text-[11px] font-mono" style={{ color: "#333" }}>{timeStr}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStarred(!starred)}
            className="p-1.5 rounded-lg transition-all"
            style={{
              border: `1px solid ${starred ? "rgba(0,255,110,0.25)" : "#1e1e1e"}`,
              background: starred ? "rgba(0,255,110,0.06)" : "transparent",
              color: starred ? "#00ff6e" : "#444",
            }}
          >
            <Star size={13} fill={starred ? "currentColor" : "none"} />
          </button>
          <button className="p-1.5 rounded-lg transition-all"
            style={{ border: "1px solid #1e1e1e", color: "#444" }}>
            <Share2 size={13} />
          </button>
          <a href={`https://pump.fun/coin/${mint}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all"
            style={{ border: "1px solid #1e1e1e", color: "#555" }}>
            pump.fun <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        {/* Left */}
        <div className="space-y-3">
          {/* Price */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #181818" }}>
            <div className="p-5 border-b border-[#181818]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono mb-1" style={{ color: "#444" }}>market_cap</p>
                  <p className="text-3xl font-black text-[#e8e8e8] font-mono">{fmt(token.marketCap)}</p>
                  <div className={`flex items-center gap-1.5 mt-1.5`}>
                    {up ? <TrendingUp size={12} style={{ color: "#00ff6e" }} /> : <TrendingDown size={12} style={{ color: "#ff4455" }} />}
                    <span className="text-sm font-mono font-semibold" style={{ color: up ? "#00ff6e" : "#ff4455" }}>
                      {up ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: "#333" }}>24h</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono mb-1" style={{ color: "#444" }}>price</p>
                  <p className="text-base font-bold font-mono text-[#e8e8e8]">${fmtPrice(token.price)}</p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: "#333" }}>
                    ath {fmt(token.marketCap * 1.35)}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart area */}
            <div className="p-4">
              <div className="rounded-lg overflow-hidden" style={{ background: "#0a0a0a", border: "1px solid #141414" }}>
                <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                  {["1m", "5m", "1h", "4h", "1D"].map((t, i) => (
                    <button key={t} className="text-[10px] font-mono px-2 py-0.5 rounded transition-colors"
                      style={{
                        color: i === 0 ? "#00ff6e" : "#333",
                        background: i === 0 ? "rgba(0,255,110,0.08)" : "transparent",
                      }}>
                      {t}
                    </button>
                  ))}
                  <div className="ml-auto text-[10px] font-mono" style={{ color: "#333" }}>pump · 1m</div>
                </div>
                <div className="px-2 pb-3 h-[140px]">
                  <Sparkline positive={up} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 border-t border-[#181818]">
              {[
                { label: "volume_24h", val: fmt(token.volume24h) },
                { label: "buybacks_done", val: fmt(token.buybacksCompleted), green: true },
                { label: "total_burned", val: fmt(token.totalBurned) },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3 border-r border-[#181818] last:border-r-0">
                  <p className="text-[10px] font-mono mb-1" style={{ color: "#333" }}>{s.label}</p>
                  <p className="text-sm font-bold font-mono" style={{ color: s.green ? "#00ff6e" : "#e8e8e8" }}>
                    {s.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl p-5" style={{ background: "#080808", border: "1px solid #181818" }}>
            <p className="text-[10px] font-mono tracking-widest mb-3" style={{ color: "#444" }}>DESCRIPTION</p>
            <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{token.description}</p>
          </div>

          {/* Bonding curve */}
          <div className="rounded-xl p-5" style={{ background: "#080808", border: "1px solid #181818" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-mono tracking-widest" style={{ color: "#444" }}>BONDING_CURVE</p>
              <span className="text-sm font-bold font-mono" style={{ color: "#00ff6e" }}>
                {token.bondingCurveProgress.toFixed(1)}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: "#141414" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${token.bondingCurveProgress}%`,
                  background: "linear-gradient(90deg, rgba(0,255,110,0.5), #00ff6e)",
                }}
              />
            </div>
            <p className="text-[11px] font-mono" style={{ color: "#333" }}>
              // at 100%, liquidity auto-deposited and token graduates
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          {/* Buy/Sell */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #181818" }}>
            {/* Tabs */}
            <div className="flex border-b border-[#181818]">
              {(["buy", "sell"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2.5 text-xs font-mono font-semibold transition-all"
                  style={{
                    color: tab === t ? (t === "buy" ? "#00ff6e" : "#ff4455") : "#444",
                    borderBottom: `2px solid ${tab === t ? (t === "buy" ? "#00ff6e" : "#ff4455") : "transparent"}`,
                    background: tab === t ? (t === "buy" ? "rgba(0,255,110,0.04)" : "rgba(255,68,85,0.04)") : "transparent",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-4 space-y-3">
              {/* Quick amounts */}
              <div className="flex gap-1.5">
                {["0.1", "0.5", "1"].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBuyAmount(amt)}
                    className="px-2.5 py-1.5 rounded text-[11px] font-mono transition-all"
                    style={{
                      background: buyAmount === amt ? "rgba(0,255,110,0.08)" : "#0a0a0a",
                      border: `1px solid ${buyAmount === amt ? "rgba(0,255,110,0.25)" : "#1a1a1a"}`,
                      color: buyAmount === amt ? "#00ff6e" : "#555",
                    }}
                  >
                    {amt}
                  </button>
                ))}
                <button
                  onClick={() => setBuyAmount("max")}
                  className="px-2.5 py-1.5 rounded text-[11px] font-mono transition-all"
                  style={{
                    background: buyAmount === "max" ? "rgba(0,255,110,0.08)" : "#0a0a0a",
                    border: `1px solid ${buyAmount === "max" ? "rgba(0,255,110,0.25)" : "#1a1a1a"}`,
                    color: buyAmount === "max" ? "#00ff6e" : "#555",
                  }}
                >
                  max
                </button>
              </div>

              {/* Input */}
              <div className="relative">
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-3 rounded-lg text-base font-bold font-mono"
                  style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", color: "#e8e8e8", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,110,0.2)")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono" style={{ color: "#444" }}>SOL</span>
              </div>

              <button
                className="w-full py-2.5 rounded-lg text-sm font-semibold font-mono transition-all"
                style={{
                  background: tab === "buy" ? "#00ff6e" : "#ff4455",
                  color: "#050505",
                  boxShadow: `0 0 16px ${tab === "buy" ? "rgba(0,255,110,0.15)" : "rgba(255,68,85,0.15)"}`,
                }}
              >
                {tab}_token()
              </button>
              <p className="text-[10px] font-mono text-center" style={{ color: "#333" }}>
                // connect wallet to execute
              </p>
            </div>
          </div>

          {/* Creator */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #181818" }}>
            <div className="px-4 py-3 border-b border-[#181818] flex items-center justify-between">
              <p className="text-[10px] font-mono tracking-widest" style={{ color: "#444" }}>CREATOR</p>
              <Link href={`https://pump.fun/coin/${mint}`} target="_blank"
                className="text-[10px] font-mono" style={{ color: "#00cc57" }}>
                timeline →
              </Link>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "#0a0a0a", border: "1px solid #181818" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                    style={{ background: "#141414", border: "1px solid #1e1e1e", color: "#666" }}>
                    {token.creatorWallet[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#e8e8e8]">{token.creatorWallet}</p>
                    <p className="text-[10px] font-mono" style={{ color: "#00cc57" }}>
                      {100 - token.buybackRate}% creator share
                    </p>
                  </div>
                </div>
                <button className="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
                  style={{ border: "1px solid #1e1e1e", color: "#555" }}>
                  follow
                </button>
              </div>
            </div>
          </div>

          {/* Buyback agent panel */}
          <BurnStatsPanel token={token} />
        </div>
      </div>
    </div>
  );
}
