"use client";

import { useEffect, useState } from "react";
import PixelEQ from "@/components/PixelEQ";
import { useRotatingPlaylist } from "./useRotatingPlaylist";

/**
 * AudioFixture — the corner's signature element. A persistent fixture
 * that *looks* like a music player but emits no audio. Rotates a
 * curated playlist as metadata only. Solves the on-site copyright
 * constraint while preserving the music-coded sensibility.
 *
 * Layout, single line:
 *   [PixelEQ]  ▶  Title — Artist  ·  mm:ss / mm:ss
 *
 * Aria: the rotating display itself is aria-hidden (a screen reader
 * shouldn't be hit with a new title every ~12s). A single sr-only
 * span explains the conceit for assistive tech.
 *
 * Click affordance: clicking the play glyph opens a small inline
 * popover that names the conceit ("no audio — copyright. titles
 * rotate."). This is the "wait — what?" moment that travels.
 */

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AudioFixture() {
  const { track, trackIndex, positionSeconds } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);
  const [punched, setPunched] = useState(false);

  // Cross-fade the title block when the track rotates. We key on
  // trackIndex; the fade itself is a CSS animation that resets when
  // the key changes (because React unmounts/remounts the inner span).
  useEffect(() => {
    // Auto-dismiss the hint after a few seconds if left open.
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(id);
  }, [showHint]);

  return (
    <div className="corner-audio" role="group">
      <PixelEQ />

      <button
        type="button"
        className="corner-audio__glyph"
        aria-expanded={showHint}
        aria-label="What is this audio fixture?"
        onClick={() => {
          setShowHint((v) => !v);
          setPunched(true);
          window.setTimeout(() => setPunched(false), 140);
        }}
        data-punched={punched ? "" : undefined}
      >
        <span aria-hidden>▶</span>
      </button>

      {/* Title block — keyed on trackIndex so the cross-fade
          animation resets every rotation. Fixed width to prevent
          layout shift between short and long titles. */}
      <span
        className="corner-audio__title"
        key={trackIndex}
        aria-hidden="true"
      >
        <span className="corner-audio__track">{track.title}</span>
        <span className="corner-audio__sep">—</span>
        <span className="corner-audio__artist">{track.artist}</span>
      </span>

      <span className="corner-audio__time tabular" aria-hidden="true">
        <span className="corner-audio__sep">·</span>
        {formatMMSS(positionSeconds)} / {formatMMSS(track.runtime)}
      </span>

      {/* sr-only explanation of the silent fixture. Sighted users
          discover this via the click affordance below. */}
      <span className="sr-only">
        Silent music-metadata fixture. No audio is emitted from this page.
        Track titles rotate visually for atmosphere.
      </span>

      {showHint && (
        <span className="corner-audio__hint" role="status">
          no audio. (copyright.) the titles rotate.
        </span>
      )}

      <style>{`
        .corner-audio {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          color: var(--ink-2);
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-snug);
          line-height: 1;
          position: relative;
          flex-wrap: wrap;
          max-width: 100%;
        }
        .corner-audio__glyph {
          background: transparent;
          border: 0;
          cursor: pointer;
          color: var(--ink);
          font-family: var(--font-stack-mono);
          font-size: 11px;
          line-height: 1;
          padding: 2px 4px;
          margin: 0 2px;
          transition: transform 120ms var(--ease), color 180ms var(--ease);
        }
        .corner-audio__glyph[data-punched] {
          transform: scale(1.18);
        }
        .corner-audio__glyph:hover {
          color: var(--ink);
        }
        .corner-audio__title {
          display: inline-flex;
          align-items: baseline;
          gap: 0.5em;
          color: var(--ink);
          animation: corner-audio-fade 320ms var(--ease);
        }
        .corner-audio__track {
          color: var(--ink);
        }
        .corner-audio__sep {
          color: var(--ink-4);
        }
        .corner-audio__artist {
          color: var(--ink-3);
        }
        .corner-audio__time {
          color: var(--ink-3);
          display: inline-flex;
          align-items: baseline;
          gap: 0.5em;
        }
        .corner-audio__hint {
          /* small inline popover anchored to the fixture */
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
          animation: corner-audio-hint-in 180ms var(--ease);
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
        @keyframes corner-audio-fade {
          0%   { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes corner-audio-hint-in {
          0%   { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-audio__title { animation: none; }
          .corner-audio__hint { animation: none; }
          .corner-audio__glyph[data-punched] { transform: none; }
        }
        @media (max-width: 540px) {
          .corner-audio__time { display: none; }
        }
      `}</style>
    </div>
  );
}
