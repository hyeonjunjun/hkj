"use client";

import { useEffect, useState } from "react";

/**
 * NowPlaying — live Last.fm "now playing" line.
 *
 * Polls /api/now-playing every 60s. Renders a 2-line block:
 *   line 1: track + artist
 *   line 2: relative time stamp (e.g. "now playing" or "03:42 ago")
 *
 * Renders NOTHING when:
 *   - the API route returns { ok: false } (env not configured)
 *   - the fetch fails for any reason
 *   - no track is returned
 *
 * The lede on the home claims you're a "habitual collector of mixes
 * and voice memos" — this turns the claim into evidence. Updates
 * silently in the background; no loading state, no spinner.
 */

type Track = {
  name: string;
  artist: string;
  album: string;
  url: string;
};

type Response =
  | { ok: false; reason?: string }
  | {
      ok: true;
      nowPlaying: boolean;
      track: Track;
      playedAt: string | null;
    };

const POLL_MS = 60_000;

function formatRelative(iso: string | null): string {
  if (!iso) return "now playing";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NowPlaying() {
  const [data, setData] = useState<Response | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as Response;
        if (!cancelled) setData(json);
      } catch {
        // silent — no toast, no error UI
      }
    }
    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!data || !data.ok) return null;

  const { track, nowPlaying, playedAt } = data;
  const stamp = nowPlaying ? "now playing" : formatRelative(playedAt);

  return (
    <div className="np">
      <p className="t-meta dim np__label">Now playing</p>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="np__track"
      >
        {track.artist.toLowerCase()} — {track.name.toLowerCase()}
      </a>
      <p className="t-meta dimmer np__stamp">{stamp}</p>

      <style>{`
        .np {
          display: grid;
          row-gap: 4px;
          width: 100%;
        }
        .np__label,
        .np__stamp {
          margin: 0;
        }
        .np__track {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          line-height: 1.4;
          letter-spacing: 0;
          color: var(--ink);
          text-transform: lowercase;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
          width: max-content;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .np__track:hover {
          background-size: 100% 1px;
        }
      `}</style>
    </div>
  );
}
