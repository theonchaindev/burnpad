"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import WalletButton from "./WalletButton";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/launch", label: "Launch" },
    { href: "/explore", label: "Explore" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#080808]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center fire-glow">
            <Flame size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide">
            <span className="gradient-text">BURN</span>
            <span className="text-[#f5f5f5]">PAD</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === link.href
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-[#888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <WalletButton />
      </div>
    </nav>
  );
}
