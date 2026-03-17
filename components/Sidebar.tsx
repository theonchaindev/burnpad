"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid, Rocket, BookOpen, Twitter, Wallet, ChevronRight,
} from "lucide-react";
import { getStoredWallet, hasWallet } from "@/lib/wallet";
import WalletModal from "./wallet/WalletModal";

const NAV = [
  { href: "/",        icon: LayoutGrid, label: "Feed"    },
  { href: "/launch",  icon: Rocket,     label: "Create"  },
  { href: "/docs",    icon: BookOpen,   label: "Docs"    },
];

function shortAddr(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
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
      <aside className="fixed left-0 top-0 bottom-0 w-[200px] z-40 flex flex-col"
        style={{ background: "var(--bg2)", borderRight: "1px solid var(--line)" }}>

        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--line)" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green-bdr)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>
              burn<span style={{ color: "var(--green)" }}>pad</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  color: active ? "var(--text)" : "var(--text3)",
                  background: active ? "var(--bg4)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text3)"; }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-3 space-y-1 border-t pt-3" style={{ borderColor: "var(--line)" }}>
          {/* X / Twitter */}
          <a
            href="https://twitter.com/burnpad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--text3)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text2)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text3)")}
          >
            <Twitter size={15} />
            Community
          </a>

          {/* Wallet */}
          <button
            onClick={() => setWalletOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
            style={{
              background: walletAddr ? "var(--green-bg)" : "var(--bg4)",
              border: `1px solid ${walletAddr ? "var(--green-bdr)" : "var(--line)"}`,
              color: walletAddr ? "var(--green)" : "var(--text2)",
            }}
          >
            <Wallet size={14} />
            <span className="flex-1 truncate text-xs">
              {walletAddr ? shortAddr(walletAddr) : "Create wallet"}
            </span>
            <ChevronRight size={11} style={{ color: "var(--text3)" }} />
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
