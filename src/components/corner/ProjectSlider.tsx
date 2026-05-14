"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import { ProjectCard } from "./ProjectCard";

/**
 * ProjectSlider — horizontal-scroll showcase. Full-bleed, edge-to-edge.
 *
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ INDEX                                  01 / 07   →             │
 *   │   ┌─[card]─┐  ┌─[card]─┐  ┌─[card]─┐  ┌─[card]─┐  …            │
 *   │   │  media │  │  media │  │  media │  │  media │               │
 *   │   │  meta  │  │  meta  │  │  meta  │  │  meta  │               │
 *   │   └────────┘  └────────┘  └────────┘  └────────┘               │
 *   │ ─────────────────────●─────────────────                         │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * Interactions:
 *  - Native horizontal scroll (mouse wheel / touch swipe)
 *  - Drag-to-scroll on desktop (pointerdown + move)
 *  - Scroll-snap to each card
 *  - Current index derived via IntersectionObserver
 *  - Arrow keys scroll one card at a time
 *  - Progress bar below shows scroll position
 *
 * Motion:
 *  - Cards stagger-fade in on first paint
 *  - Card hover: media scales, title shifts, description reveals
 *  - Number indicator cross-fades on change
 */

const PIECES_SORTED: Piece[] = [...PIECES].sort((a, b) => a.order - b.order);

export function ProjectSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: 0,
  });

  // Observe which card is most visible; update currentIndex.
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio.
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
        if (best && best.isIntersecting) {
          const idx = Number((best.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setCurrentIndex(idx);
        }
      },
      {
        root,
        threshold: [0.3, 0.5, 0.7, 0.9],
      },
    );
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Sync scrollProgress (0..1) with the scroll position.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(el.scrollLeft / max);
    };
    handler();
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Drag-to-scroll (pointer events). Lets the slider feel native on
  // trackpads / mice that don't have horizontal scroll.
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Don't hijack clicks from inside cards' links — only initiate on
    // primary-button presses outside of any anchor-or-button.
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    if (e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture(e.pointerId);
    el.style.scrollBehavior = "auto";
    el.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    s.moved = Math.abs(dx);
    el.scrollLeft = s.startScrollLeft - dx;
  }, []);

  const onPointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current;
    if (!s.active) return;
    s.active = false;
    const el = trackRef.current;
    if (!el) return;
    try { el.releasePointerCapture(e.pointerId); } catch {}
    el.style.scrollBehavior = "";
    el.style.cursor = "";
    // Suppress click if we dragged more than 6px.
    if (s.moved > 6) {
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
        document.removeEventListener("click", stop, true);
      };
      document.addEventListener("click", stop, true);
    }
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;
    const step = firstCard.offsetWidth + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard(-1);
      }
    },
    [scrollByCard],
  );

  const total = PIECES_SORTED.length;
  const numberLabel = `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section className="corner-slider" aria-label="Index of work">
      <header className="corner-slider__head">
        <div className="corner-slider__head-left">
          <span className="t-section">Index</span>
          <span className="t-sep" aria-hidden>·</span>
          <span className="t-meta dim">selected work · 2025—2026</span>
        </div>
        <div className="corner-slider__head-right">
          <span
            className="t-code tabular corner-slider__counter"
            aria-live="polite"
            key={currentIndex}
          >
            {numberLabel}
          </span>
          <button
            type="button"
            className="corner-slider__arrow"
            aria-label="Previous project"
            onClick={() => scrollByCard(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="corner-slider__arrow"
            aria-label="Next project"
            onClick={() => scrollByCard(1)}
          >
            →
          </button>
        </div>
      </header>

      <div
        className="corner-slider__track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
      >
        {PIECES_SORTED.map((piece, i) => (
          <div
            key={piece.slug}
            ref={(el) => { cardRefs.current[i] = el; }}
            data-idx={i}
            className="corner-slider__cell"
          >
            <ProjectCard piece={piece} index={i} />
          </div>
        ))}
      </div>

      <div className="corner-slider__progress" aria-hidden>
        <span
          className="corner-slider__progress-fill"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <style>{`
        .corner-slider {
          width: 100%;
          display: grid;
          row-gap: clamp(20px, 2.6vh, 32px);
        }
        .corner-slider__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding: 0 var(--margin-page);
        }
        .corner-slider__head-left,
        .corner-slider__head-right {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
        }
        .corner-slider__counter {
          color: var(--ink-2);
          letter-spacing: 0.08em;
          animation: corner-counter-flip 320ms var(--ease);
        }
        @keyframes corner-counter-flip {
          0%   { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .corner-slider__arrow {
          appearance: none;
          background: transparent;
          border: 1px solid var(--ink-hair);
          color: var(--ink-3);
          width: 28px;
          height: 28px;
          padding: 0;
          line-height: 1;
          cursor: pointer;
          border-radius: 2px;
          transition: color 180ms var(--ease), border-color 180ms var(--ease), transform 120ms var(--ease);
          font-family: var(--font-stack-chrome);
        }
        .corner-slider__arrow:hover {
          color: var(--ink);
          border-color: var(--ink-3);
        }
        .corner-slider__arrow:active {
          transform: scale(0.96);
        }

        .corner-slider__track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding-inline-start: var(--margin-page);
          padding: 4px var(--margin-page) 8px;
          cursor: grab;
          /* Hide native scrollbar — the progress bar below is the
             visible indicator. */
          scrollbar-width: none;
          -ms-overflow-style: none;
          /* Disable text selection during drag-to-scroll */
          user-select: none;
        }
        .corner-slider__track::-webkit-scrollbar {
          display: none;
        }
        .corner-slider__track:active {
          cursor: grabbing;
        }
        .corner-slider__track:focus-visible {
          outline: 1px solid var(--ink-3);
          outline-offset: 2px;
        }
        .corner-slider__cell {
          scroll-snap-align: start;
          flex: 0 0 auto;
        }

        .corner-slider__progress {
          position: relative;
          height: 1px;
          background: var(--ink-ghost);
          margin: 0 var(--margin-page);
          overflow: hidden;
        }
        .corner-slider__progress-fill {
          position: absolute;
          inset: 0;
          background: var(--ink);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 80ms linear;
        }

        @media (max-width: 720px) {
          .corner-slider__head {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .corner-slider__head-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </section>
  );
}
