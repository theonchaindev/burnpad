import LaunchForm from "@/components/LaunchForm";

export const metadata = {
  title: "Create Coin — BurnPad",
  description: "Launch a Pump.fun token with a permanently locked automated buyback & burn agent.",
};

export default function LaunchPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#e8e8e8] mb-1">Create a new coin</h1>
        <p className="text-sm" style={{ color: "#555" }}>
          Coins on BurnPad are pump.fun tokens with a <span className="text-[#e8e8e8]">permanently locked</span> buyback &amp; burn agent.
          Investors can verify your commitment on-chain.
        </p>
      </div>
      <LaunchForm />
      <p className="mt-4 text-[11px] text-center font-mono" style={{ color: "#2a2a2a" }}>
        // not financial advice · always DYOR · solana
      </p>
    </div>
  );
}
