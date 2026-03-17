"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/launch", label: "Deploy" },
    { href: "/explore", label: "Agents" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#181818] bg-[#050505]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 h-[52px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-[22px] h-[22px] flex items-center justify-center rounded"
            style={{ background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.2)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2" fill="#00ff6e" />
              <circle cx="6" cy="6" r="4.5" stroke="#00ff6e" strokeWidth="0.75" opacity="0.35" />
              <line x1="6" y1="0" x2="6" y2="1.5" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="12" y1="6" x2="10.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="6" y1="12" x2="6" y2="10.5" stroke="#00ff6e" strokeWidth="1.2" />
              <line x1="0" y1="6" x2="1.5" y2="6" stroke="#00ff6e" strokeWidth="1.2" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#e8e8e8]">
            burn<span style={{ color: "#00ff6e" }}>pad</span>
          </span>
          <span className="hidden sm:block text-[9px] font-mono px-1.5 py-0.5 rounded-sm"
            style={{ color: "#00cc57", background: "rgba(0,255,110,0.07)", border: "1px solid rgba(0,255,110,0.12)" }}>
            AGENT
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  color: active ? "#00ff6e" : "#555",
                  background: active ? "rgba(0,255,110,0.07)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <WalletButton />
      </div>
    </nav>
  );
}
