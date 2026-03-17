"use client";

import { useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { Upload, ImageIcon, Flame, Info, ChevronRight, Lock } from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";
import LockModal from "./LockModal";
import type { BuybackTimeframe, LaunchFormData } from "@/lib/types";

export default function LaunchForm() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const [form, setForm] = useState<LaunchFormData>({
    name: "",
    ticker: "",
    description: "",
    imageFile: null,
    buybackRate: 100,
    buybackTimeframe: "instant",
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

      if (!res.ok) throw new Error(data.error || "Launch failed");
      router.push(`/token/${data.mint}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Launch failed");
    } finally {
      setLaunching(false);
      setLockModalOpen(false);
    }
  }

  const step1Valid = form.name.trim() && form.ticker.trim() && form.description.trim();

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s ? "bg-orange-500 text-white fire-glow" :
              s < step ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
              "bg-[#1a1a1a] text-[#555] border border-[#222]"
            }`}>
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-[#f5f5f5]" : "text-[#555]"}`}>
              {s === 1 ? "Token details" : "Buyback config"}
            </span>
            {s < 2 && <ChevronRight size={14} className="text-[#333]" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] overflow-hidden">
        <div className="p-6">

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                  Token Image
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-36 rounded-xl border-2 border-dashed border-[#222] bg-[#111] flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center mb-2 group-hover:bg-orange-500/10 transition-colors">
                        <ImageIcon size={18} className="text-[#555] group-hover:text-orange-400 transition-colors" />
                      </div>
                      <p className="text-sm text-[#555]">Click to upload image</p>
                      <p className="text-xs text-[#333] mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                  Token Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. SafeMoon"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-[#f5f5f5] text-sm placeholder:text-[#333] focus:border-orange-500/50 transition-colors"
                />
              </div>

              {/* Ticker */}
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                  Ticker Symbol <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.ticker}
                  onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase().slice(0, 10) }))}
                  placeholder="e.g. SFM"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-[#f5f5f5] text-sm font-mono placeholder:text-[#333] focus:border-orange-500/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Tell the community about your token..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#111] border border-[#222] text-[#f5f5f5] text-sm placeholder:text-[#333] focus:border-orange-500/50 transition-colors resize-none"
                />
              </div>

              <button
                disabled={!step1Valid}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-orange-400 hover:to-orange-500 transition-all fire-glow"
              >
                Continue to Buyback Config →
              </button>
            </div>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Buyback rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#888] uppercase tracking-wider">
                    Buyback Rate
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold gradient-text">{form.buybackRate}%</span>
                    <span className="text-xs text-[#555]">of trading fees</span>
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
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#333]">1%</span>
                  <span className="text-xs text-[#333]">100%</span>
                </div>
                <p className="text-xs text-[#555] mt-2">
                  {form.buybackRate === 100
                    ? "All trading fees go directly to buyback & burn. Maximum trust signal."
                    : `${form.buybackRate}% of trading fees automatically go to buyback & burn.`}
                </p>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
                  Buyback Frequency
                </label>
                <TimeframeSelector
                  value={form.buybackTimeframe}
                  onChange={(v) => setForm((f) => ({ ...f, buybackTimeframe: v }))}
                />
              </div>

              {/* Lock notice */}
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 flex items-start gap-3">
                <Lock size={15} className="text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-300 mb-1">Settings will be locked forever</p>
                  <p className="text-xs text-[#888] leading-relaxed">
                    When you launch, you&apos;ll be asked to confirm a permanent lock. Once confirmed,
                    these settings can never be changed, giving your community 100% assurance.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-[#222] text-sm text-[#888] hover:text-[#f5f5f5] hover:border-[#333] transition-all"
                >
                  Back
                </button>
                <button
                  onClick={connected ? () => setLockModalOpen(true) : () => setVisible(true)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-orange-400 hover:to-orange-500 transition-all fire-glow"
                >
                  <Flame size={15} />
                  {connected ? "Launch & Lock" : "Connect Wallet to Launch"}
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
        tokenName={form.name || "your token"}
        buybackRate={form.buybackRate}
        buybackTimeframe={form.buybackTimeframe}
        loading={launching}
      />
    </div>
  );
}
