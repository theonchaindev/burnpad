import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WalletProviders from "@/components/WalletProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BurnPad — Autonomous Buyback & Burn Protocol",
  description: "Deploy Pump.fun tokens with a permanent, on-chain buyback & burn agent. Lock settings forever. Build trust through immutable protocol.",
  openGraph: {
    title: "BurnPad",
    description: "Autonomous buyback & burn agent protocol on Pump.fun",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#050505", color: "#e8e8e8" }}>
        <WalletProviders>
          <Navbar />
          <main className="pt-14 min-h-screen">{children}</main>
        </WalletProviders>
      </body>
    </html>
  );
}
