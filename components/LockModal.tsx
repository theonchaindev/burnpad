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

export default function LockModal({ open, onClose, onConfirm, tokenName, buybackRate, buybackTimeframe, loading }: Props) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const timeframeLabel = TIMEFRAME_OPTIONS.find((o) => o.value === buybackTimeframe)?.label ?? "";
  const canConfirm = typed === "I UNDERSTAND";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>Lock protocol</h2>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text3)" }}>This action is permanent and cannot be undone</p>
            </div>
            <button onClick={onClose} className="p-1 rounded transition-colors" style={{ color: "var(--text3)" }}>
              <X size={16} />
            </button>
          </div>

          {/* Warning */}
          <div className="mb-5 p-3.5 rounded-lg flex items-start gap-2.5"
            style={{ background: "rgba(240,62,90,0.05)", border: "1px solid rgba(240,62,90,0.12)" }}>
            <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "var(--red)" }} />
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text2)" }}>
              Once confirmed, the buyback & burn parameters for{" "}
              <span style={{ color: "var(--text)" }} className="font-medium">{tokenName}</span> are{" "}
              <span style={{ color: "var(--red)" }}>permanently locked</span>. No admin key exists.
            </p>
          </div>

          {/* Parameters */}
          <div className="mb-5 rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
            {[
              { label: "Buyback rate", value: `${buybackRate}%`, accent: true },
              { label: "Execution interval", value: timeframeLabel, accent: false },
              { label: "Action", value: "Buyback & burn", accent: false },
              { label: "Mutable", value: "Never", accent: false, red: true },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                  background: i % 2 === 0 ? "var(--bg3)" : "var(--bg2)",
                }}>
                <span className="text-[12px]" style={{ color: "var(--text3)" }}>{row.label}</span>
                <span className="text-[12px] font-medium" style={{ color: row.red ? "var(--red)" : row.accent ? "var(--green)" : "var(--text)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Confirm input */}
          <div className="mb-4">
            <label className="block text-[11px] mb-2" style={{ color: "var(--text3)" }}>
              Type <span className="font-mono font-medium" style={{ color: "var(--text)" }}>I UNDERSTAND</span> to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="I UNDERSTAND"
              autoComplete="off"
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
              style={{
                background: "var(--bg3)",
                border: `1px solid ${canConfirm ? "rgba(0,232,124,0.4)" : "var(--line)"}`,
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-medium transition-colors"
              style={{ color: "var(--text3)", border: "1px solid var(--line)" }}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || loading}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              style={{
                background: canConfirm && !loading ? "var(--green)" : "var(--bg3)",
                color: canConfirm && !loading ? "#000" : "var(--text3)",
                border: `1px solid ${canConfirm && !loading ? "var(--green)" : "var(--line)"}`,
                cursor: canConfirm && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading
                ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                : <><Lock size={12} /> Lock & deploy</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
