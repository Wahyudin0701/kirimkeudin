import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors — Kirim Ke Udin
        "ku-navy":  "#0D2D6B",
        "ku-yellow":"#F5C518",
        "ku-bg":    "#F4F6FA",
        "ku-white": "#FFFFFF",
        "ku-gray":  "#687280",

        // Navy tones
        "ku-navy-light": "#1a3f8f",
        "ku-navy-dark":  "#081d47",

        // Yellow tones
        "ku-yellow-light": "#fde68a",
        "ku-yellow-dark":  "#d4a617",

        // Text hierarchy
        "text-main":  "#0f172a",
        "text-soft":  "#334155",
        "text-muted": "#64748b",

        // Status
        "ku-green": "#10b981",
        "ku-red":   "#eb5757",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        jakarta:    ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass":     "0 40px 80px -12px rgba(13, 45, 107, 0.2)",
        "glass-sm":  "0 8px 32px rgba(13, 45, 107, 0.1)",
        "glass-lg":  "0 60px 120px -20px rgba(13, 45, 107, 0.3)",
        "card":      "0 4px 24px rgba(13, 45, 107, 0.08)",
        "card-hover":"0 12px 40px rgba(13, 45, 107, 0.15)",
      },
      animation: {
        "drift-1":       "drift1 14s infinite alternate ease-in-out",
        "drift-2":       "drift2 16s infinite alternate-reverse ease-in-out",
        "drift-3":       "drift3 12s infinite alternate ease-in-out",
        "float-up":      "floatUp 6s ease-in-out infinite",
        "float-down":    "floatDown 7s ease-in-out infinite",
        "shimmer":       "shimmerSweep 7s infinite cubic-bezier(0.16,1,0.3,1)",
        "pulse-glow":    "pulseGlow 3s infinite alternate ease-in-out",
        "gradient-move": "gradientMove 3s infinite linear",
        "sweep-left":    "sweepInLeft 1s cubic-bezier(0.16,1,0.3,1) forwards",
        "sweep-right":   "sweepInRight 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-down":     "fadeDown 1s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":       "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        drift1: {
          "0%":   { transform: "translate(0,0) scale(1) rotate(0deg)" },
          "50%":  { transform: "translate(10vw,5vh) scale(1.2) rotate(45deg)" },
          "100%": { transform: "translate(5vw,15vh) scale(0.9) rotate(90deg)" },
        },
        drift2: {
          "0%":   { transform: "translate(0,0) scale(1) rotate(0deg)" },
          "50%":  { transform: "translate(-10vw,-10vh) scale(1.15) rotate(-45deg)" },
          "100%": { transform: "translate(-5vw,-15vh) scale(1.3) rotate(-90deg)" },
        },
        drift3: {
          "0%":   { transform: "translate(0,0) scale(1) rotate(0deg)" },
          "50%":  { transform: "translate(12vw,-8vh) scale(1.2) rotate(60deg)" },
          "100%": { transform: "translate(5vw,-15vh) scale(0.85) rotate(-60deg)" },
        },
        floatUp: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-12px)" },
        },
        floatDown: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(12px)" },
        },
        shimmerSweep: {
          "0%,70%": { left: "-150%" },
          "100%":   { left: "200%" },
        },
        pulseGlow: {
          "0%":   { opacity: "0.25", transform: "scale(0.95)" },
          "100%": { opacity: "0.55", transform: "scale(1.05)" },
        },
        gradientMove: {
          "0%":   { backgroundPosition: "0 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        sweepInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-80px) skewX(5deg)" },
          "100%": { opacity: "1", transform: "translateX(0) skewX(0)" },
        },
        sweepInRight: {
          "0%":   { opacity: "0", transform: "translateX(120px) skewX(-5deg)" },
          "100%": { opacity: "1", transform: "translateX(0) skewX(0)" },
        },
        fadeDown: {
          "0%":   { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
