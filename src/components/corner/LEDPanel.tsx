"use client";

import { useEffect, useState } from "react";
import { useRotatingPlaylist } from "./useRotatingPlaylist";

/**
 * LEDPanel — the dot-matrix audio device. The corner's signature
 * element, rebuilt from a single-line fixture into a small physical-
 * device-style display. Visual reference: NOTHING glyph interface,
 * cassette LCD windows, Solari split-flap aesthetics, but tuned to
 * the Departure Mono / amber accent already in the system.
 *
 * Three rows inside the screen:
 *   ▶  PLAYING                              02:14
 *   ADORE U
 *   FRED AGAIN..
 *   ●●●●●●●●●○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○
 *
 * Bezel is CSS-only: outer dark frame with a thin highlight, inner
 * recess via box-shadow inset. The screen itself uses a subtle
 * radial-gradient dot-grid background so the text reads as floating
 * in a matrix of unlit cells rather than over flat black.
 *
 * Glow on the lit text via text-shadow at the accent color. Cross-
 * fade on track rotation (keyed on trackIndex). All motion respects
 * prefers-reduced-motion.
 *
 * Click affordance: the panel itself is a button. Clicking it
 * toggles a small "no audio — copyright. titles rotate." hint. This
 * is the "wait — what?" beat.
 */

