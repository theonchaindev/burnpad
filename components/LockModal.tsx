"use client";

import { useState } from "react";
import { Lock, AlertTriangle, X, Flame } from "lucide-react";
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
  open,
  onClose,
  onConfirm,
  tokenName,
  buybackRate,
  buybackTimeframe,
  loading,
}: Props) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === buybackTimeframe)?.label ?? "";
  const canConfirm = typed === "I UNDERSTAND";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-[#222] shadow-2xl overflow-hidden">
        {/* Top warning bar */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                <Lock size={18} className="text-orange-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#f5f5f5]">Lock Settings Forever</h2>
                <p className="text-xs text-[#888]">This action cannot be undone</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#555] hover:text-[#888] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Warning */}
          <div className="mb-5 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-sm text-orange-200/80 leading-relaxed">
                Once locked, the buyback &amp; burn settings for{" "}
                <span className="font-semibold text-orange-300">{tokenName}</span> can{" "}
                <strong className="text-orange-400">never be changed or disabled</strong>.
                This is permanent and enforced on-chain.
              </p>
            </div>
          </div>

          {/* Config summary */}
          <div className="mb-5 p-4 rounded-xl bg-[#111] border border-[#1a1a1a] space-y-2.5">
            <p className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-2">
              Locking these settings
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888]">Buyback rate</span>
              <span className="text-sm font-bold text-orange-400">{buybackRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888]">Execution frequency</span>
              <span className="text-sm font-bold text-[#f5f5f5]">{timeframeLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888]">Action type</span>
              <div className="flex items-center gap-1.5">
                <Flame size={12} className="text-orange-500" />
                <span className="text-sm font-bold text-[#f5f5f5]">Buyback &amp; Burn</span>
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="mb-5">
            <label className="block text-xs text-[#888] mb-2">
              Type <span className="font-mono text-orange-400 font-semibold">I UNDERSTAND</span> to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="I UNDERSTAND"
              className="w-full px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-[#f5f5f5] text-sm font-mono placeholder:text-[#333] focus:border-orange-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-[#f5f5f5] hover:border-[#333] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-400 hover:to-orange-500 transition-all fire-glow"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={14} />
                  Lock Forever
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
