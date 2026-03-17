import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import WalletButton from "@/components/WalletButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BurnPad — Autonomous Buyback & Burn Protocol",
  description: "Deploy Pump.fun tokens with a permanent, on-chain buyback & burn agent. Lock settings forever.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-h-screen overflow-y-auto" style={{ marginLeft: 200 }}>
            {children}
          </main>
          <WalletButton />
        </div>
      </body>
    </html>
  );
}
