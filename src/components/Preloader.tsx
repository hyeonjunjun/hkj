"use client";

import { useEffect, useState } from "react";

/**
 * Preloader — opening curtain on first visit.
 *
 * A character-cloud field with lede words sprinkled in. Fades up on
 * mount, holds, fades down. Once-per-session via sessionStorage so
 * return visits go straight to the home. Honors prefers-reduced-motion.
 *
 * Tier A (this file): hand-laid character grid, no image sampling.
 * Vocabulary: + . , ' : * — sparse, atmospheric. Words from the home
 * lede drift in at specific positions. ~2.8s total.
 *
 * Tier B (future): replace the character grid with a designed
 * typographic SVG image (image #2 register from the references).
 * Same component shape — just swap the asset.
 */

const SESSION_KEY = "rj-curtain-shown";
const TOTAL_MS = 2800;

// Cloud-shape sparse grid. Hand-laid: rows × cols of characters.
// Empty space = ' '; chars cluster to suggest cumulus + drift.
const CLOUD: ReadonlyArray<string> = [
  "                                                                  ",
  "                       . . .                                       ",
  "                  +  +  +  +  +                                    ",
  "             +  +  +  +  +  +  +  +    .  .                       ",
  "        .  +  +  +  +  +  +  +  +  +    .  .  .                   ",
  "       +  +  +  +  +  +  +  +  +  +  +    .  .  .  .              ",
  "    +  +  +  +  +  +  +  +  +  +  +  +  +    .  .  .  .  .        ",
  "  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +    .  .  .  .  .    ",
  "    +  +  +  +  +  +  +  +  +  +  +  +  +  +    .  .  .  .  .     ",
  "       +  +  +  +  +  +  +  +  +  +  +  +    .  .  .  .  .        ",
  "          +  +  +  +  +  +  +  +  +  +    .  .  .  .  .           ",
  "             +  +  +  +  +  +  +  +    .  .  .  .                 ",
  "                +  +  +  +  +  +    .  .  .                       ",
  "                   +  +  +  +    .  .                              ",
  "                      +  +    .                                    ",
  "                                                                  ",
];

// Words drift in at specific positions on top of the cloud. Each tuple
// is [row, col, word]. Positions hand-tuned to land in negative space
// rather than overlap the cloud body.
const WORDS: ReadonlyArray<[number, number, string]> = [
  [2, 4, "old soul"],
  [4, 38, "late-night"],
  [9, 0, "mixes"],
  [11, 38, "voice memos"],
  [14, 4, "ryan jun"],
];

export default function Preloader() {
  const [phase, setPhase] = useState<"idle" | "active" | "fade" | "done">(
    "idle",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip if already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase("done");
      return;
    }

    // Skip on reduced-motion — same flag set so a re-render mid-session
    // doesn't show it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
      return;
    }

    setPhase("active");

    const fadeAt = setTimeout(() => setPhase("fade"), TOTAL_MS - 600);
    const doneAt = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    }, TOTAL_MS);

    return () => {
      clearTimeout(fadeAt);
      clearTimeout(doneAt);
    };
  }, []);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      className="curtain"
      data-phase={phase}
      aria-hidden
      role="presentation"
    >
      <pre className="curtain__cloud">
        {CLOUD.map((row, i) => (
          <span key={i} className="curtain__row">
            {row}
            {"\n"}
          </span>
        ))}
      </pre>

      {WORDS.map(([row, col, word], i) => (
        <span
          key={i}
          className="curtain__word"
          style={
            {
              "--row": row,
              "--col": col,
              "--delay": `${200 + i * 220}ms`,
            } as React.CSSProperties
          }
        >
          {word}
        </span>
      ))}

      <style>{`
        .curtain {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: var(--paper);
          display: grid;
          place-items: center;
          opacity: 0;
          animation: curtain-in 240ms ease forwards;
          pointer-events: none;
        }
        .curtain[data-phase="fade"] {
          animation: curtain-out 600ms ease forwards;
        }
        @keyframes curtain-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes curtain-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        .curtain__cloud {
          font-family: var(--font-stack-mono);
          font-size: clamp(8px, 1.1vw, 14px);
          line-height: 1.45;
          color: var(--ink-3);
          letter-spacing: 0.01em;
          margin: 0;
          white-space: pre;
          text-align: center;
          opacity: 0;
          animation: cloud-in 800ms ease 80ms forwards;
        }
        @keyframes cloud-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Words drift in over the cloud, staggered. CSS custom props
           --row / --col / --delay set position + animation timing per
           word. Values are character-grid coordinates; they translate
           to em-based offsets on top of the cloud's center alignment. */
        .curtain__word {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%)
            translate(
              calc((var(--col) - 33) * 0.62ch),
              calc((var(--row) - 8) * 1.45em)
            );
          font-family: var(--font-stack-mono);
          font-size: clamp(9px, 1vw, 13px);
          letter-spacing: 0.04em;
          color: var(--ink);
          text-transform: lowercase;
          opacity: 0;
          animation: word-in 600ms ease forwards;
          animation-delay: var(--delay);
          white-space: nowrap;
        }
        @keyframes word-in {
          from { opacity: 0; transform: translate(-50%, -50%) translate(calc((var(--col) - 33) * 0.62ch), calc((var(--row) - 8) * 1.45em + 4px)); }
          to   { opacity: 1; transform: translate(-50%, -50%) translate(calc((var(--col) - 33) * 0.62ch), calc((var(--row) - 8) * 1.45em)); }
        }

        @media (max-width: 760px) {
          .curtain__cloud { font-size: 7px; }
          .curtain__word { font-size: 9px; }
        }
      `}</style>
    </div>
  );
}
