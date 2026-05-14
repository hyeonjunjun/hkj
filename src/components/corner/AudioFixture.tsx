"use client";

import { LEDPanel } from "./LEDPanel";

/**
 * AudioFixture — the corner's signature audio "device."
 *
 * v1 (single-line text fixture) was replaced by a dot-matrix LED
 * panel as of 2026-05-14. This module stays as the named export so
 * the pages (and any future surface) can keep importing
 * `AudioFixture` while the internal implementation evolves.
 *
 * If we ever want to ship a side-by-side comparison or a swappable
 * "compact" mode, that decision lives here — not in the route.
 */

export function AudioFixture() {
  return <LEDPanel />;
}
