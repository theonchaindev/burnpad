"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Twitter, Globe, Lock, ChevronDown, ChevronUp, Info, Droplets } from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";
import LockModal from "./LockModal";
import { hasWallet } from "@/lib/wallet";
import type { BuybackTimeframe, LaunchFormData } from "@/lib/types";

const PLATFORM_FEE_SOL = 0.02;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  fontSize: 13,
  background: "var(--bg3)",
  border: "1px solid var(--line2)",
  color: "var(--text)",
  outline: "none",
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px]" style={{ color: "var(--text3)" }}>{hint}</p>}
    </div>
  );
}

export default function LaunchForm() {
  const router = useRouter();
  const walletExists = typeof window !== "undefined" && hasWallet();

  const [form, setForm] = useState<LaunchFormData>({
    name: "", ticker: "", description: "",
    imageFile: null, twitter: "", telegram: "", website: "",
    buybackRate: 100, buybackTimeframe: "5m",
    createLP: false, lpSolAmount: 1,
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
      fd.append("createLP", String(form.createLP));
      fd.append("lpSolAmount", String(form.lpSolAmount));
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
  const totalCost = PLATFORM_FEE_SOL + (form.createLP ? form.lpSolAmount : 0);

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">

      {/* Image + name row */}
      <div className="flex gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-28 h-28 rounded-xl flex-shrink-0 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
          style={{
            background: "var(--bg3)",
            border: imagePreview ? "1px solid var(--line2)" : "2px dashed var(--line2)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--green-bdr)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = imagePreview ? "var(--line2)" : "var(--line2)"; }}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload size={20} style={{ color: "var(--text3)" }} />
              <span className="text-[10px] text-center leading-tight" style={{ color: "var(--text3)" }}>
                image /<br />gif
              </span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,image/gif" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />

        <div className="flex-1 space-y-3">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Token name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
            />
          </Field>
          <Field label="Ticker">
            <input
              value={form.ticker}
              onChange={(e) => setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase().slice(0, 10) }))}
              placeholder="TICKER"
              style={{ ...inputStyle, fontFamily: "var(--font-geist-mono)", textTransform: "uppercase" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
            />
          </Field>
        </div>
      </div>

      {/* Description */}
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe your token and why the buyback & burn matters..."
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
        />
      </Field>

      {/* More options toggle */}
      <button
        type="button"
        onClick={() => setShowLinks(!showLinks)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors"
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--line)",
          color: showLinks ? "var(--text2)" : "var(--text3)",
        }}
      >
        <span>Show more options</span>
        {showLinks ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {showLinks && (
        <div className="space-y-3 rounded-xl p-4" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
          <Field label="Twitter / X">
            <div className="relative">
              <Twitter size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
              <input
                value={form.twitter}
                onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                placeholder="https://twitter.com/yourtoken"
                style={{ ...inputStyle, paddingLeft: 32 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
              />
            </div>
          </Field>
          <Field label="Telegram">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text3)" }}>✈</span>
              <input
                value={form.telegram}
                onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
                placeholder="https://t.me/yourtoken"
                style={{ ...inputStyle, paddingLeft: 32 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
              />
            </div>
          </Field>
          <Field label="Website">
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://yourtoken.com"
                style={{ ...inputStyle, paddingLeft: 32 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green-bdr)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line2)")}
              />
            </div>
          </Field>
        </div>
      )}

      {/* Buyback agent config section */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: "var(--green-bdr)" }} />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
          style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)", color: "var(--green)" }}>
          <Lock size={9} />
          BUYBACK AGENT CONFIG
        </div>
        <div className="flex-1 h-px" style={{ background: "var(--green-bdr)" }} />
      </div>

      {/* Buyback rate */}
      <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text)" }}>Buyback rate</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text3)" }}>% of trading fees routed to buyback & burn</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono" style={{ color: "var(--green)" }}>{form.buybackRate}</span>
            <span className="text-sm font-mono" style={{ color: "var(--text3)" }}>%</span>
          </div>
        </div>
        <input
          type="range" min={1} max={100} value={form.buybackRate}
          onChange={(e) => setForm((f) => ({ ...f, buybackRate: Number(e.target.value) }))}
          className="w-full accent-[var(--green)]"
        />
        <div className="flex justify-between text-[10px] font-mono" style={{ color: "var(--text3)" }}>
          <span>1%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Execution interval */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text2)" }}>Execution interval</p>
        <TimeframeSelector
          value={form.buybackTimeframe}
          onChange={(v) => setForm((f) => ({ ...f, buybackTimeframe: v }))}
        />
      </div>

      {/* LP creation section */}
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: "var(--line2)" }} />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
          style={{ background: "var(--bg3)", border: "1px solid var(--line2)", color: "var(--text3)" }}>
          <Droplets size={9} />
          LIQUIDITY
        </div>
        <div className="flex-1 h-px" style={{ background: "var(--line2)" }} />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
        {/* Toggle header */}
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, createLP: !f.createLP }))}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ background: form.createLP ? "var(--bg2)" : "var(--bg2)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: form.createLP ? "var(--green-bg)" : "var(--bg3)",
                border: `1px solid ${form.createLP ? "var(--green-bdr)" : "var(--line)"}`,
              }}>
              <Droplets size={14} style={{ color: form.createLP ? "var(--green)" : "var(--text3)" }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Create liquidity pool</p>
              <p className="text-[11px]" style={{ color: "var(--text3)" }}>Add SOL to Pump Swap AMM at launch</p>
            </div>
          </div>
          {/* Toggle switch */}
          <div
            className="w-10 h-5 rounded-full relative transition-all"
            style={{ background: form.createLP ? "var(--green)" : "var(--bg4)", border: "1px solid var(--line2)" }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
              style={{
                background: form.createLP ? "#06060c" : "var(--text3)",
                left: form.createLP ? "calc(100% - 18px)" : "2px",
              }}
            />
          </div>
        </button>

        {/* LP amount input (expanded when createLP is true) */}
        {form.createLP && (
          <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="pt-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "var(--text2)" }}>SOL to add to pool</label>
                <span className="text-xs font-mono font-bold" style={{ color: "var(--green)" }}>
                  {form.lpSolAmount} SOL
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={form.lpSolAmount}
                onChange={(e) => setForm((f) => ({ ...f, lpSolAmount: Number(e.target.value) }))}
                className="w-full accent-[var(--green)]"
              />
              <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: "var(--text3)" }}>
                <span>0.1 SOL</span>
                <span>5 SOL</span>
                <span>10 SOL</span>
              </div>
            </div>
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
              style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}>
              <Info size={12} className="mt-0.5 shrink-0" style={{ color: "var(--text3)" }} />
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text3)" }}>
                SOL is deposited into <span style={{ color: "var(--text2)" }}>Pump Swap</span> (pump.fun&apos;s native AMM) at token launch. Paired against your full token supply.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lock warning */}
      <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg"
        style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
        <Info size={13} className="mt-0.5 shrink-0" style={{ color: "var(--green)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text3)" }}>
          Buyback rate and interval are <span style={{ color: "var(--text)" }}>permanently locked on-chain</span> at deployment.
          No one — including you — can modify these settings after launch.
        </p>
      </div>

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg font-mono"
          style={{ color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(255,68,102,0.12)" }}>
          {error}
        </p>
      )}

      {/* Cost + submit */}
      <div className="space-y-2">
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <span className="text-[11px]" style={{ color: "var(--text3)" }}>Platform fee</span>
            <span className="text-[11px] font-mono" style={{ color: "var(--text2)" }}>{PLATFORM_FEE_SOL} SOL</span>
          </div>
          {form.createLP && (
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-[11px]" style={{ color: "var(--text3)" }}>LP deposit</span>
              <span className="text-[11px] font-mono" style={{ color: "var(--text2)" }}>{form.lpSolAmount} SOL</span>
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-2" style={{ background: "var(--bg3)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>Total cost</span>
            <span className="text-xs font-mono font-bold" style={{ color: "var(--green)" }}>{totalCost.toFixed(2)} SOL</span>
          </div>
        </div>

        <button
          onClick={walletExists ? () => setLockModalOpen(true) : undefined}
          disabled={!walletExists || !valid}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={{
            background: walletExists && valid ? "var(--green)" : "var(--green-bg)",
            color: walletExists && valid ? "#06060c" : "rgba(0,255,148,0.3)",
            boxShadow: walletExists && valid ? "0 0 24px rgba(0,255,148,0.15)" : "none",
            border: `1px solid ${walletExists && valid ? "var(--green)" : "var(--green-bdr)"}`,
            cursor: walletExists && valid ? "pointer" : "not-allowed",
          }}
        >
          <Lock size={14} />
          {walletExists ? "Create coin" : "Create a wallet to deploy"}
        </button>

        {walletExists && (
          <p className="text-center text-[11px]" style={{ color: "var(--text3)" }}>
            costs {totalCost.toFixed(2)} SOL · settings locked forever
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
