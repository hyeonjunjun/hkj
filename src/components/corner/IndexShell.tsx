"use client";

import { useCallback, useState } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import { SelectsGrid } from "./SelectsGrid";
import { NowPlayingPanel } from "./NowPlayingPanel";

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

  const onPeek = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const onClose = useCallback(() => {
    setActiveSlug(null);
  }, []);

  return (
    <div className="index-shell" data-open={active ? "" : undefined}>
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
          /* Smooth column transition. The 0-width rail collapses to
             nothing visually. */
          transition: grid-template-columns 420ms var(--ease);
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

        @media (prefers-reduced-motion: reduce) {
          .index-shell { transition: none; }
        }
      `}</style>
    </div>
  );
}
