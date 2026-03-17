"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Copy, Check } from "lucide-react";
import { createAgentWallet, getStoredWallet, hasWallet, clearWallet } from "@/lib/wallet";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (address: string) => void;
}

type View = "landing" | "create" | "existing";

const inp: React.CSSProperties = {
  background: "var(--bg3)",
  border: "1px solid var(--line)",
  color: "var(--text)",
  outline: "none",
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  fontSize: 13,
};

export default function WalletModal({ open, onClose, onCreated }: Props) {
  const [view, setView] = useState<View>(() =>
    typeof window !== "undefined" && hasWallet() ? "existing" : "landing"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const storedWallet = typeof window !== "undefined" ? getStoredWallet() : null;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreate() {
    if (!password || password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError("");
    try {
      const wallet = await createAgentWallet(password);
      onCreated(wallet.address);
      setView("existing");
    } catch {
      setError("Failed to create wallet");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl"
        style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {view === "existing" ? "Agent wallet" : "Create wallet"}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text3)" }}>
                {view === "existing" ? "Your on-chain identity" : "Encrypted locally, never exported"}
              </p>
            </div>
            <button onClick={onClose} style={{ color: "var(--text3)" }}>
              <X size={16} />
            </button>
          </div>

          {/* Landing */}
          {view === "landing" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Private key cannot be exported</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text2)" }}>
                  Creator fees go directly to your buyback agent. Since the private key stays encrypted in your browser, no one can redirect those fees. The burn commitment is enforced at the wallet level.
                </p>
              </div>
              <button onClick={() => setView("create")}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: "var(--green)", color: "#000" }}>
                Create agent wallet
              </button>
            </div>
          )}

          {/* Create */}
          {view === "create" && (
            <div className="space-y-3">
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text2)" }}>
                A Solana wallet will be generated and encrypted with your password. The private key is never shown, exported, or transmitted.
              </p>

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set a strong password (min 8 chars)"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                style={inp}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />

              {error && (
                <p className="text-[11px] px-3 py-2 rounded-lg"
                  style={{ color: "var(--red)", background: "rgba(240,62,90,0.06)", border: "1px solid rgba(240,62,90,0.12)" }}>
                  {error}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={() => setView("landing")} className="px-4 py-2.5 rounded-lg text-xs transition-colors"
                  style={{ color: "var(--text3)", border: "1px solid var(--line)" }}>
                  Back
                </button>
                <button onClick={handleCreate} disabled={loading || !password || !confirm}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors"
                  style={{
                    background: password && confirm && !loading ? "var(--green)" : "var(--bg3)",
                    color: password && confirm && !loading ? "#000" : "var(--text3)",
                    border: `1px solid ${password && confirm && !loading ? "var(--green)" : "var(--line)"}`,
                    cursor: loading || !password || !confirm ? "not-allowed" : "pointer",
                  }}>
                  {loading
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : "Generate wallet"}
                </button>
              </div>
            </div>
          )}

          {/* Existing */}
          {view === "existing" && storedWallet && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--line)", background: "var(--bg3)" }}>
                  <p className="text-[11px]" style={{ color: "var(--text3)" }}>Wallet address</p>
                </div>
                <div className="px-4 py-3 flex items-center gap-2">
                  <p className="text-xs font-mono flex-1 break-all" style={{ color: "var(--text)" }}>
                    {storedWallet.address}
                  </p>
                  <button onClick={() => copy(storedWallet.address)} style={{ color: "var(--text3)" }} className="shrink-0">
                    {copied ? <Check size={13} style={{ color: "var(--green)" }} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text)" }}>Fund your wallet</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text2)" }}>
                  Send SOL to this address. You need at least{" "}
                  <span style={{ color: "var(--text)" }}>0.02 SOL</span> to create a coin.
                </p>
              </div>

              <p className="text-[11px] px-1" style={{ color: "var(--text3)" }}>
                Private key is encrypted in your browser and cannot be exported.
              </p>

              <button onClick={() => { clearWallet(); setView("landing"); }}
                className="w-full py-2 rounded-lg text-xs transition-colors"
                style={{ color: "var(--text3)", border: "1px solid var(--line)" }}>
                Remove wallet from this device
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
