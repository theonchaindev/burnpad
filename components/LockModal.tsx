"use client";

import { useState } from "react";
import { Lock, X, AlertTriangle } from "lucide-react";
import type { BuybackTimeframe } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tokenName: string;
  buybackRate: number;
  buybackTimeframe: BuybackTimeframe;
  loading: boolean;
}

export default function LockModal({
  open, onClose, onConfirm, tokenName, buybackRate, buybackTimeframe, loading,
}: Props) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === buybackTimeframe)?.label ?? "";
  const canConfirm = typed === "I UNDERSTAND";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "var(--bg2)", border: "1px solid var(--line2)" }}>

        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%)" }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
                <Lock size={15} style={{ color: "var(--green)" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Protocol Lock</h2>
                <p className="text-[11px]" style={{ color: "var(--text3)" }}>This action is irreversible</p>
              </div>
            </div>
            <button onClick={onClose} style={{ color: "var(--text3)" }} className="hover:text-[var(--text2)] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Warning */}
          <div className="mb-5 p-3.5 rounded-xl"
            style={{ background: "var(--red-bg)", border: "1px solid rgba(255,68,102,0.15)" }}>
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "var(--red)" }} />
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text2)" }}>
                Once confirmed, the buyback &amp; burn parameters for{" "}
                <span className="font-semibold" style={{ color: "var(--text)" }}>{tokenName}</span> are{" "}
                <span style={{ color: "var(--red)" }} className="font-semibold">permanently immutable</span>.
                No admin can modify or disable this protocol.
              </p>
            </div>
          </div>

          {/* Config summary */}
          <div className="mb-5 rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
            <div className="px-4 py-2.5" style={{ background: "var(--bg3)", borderBottom: "1px solid var(--line)" }}>
              <p className="text-[10px] font-mono tracking-widest" style={{ color: "var(--text3)" }}>LOCKING PARAMETERS</p>
            </div>
            <div style={{ background: "var(--bg2)" }}>
              {[
                { key: "buyback_rate", value: `${buybackRate}%`, color: "var(--green)" },
                { key: "execution_interval", value: timeframeLabel, color: "var(--text)" },
                { key: "action", value: "buyback_and_burn", color: "var(--text)" },
                { key: "mutable", value: "false", color: "var(--red)" },
              ].map((row, i, arr) => (
                <div key={row.key}
                  className="flex justify-between items-center px-4 py-2.5"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <span className="text-[12px] font-mono" style={{ color: "var(--text3)" }}>{row.key}</span>
                  <span className="text-[12px] font-mono font-semibold" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm input */}
          <div className="mb-4">
            <label className="block text-[11px] mb-2" style={{ color: "var(--text3)" }}>
              Type{" "}
              <span className="font-mono font-semibold" style={{ color: "var(--green)" }}>I UNDERSTAND</span>
              {" "}to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="I UNDERSTAND"
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono transition-all"
              style={{
                background: "var(--bg3)",
                border: `1px solid ${canConfirm ? "var(--green-bdr)" : "var(--line2)"}`,
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
              style={{ color: "var(--text3)", background: "transparent", border: "1px solid var(--line)" }}
            >
              cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: canConfirm && !loading ? "var(--green)" : "var(--green-bg)",
                color: canConfirm && !loading ? "#06060c" : "rgba(0,255,148,0.3)",
                border: `1px solid ${canConfirm && !loading ? "var(--green)" : "var(--green-bdr)"}`,
                cursor: canConfirm && !loading ? "pointer" : "not-allowed",
                boxShadow: canConfirm && !loading ? "0 0 16px rgba(0,255,148,0.15)" : "none",
              }}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={12} />
                  lock_protocol
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
