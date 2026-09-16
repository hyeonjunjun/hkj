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
        "ws-paper": "var(--ws-paper)",
        "ws-ink": "var(--ws-ink)",
        "ws-accent": "var(--ws-accent)",
      },
      /**
       * The site's type scale. Four steps plus one display step, each with
       * a defined role — replaces the ad-hoc spread of text-[10px] through
       * text-[19px] that had accumulated (nine distinct styles were live on
       * the Info page alone, including three different 13px variants).
       *
       * micro   — section labels, figure captions, the studio-info block
       * meta    — nav, clock, counters, category/year, image captions
       * body    — paragraphs: standfirst, descriptions, journal entries
       * title   — row titles, entry titles, the wordmark
       * display — work-detail headline and the next-project link
       *
       * Line heights are bundled so callers don't re-specify them per use.
       */
      fontSize: {
        micro: ["11px", { lineHeight: "1.45" }],
        meta: ["13px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.65" }],
        title: ["19px", { lineHeight: "1.3" }],
        display: ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
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
        display: ["var(--font-display)", "General Sans", "sans-serif"],
        "instrument-sans": ["var(--font-instrument-sans)", "Instrument Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
