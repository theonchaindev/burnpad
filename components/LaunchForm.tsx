"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Twitter, Globe, Lock, ChevronDown, ChevronUp, Droplets, Copy, Check,
} from "lucide-react";
import TimeframeSelector from "./TimeframeSelector";
import LockModal from "./LockModal";
import type { BuybackTimeframe, LaunchFormData } from "@/lib/types";

const PLATFORM_FEE_SOL = 0.02;

const inp: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  fontSize: 13,
  background: "var(--bg3)",
  border: "1px solid var(--line)",
  color: "var(--text)",
  outline: "none",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text2)" }}>
      {children}
    </label>
  );
}

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "rgba(0,232,124,0.4)";
}
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "var(--line)";
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
      <span className="text-xs font-medium" style={{ color: "var(--text3)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
    </div>
  );
}

export default function LaunchForm() {
  const router = useRouter();

  const [form, setForm] = useState<LaunchFormData>({
    name: "", ticker: "", description: "",
    imageFile: null, twitter: "", telegram: "", website: "",
    buybackRate: 100, buybackTimeframe: "5m",
    createLP: false, lpSolAmount: 1, lpFeeShare: 0,
  });
  const [imagePreview, setImagePreview]   = useState<string | null>(null);
  const [showLinks, setShowLinks]         = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [launching, setLaunching]         = useState(false);
  const [error, setError]                 = useState("");
  const [agentAddress, setAgentAddress]   = useState<string | null>(null);
  const [copied, setCopied]               = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Generate a server-side agent wallet on mount
  useEffect(() => {
    fetch("/api/agent/create", { method: "POST" })
      .then((r) => r.json())
      .then((d) => { if (d.address) setAgentAddress(d.address); })
      .catch(() => {/* silently ignore — server may not be configured yet */});
  }, []);

  function copyAddress() {
    if (!agentAddress) return;
    navigator.clipboard.writeText(agentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
      fd.append("name",            form.name);
      fd.append("ticker",          form.ticker);
      fd.append("description",     form.description);
      fd.append("buybackRate",     String(form.buybackRate));
      fd.append("buybackTimeframe", form.buybackTimeframe);
      fd.append("twitter",         form.twitter);
      fd.append("telegram",        form.telegram);
      fd.append("website",         form.website);
      fd.append("createLP",        String(form.createLP));
      fd.append("lpSolAmount",     String(form.lpSolAmount));
      fd.append("lpFeeShare",      String(form.lpFeeShare));
      if (agentAddress) fd.append("agentAddress", agentAddress);
      if (form.imageFile) fd.append("image", form.imageFile);

      const res  = await fetch("/api/launch", { method: "POST", body: fd });
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

  const valid    = form.name.trim() && form.ticker.trim() && form.description.trim();
  const totalCost = PLATFORM_FEE_SOL + (form.createLP ? form.lpSolAmount : 0);
  const burnPct  = form.createLP ? form.buybackRate - form.lpFeeShare : form.buybackRate;
  const lpPct    = form.createLP ? form.lpFeeShare : 0;
  const creatorPct = 100 - form.buybackRate;

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">

      {/* Agent wallet funding notice */}
      {agentAddress && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg2)", border: "1px solid var(--line)" }}>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text)" }}>
              Fund your agent wallet
            </p>
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>
              Send at least <span style={{ color: "var(--text2)" }}>{totalCost.toFixed(2)} SOL</span> to this address before launching.
              The agent will use it for the creation fee and future buybacks.
            </p>
          </div>
          <button
            onClick={copyAddress}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left"
            style={{ background: "var(--bg3)", border: "1px solid var(--line)" }}
          >
            <span className="text-[12px] font-mono truncate" style={{ color: "var(--text2)" }}>
              {agentAddress}
            </span>
            <span className="shrink-0 ml-2" style={{ color: copied ? "var(--green)" : "var(--text3)" }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </span>
          </button>
        </div>
      )}

      {/* Image + name */}
      <div className="flex gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-24 h-24 rounded-xl flex-shrink-0 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
          style={{
            background: "var(--bg3)",
            border: imagePreview ? "1px solid var(--line)" : "2px dashed var(--line)",
          }}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload size={18} style={{ color: "var(--text3)" }} />
              <span className="text-[10px] text-center" style={{ color: "var(--text3)" }}>image/gif</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,image/gif" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />

        <div className="flex-1 space-y-3">
          <div>
            <Label>Name</Label>
            <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Token name" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <Label>Ticker</Label>
            <input value={form.ticker}
              onChange={(e) => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase().slice(0, 10) }))}
              placeholder="TICKER" style={{ ...inp, fontFamily: "var(--font-geist-mono)", textTransform: "uppercase" }}
              onFocus={focus} onBlur={blur} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe your token and why the buyback & burn matters..."
          rows={3} style={{ ...inp, resize: "none" }}
          onFocus={focus} onBlur={blur} />
      </div>

      {/* Social links toggle */}
      <button type="button" onClick={() => setShowLinks(!showLinks)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors"
        style={{ background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--text3)" }}>
        <span>Social links</span>
        {showLinks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {showLinks && (
        <div className="space-y-3 px-1">
          <div>
            <Label>Twitter / X</Label>
            <div className="relative">
              <Twitter size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
              <input value={form.twitter} onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))}
                placeholder="https://twitter.com/yourtoken"
                style={{ ...inp, paddingLeft: 32 }} onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <Label>Telegram</Label>
            <input value={form.telegram} onChange={(e) => setForm(f => ({ ...f, telegram: e.target.value }))}
              placeholder="https://t.me/yourtoken" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <Label>Website</Label>
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
              <input value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://yourtoken.com"
                style={{ ...inp, paddingLeft: 32 }} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>
      )}

      <Divider label="Buyback agent" />

      {/* Buyback rate */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label>Buyback rate</Label>
            <p className="text-[11px]" style={{ color: "var(--text3)" }}>% of trading fees used by the agent</p>
          </div>
          <span className="text-2xl font-bold font-mono" style={{ color: "var(--green)" }}>{form.buybackRate}%</span>
        </div>
        <input type="range" min={form.createLP ? form.lpFeeShare + 1 : 1} max={100} value={form.buybackRate}
          onChange={(e) => setForm(f => ({ ...f, buybackRate: Number(e.target.value) }))}
          className="w-full" />
        <div className="flex justify-between text-[11px] font-mono mt-1.5" style={{ color: "var(--text3)" }}>
          <span>1%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Execution interval */}
      <div>
        <Label>Execution interval</Label>
        <TimeframeSelector value={form.buybackTimeframe as BuybackTimeframe}
          onChange={(v) => setForm(f => ({ ...f, buybackTimeframe: v }))} />
      </div>

      <Divider label="Liquidity pool" />

      {/* LP toggle */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
        <button type="button" onClick={() => setForm(f => ({ ...f, createLP: !f.createLP, lpFeeShare: 0 }))}
          className="w-full flex items-center justify-between p-4 transition-colors"
          style={{ background: "var(--bg2)" }}>
          <div className="flex items-center gap-3">
            <Droplets size={16} style={{ color: form.createLP ? "var(--green)" : "var(--text3)" }} />
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Create liquidity pool</p>
              <p className="text-[11px]" style={{ color: "var(--text3)" }}>Add initial SOL to Pump Swap at launch</p>
            </div>
          </div>
          <div className="w-9 h-5 rounded-full relative transition-all shrink-0"
            style={{ background: form.createLP ? "var(--green)" : "var(--bg3)", border: "1px solid var(--line)" }}>
            <div className="absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all"
              style={{ background: form.createLP ? "#000" : "var(--text3)", left: form.createLP ? "calc(100% - 17px)" : "3px" }} />
          </div>
        </button>

        {form.createLP && (
          <div className="px-4 pb-5 space-y-5" style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--text2)" }}>SOL to deposit</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "var(--text)" }}>{form.lpSolAmount} SOL</span>
              </div>
              <input type="range" min={0.1} max={10} step={0.1} value={form.lpSolAmount}
                onChange={(e) => setForm(f => ({ ...f, lpSolAmount: Number(e.target.value) }))}
                className="w-full" />
              <div className="flex justify-between text-[11px] font-mono mt-1.5" style={{ color: "var(--text3)" }}>
                <span>0.1</span><span>5</span><span>10 SOL</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: "var(--text2)" }}>Fee split</span>
                <span className="text-[11px]" style={{ color: "var(--text3)" }}>
                  of your {form.buybackRate}% fee allocation
                </span>
              </div>
              <div className="flex items-center gap-0 h-7 rounded-lg overflow-hidden mb-2.5"
                style={{ border: "1px solid var(--line)" }}>
                <div className="flex items-center justify-center h-full text-[11px] font-medium transition-all"
                  style={{
                    width: `${burnPct}%`,
                    background: burnPct > 0 ? "rgba(0,232,124,0.12)" : "transparent",
                    color: "var(--green)",
                    minWidth: burnPct > 0 ? 48 : 0,
                  }}>
                  {burnPct > 0 && `${burnPct}% burn`}
                </div>
                {lpPct > 0 && (
                  <div className="flex items-center justify-center h-full text-[11px] font-medium transition-all"
                    style={{
                      width: `${lpPct}%`,
                      background: "rgba(96,165,250,0.1)",
                      color: "#60a5fa",
                      borderLeft: "1px solid var(--line)",
                      minWidth: 48,
                    }}>
                    {lpPct}% LP
                  </div>
                )}
              </div>
              <input type="range" min={0} max={Math.floor(form.buybackRate / 2)} value={form.lpFeeShare}
                onChange={(e) => setForm(f => ({ ...f, lpFeeShare: Number(e.target.value) }))}
                className="w-full" />
              <div className="flex justify-between text-[11px] font-mono mt-1.5" style={{ color: "var(--text3)" }}>
                <span>All burn</span>
                <span>50 / 50</span>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
              {[
                { label: "Buyback & burn", value: `${burnPct}%`, color: "var(--green)" },
                { label: "LP restocking",  value: `${lpPct}%`,  color: "#60a5fa" },
                { label: "Creator",        value: `${creatorPct}%`, color: "var(--text2)" },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between px-3 py-2"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none", background: "var(--bg3)" }}>
                  <span className="text-[12px]" style={{ color: "var(--text3)" }}>{row.label}</span>
                  <span className="text-[12px] font-mono font-medium" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] px-1" style={{ color: "var(--text3)" }}>
        Buyback rate and interval are{" "}
        <span style={{ color: "var(--text2)" }}>permanently locked on-chain</span> at deployment.
        These settings cannot be changed after launch.
      </p>

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "var(--red)", background: "rgba(240,62,90,0.06)", border: "1px solid rgba(240,62,90,0.12)" }}>
          {error}
        </p>
      )}

      {/* Cost summary + CTA */}
      <div className="space-y-2">
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <span className="text-[12px]" style={{ color: "var(--text3)" }}>Platform fee</span>
            <span className="text-[12px] font-mono" style={{ color: "var(--text2)" }}>{PLATFORM_FEE_SOL} SOL</span>
          </div>
          {form.createLP && (
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-[12px]" style={{ color: "var(--text3)" }}>LP deposit</span>
              <span className="text-[12px] font-mono" style={{ color: "var(--text2)" }}>{form.lpSolAmount} SOL</span>
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-2" style={{ background: "var(--bg3)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--text)" }}>Total required</span>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--green)" }}>{totalCost.toFixed(2)} SOL</span>
          </div>
        </div>

        <button
          onClick={valid ? () => setLockModalOpen(true) : undefined}
          disabled={!valid}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          style={{
            background: valid ? "var(--green)" : "var(--bg3)",
            color: valid ? "#000" : "var(--text3)",
            border: `1px solid ${valid ? "var(--green)" : "var(--line)"}`,
            cursor: valid ? "pointer" : "not-allowed",
          }}
        >
          <Lock size={14} />
          Create coin
        </button>
      </div>

      <LockModal
        open={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        onConfirm={handleLaunch}
        tokenName={form.name || "token"}
        buybackRate={form.buybackRate}
        buybackTimeframe={form.buybackTimeframe as BuybackTimeframe}
        loading={launching}
      />
    </div>
  );
}
