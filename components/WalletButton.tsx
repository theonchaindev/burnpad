"use client";

import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { getActiveWallet } from "@/lib/wallet";
import WalletPanel from "./WalletPanel";

function shortAddr(a: string) {
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

export default function WalletButton() {
  const [open, setOpen] = useState(false);
  const [addr, setAddr] = useState<string | null>(null);

  function refresh() {
    const w = getActiveWallet();
    setAddr(w?.address ?? null);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3.5 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
        style={{
          background: addr ? "rgba(0,232,124,0.06)" : "var(--bg3)",
          border: `1px solid ${addr ? "rgba(0,232,124,0.15)" : "var(--line)"}`,
          color: addr ? "var(--green)" : "var(--text2)",
        }}
      >
        <Wallet size={12} />
        <span className="font-mono">{addr ? shortAddr(addr) : "Wallets"}</span>
      </button>

      <WalletPanel
        open={open}
        onClose={() => setOpen(false)}
        onChange={refresh}
      />
    </>
  );
}
