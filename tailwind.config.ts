import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        surface: "#0a0a0a",
        "surface-2": "#0f0f0f",
        "surface-3": "#141414",
        line: "#181818",
        "line-2": "#222222",
        dim: "#444",
        muted: "#666",
        secondary: "#999",
        primary: "#e8e8e8",
        green: {
          DEFAULT: "#00ff6e",
          dim: "#00cc57",
          faint: "rgba(0,255,110,0.08)",
          border: "rgba(0,255,110,0.2)",
          glow: "rgba(0,255,110,0.4)",
        },
        red: {
          DEFAULT: "#ff4455",
          faint: "rgba(255,68,85,0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.2s ease-out",
        "fade-in": "fadeIn 0.25s ease-out",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