const PROGRESS_CELLS = 32;

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LEDPanel() {
  const { track, trackIndex, positionSeconds } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4200);
    return () => clearTimeout(id);
  }, [showHint]);

  // How many progress cells are filled (0..PROGRESS_CELLS).
  const filledCells = Math.min(
    PROGRESS_CELLS,
    Math.max(0, Math.round((positionSeconds / track.runtime) * PROGRESS_CELLS)),
  );

  return (
    <div className="corner-led" aria-label="Now playing display">
      <button
        type="button"
        className="corner-led__bezel"
        aria-expanded={showHint}
        aria-label="What is this audio fixture?"
        onClick={() => setShowHint((v) => !v)}
      >
        <div className="corner-led__screen">
          <div className="corner-led__dotgrid" aria-hidden />
          <div className="corner-led__scanlines" aria-hidden />

          <div className="corner-led__row corner-led__row-meta">
            <span className="corner-led__status">
              <span className="corner-led__cursor" aria-hidden>▶</span>
              <span>PLAYING</span>
            </span>
            <span className="corner-led__time tabular">
              {formatMMSS(positionSeconds)} / {formatMMSS(track.runtime)}
            </span>
          </div>

          {/* Keyed on trackIndex so the cross-fade animation
              resets every rotation. */}
          <div className="corner-led__row corner-led__row-track" key={trackIndex}>
            <span className="corner-led__track-title">{track.title.toUpperCase()}</span>
          </div>
          <div className="corner-led__row corner-led__row-artist" key={`a-${trackIndex}`}>
            <span className="corner-led__artist">{track.artist.toUpperCase()}</span>
          </div>

          <div className="corner-led__row corner-led__row-progress" aria-hidden>
            {Array.from({ length: PROGRESS_CELLS }).map((_, i) => (
              <span
                key={i}
                className="corner-led__pcell"
                data-on={i < filledCells ? "" : undefined}
              />
            ))}
          </div>
        </div>
      </button>

      <div className="corner-led__label">
        <span className="t-footnote dimmer">RJ&middot;CRN&middot;01</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dimmer">ZERO AUDIO</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dim">{track.runtime > 0 ? "rotation active" : "idle"}</span>
      </div>

      {/* Screen-reader explanation of the silent device. */}
      <span className="sr-only">
        Silent music-metadata display. No audio is emitted from this page.
        Track titles rotate visually for atmosphere.
      </span>

      {showHint && (
        <span className="corner-led__hint" role="status">
          no audio. (copyright.) the titles rotate.
        </span>
      )}

      <style>{`
        .corner-led {
          /* The whole LED device is its own block. Caller controls
             width via the surrounding section; the bezel fills the
             available width up to a sensible max. */
          width: 100%;
          max-width: 460px;
          display: grid;
          row-gap: 10px;
          position: relative;
        }
        .corner-led__bezel {
          /* The bezel is a clickable button — keeps the hint affordance
             obvious. No native button chrome leaks through; we paint
             everything ourselves. */
          appearance: none;
          border: 0;
          padding: 14px;
          margin: 0;
          width: 100%;
          background: linear-gradient(
            180deg,
            rgba(26, 24, 22, 0.96) 0%,
            rgba(14, 12, 11, 0.98) 100%
          );
          border-radius: 6px;
          cursor: pointer;
          /* Outer "device" shadow + thin top highlight + thin bottom
             dark line to read as a milled plastic frame. */
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.04) inset,
            0 -1px 0 rgba(0, 0, 0, 0.5) inset,
            0 12px 28px rgba(0, 0, 0, 0.18),
            0 2px 6px rgba(0, 0, 0, 0.12);
          transition: transform 200ms var(--ease), box-shadow 200ms var(--ease);
        }
        .corner-led__bezel:hover {
          transform: translateY(-1px);
        }
        .corner-led__bezel:active {
          transform: translateY(0);
        }

        .corner-led__screen {
          /* The screen surface — a recessed area. Background is near-
             black with a warm amber undertone so unlit dots read as
             coal rather than pure void. */
          position: relative;
          padding: 18px 20px 16px;
          border-radius: 3px;
          background:
            radial-gradient(120% 80% at 50% 0%,
              rgba(232, 178, 90, 0.06) 0%,
              transparent 60%),
            #0c0a08;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.6) inset,
            0 -1px 0 rgba(255, 255, 255, 0.03) inset,
            0 0 0 1px rgba(0, 0, 0, 0.6) inset;
          overflow: hidden;
          isolation: isolate; /* keep blends contained */
          font-family: var(--font-stack-chrome);
          /* every text inside the screen rides on the chrome stack
             (Departure Mono) so the pixel character is consistent. */
        }
        /* Faint dot-grid backdrop — reads as the unlit pixels of the
           panel. 4px cell, tiny dots. */
        .corner-led__dotgrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.045) 0.6px,
            transparent 0.8px
          );
          background-size: 4px 4px;
          background-position: 0 0;
          pointer-events: none;
          z-index: 0;
        }
        /* CRT scanlines — extremely subtle horizontal banding. */
        .corner-led__scanlines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.10) 0,
            rgba(0, 0, 0, 0.10) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.6;
          z-index: 1;
        }

        .corner-led__row {
          position: relative;
          z-index: 2;
          color: var(--accent);
          /* Amber LED glow — the lit text bleeds slightly into the
             surrounding "matrix" the way a real LED display does.
             Two layers: tight bloom (close shadow) + atmospheric
             halo (wider, dimmer). */
          text-shadow:
            0 0 1px rgba(232, 178, 90, 0.9),
            0 0 6px rgba(232, 178, 90, 0.35),
            0 0 14px rgba(232, 178, 90, 0.18);
          letter-spacing: 0.08em;
        }
        .corner-led__row-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 9px;
          letter-spacing: 0.16em;
          margin-bottom: 14px;
          opacity: 0.85;
        }
        .corner-led__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .corner-led__cursor {
          /* A tiny blink — like the cursor on a Solari display. */
          animation: corner-led-blink 1.6s steps(2, end) infinite;
        }
        @keyframes corner-led-blink {
          0%, 60%  { opacity: 1; }
          61%, 100% { opacity: 0.25; }
        }
        .corner-led__time {
          opacity: 0.75;
        }
        .corner-led__row-track {
          font-size: 16px;
          line-height: 1.1;
          margin-bottom: 4px;
          animation: corner-led-fade 380ms var(--ease);
        }
        .corner-led__row-artist {
          font-size: 11px;
          letter-spacing: 0.14em;
          opacity: 0.7;
          margin-bottom: 16px;
          animation: corner-led-fade 380ms var(--ease) 60ms both;
        }
        @keyframes corner-led-fade {
          0%   { opacity: 0; transform: translateY(2px); filter: blur(0.4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .corner-led__row-progress {
          display: flex;
          gap: 2px;
          /* Allow horizontal scroll on very narrow viewports rather
             than overflowing — but in practice we keep cells small. */
          overflow: hidden;
        }
        .corner-led__pcell {
          flex: 1 1 auto;
          height: 4px;
          background: rgba(232, 178, 90, 0.10);
          transition: background 240ms var(--ease), box-shadow 240ms var(--ease);
        }
        .corner-led__pcell[data-on] {
          background: var(--accent);
          box-shadow:
            0 0 2px rgba(232, 178, 90, 0.8),
            0 0 4px rgba(232, 178, 90, 0.35);
        }

        .corner-led__label {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 0 4px;
          color: var(--ink-4);
        }
        .corner-led__label .t-sep,
        .corner-led__label > span:nth-child(even):not(.t-footnote) {
          opacity: 0.5;
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

        .corner-led__hint {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          padding: 6px 10px;
          background: var(--ink);
          color: var(--paper);
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: var(--track-eyebrow);
          text-transform: uppercase;
          line-height: 1.4;
          border-radius: 2px;
          z-index: 4;
          white-space: nowrap;
          animation: corner-led-hint-in 200ms var(--ease);
        }
        @keyframes corner-led-hint-in {
          0%   { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .corner-led__bezel { transition: none; }
          .corner-led__cursor { animation: none; opacity: 0.85; }
          .corner-led__row-track,
          .corner-led__row-artist { animation: none; }
          .corner-led__pcell { transition: none; }
          .corner-led__hint { animation: none; }
        }

        @media (max-width: 540px) {
          .corner-led__bezel { padding: 10px; }
          .corner-led__screen { padding: 14px 16px 12px; }
          .corner-led__row-track { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}
