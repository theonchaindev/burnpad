"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Copy, Check, ExternalLink } from "lucide-react";
import BurnStatsPanel from "@/components/BurnStatsPanel";
import type { Token } from "@/lib/types";
import { MOCK_TOKENS, seedColour } from "@/lib/constants";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(4)}`;
}
function fmtPrice(n: number) {
  if (n < 0.0001) return n.toExponential(4);
  return n.toFixed(6);
}

function Sparkline({ positive }: { positive: boolean }) {
  const pts = positive
    ? [70, 65, 58, 50, 40, 30, 24, 14, 9, 4]
    : [4, 10, 20, 26, 36, 46, 56, 62, 67, 76];
  const w = 100, h = 40;
  const path = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${(y / 80) * h}`).join(" ");
  const fill = pts.map((y, i) => `${(i / (pts.length - 1)) * w},${(y / 80) * h}`).join(" ") + ` ${w},${h} 0,${h}`;
  const color = positive ? "var(--green)" : "var(--red)";
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
      <polygon points={fill} fill={positive ? "rgba(0,232,124,0.05)" : "rgba(240,62,90,0.05)"} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function TokenPage() {
  const params = useParams();
  const mint = params.mint as string;
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div className="h-96 rounded-xl animate-pulse" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }} />
          <div className="space-y-3">
            {[200, 240].map(h => (
              <div key={h} className="rounded-xl animate-pulse" style={{ height: h, background: "var(--bg2)", border: "1px solid var(--line)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <p className="text-sm mb-3" style={{ color: "var(--text3)" }}>Token not found</p>
        <Link href="/" className="text-sm" style={{ color: "var(--green)" }}>← Back to feed</Link>
      </div>
    );
  }

  const up = token.priceChange24h >= 0;
  const col = seedColour(token.name);
  const timeAgo = Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 60000);
  const timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`;

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
        style={{ color: "var(--text3)" }}>
        <ArrowLeft size={13} />
        Feed
      </Link>

      {/* Token header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-xl font-bold"
          style={{ background: col.bg, color: col.text }}>
          {token.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{token.name}</h1>
            <span className="text-sm font-mono" style={{ color: "var(--text3)" }}>{token.ticker}</span>
            {token.buybackLocked && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded"
                style={{ background: "rgba(0,232,124,0.08)", color: "var(--green)", border: "1px solid rgba(0,232,124,0.12)" }}>
                Locked
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <button onClick={copyMint} className="flex items-center gap-1.5 text-[12px] font-mono"
              style={{ color: "var(--text3)" }}>
              {mint.slice(0, 8)}…{mint.slice(-6)}
              {copied ? <Check size={10} style={{ color: "var(--green)" }} /> : <Copy size={10} />}
            </button>
            <span style={{ color: "var(--text3)" }}>·</span>
            <span className="text-[12px]" style={{ color: "var(--text3)" }}>{timeStr}</span>
          </div>
        </div>
        <a href={`https://pump.fun/coin/${mint}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ border: "1px solid var(--line)", color: "var(--text3)" }}>
          pump.fun <ExternalLink size={10} />
        </a>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Left */}
        <div className="space-y-3">
          {/* Price card */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <div className="p-5" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs mb-1.5" style={{ color: "var(--text3)" }}>Market cap</p>
                  <p className="text-3xl font-bold font-mono" style={{ color: "var(--text)" }}>{fmt(token.marketCap)}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {up ? <TrendingUp size={12} style={{ color: "var(--green)" }} /> : <TrendingDown size={12} style={{ color: "var(--red)" }} />}
                    <span className="text-sm font-mono font-medium" style={{ color: up ? "var(--green)" : "var(--red)" }}>
                      {up ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                    </span>
                    <span className="text-xs" style={{ color: "var(--text3)" }}>24h</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1.5" style={{ color: "var(--text3)" }}>Price</p>
                  <p className="text-base font-mono font-medium" style={{ color: "var(--text)" }}>${fmtPrice(token.price)}</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="px-4 pt-3 pb-0">
              <div className="flex items-center gap-1 mb-2">
                {["1m", "5m", "1h", "4h", "1D"].map((t, i) => (
                  <button key={t} className="text-[11px] px-2 py-1 rounded transition-colors"
                    style={{ color: i === 0 ? "var(--text)" : "var(--text3)", background: i === 0 ? "var(--bg3)" : "transparent" }}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="h-[120px]">
                <Sparkline positive={up} />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3" style={{ borderTop: "1px solid var(--line)" }}>
              {[
                { label: "Volume 24h", value: fmt(token.volume24h) },
                { label: "Burns done", value: fmt(token.buybacksCompleted), accent: true },
                { label: "Total burned", value: fmt(token.totalBurned) },
              ].map((s, i) => (
                <div key={s.label} className="px-4 py-3"
                  style={{ borderRight: i < 2 ? "1px solid var(--line)" : "none" }}>
                  <p className="text-[11px] mb-1" style={{ color: "var(--text3)" }}>{s.label}</p>
                  <p className="text-sm font-mono font-medium" style={{ color: s.accent ? "var(--green)" : "var(--text)" }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text2)" }}>About</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{token.description}</p>
          </div>

          {/* Bonding curve */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>Bonding curve</p>
              <span className="text-sm font-mono font-medium" style={{ color: "var(--green)" }}>
                {token.bondingCurveProgress.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--bg3)" }}>
              <div className="h-full rounded-full" style={{ width: `${token.bondingCurveProgress}%`, background: "var(--green)" }} />
            </div>
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>
              At 100%, liquidity migrates automatically and the token graduates.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-3">
          {/* Buy / Sell */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <div className="flex" style={{ borderBottom: "1px solid var(--line)" }}>
              {(["buy", "sell"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors"
                  style={{
                    color: tab === t ? (t === "buy" ? "var(--green)" : "var(--red)") : "var(--text3)",
                    borderBottom: `2px solid ${tab === t ? (t === "buy" ? "var(--green)" : "var(--red)") : "transparent"}`,
                  }}>
                  {t === "buy" ? "Buy" : "Sell"}
                </button>
              ))}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-1.5">
                {["0.1", "0.5", "1", "Max"].map((amt) => (
                  <button key={amt} onClick={() => setBuyAmount(amt.toLowerCase())}
                    className="flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                    style={{
                      border: `1px solid ${buyAmount === amt.toLowerCase() ? "rgba(0,232,124,0.3)" : "var(--line)"}`,
                      color: buyAmount === amt.toLowerCase() ? "var(--green)" : "var(--text3)",
                      background: "var(--bg3)",
                    }}>
                    {amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-3 rounded-lg text-base font-mono font-medium"
                  style={{ background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--text)", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.3)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono" style={{ color: "var(--text3)" }}>SOL</span>
              </div>

              <button className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: tab === "buy" ? "var(--green)" : "var(--red)", color: "#000" }}>
                {tab === "buy" ? "Buy" : "Sell"}
              </button>
              <p className="text-[11px] text-center" style={{ color: "var(--text3)" }}>Connect a wallet to trade</p>
            </div>
          </div>

          {/* Creator */}
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>Creator</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-mono" style={{ color: "var(--text)" }}>{token.creatorWallet}</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--text3)" }}>
                Keeps {100 - token.buybackRate}% of creator fees
              </p>
            </div>
          </div>

          <BurnStatsPanel token={token} />
        </div>
      </div>
    </div>
  );
}
