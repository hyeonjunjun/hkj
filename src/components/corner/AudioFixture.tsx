"use client";

import { WalkmanDevice } from "./WalkmanDevice";

/**
 * AudioFixture — the corner's signature audio "device."
 *
 * Implementation has moved through:
 *   v0: single-line text fixture (▶ track — artist · mm:ss)
 *   v1: dot-matrix LED panel (NOTHING-coded)
 *   v2: Walkman-style USB-stick device (Sony NW-E series form)
 *
 * This module stays as the named export so the pages can keep
 * importing `AudioFixture` while the visual implementation evolves.
 */

export function AudioFixture() {
  return <WalkmanDevice />;
}
