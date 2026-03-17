import { Lock, Wallet, Flame, Droplets, Shield, Zap, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "how-it-works",
    icon: Zap,
    title: "How BurnPad Works",
    content: [
      {
        q: "What is BurnPad?",
        a: "BurnPad is a token launchpad built on Solana that combines pump.fun's bonding curve mechanics with an autonomous, on-chain buyback & burn agent. Every token launched through BurnPad has a permanently configured burn agent that runs forever.",
      },
      {
        q: "What does the buyback & burn agent do?",
        a: "The agent automatically uses a percentage of trading fees to buy back tokens from the open market and send them to the burn address (null address). This reduces the circulating supply over time, creating deflationary pressure.",
      },
      {
        q: "Why is this a trust signal for investors?",
        a: "Because the settings are locked at deployment and cannot be changed by anyone — including the creator. Investors can verify on-chain that the burn agent is active and immutable. There's no rug-pull vector through fee redirection.",
      },
    ],
  },
  {
    id: "agent-wallet",
    icon: Wallet,
    title: "Agent Wallet",
    content: [
      {
        q: "What is an agent wallet?",
        a: "An agent wallet is a Solana keypair generated and encrypted entirely in your browser. It acts as your on-chain identity for deploying and managing your burn agent. Creator fees flow directly to this wallet to fund buybacks.",
      },
      {
        q: "Why can't I export the private key?",
        a: "This is intentional. By making the private key non-exportable, you cryptographically guarantee that creator fees can only be used for buybacks — not redirected elsewhere. The key is encrypted with your password using AES-GCM and stored locally. It never leaves your device.",
      },
      {
        q: "What if I lose my password?",
        a: "If you lose your password, you lose access to the agent wallet. You can remove the wallet from your device and create a new one, but any SOL remaining in the old wallet would be inaccessible. Keep your password somewhere safe.",
      },
      {
        q: "Is my private key transmitted to BurnPad servers?",
        a: "No. Your private key is generated locally using the Web Crypto API, encrypted with your password, and stored only in your browser's localStorage. BurnPad servers never see your key or your password.",
      },
    ],
  },
  {
    id: "buyback-config",
    icon: Flame,
    title: "Buyback Configuration",
    content: [
      {
        q: "What is the buyback rate?",
        a: "The buyback rate (1–100%) determines what percentage of the trading fees earned by your token are used for buybacks. At 100%, all fees go directly to buying and burning tokens. At 50%, half goes to buybacks and half remains in the agent wallet.",
      },
      {
        q: "What are the execution intervals?",
        a: "Every 5 minutes — maximum burn frequency, ideal for high-volume launches. Every 15 minutes — frequent burns with lower transaction overhead. Every 30 minutes — balanced frequency for steady deflation. Hourly — one large burn per hour, lowest gas costs.",
      },
      {
        q: "Can I change these settings after launch?",
        a: "No. Buyback rate and execution interval are locked permanently at deployment. This immutability is the core trust guarantee of BurnPad. Always choose your settings carefully before deploying.",
      },
    ],
  },
  {
    id: "liquidity",
    icon: Droplets,
    title: "Liquidity Pool",
    content: [
      {
        q: "What is the LP option?",
        a: "When creating a coin, you can optionally add a liquidity pool on Pump Swap — pump.fun's native AMM. You specify an amount of SOL, and at launch it's paired with your token supply to create a trading pool immediately.",
      },
      {
        q: "What is Pump Swap?",
        a: "Pump Swap is pump.fun's native automated market maker (AMM). It provides decentralized, permissionless liquidity for tokens launched on the Solana ecosystem. Adding LP via Pump Swap means your token is instantly tradeable at launch.",
      },
      {
        q: "Is LP required?",
        a: "No. LP is optional. Without it, your token still trades on the bonding curve until it reaches graduation threshold (~$69K market cap), at which point liquidity migrates to Raydium automatically.",
      },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Trust",
    content: [
      {
        q: "How is the immutability enforced?",
        a: "Buyback parameters are written to a Solana program account at deployment with the upgrade authority burned. The on-chain program reads these parameters and enforces them for every execution — no admin key can override them.",
      },
      {
        q: "Can BurnPad team access my funds?",
        a: "No. BurnPad only collects a small platform fee (0.02 SOL) at deployment. After that, fees flow to your agent wallet, which only you control via your local encrypted keypair.",
      },
      {
        q: "What happens if BurnPad goes offline?",
        a: "The on-chain buyback agent runs independently of BurnPad's frontend. Even if the website goes offline, the burn agent continues executing buybacks on-chain as long as your agent wallet has SOL.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)", color: "var(--green)" }}>
              <Lock size={9} />
              DOCUMENTATION
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            How BurnPad works
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
            Everything you need to know about the autonomous buyback & burn protocol,
            agent wallets, and how trust is enforced on-chain.
          </p>
        </div>

        {/* Table of contents */}
        <div className="mb-8 p-4 rounded-xl" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
          <p className="text-[10px] font-mono tracking-widest mb-3" style={{ color: "var(--text3)" }}>CONTENTS</p>
          <div className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.id} href={`#${s.id}`}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors group"
                  style={{ color: "var(--text2)" }}>
                  <Icon size={12} style={{ color: "var(--text3)" }} />
                  <span className="text-sm">{s.title}</span>
                  <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text3)" }} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
                    <Icon size={14} style={{ color: "var(--green)" }} />
                  </div>
                  <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{section.title}</h2>
                </div>

                <div className="space-y-3">
                  {section.content.map((item, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{item.q}</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--text2)" }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>
          <div className="h-px w-full mb-6" style={{ background: "linear-gradient(90deg, transparent 0%, var(--green-bdr) 50%, transparent 100%)" }} />
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Ready to launch?</p>
          <p className="text-[12px] mb-4" style={{ color: "var(--text3)" }}>
            Create your agent wallet and deploy a permanently burning token in minutes.
          </p>
          <a
            href="/launch"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "var(--green)", color: "#06060c", boxShadow: "0 0 20px rgba(0,255,148,0.15)" }}
          >
            <Flame size={14} />
            Start a new coin
          </a>
        </div>
      </div>
    </div>
  );
}
