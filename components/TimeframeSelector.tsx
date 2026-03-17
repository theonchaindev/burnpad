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
            className={`relative p-3 rounded-lg border text-left transition-all ${
              selected
                ? "border-orange-500/60 bg-orange-500/10 fire-glow"
                : "border-[#222] bg-[#111] hover:border-[#333]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg leading-none">{opt.icon}</span>
              <span className={`text-sm font-semibold ${selected ? "text-orange-400" : "text-[#f5f5f5]"}`}>
                {opt.label}
              </span>
              {selected && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
              )}
            </div>
            <p className="text-xs text-[#888] leading-snug">{opt.description}</p>
          </button>
        );
      })}
    </div>
  );
}
