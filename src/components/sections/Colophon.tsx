"use client";

import WobblyRule from "@/components/ui/WobblyRule";

/**
 * Colophon — Quiet footer with hand-drawn rule
 *
 * WobblyRule above, then single line of credits.
 * Deep bottom padding for breathing room at page end.
 */
export default function Colophon() {
  return (
    <footer>
      <WobblyRule className="section-padding" />

      <div
        className="section-padding"
        style={{
          paddingTop: "clamp(2.5rem, 4vh, 3.5rem)",
          paddingBottom: "clamp(3rem, 5vh, 4rem)",
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            letterSpacing: "0.08em",
            lineHeight: 1.6,
          }}
        >
          Designed & built by HKJ · Set in GT Alpina & Söhne · © 2026
        </p>
      </div>
    </footer>
  );
}
