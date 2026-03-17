"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all"
        style={{
          color: "#00ff6e",
          background: "rgba(0,255,110,0.07)",
          border: "1px solid rgba(0,255,110,0.18)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff6e", boxShadow: "0 0 6px #00ff6e" }} />
        connect_wallet
      </button>
    );
  }

  const short = `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all"
        style={{ color: "#999", background: "#0a0a0a", border: "1px solid #1e1e1e" }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00ff6e", boxShadow: "0 0 5px #00ff6e" }} />
        {short}
        <ChevronDown size={11} style={{ color: "#555" }} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 rounded-lg overflow-hidden z-50"
          style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <div className="px-3 py-2 border-b border-[#181818]">
            <p className="text-[10px] text-[#444] font-mono mb-0.5">connected</p>
            <p className="text-xs font-mono text-[#e8e8e8]">{short}</p>
          </div>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[#0f0f0f]"
            style={{ color: "#ff4455" }}
          >
            <LogOut size={11} />
            disconnect
          </button>
        </div>
      )}
    </div>
  );
}
