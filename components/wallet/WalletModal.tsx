"use client";

import { useState } from "react";
import { X, Wallet, Eye, EyeOff, ShieldOff, Copy, Check } from "lucide-react";
import { createAgentWallet, getStoredWallet, hasWallet, clearWallet } from "@/lib/wallet";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (address: string) => void;
}

type View = "landing" | "create" | "existing";

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

  const inputStyle: React.CSSProperties = {
    background: "var(--bg3)",
    border: "1px solid var(--line2)",
    color: "var(--text)",
    outline: "none",
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 13,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%)" }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
                <Wallet size={14} style={{ color: "var(--green)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Agent Wallet</p>
                <p className="text-[11px]" style={{ color: "var(--text3)" }}>
                  {view === "existing" ? "Your on-chain identity" : "Create your wallet"}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ color: "var(--text3)" }} className="hover:text-[var(--text2)] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* ── LANDING ── */}
          {view === "landing" && (
            <div className="space-y-4">
              {/* No-export notice */}
              <div className="p-3.5 rounded-xl space-y-2"
                style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                <div className="flex items-start gap-2.5">
                  <ShieldOff size={13} className="mt-0.5 shrink-0" style={{ color: "var(--green)" }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                      Private key cannot be exported
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text2)" }}>
                      Creator fees go directly to your buyback agent. Since the private key stays encrypted in your browser, you — and no one else — can redirect those fees. The burn commitment is enforced at the wallet level.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setView("create")}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: "var(--green)", color: "#06060c" }}
              >
                Create agent wallet
              </button>
            </div>
          )}

          {/* ── CREATE ── */}
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
                  placeholder="Set a strong password"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text3)" }}
                >
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />

              {error && (
                <p className="text-[11px] px-3 py-2 rounded-lg"
                  style={{ color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(255,68,102,0.12)" }}>
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button onClick={() => setView("landing")} className="px-4 py-2.5 rounded-lg text-xs transition-all"
                  style={{ color: "var(--text3)", border: "1px solid var(--line)" }}>
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !password || !confirm}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: password && confirm ? "var(--green)" : "var(--green-bg)",
                    color: password && confirm ? "#06060c" : "rgba(0,255,148,0.3)",
                    border: `1px solid ${password && confirm ? "var(--green)" : "var(--green-bdr)"}`,
                    cursor: loading || !password || !confirm ? "not-allowed" : "pointer",
                  }}
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : "Generate wallet"}
                </button>
              </div>
            </div>
          )}

          {/* ── EXISTING ── */}
          {view === "existing" && storedWallet && (
            <div className="space-y-4">
              {/* Address */}
              <div className="p-4 rounded-xl" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text3)" }}>Wallet address</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono flex-1 break-all" style={{ color: "var(--text)" }}>
                    {storedWallet.address}
                  </p>
                  <button onClick={() => copy(storedWallet.address)} style={{ color: "var(--text3)" }} className="shrink-0">
                    {copied ? <Check size={13} style={{ color: "var(--green)" }} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Fund instruction */}
              <div className="p-3.5 rounded-xl" style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>Fund your wallet</p>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text2)" }}>
                  Send SOL to this address from any exchange or wallet. You need at least <strong style={{ color: "var(--text)" }}>0.02 SOL</strong> to create a coin.
                </p>
              </div>

              {/* No export notice */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "var(--bg4)", border: "1px solid var(--line)" }}>
                <ShieldOff size={12} style={{ color: "var(--text3)" }} />
                <p className="text-[11px]" style={{ color: "var(--text3)" }}>
                  Private key is encrypted and cannot be exported
                </p>
              </div>

              <button
                onClick={() => { clearWallet(); setView("landing"); }}
                className="w-full py-2 rounded-lg text-xs transition-all"
                style={{ color: "var(--text3)", border: "1px solid var(--line)" }}
              >
                Remove wallet from this device
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
