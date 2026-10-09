import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF5EC",
          dark: "#F3EAD9",
          deep: "#EDE0C8",
        },
        rosegold: {
          light: "#E8B4B8",
          DEFAULT: "#B76E79",
          dark: "#96555F",
        },
        gold: {
          light: "#E9CE7A",
          DEFAULT: "#C9A227",
          dark: "#A8861B",
        },
        charcoal: {
          DEFAULT: "#2A2320",
          soft: "#4A4038",
          muted: "#7A6E62",
        },
        blush: "#F7E8E4",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(183, 110, 121, 0.25)",
        card: "0 4px 24px -6px rgba(42, 35, 32, 0.12)",
        gold: "0 8px 30px -8px rgba(201, 162, 39, 0.45)",
      },
      animation: {
        "spin-slow": "spin 24s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
