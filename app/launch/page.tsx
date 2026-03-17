import { Flame, Lock, Info } from "lucide-react";
import LaunchForm from "@/components/LaunchForm";

export const metadata = {
  title: "Launch Token — BurnPad",
  description: "Launch a Pump.fun token with permanently locked automated buyback & burn.",
};

export default function LaunchPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-4 fire-glow">
          <Flame size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-black mb-2">Launch a BurnPad Token</h1>
        <p className="text-[#888] text-sm leading-relaxed max-w-md mx-auto">
          Configure your token and buyback settings. Once launched, the buyback rate and
          frequency are permanently locked — giving your community total assurance.
        </p>
      </div>

      {/* Trust indicators */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Lock, label: "Settings locked forever" },
          { icon: Flame, label: "Auto buyback & burn" },
          { icon: Info, label: "On-chain verifiable" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] text-center">
            <item.icon size={14} className="text-orange-400" />
            <span className="text-xs text-[#888] leading-tight">{item.label}</span>
          </div>
        ))}
      </div>

      <LaunchForm />

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-[#333] text-center leading-relaxed">
        Tokens launched on BurnPad are Pump.fun tokens. Crypto trading is high risk. This is not financial advice.
        The irreversible lock is a UI and smart contract commitment — always DYOR.
      </p>
    </div>
  );
}
