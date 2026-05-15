"use client";

import { useEffect, useState } from "react";
import { useRotatingPlaylist } from "./useRotatingPlaylist";
import { CORNER_PLAYLIST } from "@/constants/corner-playlist";

/**
 * CornerAudio — compact Spotify-style now-playing fixture pinned to
 * the bottom-right corner across /v/corner/*.
 *
 * Anatomy:
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ [cover]  ▶  Track Title · Artist Name    02:14   │
 *   │          ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  (on hover)
 *   └──────────────────────────────────────────────────┘
 *
 * Track title links out to the song's public Spotify URL (target=_blank).
 * Cover thumbnail is the Spotify album art (300px JPEG from oEmbed).
 *
 * Entrance choreography (first paint, ~1.2s total):
 *   t+480ms  widget fades in
 *   t+680ms  LCD scan-line begins sweeping across the screen area
 *   t+900ms  scan ends; cover + title + artist + time fully revealed
 * Grid stagger-fade is delayed in SelectsGrid to begin AFTER this
 * sequence so the audio fixture "boots" first.
 *
 * Reduced-motion-safe: skips the scan sweep but preserves the fade-in.
 */

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CornerAudio() {
  const { track, trackIndex, positionSeconds, rotationCount } = useRotatingPlaylist();
  const [showHint, setShowHint] = useState(false);
  const [booted, setBooted] = useState(false);

  // Boot phase ends ~900ms after mount. After that, normal stable
  // rendering takes over (cross-fade per track change handled by the
  // animation on .corner-audio-fixed__track keyed on trackIndex).
  useEffect(() => {
    const id = setTimeout(() => setBooted(true), 900);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setShowHint(false), 4200);
    return () => clearTimeout(id);
  }, [showHint]);

  // Queue ordering — show the next N tracks in playlist order starting
  // after the currently playing one. Wraps the array end so the queue
  // is always full.
  const QUEUE_LENGTH = 7;
  const queue = Array.from({ length: QUEUE_LENGTH }, (_, i) => {
    const idx = (trackIndex + i + 1) % CORNER_PLAYLIST.length;
    return { piece: CORNER_PLAYLIST[idx], idx };
  });

  return (
    <aside
      className="corner-audio-fixed"
      aria-label="Now playing"
      data-booted={booted ? "" : undefined}
    >
      {/* The LCD scan-line: a thin gradient that sweeps top-to-bottom
          across the widget content area during the boot phase, fading
          out at the end. Pure-CSS animation; no JS work after mount. */}
      <span className="corner-audio-fixed__scan" aria-hidden />

      <div className="corner-audio-fixed__row corner-audio-fixed__row--top">
        {track.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.cover}
            alt=""
            className="corner-audio-fixed__cover"
            width={28}
            height={28}
            loading="lazy"
          />
        ) : (
          <span className="corner-audio-fixed__cover corner-audio-fixed__cover--placeholder" aria-hidden />
        )}

        <span className="corner-audio-fixed__icon" aria-hidden>▶</span>

        {/* Title link wraps the title + sep + artist so the entire
            line is the click target. Falls back to a plain span when
            no URL is set. Keyed on trackIndex so the cross-fade
            animation resets each rotation. */}
        {track.url ? (
          <a
            className="corner-audio-fixed__track"
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            key={trackIndex}
            aria-label={`Open ${track.title} by ${track.artist} on Spotify`}
          >
            <TrackContent track={track} />
          </a>
        ) : (
          <span className="corner-audio-fixed__track" key={trackIndex}>
            <TrackContent track={track} />
          </span>
        )}

        <span className="corner-audio-fixed__time tabular t-warmth">
          {formatMMSS(positionSeconds)}
        </span>

        <button
          type="button"
          className="corner-audio-fixed__hintbtn t-warmth"
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
      <div
        className="corner-audio-fixed__progress"
        role="progressbar"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={track.runtime}
        aria-valuenow={Math.round(positionSeconds)}
      >
        <span
          className="corner-audio-fixed__progress-fill"
          style={{ transform: `scaleX(${positionSeconds / track.runtime})` }}
        />
        <span
          className="corner-audio-fixed__progress-head"
          style={{ left: `${(positionSeconds / track.runtime) * 100}%` }}
          aria-hidden
        />
      </div>

      {showHint && (
        <p className="corner-audio-fixed__hint t-warmth" role="status">
          no audio. (copyright.) the titles rotate. click to open on spotify.
          {rotationCount > 0 && (
            <>
              {" "}<span className="corner-audio-fixed__rotation tabular">
                rotation {rotationCount.toLocaleString()} since 2023-11-14
              </span>
            </>
          )}
        </p>
      )}

      {/* Queue dropdown — Spotify-style upcoming-tracks list that
          slides up above the widget on hover. Stays open while the
          cursor is inside the bridge or the queue itself so it's not
          jumpy. Tracks link out to Spotify when a URL exists. */}
      <div className="corner-audio-fixed__queue" aria-hidden role="presentation">
        <div className="corner-audio-fixed__queue-head">
          <span className="t-warmth corner-audio-fixed__queue-title">Queue</span>
          <span className="t-warmth corner-audio-fixed__queue-meta tabular">
            {String(queue.length).padStart(2, "0")} upcoming
          </span>
        </div>
        <ol className="corner-audio-fixed__queue-list">
          {queue.map(({ piece, idx }) => (
            <li
              key={`${idx}-${piece.title}`}
              className="corner-audio-fixed__queue-item"
            >
              <QueueRow track={piece} />
            </li>
          ))}
        </ol>
      </div>

      <span className="sr-only">
        Silent music-metadata fixture. No audio is emitted from this page.
      </span>

      <style>{`
        .corner-audio-fixed {
          position: fixed;
          right: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vh, 28px);
          z-index: 30;
          padding: 8px 12px 8px 8px;
          background: var(--paper);
          color: var(--ink-2);
          border: 1px solid var(--ink-hair);
          border-radius: 4px;
          font-family: var(--font-stack-spotify);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.06),
            0 2px 6px rgba(0, 0, 0, 0.04);
          display: grid;
          row-gap: 4px;
          opacity: 0;
          transform: translateY(8px);
          animation: corner-audio-fixed-in 520ms var(--ease) 480ms forwards;
          max-width: calc(100vw - 32px);
          overflow: hidden;
          isolation: isolate;
        }
        @keyframes corner-audio-fixed-in {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* LCD boot scan — thin bright bar sweeps the widget. */
        .corner-audio-fixed__scan {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent 0%,
            transparent 45%,
            rgba(232, 178, 90, 0.55) 49%,
            rgba(232, 178, 90, 0.85) 50%,
            rgba(232, 178, 90, 0.55) 51%,
            transparent 55%,
            transparent 100%
          );
          opacity: 0;
          transform: translateY(-100%);
          animation: corner-audio-scan 480ms cubic-bezier(0.4, 0, 0.2, 1) 680ms forwards;
        }
        @keyframes corner-audio-scan {
          0%   { opacity: 0;    transform: translateY(-110%); }
          15%  { opacity: 0.95; }
          85%  { opacity: 0.95; }
          100% { opacity: 0;    transform: translateY(110%); }
        }

        /* Content reveals progressively during boot via a CSS-driven
           opacity ramp. Once .corner-audio-fixed[data-booted] is set,
           the override below makes everything fully visible. */
        .corner-audio-fixed__row,
        .corner-audio-fixed__progress,
        .corner-audio-fixed__hint {
          opacity: 0;
          transition: opacity 320ms var(--ease);
        }
        .corner-audio-fixed[data-booted] .corner-audio-fixed__row,
        .corner-audio-fixed[data-booted] .corner-audio-fixed__progress,
        .corner-audio-fixed[data-booted] .corner-audio-fixed__hint {
          opacity: 1;
        }

        .corner-audio-fixed__row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .corner-audio-fixed__cover {
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          object-fit: cover;
          border-radius: 2px;
          background: var(--paper-2);
          border: 1px solid var(--ink-ghost);
        }
        .corner-audio-fixed__cover--placeholder {
          display: block;
          background:
            repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 4px,
              var(--ink-ghost) 4px,
              var(--ink-ghost) 5px
            ),
            var(--paper-2);
        }

        .corner-audio-fixed__icon {
          color: var(--ink);
          font-size: 8px;
          animation: corner-audio-blink 1.8s steps(2, end) infinite;
          flex: 0 0 auto;
        }
        @keyframes corner-audio-blink {
          0%, 60%   { opacity: 1; }
          61%, 100% { opacity: 0.35; }
        }
        .corner-audio-fixed__track {
          flex: 1 1 auto;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.2;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          animation: corner-audio-fade 280ms var(--ease);
          color: var(--ink);
          /* Underline on hover only when this is a link */
          border-bottom: 1px solid transparent;
          transition: border-color 200ms var(--ease);
        }
        a.corner-audio-fixed__track {
          text-decoration: none;
        }
        a.corner-audio-fixed__track:hover {
          border-bottom-color: var(--ink-3);
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
          font-weight: 400;
        }
        .corner-audio-fixed__time {
          color: var(--ink-3);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -0.005em;
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
          font-family: var(--font-stack-spotify);
          font-size: 11px;
        }
        .corner-audio-fixed__hintbtn:hover {
          color: var(--ink);
        }

        /* ── Progress bar (always visible) ──────────────────────────
           Slim 2px rail under the now-playing row. Track = --ink-hair
           (just-perceivable at the corner's contrast). Fill = --accent
           (warm Solari amber) since the now-playing IS the live signal
           the accent is reserved for. Smooth scaleX transform animation
           — no per-frame layout work. A tiny playhead dot at the fill
           edge gives a Spotify-style cursor without being draggable. */
        .corner-audio-fixed__progress {
          position: relative;
          width: 100%;
          height: 2px;
          background: var(--ink-hair);
          border-radius: 1px;
          overflow: visible;
          margin-top: 2px;
        }
        .corner-audio-fixed__progress-fill {
          position: absolute;
          inset: 0;
          background: var(--accent);
          border-radius: 1px;
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .corner-audio-fixed__progress-head {
          position: absolute;
          top: 50%;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          margin-top: -3px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 2px var(--paper);
          pointer-events: none;
          transition: left 360ms cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 200ms var(--ease);
          opacity: 0;
        }
        .corner-audio-fixed:hover .corner-audio-fixed__progress-head {
          opacity: 1;
        }
        .corner-audio-fixed[data-booted] .corner-audio-fixed__progress-fill {
          /* No transition during boot — let the scan reveal it. After
             boot, smooth time-driven advancement. */
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-audio-fixed__progress-fill,
          .corner-audio-fixed__progress-head {
            transition: none;
          }
        }

        .corner-audio-fixed__hint {
          color: var(--ink-2);
          text-transform: lowercase;
          padding-top: 4px;
          margin: 0;
          font-size: 10.5px;
          letter-spacing: -0.005em;
          font-weight: 400;
        }
        .corner-audio-fixed__rotation {
          /* "rotation X since 2023-11-14" — a small time-anchored
             marker that shows the silent fixture has been alive for
             months. Lower contrast so it doesn't compete with the
             main hint sentence. */
          display: block;
          margin-top: 4px;
          color: var(--ink-3);
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Queue dropdown ────────────────────────────────────────
           Spotify-style "upcoming tracks" panel anchored above the
           widget. Hidden by default; slides up + fades in on widget
           hover. Two reveal triggers:
             - hover the widget itself
             - keyboard focus inside the widget
           Animated opacity + translateY so it has a real entrance,
           not just an instant pop-in. Allows hover to span the small
           gap between widget and queue via a top: calc() offset that
           overlaps with a pseudo-bridge. */
        .corner-audio-fixed__queue {
          position: absolute;
          /* sit above the widget with an 8px bridge that pseudo-extends
             the hover hit area; bridged via the negative top + bottom
             padding pattern below. */
          left: 0;
          right: 0;
          bottom: calc(100% + 8px);
          padding: 10px 12px 12px;
          background: var(--paper);
          color: var(--ink-2);
          border: 1px solid var(--ink-hair);
          border-radius: 4px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow:
            0 -8px 24px rgba(0, 0, 0, 0.06),
            0 -2px 6px rgba(0, 0, 0, 0.04);
          opacity: 0;
          transform: translateY(6px);
          pointer-events: none;
          transition:
            opacity 200ms var(--ease),
            transform 240ms var(--ease);
          z-index: 1;
        }
        /* Invisible bridge so the cursor can travel from the widget
           into the queue without the queue hiding mid-traverse. */
        .corner-audio-fixed__queue::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          height: 10px;
        }
        .corner-audio-fixed:hover .corner-audio-fixed__queue,
        .corner-audio-fixed:focus-within .corner-audio-fixed__queue {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .corner-audio-fixed__queue-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 4px 8px;
          border-bottom: 1px solid var(--ink-ghost);
          margin-bottom: 4px;
        }
        .corner-audio-fixed__queue-title {
          color: var(--ink);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.005em;
        }
        .corner-audio-fixed__queue-meta {
          color: var(--ink-3);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .corner-audio-fixed__queue-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: 1px;
        }
        .corner-audio-fixed__queue-item {
          list-style: none;
        }
        .queue-row {
          display: flex;
          align-items: baseline;
          padding: 4px 6px;
          font-family: var(--font-stack-spotify);
          font-size: 11px;
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: inherit;
          border-radius: 2px;
          transition: background 160ms var(--ease);
          text-decoration: none;
        }
        .queue-row--link {
          cursor: pointer;
        }
        .queue-row--link:hover {
          background: var(--ink-ghost);
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-audio-fixed__queue {
            transition: opacity 200ms var(--ease);
            transform: none;
          }
        }
        @media (max-width: 540px) {
          .corner-audio-fixed__queue {
            display: none;
          }
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
          .corner-audio-fixed__scan { display: none; }
          .corner-audio-fixed__row,
          .corner-audio-fixed__hint { opacity: 1; transition: none; }
        }
        @media (max-width: 540px) {
          .corner-audio-fixed {
            right: 12px;
            bottom: 12px;
            padding: 6px 10px 6px 6px;
            font-size: 9px;
          }
          .corner-audio-fixed__cover { width: 22px; height: 22px; }
        }
      `}</style>
    </aside>
  );
}

