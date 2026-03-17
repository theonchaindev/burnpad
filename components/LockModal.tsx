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

      <div className="relative w-full max-w-md rounded-xl overflow-hidden animate-slide-up"
        style={{ background: "#080808", border: "1px solid #222" }}>

        {/* Top accent line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #00ff6e, transparent)" }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.2)" }}>
                <Lock size={15} style={{ color: "#00ff6e" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#e8e8e8]">Protocol Lock</h2>
                <p className="text-[11px]" style={{ color: "#555" }}>This action is irreversible</p>
              </div>
            </div>
            <button onClick={onClose} className="transition-colors hover:text-[#999]" style={{ color: "#444" }}>
              <X size={16} />
            </button>
          </div>

          {/* Warning */}
          <div className="mb-5 p-3.5 rounded-lg"
            style={{ background: "rgba(255,68,85,0.04)", border: "1px solid rgba(255,68,85,0.12)" }}>
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "#ff4455" }} />
              <p className="text-[12px] leading-relaxed" style={{ color: "#999" }}>
                Once confirmed, the buyback &amp; burn parameters for{" "}
                <span className="font-semibold text-[#e8e8e8]">{tokenName}</span> are{" "}
                <span style={{ color: "#ff4455" }} className="font-semibold">permanently immutable</span>.
                No admin can modify or disable this protocol.
              </p>
            </div>
          </div>

          {/* Config summary */}
          <div className="mb-5 rounded-lg overflow-hidden" style={{ border: "1px solid #1a1a1a" }}>
            <div className="px-4 py-2 border-b border-[#181818]">
              <p className="text-[10px] font-mono tracking-widest" style={{ color: "#444" }}>LOCKING PARAMETERS</p>
            </div>
            <div className="divide-y divide-[#181818]">
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-[12px]" style={{ color: "#666" }}>buyback_rate</span>
                <span className="text-[12px] font-mono font-semibold" style={{ color: "#00ff6e" }}>{buybackRate}%</span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-[12px]" style={{ color: "#666" }}>execution_interval</span>
                <span className="text-[12px] font-mono font-semibold text-[#e8e8e8]">{timeframeLabel}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-[12px]" style={{ color: "#666" }}>action</span>
                <span className="text-[12px] font-mono font-semibold text-[#e8e8e8]">buyback_and_burn</span>
              </div>
              <div className="flex justify-between items-center px-4 py-2.5">
                <span className="text-[12px]" style={{ color: "#666" }}>mutable</span>
                <span className="text-[12px] font-mono font-semibold" style={{ color: "#ff4455" }}>false</span>
              </div>
            </div>
          </div>

          {/* Confirm input */}
          <div className="mb-4">
            <label className="block text-[11px] mb-2" style={{ color: "#555" }}>
              Type{" "}
              <span className="font-mono font-semibold" style={{ color: "#00ff6e" }}>I UNDERSTAND</span>
              {" "}to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="I UNDERSTAND"
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono transition-all"
              style={{
                background: "#0a0a0a",
                border: `1px solid ${canConfirm ? "rgba(0,255,110,0.3)" : "#1e1e1e"}`,
                color: "#e8e8e8",
                outline: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
              style={{ color: "#555", background: "transparent", border: "1px solid #1e1e1e" }}
            >
              cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: canConfirm && !loading ? "#00ff6e" : "rgba(0,255,110,0.1)",
                color: canConfirm && !loading ? "#050505" : "rgba(0,255,110,0.3)",
                border: `1px solid ${canConfirm && !loading ? "#00ff6e" : "rgba(0,255,110,0.15)"}`,
                cursor: canConfirm && !loading ? "pointer" : "not-allowed",
                boxShadow: canConfirm && !loading ? "0 0 16px rgba(0,255,110,0.2)" : "none",
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
