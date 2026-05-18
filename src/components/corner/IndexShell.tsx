"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { PIECES, type Piece } from "@/constants/pieces";
import { SelectsGrid } from "./SelectsGrid";
import { NowPlayingPanel } from "./NowPlayingPanel";

/**
 * IndexShell — one grid, two registers.
 *
 *   ?view=projects  → media height folds to 0; titles stay put, stacking
 *                     vertically with the grid's row-gap as padding.
 *   default         → media at natural 16:9; tiles read as the gallery.
 *
 * The transition is a per-tile height fold (staggered) driven by GSAP.
 * Titles are not translated. The peek panel is grid-only and closes
 * automatically when the URL flips to the projects view.
 */

type View = "grid" | "ledger";

const SORTED: ReadonlyArray<Piece> = [...PIECES].sort((a, b) => a.order - b.order);

const FOLD_DURATION = 0.7;
const FOLD_EASE = "power2.inOut";
const FOLD_STAGGER = 0.018;

export function IndexShell() {
  const searchParams = useSearchParams();
  const view: View =
    searchParams?.get("view") === "projects" ? "ledger" : "grid";

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = activeSlug ? SORTED.find((p) => p.slug === activeSlug) ?? null : null;

  const shellRef = useRef<HTMLDivElement | null>(null);
  const prevView = useRef<View | null>(null);

  // Switching to the ledger closes any open peek so the panel doesn't
  // dangle over a folded grid.
  useEffect(() => {
    if (view === "ledger" && activeSlug) setActiveSlug(null);
  }, [view, activeSlug]);

  // Drive the fold. useLayoutEffect runs before paint so the first
  // mount with view=ledger paints with media already at height 0 (no
  // flash of natural-height tiles).
  useLayoutEffect(() => {
    const root = shellRef.current;
    if (!root) return;
    const media = Array.from(
      root.querySelectorAll<HTMLElement>(".select-tile__media"),
    );
    if (media.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFirst = prevView.current === null;

    if (view === "ledger") {
      if (reduced || isFirst) {
        gsap.set(media, { height: 0 });
      } else {
        gsap.to(media, {
          height: 0,
          duration: FOLD_DURATION,
          ease: FOLD_EASE,
          stagger: FOLD_STAGGER,
          overwrite: "auto",
        });
      }
    } else {
      if (reduced || isFirst) {
        gsap.set(media, { clearProps: "height" });
      } else {
        // Unfold from 0 to the natural 16:9 height for each tile. After
        // the tween, clear the inline height so aspect-ratio takes back
        // over for any subsequent resize.
        media.forEach((el, i) => {
          const target = el.offsetWidth * 9 / 16;
          gsap.fromTo(
            el,
            { height: 0 },
            {
              height: target,
              duration: FOLD_DURATION,
              ease: FOLD_EASE,
              delay: i * FOLD_STAGGER,
              overwrite: "auto",
              onComplete: () => gsap.set(el, { clearProps: "height" }),
            },
          );
        });
      }
    }

    prevView.current = view;
  }, [view]);

  const onPeek = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const onClose = useCallback(() => {
    setActiveSlug(null);
  }, []);

  // Keyboard navigation across tiles.
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

  const railOpen = Boolean(active) && view === "grid";

  return (
    <div
      className="index-shell"
      data-open={railOpen ? "" : undefined}
      data-view={view}
      ref={shellRef}
      onKeyDown={onKeyDown}
    >
      <div className="index-shell__main">
        <SelectsGrid
          pieces={SORTED}
          activeSlug={activeSlug}
          onPeek={onPeek}
          panelOpen={railOpen}
          folded={view === "ledger"}
        />
      </div>
      <div className="index-shell__rail" aria-hidden={!railOpen}>
        {active && view === "grid" && <NowPlayingPanel piece={active} onClose={onClose} />}
      </div>

      <style>{`
        .index-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 0;
          align-items: start;
          min-height: 0;
        }
        .index-shell[data-open] {
          grid-template-columns: minmax(0, 1fr) clamp(320px, 30vw, 420px);
        }
        .index-shell__main {
          min-width: 0;
        }
        .index-shell__rail {
          overflow: hidden;
          align-self: stretch;
        }

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
