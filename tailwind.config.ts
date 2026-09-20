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
        "ws-paper": "var(--ws-paper)",
        "ws-ink": "var(--ws-ink)",
        "ws-accent": "var(--ws-accent)",
        /**
         * The single muted step, plus rule/fill. Use these instead of
         * `ws-ink/NN` opacity suffixes — the point of the collapse is
         * that there is one secondary weight of ink, not a ladder.
         */
        "ws-ink-mute": "var(--ws-ink-mute)",
        "ws-rule": "var(--ws-rule)",
        "ws-fill": "var(--ws-fill)",
      },
      /**
       * The site runs on ONE font-size. Hierarchy is carried by weight and
       * leading, never by size — the pattern measured off cathydolle.com,
       * dylan.camera and ard.works, none of which uses more than two
       * weights or any letter-spacing at all.
       *
       * label — section headings, field labels, nav. Weight 500.
       * value — metadata values, years, tags, captions. Weight 400.
       * prose — descriptions and body paragraphs. Weight 400, open leading.
       *
       * Size, leading, tracking and weight are all bundled here so no
       * component re-specifies them. `uppercase` stays a separate class
       * because fontSize can't carry text-transform.
       *
       * Deliberately absent: any display step. The case-study h1 is a
       * `label` like everything else; presence lives in the imagery.
       */
      fontSize: {
        label: ["12px", { lineHeight: "14px", letterSpacing: "0", fontWeight: "600" }],
        value: ["12px", { lineHeight: "14px", letterSpacing: "0", fontWeight: "400" }],
        prose: ["12px", { lineHeight: "18px", letterSpacing: "0", fontWeight: "400" }],
      },
      fontFamily: {
        display: ["var(--font-display)", "General Sans", "sans-serif"],
        "instrument-sans": ["var(--font-instrument-sans)", "Instrument Sans", "sans-serif"],
        /**
         * Switzer, self-hosted as two variable files (100-900 roman +
         * italic). Loaded and available; not yet the site default.
         */
        switzer: ["var(--font-switzer)", "Switzer", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
