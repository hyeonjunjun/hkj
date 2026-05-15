"use client";

import { useEffect, useState } from "react";
import { CORNER_PLAYLIST, CORNER_PLAYLIST_EPOCH, type CornerTrack } from "@/constants/corner-playlist";

/**
 * useRotatingPlaylist — derives "what's playing right now" from real
 * time elapsed since a fixed epoch. Two consequences:
 *
 *   1. Every visitor at the same wall-clock moment sees the same track
 *      and the same position within it. The rotation is shared.
 *   2. Navigating between pages picks up wherever the rotation actually
 *      is — there is no per-mount reset, no fake "starts at zero."
 *
 * Update cadence is 1Hz, which is plenty for the visible mm:ss display.
 * Track transitions are detected by the parent via the returned track
 * identity, so it can fade the title cross-fade on rotation.
 *
 * Pauses when `document.hidden` so background tabs don't burn the
 * interval (the next visible read recomputes from real time, so no
 * state catches up; the truth is always "now − epoch").
 */

export interface PlaybackState {
  track: CornerTrack;
  trackIndex: number;
  /** Position within the current track, in seconds (integer). */
  positionSeconds: number;
  /** How many full playlist cycles have completed since the epoch. */
  rotationCount: number;
}

const PLAYLIST_TOTAL_SECONDS = CORNER_PLAYLIST.reduce(
  (acc, t) => acc + t.runtime,
  0,
);

function computeState(nowMs: number): PlaybackState {
  // Position within the looping playlist, in seconds since epoch.
  const elapsedSeconds = Math.floor((nowMs - CORNER_PLAYLIST_EPOCH) / 1000);
  const rotationCount = Math.max(0, Math.floor(elapsedSeconds / PLAYLIST_TOTAL_SECONDS));
  let pos = ((elapsedSeconds % PLAYLIST_TOTAL_SECONDS) + PLAYLIST_TOTAL_SECONDS) % PLAYLIST_TOTAL_SECONDS;
  let trackIndex = 0;
  for (let i = 0; i < CORNER_PLAYLIST.length; i++) {
    if (pos < CORNER_PLAYLIST[i].runtime) {
      trackIndex = i;
      break;
    }
    pos -= CORNER_PLAYLIST[i].runtime;
  }
  return {
    track: CORNER_PLAYLIST[trackIndex],
    trackIndex,
    positionSeconds: pos,
    rotationCount,
  };
}

export function useRotatingPlaylist(): PlaybackState {
  // SSR-stable initial: the first track at position 0. Real time
  // takes over after mount. The brief mismatch between SSR HTML and
  // first client paint is invisible because the mm:ss is part of the
  // audio fixture, not anything layout-load-bearing.
  const [state, setState] = useState<PlaybackState>(() => ({
    track: CORNER_PLAYLIST[0],
    trackIndex: 0,
    positionSeconds: 0,
    rotationCount: 0,
  }));

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      if (typeof document !== "undefined" && document.hidden) return;
      setState(computeState(Date.now()));
    };

    // Initial sync to real time, then 1Hz updates.
    tick();
    const id = setInterval(tick, 1000);

    // Resume on tab focus.
    const onVis = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return state;
}
