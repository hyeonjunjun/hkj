"use client";

import { useEffect, useState } from "react";
import { useRotatingPlaylist } from "./useRotatingPlaylist";

/**
 * CornerAudio — compact ASCII player fixed to the bottom-right corner.
 *
 * The single-section index home doesn't have room for the full
 * ASCIIPlayer's multi-row layout. This is the compact form:
 *
 *   ┌─────────────────────────────────────────────┐
 *   │ ▶ ADORE U · Fred Again..       02:14   ? │
 *   │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
 *   └─────────────────────────────────────────────┘
 *
 * Lives at position: fixed bottom-right with a paper-2 background and
 * a hairline border so it reads as a quiet HUD. Persists across page
 * scroll. Clicking ? toggles the no-audio hint.
 *
 * Reduced-motion-safe.
 */

const PROGRESS_CELLS = 28;

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CornerAudio() {
  const { track, trackIndex, positionSeconds } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4200);
    return () => clearTimeout(id);
  }, [showHint]);

  const filled = Math.min(
    PROGRESS_CELLS,
    Math.max(0, Math.round((positionSeconds / track.runtime) * PROGRESS_CELLS)),
  );
  const bar = "█".repeat(filled) + "░".repeat(PROGRESS_CELLS - filled);

  return (
    <aside
      className="corner-audio-fixed"
      aria-label="Now playing"
      data-expanded={expanded ? "" : undefined}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="corner-audio-fixed__row corner-audio-fixed__row--top">
        <span className="corner-audio-fixed__icon" aria-hidden>▶</span>
        <span className="corner-audio-fixed__track" key={trackIndex}>
          <span className="corner-audio-fixed__title">{track.title}</span>
          <span className="corner-audio-fixed__sep" aria-hidden>·</span>
          <span className="corner-audio-fixed__artist">{track.artist}</span>
        </span>
        <span className="corner-audio-fixed__time tabular t-footnote">
          {formatMMSS(positionSeconds)}
        </span>
        <button
          type="button"
          className="corner-audio-fixed__hintbtn t-footnote"
          aria-expanded={showHint}
          aria-label="What is this audio fixture?"
          onClick={(e) => {
            e.stopPropagation();
            setShowHint((v) => !v);
          }}
        >
          ?
        </button>
      </div>
      <div className="corner-audio-fixed__row corner-audio-fixed__row--bar" aria-hidden>
        <span
          className="corner-audio-fixed__bar"
          style={{
            /* Use backgroundImage (non-shorthand) instead of background
               so it doesn't reset background-clip on re-render — React
               warns about mixing shorthand + non-shorthand for the same
               property family. */
            backgroundImage: `linear-gradient(90deg, var(--ink) 0, var(--ink) ${(filled / PROGRESS_CELLS) * 100}%, var(--ink-hair) ${(filled / PROGRESS_CELLS) * 100}%, var(--ink-hair) 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {bar}
        </span>
      </div>

      {showHint && (
        <p className="corner-audio-fixed__hint t-footnote" role="status">
          no audio. (copyright.) the titles rotate.
        </p>
      )}

      <span className="sr-only">
        Silent music-metadata fixture. No audio is emitted from this page.
      </span>

      <style>{`
        .corner-audio-fixed {
          position: fixed;
          right: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vh, 28px);
          z-index: 30;
          padding: 10px 12px 10px 14px;
          background: var(--paper);
          color: var(--ink-2);
          border: 1px solid var(--ink-hair);
          border-radius: 2px;
          font-family: var(--font-stack-mono);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.06),
            0 2px 6px rgba(0, 0, 0, 0.04);
          display: grid;
          row-gap: 4px;
          /* Reveal from below on page-load */
          opacity: 0;
          transform: translateY(8px);
          animation: corner-audio-fixed-in 520ms var(--ease) 480ms forwards;
          /* Tighten on small screens */
          max-width: calc(100vw - 32px);
        }
        @keyframes corner-audio-fixed-in {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .corner-audio-fixed__row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .corner-audio-fixed__icon {
          color: var(--ink);
          font-size: 8px;
          animation: corner-audio-blink 1.8s steps(2, end) infinite;
        }
        @keyframes corner-audio-blink {
          0%, 60%   { opacity: 1; }
          61%, 100% { opacity: 0.35; }
        }
        .corner-audio-fixed__track {
          flex: 1 1 auto;
          font-size: 10px;
          letter-spacing: 0.04em;
          line-height: 1.2;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          animation: corner-audio-fade 280ms var(--ease);
        }
        @keyframes corner-audio-fade {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .corner-audio-fixed__title {
          color: var(--ink);
          font-weight: 500;
        }
        .corner-audio-fixed__sep {
          color: var(--ink-4);
          margin: 0 0.4em;
        }
        .corner-audio-fixed__artist {
          color: var(--ink-3);
        }
        .corner-audio-fixed__time {
          color: var(--ink-3);
          flex: 0 0 auto;
        }
        .corner-audio-fixed__hintbtn {
          appearance: none;
          background: transparent;
          border: 0;
          padding: 0 4px;
          color: var(--ink-4);
          cursor: pointer;
          transition: color 180ms var(--ease);
          font-family: var(--font-stack-chrome);
        }
        .corner-audio-fixed__hintbtn:hover {
          color: var(--ink);
        }

        .corner-audio-fixed__row--bar {
          font-family: var(--font-stack-chrome);
          font-size: 8px;
          line-height: 1;
          color: var(--ink-3);
          overflow: hidden;
          white-space: nowrap;
          max-height: 0;
          opacity: 0;
          transition:
            max-height 240ms var(--ease),
            opacity 200ms var(--ease) 40ms;
        }
        .corner-audio-fixed[data-expanded] .corner-audio-fixed__row--bar {
          max-height: 16px;
          opacity: 1;
        }
        .corner-audio-fixed__bar {
          letter-spacing: 0;
        }

        .corner-audio-fixed__hint {
          color: var(--ink-2);
          text-transform: lowercase;
          padding-top: 4px;
          margin: 0;
          letter-spacing: 0.04em;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .corner-audio-fixed { animation: none; opacity: 1; transform: none; }
          .corner-audio-fixed__icon { animation: none; opacity: 0.85; }
          .corner-audio-fixed__track { animation: none; }
        }
        @media (max-width: 480px) {
          .corner-audio-fixed {
            right: 12px;
            bottom: 12px;
            padding: 8px 10px;
            font-size: 9px;
          }
        }
      `}</style>
    </aside>
  );
}
