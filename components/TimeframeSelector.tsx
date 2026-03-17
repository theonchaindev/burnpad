"use client";

import type { BuybackTimeframe } from "@/lib/types";
import { TIMEFRAME_OPTIONS } from "@/lib/constants";

interface Props {
  value: BuybackTimeframe;
  onChange: (v: BuybackTimeframe) => void;
  disabled?: boolean;
}

export default function TimeframeSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TIMEFRAME_OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className="relative p-3 rounded-lg text-left transition-all"
            style={{
              background: selected ? "rgba(0,255,110,0.06)" : "#0a0a0a",
              border: `1px solid ${selected ? "rgba(0,255,110,0.25)" : "#1a1a1a"}`,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base leading-none">{opt.icon}</span>
              <span className="text-xs font-semibold" style={{ color: selected ? "#00ff6e" : "#e8e8e8" }}>
                {opt.label}
              </span>
              {selected && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00ff6e", boxShadow: "0 0 5px #00ff6e" }} />
              )}
            </div>
            <p className="text-[11px] leading-snug" style={{ color: "#555" }}>
              {opt.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
