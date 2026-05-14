"use client";

import { useEffect, useState } from "react";
import { useRotatingPlaylist } from "./useRotatingPlaylist";

/**
 * WalkmanDevice — the corner's audio fixture as a stylized USB-stick
 * Walkman-style player. Reference: Sony NW-E series (NW-E005 / NW-E303).
 * The form is accurate to the reference; the wordmarks are Ryan's so the
 * device reads as a piece of the corner's own identity, not a Sony tribute.
 *
 * Anatomy (left → right):
 *
 *   [ wordmark | LCD screen | skip+play+skip buttons | mark ]
 *
 *   The whole device is a horizontal pill (~5:1 aspect). Chrome body
 *   via stacked gradients; cyan-monochrome LCD via warm-black background
 *   + cyan text with a slim text-shadow glow. Buttons are circular with
 *   highlight + recessed shadow. A small bump on the top edge stands in
 *   for the volume/hold key.
 *
 * Click the play button → toggles the "no audio. (copyright.) the
 * titles rotate." hint. The screen itself is not a click target; the
 * physical-button click affordance is more honest to the form.
 *
 * Reduced-motion respected: blink stops, micro-flicker stops, time
 * still advances.
 */

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function WalkmanDevice() {
  const { track, trackIndex, positionSeconds } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4200);
    return () => clearTimeout(id);
  }, [showHint]);

  return (
    <div className="walkman" aria-label="Now playing display">
      <div className="walkman__body">
        {/* Top bump — volume / hold key */}
        <span className="walkman__top-bump" aria-hidden />

        {/* Wordmark — Ryan's equivalent of SONY etching on the left */}
        <span className="walkman__wordmark" aria-hidden>RYAN</span>

        {/* LCD screen */}
        <div className="walkman__screen">
          <div className="walkman__screen-inner">
            {/* Row 1: music note + track title + battery */}
            <div className="walkman__lcd-row walkman__lcd-row--top" key={`t-${trackIndex}`}>
              <span className="walkman__note" aria-hidden>♪</span>
              <span className="walkman__track">{track.title}</span>
              <span className="walkman__battery" aria-hidden>
                <span className="walkman__battery-cell" />
                <span className="walkman__battery-cell" />
                <span className="walkman__battery-cell walkman__battery-cell--off" />
              </span>
            </div>

            {/* Row 2: artist */}
            <div className="walkman__lcd-row walkman__lcd-row--artist" key={`a-${trackIndex}`}>
              <span className="walkman__artist">{track.artist}</span>
            </div>

            {/* Row 3: play indicator + elapsed time */}
            <div className="walkman__lcd-row walkman__lcd-row--bottom">
              <span className="walkman__play-glyph" aria-hidden>▶</span>
              <span className="walkman__time tabular">{formatMMSS(positionSeconds)}</span>
            </div>

            {/* Faint LCD reflection — a soft diagonal sheen */}
            <span className="walkman__screen-sheen" aria-hidden />
          </div>
        </div>

        {/* Control cluster: skip-fwd top, play center, skip-back bottom */}
        <div className="walkman__controls">
          <button
            type="button"
            className="walkman__btn walkman__btn--skip"
            aria-label="Skip forward (decorative)"
            tabIndex={-1}
          >
            <span aria-hidden>▶▶|</span>
          </button>
          <button
            type="button"
            className="walkman__btn walkman__btn--play"
            aria-expanded={showHint}
            aria-label="What is this audio fixture?"
            onClick={() => setShowHint((v) => !v)}
          >
            <span aria-hidden>▶<span className="walkman__pause-bars">||</span></span>
          </button>
          <button
            type="button"
            className="walkman__btn walkman__btn--skip"
            aria-label="Skip back (decorative)"
            tabIndex={-1}
          >
            <span aria-hidden>|◀◀</span>
          </button>
        </div>

        {/* The cassette-W-with-dot equivalent — `rj·` mark */}
        <span className="walkman__mark" aria-hidden>
          rj<span className="walkman__mark-dot" />
        </span>
      </div>

      <div className="walkman__label">
        <span className="t-footnote dimmer">RJ&middot;CRN&middot;01</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dimmer">ZERO AUDIO</span>
        <span className="t-footnote dimmer" aria-hidden>·</span>
        <span className="t-footnote dim">rotation active</span>
      </div>

      <span className="sr-only">
        Silent music-metadata fixture styled after a portable music player.
        No audio is emitted from this page. Track titles rotate visually
        for atmosphere.
      </span>

      {showHint && (
        <span className="walkman__hint" role="status">
          no audio. (copyright.) the titles rotate.
        </span>
      )}

      <style>{`
        .walkman {
          width: 100%;
          max-width: 520px;
          display: grid;
          row-gap: 12px;
          position: relative;
        }

        /* ── Body — chrome capsule ─────────────────────────────────
           Pill-shape with stacked gradients to imitate polished
           chrome. Top edge gets a bright specular; bottom edge gets
           a dim band; the long middle is a soft gradient with subtle
           banding for the "machined metal" feel. */
        .walkman__body {
          position: relative;
          display: grid;
          grid-template-columns: auto auto 1fr auto auto;
          align-items: center;
          column-gap: clamp(8px, 1.6vw, 18px);
          padding: 14px clamp(18px, 3vw, 30px);
          height: clamp(92px, 12vw, 108px);
          border-radius: 999px;
          background:
            /* top specular */
            linear-gradient(180deg,
              rgba(255,255,255,0.55) 0%,
              rgba(255,255,255,0.05) 14%,
              transparent 22%
            ),
            /* bottom shadow */
            linear-gradient(180deg,
              transparent 70%,
              rgba(0,0,0,0.10) 90%,
              rgba(0,0,0,0.18) 100%
            ),
            /* main chrome — silver gradient with center sheen */
            linear-gradient(180deg,
              #c9c6c1 0%,
              #ecebe8 22%,
              #f6f5f3 38%,
              #dedcd8 58%,
              #c4c1bc 78%,
              #b3b0aa 100%
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.85),
            inset 0 -1px 0 rgba(0,0,0,0.18),
            inset 0 0 0 1px rgba(0,0,0,0.10),
            0 14px 30px rgba(0,0,0,0.16),
            0 4px 10px rgba(0,0,0,0.10);
        }
        /* Dark-theme: dark-chrome variant matching the first reference. */
        :root[data-theme="dark"] .walkman__body {
          background:
            linear-gradient(180deg,
              rgba(255,255,255,0.35) 0%,
              rgba(255,255,255,0.03) 14%,
              transparent 22%
            ),
            linear-gradient(180deg,
              transparent 70%,
              rgba(0,0,0,0.30) 90%,
              rgba(0,0,0,0.45) 100%
            ),
            linear-gradient(180deg,
              #4d4a45 0%,
              #6a6661 22%,
              #807c76 38%,
              #5e5a55 58%,
              #3e3b37 78%,
              #2a2825 100%
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.6),
            inset 0 0 0 1px rgba(0,0,0,0.35),
            0 14px 30px rgba(0,0,0,0.45),
            0 4px 10px rgba(0,0,0,0.30);
        }

        /* Top bump — small raised pill on the top edge. */
        .walkman__top-bump {
          position: absolute;
          top: -5px;
          left: 22%;
          width: 28px;
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(180deg, #efece8 0%, #b8b5b0 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 1px 2px rgba(0,0,0,0.18);
        }
        :root[data-theme="dark"] .walkman__top-bump {
          background: linear-gradient(180deg, #6a6661 0%, #2a2825 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.25),
            0 1px 2px rgba(0,0,0,0.4);
        }

        /* Wordmark — etched into the chrome on the left */
        .walkman__wordmark {
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.22em;
          font-weight: 500;
          color: rgba(40, 38, 35, 0.55);
          text-shadow:
            0 1px 0 rgba(255,255,255,0.7),
            0 -1px 0 rgba(0,0,0,0.05);
          text-transform: uppercase;
          padding-right: 4px;
        }
        :root[data-theme="dark"] .walkman__wordmark {
          color: rgba(255,255,255,0.45);
          text-shadow:
            0 1px 0 rgba(0,0,0,0.4),
            0 -1px 0 rgba(255,255,255,0.05);
        }

        /* ── LCD screen ─────────────────────────────────────────────
           Dark warm-black with cyan-monochrome text and a slim glow. */
        .walkman__screen {
          position: relative;
          padding: 2px;
          border-radius: 4px;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(255,255,255,0.15) 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.4),
            0 -1px 0 rgba(0,0,0,0.2);
          /* Stretch to fill its grid column. */
          min-width: 0;
        }
        .walkman__screen-inner {
          position: relative;
          padding: 9px 12px 8px;
          border-radius: 3px;
          background: #0e1719;
          color: #5fd8d8;
          font-family: var(--font-stack-chrome);
          font-size: 10px;
          line-height: 1.15;
          letter-spacing: 0.04em;
          text-shadow:
            0 0 1px rgba(95, 216, 216, 0.85),
            0 0 4px rgba(95, 216, 216, 0.35);
          /* Inner shadow for the recessed screen feel. */
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.7),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
          min-height: 56px;
          display: grid;
          row-gap: 2px;
          overflow: hidden;
        }
        .walkman__screen-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.06) 48%,
            rgba(255, 255, 255, 0.10) 52%,
            transparent 70%
          );
          pointer-events: none;
          border-radius: 3px;
        }
        .walkman__lcd-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
          animation: walkman-lcd-fade 340ms var(--ease);
        }
        @keyframes walkman-lcd-fade {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .walkman__lcd-row--top {
          justify-content: space-between;
        }
        .walkman__lcd-row--artist {
          opacity: 0.85;
        }
        .walkman__lcd-row--bottom {
          margin-top: 2px;
        }
        .walkman__note {
          flex: 0 0 auto;
        }
        .walkman__track {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }
        .walkman__artist {
          font-size: 9px;
          letter-spacing: 0.08em;
        }
        .walkman__play-glyph {
          font-size: 8px;
          /* The blinking caret on the bottom row. */
          animation: walkman-blink 1.6s steps(2, end) infinite;
        }
        @keyframes walkman-blink {
          0%, 60%   { opacity: 1; }
          61%, 100% { opacity: 0.2; }
        }
        .walkman__time {
          font-size: 11px;
          font-weight: 500;
        }
        .walkman__battery {
          display: inline-flex;
          gap: 1px;
          flex: 0 0 auto;
          padding-left: 6px;
        }
        .walkman__battery-cell {
          display: block;
          width: 3px;
          height: 6px;
          background: currentColor;
        }
        .walkman__battery-cell--off {
          background: rgba(95, 216, 216, 0.18);
        }

        /* ── Control cluster ────────────────────────────────────── */
        .walkman__controls {
          display: grid;
          grid-template-columns: auto auto auto;
          align-items: center;
          gap: 6px;
        }
        .walkman__btn {
          appearance: none;
          border: 0;
          width: 28px;
          height: 28px;
          padding: 0;
          margin: 0;
          border-radius: 999px;
          cursor: pointer;
          color: rgba(40, 38, 35, 0.65);
          font-family: var(--font-stack-chrome);
          font-size: 7px;
          letter-spacing: 0.02em;
          line-height: 1;
          background:
            radial-gradient(circle at 30% 25%,
              rgba(255,255,255,0.85) 0%,
              rgba(255,255,255,0.0) 40%
            ),
            linear-gradient(180deg, #efede9 0%, #c4c1bc 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 1px 2px rgba(0,0,0,0.22);
          transition: transform 120ms var(--ease), box-shadow 120ms var(--ease);
        }
        :root[data-theme="dark"] .walkman__btn {
          color: rgba(255,255,255,0.5);
          background:
            radial-gradient(circle at 30% 25%,
              rgba(255,255,255,0.4) 0%,
              rgba(255,255,255,0.0) 40%
            ),
            linear-gradient(180deg, #6a6661 0%, #2a2825 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 1px 2px rgba(0,0,0,0.45);
        }
        .walkman__btn:hover {
          transform: translateY(-0.5px);
        }
        .walkman__btn:active {
          transform: translateY(0.5px);
          box-shadow:
            inset 0 1px 2px rgba(0,0,0,0.25),
            0 0 0 transparent;
        }
        .walkman__btn--play {
          width: 36px;
          height: 36px;
          font-size: 9px;
          color: rgba(30, 28, 25, 0.85);
        }
        :root[data-theme="dark"] .walkman__btn--play {
          color: rgba(255,255,255,0.75);
        }
        .walkman__pause-bars {
          font-size: 9px;
          letter-spacing: -0.08em;
          margin-left: 1px;
        }

        /* ── The W-dot equivalent: rj-dot mark on the right ────────── */
        .walkman__mark {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          font-family: var(--font-stack-chrome);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.04em;
          color: rgba(40, 38, 35, 0.7);
          text-shadow:
            0 1px 0 rgba(255,255,255,0.8),
            0 -1px 0 rgba(0,0,0,0.05);
          padding-left: 4px;
        }
        :root[data-theme="dark"] .walkman__mark {
          color: rgba(255,255,255,0.62);
          text-shadow:
            0 1px 0 rgba(0,0,0,0.4),
            0 -1px 0 rgba(255,255,255,0.06);
        }
        .walkman__mark-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          margin-bottom: 1px;
        }

        /* ── Below-bezel micro label ─────────────────────────────── */
        .walkman__label {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 0 6px;
          color: var(--ink-4);
        }

        /* ── Click-affordance hint ───────────────────────────────── */
        .walkman__hint {
          position: absolute;
          top: calc(100% + 6px);
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
          animation: walkman-hint-in 200ms var(--ease);
        }
        @keyframes walkman-hint-in {
          0%   { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
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
          .walkman__play-glyph { animation: none; opacity: 0.9; }
          .walkman__lcd-row { animation: none; }
          .walkman__btn { transition: none; }
          .walkman__hint { animation: none; }
        }

        @media (max-width: 560px) {
          .walkman__body {
            grid-template-columns: auto 1fr auto auto;
            column-gap: 8px;
            padding: 12px 14px;
            height: clamp(78px, 22vw, 96px);
          }
          .walkman__wordmark { display: none; }
          .walkman__screen-inner { padding: 7px 10px 6px; }
          .walkman__btn { width: 22px; height: 22px; font-size: 6px; }
          .walkman__btn--play { width: 28px; height: 28px; font-size: 8px; }
          .walkman__mark { font-size: 14px; padding-left: 2px; }
        }
      `}</style>
    </div>
  );
}