function TrackContent({ track }: { track: { title: string; artist: string } }) {
  return (
    <>
      <span className="corner-audio-fixed__title">{track.title}</span>
      <span className="corner-audio-fixed__sep" aria-hidden>·</span>
      <span className="corner-audio-fixed__artist">{track.artist}</span>
    </>
  );
}

/**
 * QueueRow — single upcoming-track line inside the queue dropdown.
 * Title · Artist on the left, runtime (mm:ss) tabular on the right.
 * Whole row is a link when the track has a Spotify URL.
 */
function QueueRow({
  track,
}: {
  track: { title: string; artist: string; runtime: number; url?: string };
}) {
  const runtime = `${Math.floor(track.runtime / 60)}:${String(
    track.runtime % 60,
  ).padStart(2, "0")}`;
  const inner = (
    <>
      <span className="queue-row__text">
        <span className="queue-row__title">{track.title}</span>
        <span className="queue-row__sep" aria-hidden>·</span>
        <span className="queue-row__artist">{track.artist}</span>
      </span>
      <span className="queue-row__time tabular">{runtime}</span>
      <style>{`
        .queue-row__text {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .queue-row__title { color: var(--ink); font-weight: 500; }
        .queue-row__sep { color: var(--ink-4); margin: 0 0.35em; }
        .queue-row__artist { color: var(--ink-3); font-weight: 400; }
        .queue-row__time {
          flex: 0 0 auto;
          color: var(--ink-3);
          font-size: 10px;
          margin-left: 8px;
        }
      `}</style>
    </>
  );
  if (track.url) {
    return (
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="queue-row queue-row--link"
        aria-label={`Open ${track.title} by ${track.artist} on Spotify`}
      >
        {inner}
      </a>
    );
  }
  return <span className="queue-row">{inner}</span>;
}
