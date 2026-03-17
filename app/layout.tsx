import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletProviders from "@/components/WalletProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BurnPad — Permanent Buyback & Burn Launchpad",
  description: "Launch Pump.fun tokens with permanently locked, automated buyback & burn. Build trust through irreversible on-chain commitment.",
  openGraph: {
    title: "BurnPad",
    description: "The trustless launchpad for permanent buyback & burn tokens",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080808] text-[#f5f5f5]`}>
        <WalletProviders>
          <Navbar />
          <main className="pt-14 min-h-screen">{children}</main>
        </WalletProviders>
      </body>
    </html>
  );
}
