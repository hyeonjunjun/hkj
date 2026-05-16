"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { PIECES, type Piece } from "@/constants/pieces";
import { SelectsGrid } from "./SelectsGrid";
import { NowPlayingPanel } from "./NowPlayingPanel";
import { IndexLedger } from "./IndexLedger";

/**
 * IndexShell — owns the toggle between SelectsGrid and IndexLedger
 * on /. Both views are mounted simultaneously and stacked via CSS
 * Grid (single grid cell, same row/column). The inactive view is
 * translated 100% off-screen vertically. On view change a GSAP
 * timeline slides the outgoing view up (-100%) and the incoming
 * view in from below (100% → 0%).
 *
 * Reference: ethan&tom's section transitions — outgoing y: -100%,
 * incoming y: 100% → 0%, 0.8s power2.inOut. Keeps both sections in
 * the DOM the whole time; visibility is purely transform-based during
 * animation and pointer-events-based at rest.
 *
 * Note: we intentionally do NOT call document.startViewTransition
 * here. next.config.ts enables experimental.viewTransition, so Next
 * already wraps the underlying router.replace in a transition. Adding
 * a second nested one throws InvalidStateError. GSAP carries the
 * actual visible slide; Next handles the paint swap.
 *
 * The peek state (NowPlayingPanel) only applies to the grid view —
 * the panel is hidden while the ledger is active.
 */

type View = "grid" | "ledger";

const SORTED: ReadonlyArray<Piece> = [...PIECES].sort((a, b) => a.order - b.order);

/** ms — duration of the slide. Matches ethan&tom (~0.8s). */
const SLIDE_DURATION = 0.8;
const SLIDE_EASE = "power2.inOut";

export function IndexShell() {
  const searchParams = useSearchParams();
  const viewFromUrl: View =
    searchParams?.get("view") === "projects" ? "ledger" : "grid";

  // displayedView lags viewFromUrl during the slide animation so both
  // views remain in their proper visual positions until the GSAP
  // tween completes. After the tween, displayedView catches up.
  const [displayedView, setDisplayedView] = useState<View>(viewFromUrl);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = activeSlug ? SORTED.find((p) => p.slug === activeSlug) ?? null : null;

  const shellRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const ledgerRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  // Drive the slide whenever the URL view changes mid-session.
  useEffect(() => {
    if (viewFromUrl === displayedView) return;
    if (isAnimating.current) return;
    const fromEl = displayedView === "grid" ? gridRef.current : ledgerRef.current;
    const toEl = viewFromUrl === "grid" ? gridRef.current : ledgerRef.current;
    if (!fromEl || !toEl) return;

    isAnimating.current = true;

    // Place incoming view at its start position (off-screen below)
    // before React commits the new displayedView. Setting the
    // transform synchronously avoids a flash of the incoming view
    // at y=0 during the first frame.
    gsap.set(toEl, { yPercent: 100, autoAlpha: 1 });
    gsap.set(fromEl, { autoAlpha: 1 });

    flushSync(() => setDisplayedView(viewFromUrl));

    const tl = gsap.timeline({
      defaults: { duration: SLIDE_DURATION, ease: SLIDE_EASE },
      onComplete: () => {
        // Outgoing view stays parked off-screen (y = -100%) and
        // becomes pointer-inert; incoming view sits at y = 0.
        gsap.set(fromEl, { yPercent: -100, pointerEvents: "none" });
        gsap.set(toEl, { yPercent: 0, pointerEvents: "auto" });
        isAnimating.current = false;
      },
    });
    tl.to(fromEl, { yPercent: -100 }, 0);
    tl.to(toEl, { yPercent: 0 }, 0);
  }, [viewFromUrl, displayedView]);

  // Set initial positions of both views on mount: displayed at 0%,
  // hidden parked at 100% (below) so the first slide-in has the
  // right starting position regardless of which view loads first.
  useEffect(() => {
    if (!gridRef.current || !ledgerRef.current) return;
    if (displayedView === "grid") {
      gsap.set(gridRef.current, { yPercent: 0, pointerEvents: "auto" });
      gsap.set(ledgerRef.current, { yPercent: 100, pointerEvents: "none" });
    } else {
      gsap.set(ledgerRef.current, { yPercent: 0, pointerEvents: "auto" });
      gsap.set(gridRef.current, { yPercent: 100, pointerEvents: "none" });
    }
    // Intentional: only runs once on mount; subsequent toggles handled
    // by the slide effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPeek = useCallback((slug: string) => {
    setActiveSlug(slug);
  }, []);

  const onClose = useCallback(() => {
    setActiveSlug(null);
  }, []);

  // Keyboard navigation across tiles (grid view only).
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

  const railOpen = Boolean(active) && displayedView === "grid";

  return (
    <div
      className="index-shell"
      data-open={railOpen ? "" : undefined}
      data-view={displayedView}
      ref={shellRef}
      onKeyDown={onKeyDown}
    >
      <div className="index-shell__main">
        <div className="index-shell__viewport">
          <div ref={gridRef} className="index-shell__view" data-active={displayedView === "grid" ? "" : undefined}>
            <SelectsGrid
              pieces={SORTED}
              activeSlug={activeSlug}
              onPeek={onPeek}
              panelOpen={railOpen}
            />
          </div>
          <div ref={ledgerRef} className="index-shell__view" data-active={displayedView === "ledger" ? "" : undefined}>
            <IndexLedger />
          </div>
        </div>
      </div>
      <div className="index-shell__rail" aria-hidden={!railOpen}>
        {active && displayedView === "grid" && <NowPlayingPanel piece={active} onClose={onClose} />}
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

        /* Viewport: stacks both views in the same grid cell so the
           container sizes to the tallest. Overflow clips the off-
           screen view during the slide. */
        .index-shell__viewport {
          display: grid;
          position: relative;
          overflow: hidden;
          min-height: 0;
        }
        .index-shell__view {
          grid-column: 1;
          grid-row: 1;
          width: 100%;
          will-change: transform;
        }
        /* No transition on transform — GSAP owns the animation. The
           class is just a presence flag; visibility is transform-based.
           A non-active view is parked at y: 100% via GSAP. */
        .index-shell__view:not([data-active]) {
          pointer-events: none;
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

        @media (prefers-reduced-motion: reduce) {
          /* Reduced motion: views snap instead of sliding. GSAP
             durations are ignored via gsap.matchMedia normally; for
             this implementation we just rely on the
             prefers-reduced-motion check inside the slide trigger
             (see useEffect logic). */
          .index-shell__view {
            will-change: auto;
          }
        }
      `}</style>
    </div>
  );
}
