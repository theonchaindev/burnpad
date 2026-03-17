import { Lock } from "lucide-react";
import LaunchForm from "@/components/LaunchForm";

export const metadata = {
  title: "Deploy Agent — BurnPad",
  description: "Launch a Pump.fun token with a permanently locked automated buyback & burn agent.",
};

export default function LaunchPage() {
  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      {/* Header */}
      <div className="mb-9">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.18)" }}>
            <Lock size={14} style={{ color: "#00ff6e" }} />
          </div>
          <p className="text-[10px] font-mono tracking-widest" style={{ color: "#00cc57" }}>DEPLOY_AGENT</p>
        </div>
        <h1 className="text-2xl font-black text-[#e8e8e8] mb-2">Deploy a BurnPad token</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
          Configure your token and buyback agent. Parameters are permanently locked on-chain
          at deployment — giving your community complete, verifiable assurance.
        </p>
      </div>

      {/* Trust indicators */}
      <div className="grid grid-cols-3 gap-2 mb-7">
        {[
          { code: "locked: true", desc: "Immutable params" },
          { code: "agent: active", desc: "Auto execution" },
          { code: "verify: chain", desc: "On-chain proof" },
        ].map((item) => (
          <div key={item.code} className="p-3 rounded-lg text-center"
            style={{ background: "#080808", border: "1px solid #181818" }}>
            <p className="text-[10px] font-mono mb-1" style={{ color: "#00cc57" }}>{item.code}</p>
            <p className="text-[11px]" style={{ color: "#444" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <LaunchForm />

      <p className="mt-5 text-[11px] font-mono text-center" style={{ color: "#2a2a2a" }}>
        // tokens are high risk · not financial advice · always DYOR
      </p>
    </div>
  );
}
