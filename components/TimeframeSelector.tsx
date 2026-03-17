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
    <div className="grid grid-cols-4 gap-1.5">
      {TIMEFRAME_OPTIONS.map((opt) => {
        const sel = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className="py-2.5 rounded-lg text-xs font-medium text-center transition-all"
            style={{
              background: sel ? "var(--green-bg)" : "var(--bg3)",
              border: `1px solid ${sel ? "var(--green-bdr)" : "var(--line)"}`,
              color: sel ? "var(--green)" : "var(--text3)",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              fontWeight: sel ? 600 : 400,
            }}
            title={opt.description}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
