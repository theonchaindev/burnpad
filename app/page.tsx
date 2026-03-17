import Link from "next/link";
import { Flame, Lock, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { MOCK_TOKENS } from "@/lib/constants";
import TokenCard from "@/components/TokenCard";

const FEATURES = [
  {
    icon: Lock,
    title: "Permanently Locked",
    desc: "Once you set your buyback rate and frequency, it can never be changed. Investors know exactly what they're getting.",
  },
  {
    icon: Zap,
    title: "Automated Execution",
    desc: "Our agent monitors your token 24/7 and automatically executes buybacks on your selected schedule.",
  },
  {
    icon: Flame,
    title: "Real Burns",
    desc: "Bought-back tokens are sent directly to the burn address. Permanently reducing supply and rewarding holders.",
  },
  {
    icon: Shield,
    title: "Trust By Design",
    desc: "No admin keys, no rug vectors. The buyback commitment is on-chain and immutable from day one.",
  },
];

const STATS = [
  { label: "Tokens Launched", value: "247" },
  { label: "Total Burned", value: "$1.2M" },
  { label: "Buybacks Executed", value: "8,431" },
  { label: "Avg Buyback Rate", value: "78%" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center pt-24 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
            <Flame size={11} />
            Pump.fun Buyback &amp; Burn Launchpad
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight">
            Launch tokens with{" "}
            <span className="gradient-text">permanent</span>{" "}
            buyback &amp; burn
          </h1>

          <p className="text-[#888] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Set your buyback rate, choose your frequency, then lock it forever.
            Investors can trust your commitment is irrevocable — because it is.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/launch"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all fire-glow-strong"
            >
              <Flame size={16} />
              Launch Your Token
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#222] text-[#888] font-medium text-sm hover:border-[#333] hover:text-[#f5f5f5] transition-all"
            >
              Explore Tokens
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#1a1a1a] bg-[#0c0c0c]">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black gradient-text">{s.value}</p>
              <p className="text-xs text-[#555] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">How BurnPad works</h2>
          <p className="text-[#888] max-w-lg mx-auto">Three steps to launch a token the market can trust</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Configure your token", desc: "Set your token name, ticker, and description. Upload an image." },
            { n: "02", title: "Set buyback rules", desc: "Choose your buyback rate (1–100%) and frequency. These will be permanent." },
            { n: "03", title: "Lock & launch forever", desc: "Confirm the lock. Settings are written on-chain and can never be changed." },
          ].map((step) => (
            <div key={step.n} className="relative p-6 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a]">
              <span className="text-5xl font-black text-[#1a1a1a] absolute top-4 right-5 font-mono">{step.n}</span>
              <h3 className="text-base font-bold text-[#f5f5f5] mb-2 relative z-10">{step.title}</h3>
              <p className="text-sm text-[#888] leading-relaxed relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#111] bg-[#0c0c0c]">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Built for trust</h2>
            <p className="text-[#888] max-w-lg mx-auto">Every feature designed around investor confidence</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#f5f5f5] mb-1">{f.title}</h3>
                  <p className="text-xs text-[#888] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent launches */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">Recent launches</h2>
          <Link href="/explore" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TOKENS.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#111] bg-[#0c0c0c]">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-5 fire-glow">
            <Flame size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-3">Ready to launch?</h2>
          <p className="text-[#888] mb-7 leading-relaxed">
            Create a token with a permanent buyback &amp; burn commitment. No trust required — just code.
          </p>
          <Link
            href="/launch"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm hover:from-orange-400 hover:to-orange-500 transition-all fire-glow-strong"
          >
            <Flame size={16} />
            Launch Your Token
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#111] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <Flame size={10} className="text-white" />
            </div>
            <span className="text-sm font-bold">
              <span className="gradient-text">BURN</span>
              <span className="text-[#555]">PAD</span>
            </span>
          </div>
          <p className="text-xs text-[#333]">Built on Pump.fun · Solana · Tokens are high risk. DYOR.</p>
        </div>
      </footer>
    </div>
  );
}
