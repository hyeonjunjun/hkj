"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { PIECES, type Piece } from "@/constants/pieces";
import { SelectsGrid } from "./SelectsGrid";
import { NowPlayingPanel } from "./NowPlayingPanel";

/**
 * Wrap a state mutation in document.startViewTransition so the browser
 * captures before/after states and morphs between them. flushSync is
 * required so React applies the state change synchronously inside the
 * transition callback — otherwise the browser captures the OLD state
 * twice.
 *
 * Falls back to a plain mutation when the API isn't available
 * (Firefox, older browsers). The existing CSS transition on
 * grid-template-columns is the fallback animation in those cases.
 */
type ViewTransitionResult = {
  finished?: Promise<void>;
  ready?: Promise<void>;
};

function runViewTransition(mutate: () => void): void {
  if (typeof document === "undefined") {
    mutate();
    return;
  }
  const startVT = (document as Document & {
    startViewTransition?: (cb: () => void) => ViewTransitionResult;
  }).startViewTransition;
  if (typeof startVT !== "function") {
    mutate();
    return;
  }
  // Tag <html> with `vt-peek` so globals.css can scope the corner-peek
  // animation timings independently from the default route-transition
  // timings. Removed when the transition finishes (or aborts).
  const root = document.documentElement;
  root.classList.add("vt-peek");
  const result = startVT.call(document, () => {
    flushSync(mutate);
  });
  const cleanup = () => root.classList.remove("vt-peek");
  if (result.finished) {
    result.finished.then(cleanup, cleanup);
  } else {
    setTimeout(cleanup, 400);
  }
}

/**
 * IndexShell — owns the peek state for /v/corner.
 *
 * Composition (when panel is closed):
 *
 *   ┌─────────────────────────────────────────────────┐
 *   │ SelectsGrid (4 cols, full width)                │
 *   └─────────────────────────────────────────────────┘
 *
 * Composition (when panel is open):
 *
 *   ┌────────────────────────────────┐  ┌────────────┐
 *   │ SelectsGrid (3 cols, narrower) │  │ NowPlaying │
 *   │                                │  │   Panel    │
 *   └────────────────────────────────┘  └────────────┘
 *
 * Grid layout via CSS Grid template areas. The panel column appears
 * only when `activeSlug` is set, so the layout shifts without
 * covering content.
 *
 * State transitions:
 *   - closed + click → peek (activeSlug = clicked)
 *   - peeking + click on same tile → navigate to /work/[slug]
 *     (handled by SelectsGrid's Link, not intercepted)
 *   - peeking + click on different tile → swap (activeSlug = new)
 *   - peeking + click panel close (or Esc) → closed
 */

const SORTED: ReadonlyArray<Piece> = [...PIECES].sort((a, b) => a.order - b.order);

export function IndexShell() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = activeSlug ? SORTED.find((p) => p.slug === activeSlug) ?? null : null;
  const shellRef = useRef<HTMLDivElement | null>(null);

  const onPeek = useCallback((slug: string) => {
    runViewTransition(() => setActiveSlug(slug));
  }, []);

  const onClose = useCallback(() => {
    runViewTransition(() => setActiveSlug(null));
  }, []);

  // Keyboard navigation across tiles: arrow keys move focus along the
  // tile order; Enter triggers the link's native click (which goes
  // through SelectTile's handler — peek if not active, navigate if
  // active); Esc closes the panel.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && active) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" &&
          e.key !== "ArrowDown" && e.key !== "ArrowUp" &&
          e.key !== "Home" && e.key !== "End") return;

      const root = shellRef.current;
      if (!root) return;
      const tiles = Array.from(
        root.querySelectorAll<HTMLAnchorElement>(".select-tile__link"),
      );
      if (tiles.length === 0) return;

      const current = document.activeElement as HTMLElement | null;
      const idx = current ? tiles.indexOf(current as HTMLAnchorElement) : -1;
      if (idx < 0) return;

      // Estimate column count from layout: tiles in the same row share
      // approximately the same offsetTop (within a few px). The first
      // tile whose offsetTop is meaningfully greater than tile 0's is
      // in row 2 — that boundary gives the col count.
      const firstTop = tiles[0].getBoundingClientRect().top;
      let cols = tiles.length;
      for (let i = 1; i < tiles.length; i++) {
        if (tiles[i].getBoundingClientRect().top - firstTop > 4) {
          cols = i;
          break;
        }
      }

      let next = idx;
      switch (e.key) {
        case "ArrowRight": next = idx + 1; break;
        case "ArrowLeft":  next = idx - 1; break;
        case "ArrowDown":  next = idx + cols; break;
        case "ArrowUp":    next = idx - cols; break;
        case "Home":       next = 0; break;
        case "End":        next = tiles.length - 1; break;
      }
      if (next < 0 || next >= tiles.length || next === idx) return;
      e.preventDefault();
      tiles[next].focus();
    },
    [active, onClose],
  );

  return (
    <div
      className="index-shell"
      data-open={active ? "" : undefined}
      ref={shellRef}
      onKeyDown={onKeyDown}
    >
      <div className="index-shell__main">
        <SelectsGrid
          pieces={SORTED}
          activeSlug={activeSlug}
          onPeek={onPeek}
          panelOpen={Boolean(active)}
        />
      </div>
      <div className="index-shell__rail" aria-hidden={!active}>
        {active && <NowPlayingPanel piece={active} onClose={onClose} />}
      </div>

      <style>{`
        .index-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 0;
          /* No CSS transition on grid-template-columns — View
             Transitions handle the visual morph (tile-by-tile via
             per-tile view-transition-name, plus a custom rail slide
             defined for the corner-rail name in globals.css). The
             column count change still happens instantly under the
             hood, but the view-transition snapshot interpolates the
             before/after states. */
          align-items: start;
          min-height: 0;
        }
        .index-shell[data-open] {
          /* Rail takes up its content width when open. clamp keeps it
             readable across viewports. */
          grid-template-columns: minmax(0, 1fr) clamp(320px, 30vw, 420px);
        }

        .index-shell__main {
          min-width: 0;
        }
        .index-shell__rail {
          overflow: hidden;
          align-self: stretch;
          /* When closed, the rail has no panel inside (active=null),
             so this column has zero content; combined with the 0px
             grid-template-columns above, it disappears. */
        }

        /* Below the peek breakpoint, drop peek behavior entirely: the
           rail collapses and the grid stays 4-col (sized for its own
           breakpoints in SelectsGrid). Tile clicks navigate directly
           per the matchMedia check in SelectTile. */
        @media (max-width: 959px) {
          .index-shell,
          .index-shell[data-open] {
            grid-template-columns: 1fr;
          }
          .index-shell__rail {
            display: none;
          }
        }

      `}</style>
    </div>
  );
}
