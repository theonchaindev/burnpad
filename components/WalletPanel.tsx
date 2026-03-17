"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Check, Copy, Pencil, Trash2, Eye, EyeOff, Wallet } from "lucide-react";
import {
  getWallets, createAgentWallet, renameWallet, removeWallet,
  setActiveWallet, getActiveWallet,
} from "@/lib/wallet";
import type { AgentWallet } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onChange: () => void; // called whenever wallet list mutates
}

type Mode = "list" | "create";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function WalletRow({
  wallet, active, onSelect, onRemove, onRename,
}: {
  wallet: AgentWallet;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(wallet.name);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function submitRename() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== wallet.name) onRename(trimmed);
    setEditing(false);
  }

  function copy() {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        background: active ? "rgba(0,232,124,0.04)" : "transparent",
        borderLeft: `2px solid ${active ? "var(--green)" : "transparent"}`,
      }}
    >
      {/* Clickable area — select wallet */}
      <button onClick={onSelect} className="flex-1 text-left min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setEditing(false); }}
            className="w-full text-sm font-medium bg-transparent outline-none"
            style={{ color: "var(--text)", borderBottom: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="text-sm font-medium truncate" style={{ color: active ? "var(--green)" : "var(--text)" }}>
            {wallet.name}
          </p>
        )}
        <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text3)" }}>
          {shortAddr(wallet.address)}
        </p>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={copy} className="p-1.5 rounded transition-colors" style={{ color: "var(--text3)" }}>
          {copied ? <Check size={12} style={{ color: "var(--green)" }} /> : <Copy size={12} />}
        </button>
        <button onClick={() => { setEditing(true); setDraft(wallet.name); }}
          className="p-1.5 rounded transition-colors" style={{ color: "var(--text3)" }}>
          <Pencil size={12} />
        </button>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button onClick={onRemove}
              className="px-2 py-1 rounded text-[11px] font-medium transition-colors"
              style={{ background: "rgba(240,62,90,0.1)", color: "var(--red)", border: "1px solid rgba(240,62,90,0.2)" }}>
              Delete
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="p-1.5 rounded transition-colors" style={{ color: "var(--text3)" }}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded transition-colors" style={{ color: "var(--text3)" }}>
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

function CreateWalletForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13,
    background: "var(--bg3)", border: "1px solid var(--line)",
    color: "var(--text)", outline: "none",
  };

  async function handleCreate() {
    if (!password || password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError("");
    try {
      await createAgentWallet(password, name.trim() || undefined);
      onCreated();
    } catch {
      setError("Failed to create wallet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid var(--line)" }}>
      <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>New wallet</p>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Wallet name (optional)"
        style={inp}
        onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.3)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
      />

      <div className="relative">
        <input type={showPw ? "text" : "password"} value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)"
          style={inp}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.3)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
        />
        <button type="button" onClick={() => setShowPw(!showPw)}
          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }}>
          {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>

      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm password" style={inp}
        onFocus={(e) => (e.target.style.borderColor = "rgba(0,232,124,0.3)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
      />

      {error && (
        <p className="text-[11px] px-3 py-2 rounded-lg"
          style={{ color: "var(--red)", background: "rgba(240,62,90,0.06)", border: "1px solid rgba(240,62,90,0.12)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs transition-colors"
          style={{ color: "var(--text3)", border: "1px solid var(--line)" }}>
          Cancel
        </button>
        <button onClick={handleCreate} disabled={loading || !password || !confirm}
          className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
          style={{
            background: password && confirm && !loading ? "var(--green)" : "var(--bg3)",
            color: password && confirm && !loading ? "#000" : "var(--text3)",
            border: `1px solid ${password && confirm && !loading ? "var(--green)" : "var(--line)"}`,
            cursor: loading || !password || !confirm ? "not-allowed" : "pointer",
          }}>
          {loading
            ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : "Generate wallet"}
        </button>
      </div>

      <p className="text-[11px]" style={{ color: "var(--text3)" }}>
        Private key is encrypted locally and cannot be exported.
      </p>
    </div>
  );
}

export default function WalletPanel({ open, onClose, onChange }: Props) {
  const [wallets, setWallets] = useState<AgentWallet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("list");

  function refresh() {
    setWallets(getWallets());
    setActiveId(getActiveWallet()?.id ?? null);
  }

  useEffect(() => { if (open) { refresh(); setMode("list"); } }, [open]);

  function handleSelect(id: string) {
    setActiveWallet(id);
    setActiveId(id);
    onChange();
  }

  function handleRemove(id: string) {
    removeWallet(id);
    refresh();
    onChange();
  }

  function handleRename(id: string, name: string) {
    renameWallet(id, name);
    refresh();
    onChange();
  }

  function handleCreated() {
    refresh();
    onChange();
    setMode("list");
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-[90] bg-black/40" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[100] flex flex-col"
        style={{
          width: 320,
          background: "var(--bg2)",
          borderLeft: "1px solid var(--line)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.22s ease",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14"
          style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2">
            <Wallet size={14} style={{ color: "var(--text2)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Wallets</span>
            {wallets.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ background: "var(--bg3)", color: "var(--text3)" }}>
                {wallets.length}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ color: "var(--text3)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Wallet list */}
        <div className="flex-1 overflow-y-auto">
          {wallets.length === 0 && mode === "list" ? (
            <div className="px-4 py-8 text-center space-y-3">
              <p className="text-sm" style={{ color: "var(--text3)" }}>No wallets yet</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text3)" }}>
                Create an agent wallet to deploy coins. Your private key is encrypted locally and cannot be exported.
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--line)" }}>
              {wallets.map((w) => (
                <WalletRow
                  key={w.id}
                  wallet={w}
                  active={w.id === activeId}
                  onSelect={() => handleSelect(w.id)}
                  onRemove={() => handleRemove(w.id)}
                  onRename={(name) => handleRename(w.id, name)}
                />
              ))}
            </div>
          )}

          {mode === "create" && (
            <CreateWalletForm
              onCreated={handleCreated}
              onCancel={() => setMode("list")}
            />
          )}
        </div>

        {/* Footer */}
        {mode === "list" && (
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
            <button
              onClick={() => setMode("create")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--line)",
                color: "var(--text2)",
              }}
            >
              <Plus size={14} />
              New wallet
            </button>
          </div>
        )}
      </div>
    </>
  );
}
