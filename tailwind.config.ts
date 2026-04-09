import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        "ink-full": "var(--ink-full)",
        "ink-primary": "var(--ink-primary)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        "ink-ghost": "var(--ink-ghost)",
        "ink-whisper": "var(--ink-whisper)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      transitionTimingFunction: {
        swift: "var(--ease-swift)",
      },
      screens: {
        mobile: { max: "768px" },
        tablet: { min: "769px", max: "1024px" },
      },
    },
  },
  plugins: [],
};

export default config;
