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
        paper: "var(--paper)",
        "paper-shade": "var(--paper-shade)",
        "paper-hover": "var(--paper-hover)",
        "paper-deep": "var(--paper-deep)",
        "paper-edge": "var(--paper-edge)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        mist: "var(--mist)",
        "mist-deep": "var(--mist-deep)",
        ember: "var(--ember)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter Tight", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "serif"],
        courier: ["var(--font-courier)", "Courier Prime", "monospace"],
        /**
         * `font-mono` intentionally points at Courier Prime, not a separate
         * mono face — the site has no JetBrains-Mono-style geometric mono.
         * Every existing `font-mono` class (metadata, timestamps, tags,
         * labels, across every room) renders in Courier Prime through this
         * single indirection, with no component-level class rewrites.
         */
        mono: ["var(--font-courier)", "Courier Prime", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
