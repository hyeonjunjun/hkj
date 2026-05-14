"use client";

import { useEffect, useState } from "react";
import { useRotatingPlaylist } from "./useRotatingPlaylist";

/**
 * ASCIIPlayer — the corner's audio fixture, stripped back to text.
 *
 * Replaces the Walkman device with a typographic-only treatment:
 *
 *   NOW PLAYING — ADORE U                        03:21 / 03:34
 *                 Fred Again..
 *   ─────────────────────────────────────────────────────────────
 *   ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 *   RJ·CRN·01 · ZERO AUDIO · rotation active           [ ? ]
 *
 * No frame, no chrome, no glow. The structure comes from monospace
 * alignment, a hairline rule, and the block-character progress bar.
 * Reads as text first, fixture second — same Flora-level restraint
 * as the rest of the corner.
 *
 * Click the [ ? ] glyph to reveal the no-audio hint.
 */

const PROGRESS_CELLS = 48;

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ASCIIPlayer() {
  const { track, trackIndex, positionSeconds } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);

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
    <div className="ascii-player" aria-label="Now playing">
      <div className="ascii-player__row ascii-player__row--head">
        <span className="ascii-player__label t-meta">Now Playing</span>
        <span className="ascii-player__sep" aria-hidden>—</span>
        <span className="ascii-player__track" key={`t-${trackIndex}`}>
          {track.title}
        </span>
        <span className="ascii-player__time t-meta tabular">
          {formatMMSS(positionSeconds)} / {formatMMSS(track.runtime)}
        </span>
      </div>

      <div className="ascii-player__row ascii-player__row--artist">
        <span className="ascii-player__artist t-meta" key={`a-${trackIndex}`}>
          {track.artist}
        </span>
      </div>

      <hr className="t-rule ascii-player__rule" />

      <div className="ascii-player__row ascii-player__row--bar" aria-hidden>
        <span className="ascii-player__bar">{bar}</span>
      </div>

      <div className="ascii-player__row ascii-player__row--foot">
        <span className="t-footnote dimmer">RJ&middot;CRN&middot;01</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dimmer">ZERO AUDIO</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dim">rotation active</span>
        <button
          type="button"
          className="ascii-player__hintbtn t-footnote"
          aria-expanded={showHint}
          aria-label="What is this audio fixture?"
          onClick={() => setShowHint((v) => !v)}
        >
          [ ? ]
        </button>
      </div>

      <span className="sr-only">
        Silent music-metadata fixture. No audio is emitted from this page.
        Track titles rotate visually for atmosphere.
      </span>

      {showHint && (
        <p className="ascii-player__hint t-meta" role="status">
          no audio. (copyright.) the titles rotate.
        </p>
      )}

      <style>{`
        .ascii-player {
          display: grid;
          row-gap: 6px;
          font-family: var(--font-stack-mono);
          color: var(--ink-2);
          position: relative;
        }
        .ascii-player__row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          min-width: 0;
        }
        .ascii-player__row--head {
          align-items: baseline;
        }
        .ascii-player__label {
          flex: 0 0 auto;
          color: var(--ink-3);
        }
        .ascii-player__sep {
          color: var(--ink-4);
          flex: 0 0 auto;
        }
        .ascii-player__track {
          flex: 1 1 auto;
          color: var(--ink);
          font-size: var(--type-row);
          letter-spacing: var(--track-snug);
          line-height: 1.2;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          animation: ascii-player-fade 360ms var(--ease);
        }
        .ascii-player__time {
          flex: 0 0 auto;
          color: var(--ink-3);
        }
        .ascii-player__row--artist {
          /* Indent to align under the track title in the head row. */
          padding-left: clamp(80px, 11ch, 116px);
        }
        .ascii-player__artist {
          color: var(--ink-3);
          font-size: var(--type-caption);
          animation: ascii-player-fade 360ms var(--ease) 60ms both;
        }
        @keyframes ascii-player-fade {
          0%   { opacity: 0; transform: translateY(1px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ascii-player__rule {
          margin: 6px 0 4px;
        }
        .ascii-player__row--bar {
          font-family: var(--font-stack-chrome);
          font-size: 10px;
          line-height: 1;
          letter-spacing: 0;
          color: var(--ink-3);
          /* The progress bar is rendered as actual unicode block
             characters; clip overflow so the row stays one line. */
          overflow: hidden;
          white-space: nowrap;
        }
        .ascii-player__bar {
          /* Filled cells use --ink (full); unfilled use --ink-4 via
             the half-block dimming. Both are real characters; the
             color split happens via mix below. */
          /* Render a single string but apply a linear-gradient mask
             so the filled portion reads as --ink and the rest as
             --ink-4. Falls back to a flat color in browsers without
             background-clip:text. */
          background:
            linear-gradient(
              90deg,
              var(--ink) 0,
              var(--ink) calc(${filled} / ${PROGRESS_CELLS} * 100%),
              var(--ink-hair) calc(${filled} / ${PROGRESS_CELLS} * 100%),
              var(--ink-hair) 100%
            );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          transition: background 400ms var(--ease);
        }
        .ascii-player__row--foot {
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px;
          color: var(--ink-4);
          padding-top: 4px;
        }
        .ascii-player__hintbtn {
          appearance: none;
          background: transparent;
          border: 0;
          padding: 2px 4px;
          margin-left: auto;
          color: var(--ink-4);
          cursor: pointer;
          transition: color 180ms var(--ease);
          font-family: var(--font-stack-chrome);
        }
        .ascii-player__hintbtn:hover {
          color: var(--ink);
        }
        .ascii-player__hint {
          color: var(--ink-2);
          text-transform: lowercase;
          padding-top: 4px;
          animation: ascii-player-fade 200ms var(--ease);
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
          .ascii-player__track,
          .ascii-player__artist,
          .ascii-player__hint { animation: none; }
          .ascii-player__bar { transition: none; }
        }
        @media (max-width: 540px) {
          .ascii-player__row--head {
            flex-wrap: wrap;
          }
          .ascii-player__row--artist {
            padding-left: 0;
          }
          .ascii-player__time {
            margin-left: auto;
          }
        }
      `}</style>
    </div>
  );
}
