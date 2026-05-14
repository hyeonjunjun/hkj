"use client";

import { ASCIIPlayer } from "./ASCIIPlayer";

/**
 * AudioFixture — the corner's signature audio fixture.
 *
 * Implementation history:
 *   v0  — single-line text fixture (▶ track — artist · mm:ss)
 *   v1  — dot-matrix LED panel (NOTHING-coded)
 *   v2  — Walkman-style USB-stick device (Sony NW-E form)
 *   v3  — ASCII-only typographic player (Flora-level restraint)
 *
 * v3 is the current. Pages keep importing `AudioFixture` so swaps
 * stay in this module.
 */

export function AudioFixture() {
  return <ASCIIPlayer />;
}
