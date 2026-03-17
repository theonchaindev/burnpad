import Link from "next/link";
import { Lock, ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { MOCK_TOKENS } from "@/lib/constants";
import TokenCard from "@/components/TokenCard";

const STATS = [
  { label: "agents_deployed", value: "247" },
  { label: "total_burned", value: "$1.2M" },
  { label: "buybacks_executed", value: "8,431" },
  { label: "avg_rate", value: "78%" },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Immutable protocol",
    desc: "Buyback parameters written on-chain at deploy. No admin keys. No override. Zero trust required.",
  },
  {
    icon: Zap,
    title: "Autonomous execution",
    desc: "Agent monitors your token around the clock. Executes buybacks automatically on your interval.",
  },
  {
    icon: Clock,
    title: "Configurable intervals",
    desc: "Choose instant, hourly, daily, or weekly execution. Set it at launch — locked forever.",
  },
  {
    icon: Shield,
    title: "Verifiable on-chain",
    desc: "All parameters stored in an immutable smart contract. Anyone can verify the commitment.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center pt-20 pb-16 px-5 overflow-hidden">
        {/* Dot grid bg */}
        <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />
        {/* Green orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,255,110,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7 text-[11px] font-mono"
            style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.15)", color: "#00cc57" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff6e", boxShadow: "0 0 6px #00ff6e" }} />
            system_status: ONLINE · {STATS[0].value} agents active
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight text-[#e8e8e8]">
            Autonomous buyback &amp; burn{" "}
            <span style={{ color: "#00ff6e" }}>protocol</span>
          </h1>

          <p className="text-[#555] text-base mb-8 leading-relaxed max-w-lg mx-auto">
            Deploy tokens on Pump.fun with a permanent, on-chain buyback agent.
            Set your rate, choose your interval — locked forever at deployment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/launch"
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "#00ff6e",
                color: "#050505",
                boxShadow: "0 0 24px rgba(0,255,110,0.2)",
              }}
            >
              <Lock size={14} />
              deploy agent
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all hover:border-[#2a2a2a] hover:text-[#999]"
              style={{ color: "#555", border: "1px solid #1e1e1e" }}
            >
              browse agents
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #181818", borderBottom: "1px solid #181818", background: "#080808" }}>
        <div className="max-w-4xl mx-auto px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-[#151515]">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-6 py-2">
              <p className="text-xl font-black font-mono" style={{ color: "#00ff6e" }}>{s.value}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: "#333" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="mb-10">
          <p className="text-[10px] font-mono tracking-widest mb-2" style={{ color: "#00cc57" }}>HOW_IT_WORKS</p>
          <h2 className="text-2xl font-black text-[#e8e8e8]">Three steps to deploy</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { n: "01", title: "configure_token", desc: "Set name, ticker, description, and upload an image for your token." },
            { n: "02", title: "set_agent_params", desc: "Define your buyback rate (1–100%) and execution interval. These become immutable." },
            { n: "03", title: "lock_and_deploy", desc: "Confirm the lock. Parameters are written on-chain and can never be modified." },
          ].map((step) => (
            <div key={step.n} className="relative p-5 rounded-xl overflow-hidden"
              style={{ background: "#080808", border: "1px solid #181818" }}>
              <span className="absolute top-4 right-5 text-4xl font-black font-mono" style={{ color: "#111" }}>{step.n}</span>
              <p className="text-[11px] font-mono mb-2 relative z-10" style={{ color: "#00cc57" }}>{step.n}</p>
              <h3 className="text-sm font-bold text-[#e8e8e8] mb-1.5 font-mono relative z-10">{step.title}</h3>
              <p className="text-[12px] leading-relaxed relative z-10" style={{ color: "#555" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: "1px solid #181818", background: "#080808" }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          <div className="mb-10">
            <p className="text-[10px] font-mono tracking-widest mb-2" style={{ color: "#00cc57" }}>PROTOCOL_FEATURES</p>
            <h2 className="text-2xl font-black text-[#e8e8e8]">Built for trust</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-xl"
                style={{ background: "#080808", border: "1px solid #181818" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.12)" }}>
                  <f.icon size={14} style={{ color: "#00ff6e" }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-[#e8e8e8] mb-1">{f.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#555" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent agents */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-mono tracking-widest mb-1" style={{ color: "#00cc57" }}>RECENT_AGENTS</p>
            <h2 className="text-lg font-black text-[#e8e8e8]">Latest deployments</h2>
          </div>
          <Link href="/explore" className="flex items-center gap-1.5 text-xs font-mono transition-colors"
            style={{ color: "#555" }}>
            view all <ArrowRight size={11} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_TOKENS.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #181818", background: "#080808" }}>
        <div className="max-w-xl mx-auto px-5 py-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
            style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.2)", boxShadow: "0 0 24px rgba(0,255,110,0.08)" }}>
            <svg width="20" height="20" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2" fill="#00ff6e" />
              <circle cx="6" cy="6" r="4.5" stroke="#00ff6e" strokeWidth="0.75" opacity="0.4" />
              <line x1="6" y1="0" x2="6" y2="1.5" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="12" y1="6" x2="10.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="6" y1="12" x2="6" y2="10.5" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="0" y1="6" x2="1.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#e8e8e8] mb-3">Ready to deploy?</h2>
          <p className="mb-7 text-sm leading-relaxed" style={{ color: "#555" }}>
            Launch a token with a permanent, verifiable buyback agent. No trust assumptions required.
          </p>
          <Link
            href="/launch"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "#00ff6e", color: "#050505", boxShadow: "0 0 24px rgba(0,255,110,0.18)" }}
          >
            <Lock size={14} />
            deploy_agent()
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #111" }}>
        <div className="max-w-5xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: "rgba(0,255,110,0.06)", border: "1px solid rgba(0,255,110,0.15)" }}>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="#00ff6e" />
                <circle cx="6" cy="6" r="4.5" stroke="#00ff6e" strokeWidth="0.75" opacity="0.4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#e8e8e8] font-mono">
              burn<span style={{ color: "#00ff6e" }}>pad</span>
            </span>
          </div>
          <p className="text-[11px] font-mono" style={{ color: "#2a2a2a" }}>
            built on pump.fun · solana · not financial advice · DYOR
          </p>
        </div>
      </footer>
    </div>
  );
}
