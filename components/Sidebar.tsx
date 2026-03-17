"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Rocket, BookOpen, Twitter, Wallet } from "lucide-react";
import { getStoredWallet } from "@/lib/wallet";
import WalletModal from "./wallet/WalletModal";

const NAV = [
  { href: "/",       icon: LayoutGrid, label: "Feed"   },
  { href: "/launch", icon: Rocket,     label: "Create" },
  { href: "/docs",   icon: BookOpen,   label: "Docs"   },
];

function shortAddr(a: string) {
  return `${a.slice(0, 4)}…${a.slice(-4)}`;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAddr, setWalletAddr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = getStoredWallet();
      if (w) setWalletAddr(w.address);
    }
  }, [walletOpen]);

  return (
    <>
      <aside
        className="fixed left-0 top-0 bottom-0 w-[200px] z-40 flex flex-col"
        style={{ background: "var(--bg)", borderRight: "1px solid var(--line)" }}
      >
        {/* Logo */}
        <div className="px-5 h-14 flex items-center" style={{ borderBottom: "1px solid var(--line)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--green)" }} />
            <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text)" }}>burnpad</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors"
                style={{
                  color: active ? "var(--text)" : "var(--text3)",
                  background: active ? "var(--bg3)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-3 space-y-1" style={{ borderTop: "1px solid var(--line)" }}>
          <a
            href="https://twitter.com/burnpad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors"
            style={{ color: "var(--text3)" }}
          >
            <Twitter size={14} />
            Community
          </a>

          <button
            onClick={() => setWalletOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
            style={{
              color: walletAddr ? "var(--green)" : "var(--text2)",
              background: walletAddr ? "rgba(0,232,124,0.06)" : "var(--bg3)",
              border: `1px solid ${walletAddr ? "rgba(0,232,124,0.12)" : "var(--line)"}`,
            }}
          >
            <Wallet size={13} />
            <span className="flex-1 truncate font-mono">
              {walletAddr ? shortAddr(walletAddr) : "Create wallet"}
            </span>
          </button>
        </div>
      </aside>

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onCreated={(addr) => { setWalletAddr(addr); setWalletOpen(false); }}
      />
    </>
  );
}
