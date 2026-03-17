"use client";

import { useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { Upload, Twitter, Globe, Lock, ChevronDown, ChevronUp, Info } from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";
import LockModal from "./LockModal";
import type { BuybackTimeframe, LaunchFormData } from "@/lib/types";

const PLATFORM_FEE_SOL = 0.02;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-[#e8e8e8] mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px]" style={{ color: "#555" }}>{hint}</p>}
    </div>
  );
}

const baseInput = "w-full px-3 py-2.5 rounded-lg text-sm transition-colors bg-[#0d0d0d] border border-[#242424] text-[#e8e8e8] placeholder:text-[#333] focus:border-[rgba(0,255,110,0.3)] focus:outline-none";

export default function LaunchForm() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const [form, setForm] = useState<LaunchFormData>({
    name: "", ticker: "", description: "",
    imageFile: null, twitter: "", telegram: "", website: "",
    buybackRate: 100, buybackTimeframe: "instant",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showLinks, setShowLinks] = useState(false);
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
      fd.append("twitter", form.twitter);
      fd.append("telegram", form.telegram);
      fd.append("website", form.website);
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

  const valid = form.name.trim() && form.ticker.trim() && form.description.trim();

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Image + name row — like pump.fun */}
      <div className="flex gap-4">
        {/* Image upload */}
        <div
          onClick={() => fileRef.current?.click()}
          className="w-28 h-28 rounded-xl flex-shrink-0 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed border-[#242424] bg-[#0d0d0d] hover:border-[rgba(0,255,110,0.3)] hover:bg-[rgba(0,255,110,0.03)] overflow-hidden"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload size={20} style={{ color: "#333" }} />
              <span className="text-[10px] text-center leading-tight" style={{ color: "#444" }}>
                image /<br />gif
              </span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,image/gif" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />

        {/* Name + ticker */}
        <div className="flex-1 space-y-3">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Token name"
              className={baseInput}
            />
          </Field>
          <Field label="Ticker">
            <input
              value={form.ticker}
              onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase().slice(0, 10) }))}
              placeholder="TICKER"
              className={`${baseInput} font-mono uppercase`}
            />
          </Field>
        </div>
      </div>

      {/* Description */}
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe your token, its purpose, and why the buyback & burn matters..."
          rows={4}
          className={`${baseInput} resize-none`}
        />
      </Field>

      {/* Optional links toggle */}
      <button
        type="button"
        onClick={() => setShowLinks(!showLinks)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors"
        style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", color: showLinks ? "#e8e8e8" : "#555" }}
      >
        <span>Show more options</span>
        {showLinks ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {showLinks && (
        <div className="space-y-3 rounded-xl p-4" style={{ background: "#090909", border: "1px solid #1a1a1a" }}>
          <Field label="Twitter / X">
            <div className="relative">
              <Twitter size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
              <input
                value={form.twitter}
                onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                placeholder="https://twitter.com/yourtoken"
                className={`${baseInput} pl-8`}
              />
            </div>
          </Field>
          <Field label="Telegram">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#333" }}>✈</span>
              <input
                value={form.telegram}
                onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
                placeholder="https://t.me/yourtoken"
                className={`${baseInput} pl-8`}
              />
            </div>
          </Field>
          <Field label="Website">
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://yourtoken.com"
                className={`${baseInput} pl-8`}
              />
            </div>
          </Field>
        </div>
      )}

      {/* Divider + buyback section */}
      <div className="relative flex items-center gap-3 py-2">
        <div className="flex-1 h-px" style={{ background: "rgba(0,255,110,0.1)" }} />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
          style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.15)", color: "#00cc57" }}>
          <Lock size={9} />
          BUYBACK AGENT CONFIG
        </div>
        <div className="flex-1 h-px" style={{ background: "rgba(0,255,110,0.1)" }} />
      </div>

      {/* Buyback rate */}
      <div className="rounded-xl p-4 space-y-3" style={{ background: "#080d0a", border: "1px solid rgba(0,255,110,0.1)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#e8e8e8]">Buyback rate</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#555" }}>% of trading fees routed to buyback & burn</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono" style={{ color: "#00ff6e" }}>{form.buybackRate}</span>
            <span className="text-sm font-mono" style={{ color: "#444" }}>%</span>
          </div>
        </div>
        <input
          type="range" min={1} max={100} value={form.buybackRate}
          onChange={(e) => setForm((f) => ({ ...f, buybackRate: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-mono" style={{ color: "#2a2a2a" }}>
          <span>1%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Execution interval */}
      <div>
        <p className="text-xs font-medium text-[#e8e8e8] mb-2">Execution interval</p>
        <TimeframeSelector
          value={form.buybackTimeframe}
          onChange={(v) => setForm((f) => ({ ...f, buybackTimeframe: v }))}
        />
      </div>

      {/* Lock warning */}
      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg"
        style={{ background: "rgba(0,255,110,0.04)", border: "1px solid rgba(0,255,110,0.1)" }}>
        <Info size={13} className="mt-0.5 shrink-0" style={{ color: "#00cc57" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "#555" }}>
          Buyback rate and interval are <span className="text-[#e8e8e8]">permanently locked on-chain</span> at deployment.
          No one — including you — can modify these settings after launch.
        </p>
      </div>

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg font-mono"
          style={{ color: "#ff4455", background: "rgba(255,68,85,0.05)", border: "1px solid rgba(255,68,85,0.12)" }}>
          {error}
        </p>
      )}

      {/* Cost + submit */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs">
          <span style={{ color: "#555" }}>Platform fee</span>
          <span className="font-mono" style={{ color: "#999" }}>{PLATFORM_FEE_SOL} SOL</span>
        </div>
        <button
          onClick={connected ? () => setLockModalOpen(true) : () => setVisible(true)}
          disabled={!valid && connected}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={{
            background: valid || !connected ? "#00ff6e" : "rgba(0,255,110,0.15)",
            color: valid || !connected ? "#050505" : "rgba(0,255,110,0.3)",
            boxShadow: valid || !connected ? "0 0 24px rgba(0,255,110,0.2)" : "none",
            cursor: valid || !connected ? "pointer" : "not-allowed",
          }}
        >
          {connected ? (
            <>
              <Lock size={14} />
              Create coin
            </>
          ) : "Connect wallet to create coin"}
        </button>
        {connected && (
          <p className="text-center text-[11px]" style={{ color: "#333" }}>
            costs {PLATFORM_FEE_SOL} SOL · settings will be locked forever
          </p>
        )}
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
