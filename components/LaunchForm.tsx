"use client";

import { useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { ImageIcon, Lock, ChevronRight } from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";
import LockModal from "./LockModal";
import type { BuybackTimeframe, LaunchFormData } from "@/lib/types";

const inputStyle = {
  background: "#0a0a0a",
  border: "1px solid #1e1e1e",
  color: "#e8e8e8",
  outline: "none",
};

const inputFocusStyle = {
  borderColor: "rgba(0,255,110,0.25)",
};

function Input({ value, onChange, placeholder, mono }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`w-full px-3 py-2.5 rounded-lg text-sm transition-all ${mono ? "font-mono" : ""}`}
      style={{
        ...inputStyle,
        ...(focused ? inputFocusStyle : {}),
      }}
    />
  );
}

export default function LaunchForm() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const [form, setForm] = useState<LaunchFormData>({
    name: "", ticker: "", description: "",
    imageFile: null, buybackRate: 100, buybackTimeframe: "instant",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(file: File) {
    if (!file.type.startsWith("image/")) return;
    setForm((f) => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleLaunch() {
    setLaunching(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("ticker", form.ticker);
      fd.append("description", form.description);
      fd.append("buybackRate", String(form.buybackRate));
      fd.append("buybackTimeframe", form.buybackTimeframe);
      if (form.imageFile) fd.append("image", form.imageFile);

      const res = await fetch("/api/launch", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      router.push(`/token/${data.mint}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setLaunching(false);
      setLockModalOpen(false);
    }
  }

  const step1Valid = form.name.trim() && form.ticker.trim() && form.description.trim();

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-7">
        {[{ n: 1, label: "Token config" }, { n: 2, label: "Agent config" }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all"
                style={{
                  background: step === s.n ? "#00ff6e" : step > s.n ? "rgba(0,255,110,0.1)" : "#0a0a0a",
                  border: `1px solid ${step === s.n ? "#00ff6e" : step > s.n ? "rgba(0,255,110,0.2)" : "#222"}`,
                  color: step === s.n ? "#050505" : step > s.n ? "#00ff6e" : "#444",
                  boxShadow: step === s.n ? "0 0 12px rgba(0,255,110,0.25)" : "none",
                }}
              >
                {s.n}
              </div>
              <span className="text-xs" style={{ color: step >= s.n ? "#999" : "#333" }}>{s.label}</span>
            </div>
            {i < 1 && <ChevronRight size={12} style={{ color: "#2a2a2a" }} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "#080808", border: "1px solid #1a1a1a" }}>
        <div className="p-6">

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest mb-2" style={{ color: "#444" }}>
                  TOKEN_IMAGE
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-32 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={{ background: "#0a0a0a", border: "2px dashed #1e1e1e" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,110,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <ImageIcon size={18} style={{ color: "#333" }} className="mb-2" />
                      <p className="text-xs font-mono" style={{ color: "#444" }}>upload image</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest mb-2" style={{ color: "#444" }}>NAME</label>
                <Input value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Token name" />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest mb-2" style={{ color: "#444" }}>TICKER</label>
                <Input
                  value={form.ticker}
                  onChange={(v) => setForm((f) => ({ ...f, ticker: v.toUpperCase().slice(0, 10) }))}
                  placeholder="TICKER"
                  mono
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest mb-2" style={{ color: "#444" }}>DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your token..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg text-sm resize-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,110,0.25)")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
                />
              </div>

              <button
                disabled={!step1Valid}
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: step1Valid ? "#00ff6e" : "rgba(0,255,110,0.06)",
                  color: step1Valid ? "#050505" : "rgba(0,255,110,0.3)",
                  border: `1px solid ${step1Valid ? "#00ff6e" : "rgba(0,255,110,0.1)"}`,
                  boxShadow: step1Valid ? "0 0 16px rgba(0,255,110,0.15)" : "none",
                  cursor: step1Valid ? "pointer" : "not-allowed",
                }}
              >
                configure agent →
              </button>
            </div>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Buyback rate */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-mono tracking-widest" style={{ color: "#444" }}>
                    BUYBACK_RATE
                  </label>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono" style={{ color: "#00ff6e" }}>{form.buybackRate}</span>
                    <span className="text-sm font-mono" style={{ color: "#555" }}>%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={form.buybackRate}
                  onChange={(e) => setForm((f) => ({ ...f, buybackRate: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] font-mono" style={{ color: "#2a2a2a" }}>1%</span>
                  <span className="text-[10px] font-mono" style={{ color: "#2a2a2a" }}>100%</span>
                </div>
                <p className="text-[11px] mt-2 font-mono" style={{ color: "#444" }}>
                  {form.buybackRate === 100
                    ? "// 100% of trading fees → buyback & burn"
                    : `// ${form.buybackRate}% of fees routed to buyback agent`}
                </p>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest mb-3" style={{ color: "#444" }}>
                  EXECUTION_INTERVAL
                </label>
                <TimeframeSelector value={form.buybackTimeframe}
                  onChange={(v) => setForm((f) => ({ ...f, buybackTimeframe: v }))} />
              </div>

              {/* Lock notice */}
              <div className="px-3.5 py-3 rounded-lg flex items-start gap-2.5"
                style={{ background: "rgba(0,255,110,0.04)", border: "1px solid rgba(0,255,110,0.12)" }}>
                <Lock size={12} className="mt-0.5 shrink-0" style={{ color: "#00cc57" }} />
                <p className="text-[11px] leading-relaxed font-mono" style={{ color: "#555" }}>
                  // Settings will be permanently locked on-chain after deploy.
                  No party can modify the protocol after confirmation.
                </p>
              </div>

              {error && (
                <p className="text-xs font-mono px-3 py-2 rounded-lg"
                  style={{ color: "#ff4455", background: "rgba(255,68,85,0.06)", border: "1px solid rgba(255,68,85,0.15)" }}>
                  error: {error}
                </p>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg text-xs font-mono transition-all"
                  style={{ color: "#555", background: "transparent", border: "1px solid #1e1e1e" }}
                >
                  ← back
                </button>
                <button
                  onClick={connected ? () => setLockModalOpen(true) : () => setVisible(true)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "#00ff6e",
                    color: "#050505",
                    border: "1px solid #00ff6e",
                    boxShadow: "0 0 20px rgba(0,255,110,0.2)",
                  }}
                >
                  <Lock size={13} />
                  {connected ? "deploy & lock" : "connect wallet"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LockModal
        open={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        onConfirm={handleLaunch}
        tokenName={form.name || "token"}
        buybackRate={form.buybackRate}
        buybackTimeframe={form.buybackTimeframe}
        loading={launching}
      />
    </div>
  );
}
