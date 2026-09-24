"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import SwatchRail, { ringStep } from "./SwatchRail";
import { recallWork, rememberWork } from "@/lib/currentWork";
import { duration, easing } from "@/lib/motion";

/** Plate height, vh. */
const PLATE_VH = 52;
/**
 * Gap between plates, vh. 26vh against a 52vh plate is what keeps the
 * neighbours out of frame: centred, a plate spans 24-76vh, so the next
 * one starts at 102vh and the previous ends at -2vh. At 18vh both
 * showed as slivers top and bottom.
 */
const GAP_VH = 26;
/** One project's travel. */
const PITCH_VH = PLATE_VH + GAP_VH;
/** Slots rendered either side of the active one. */
const NEIGHBOURS = 2;

/**
 * Step duration and curve — the site's movement pair, shared with
 * SwatchRail so the column and the rail travel as one thing.
 */
const TRAVEL_MS = duration.move;
const TRAVEL_EASE = easing.move;

/* ── Input ──────────────────────────────────────────────────────────
   Navigation is DISCRETE: every input resolves to a whole number of
   projects, and nothing here reads or writes the scroll position. The
   page does not scroll at all.

   That is the fix for the trackpad and free-spin mouse. The previous
   model let the page scroll freely and glided onto the nearest plate
   once the input went quiet, which meant it was permanently guessing
   where a gesture had ended — and Lenis's own momentum kept emitting
   scroll events after the hand was off, so the guess was wrong often
   enough to feel broken.
   ─────────────────────────────────────────────────────────────────── */

/** Accumulated wheel travel that commits one step. One mouse detent (~100) clears it outright. */
const WHEEL_STEP = 30;
/** A fresh push has to beat the gesture's own peak by this much to re-arm mid-stream. */
const WHEEL_REARM = 60;
/** Silence this long ends a gesture. Momentum tails never leave a gap this big. */
const GESTURE_GAP_MS = 140;
/** deltaMode 1 is lines, not pixels. */
const LINE_PX = 16;
/** Swipe distance that commits one step, px. */
const SWIPE_PX = 40;

/** Wheel delta in pixels, whatever units the device reports in. */
function wheelDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * LINE_PX;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

interface HomeIndexProps {
  works: Work[];
}

/**
 * Home: one project at a time, stepped.
 *
 * POSITION
 *
 * A single unbounded integer. Step 7 of five projects is project 3 —
 * `pos` itself never wraps, which is what makes the loop seamless: there
 * is no wrap to hide, because there is no edge to wrap at. Slots are
 * absolute positions on an infinite strip (slot s holds work
 * `s mod n`), the strip is translated by `-pos * PITCH`, and only the
 * slots within NEIGHBOURS of `pos` are rendered.
 *
 * This replaces the previous three-stacked-copies-plus-invisible-jump
 * arrangement, along with everything that had grown around it:
 * measuring plate geometry, the ResizeObserver, scroll restoration,
 * the settle timer, the gesture-quiet heuristics, and the guard that
 * kept the page's own glide from retriggering its own settle.
 *
 * NAVIGATION
 *
 * One wheel detent, one arrow key, one swipe or one swatch click all
 * commit exactly one project (a swatch click commits the shortest way
 * round, which may be several). Nothing is inferred from scroll
 * position, so smoothed input devices cannot confuse it.
 *
 * Deliberately absent: waveform, scrubber, transport bar. The
 * horizontal waveform line has been rejected on this project repeatedly
 * for cutting across the composition.
 */
export default function HomeIndex({ works }: HomeIndexProps) {
  const n = works.length;

  /**
   * The ref is the source of truth; the state exists to render. Event
   * handlers are registered once and would otherwise close over a stale
   * position — the ref is what lets two detents in quick succession
   * advance two projects instead of the same one twice.
   */
  const posRef = useRef(0);
  const [pos, setPos] = useState(0);
  /**
   * False until the opening position has been restored and painted.
   * The restore is a jump, not a move: without this the column and the
   * rail would both travel from project one to wherever the visitor
   * actually left off, every single time home is opened.
   */
  const [settled, setSettled] = useState(false);

  const step = useCallback(
    (by: number) => {
      if (n === 0 || by === 0) return;
      posRef.current += by;
      setPos(posRef.current);
    },
    [n],
  );

  /**
   * Open on the work the visitor was last on — coming back from that
   * project's case study, or from /works — rather than on the first.
   *
   * Layout effect: the corrected position has to be in place before the
   * first paint, or home flashes project one. `settled` is raised a
   * frame later so the jump itself cannot animate but every move after
   * it can.
   */
  useLayoutEffect(() => {
    const slug = recallWork();
    const i = slug ? works.findIndex((w) => w.slug === slug) : -1;
    if (i > 0) {
      posRef.current = i;
      // The cascading-render warning is about state that should have
      // been derived during render. This cannot be: the position comes
      // from sessionStorage, which does not exist on the server, so
      // reading it during render would make the markup disagree with
      // the markup that was sent. A layout effect is the documented
      // place to reconcile with a browser-only source, and it lands
      // before paint, which is the whole point — one render at project
      // one is invisible, one PAINT at project one is a flash.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPos(i);
    }
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, [works]);

  /** Publish the work on screen, for whatever view is entered next. */
  useEffect(() => {
    if (n === 0) return;
    rememberWork(works[((pos % n) + n) % n].slug);
  }, [pos, n, works]);

  /** Swatch click — the shortest way round, so project 1 to project 5 goes back one, not forward four. */
  const goTo = useCallback(
    (i: number) => {
      if (n === 0) return;
      const current = ((posRef.current % n) + n) % n;
      step(ringStep(current, i, n));
    },
    [n, step],
  );

  /**
   * Wheel, quantised to whole projects.
   *
   * A gesture is a run of events with no gap longer than
   * GESTURE_GAP_MS. The first commits a step; the rest of that run —
   * which on a trackpad or a free-spin mouse is the momentum tail, and
   * can be a hundred events over most of a second — is swallowed. So a
   * flick of any strength is one project, and a deliberate second
   * detent, arriving after the gap, is a second project.
   *
   * The one way back in mid-gesture is a push that beats the gesture's
   * own peak magnitude: real intent climbs, decaying momentum never
   * does. That keeps a sustained two-finger drag responsive without
   * letting its tail count twice.
   */
  useEffect(() => {
    if (n === 0) return;

    let acc = 0;
    let peak = 0;
    let spent = false;
    let lastAt = 0;

    const onWheel = (e: WheelEvent) => {
      // Nothing on this page scrolls, so the only thing the default
      // would produce is an overscroll bounce.
      e.preventDefault();

      const now = performance.now();
      const delta = wheelDelta(e);
      const mag = Math.abs(delta);

      if (now - lastAt > GESTURE_GAP_MS) {
        acc = 0;
        peak = 0;
        spent = false;
      }
      lastAt = now;

      if (spent) {
        if (mag > peak * 1.1 && mag >= WHEEL_REARM) {
          acc = 0;
          peak = 0;
          spent = false;
        } else {
          peak = Math.max(peak, mag);
          return;
        }
      }

      peak = Math.max(peak, mag);
      acc += delta;
      if (Math.abs(acc) < WHEEL_STEP) return;

      step(Math.sign(acc));
      acc = 0;
      spent = true;
    };

    // passive: false — preventDefault above is the point.
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [n, step]);

  /** Up and down arrows, one project each. */
  useEffect(() => {
    if (n === 0) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.isContentEditable || (t && /^(input|textarea|select)$/i.test(t.tagName))) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, step]);

  /**
   * Touch. One swipe, one project — the finger commits as soon as it
   * has travelled SWIPE_PX and the rest of the drag is ignored, which
   * is the same contract the wheel gets.
   */
  useEffect(() => {
    if (n === 0) return;

    let startY = 0;
    let spent = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      spent = false;
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (spent) return;
      const y = e.touches[0]?.clientY ?? startY;
      const travelled = startY - y;
      if (Math.abs(travelled) < SWIPE_PX) return;
      step(Math.sign(travelled));
      spent = true;
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [n, step]);

  if (n === 0) return null;

  const active = ((pos % n) + n) % n;
  const work = works[active];

  /** Absolute slot numbers currently mounted. Centred on `pos`, so a plate is mounted well before it is seen. */
  const slots: number[] = [];
  for (let s = pos - NEIGHBOURS; s <= pos + NEIGHBOURS; s += 1) slots.push(s);

  /**
   * No Client row: the title already sits beside the active swatch on
   * the left, and repeating it across the spread just doubled it.
   * What is left is the spec — role, type, year.
   */
  const meta = [
    { label: "Role", value: work.role.toLowerCase() },
    { label: "Type", value: work.category.toLowerCase() },
    { label: "Year", value: work.year },
  ];

  /* Every cell is pinned to grid row 1 so the three zones overlay one
     full-height spread. They used to reach the same arrangement by
     accident — the rail and the metadata were `sticky h-screen` in row
     1 and the plate column auto-placed into row 2 below them, with
     stickiness dragging the margins back over it as the page scrolled.
     Nothing scrolls now, so the overlay has to be stated. */
  return (
    <div className="grid12 h-full grid-rows-[100%] items-start">
      {/* Left margin — rail plus the active title, held at the
          viewport's middle. Spans 4 columns so the title has room; the
          swatches themselves stay at column 1. */}
      <div className="z-10 col-span-2 col-start-1 row-start-1 flex h-full items-center md:col-span-4 md:col-start-1">
        <SwatchRail works={works} activeIndex={active} onSelect={goTo} animate={settled} />
      </div>

      {/* Centre column — the plates, as slots on an infinite strip.

          The frame is the whole spread and clips, so a neighbour that
          has not arrived yet cannot add scrollable overflow to the page.
          Visually it is the old geometry exactly: the gap is wide enough
          that only one plate is ever in frame.

          The media block is columns 3-10 at a fixed height, and however
          many plates a work has divide that width with one gutter
          between — dylan.camera's rule, measured off his site at 1920:
          the block is 8 columns (1260px) and 1/2/3 items come out at
          1260 / 624 / 412px against his measured 1259 / 624 / 410.

          Nothing preserves aspect ratio. Everything cover-crops to the
          shared height, which is what lets a 16:9 still sit beside a
          portrait without the row going ragged. */}
      <div
        data-enter=""
        style={{ ["--enter" as string]: 0 }}
        /* data-enter sits on the FRAME, not on the plates: the plates
           are keyed by slot and remount as the viewer steps, which would
           replay the entrance on every single step. The frame is stable
           for the life of the view. */
        className="relative col-span-12 col-start-1 row-start-1 h-full overflow-hidden md:col-span-8 md:col-start-3"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${-pos * PITCH_VH}vh)`,
            transition: settled ? `transform ${TRAVEL_MS}ms ${TRAVEL_EASE}` : "none",
          }}
        >
          {slots.map((slot) => {
            const i = ((slot % n) + n) % n;
            const w = works[i];
            const plates = w.plates?.length ? w.plates : [w.media];
            const isActive = slot === pos;
            return (
              <Link
                key={slot}
                href={`/works/${w.slug}`}
                aria-label={`Open ${w.title}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? undefined : -1}
                /* Lets globals.css drop the name for the home <-> /works
                   pair, where the media fades out where it stands
                   instead of travelling. Every other journey keeps it. */
                data-vt-media=""
                /* Only the plate on the line is named for the view
                   transition: a view-transition-name must be unique per
                   document, and the neighbours hold the same works. */
                style={{
                  top: `calc(50% - ${PLATE_VH / 2}vh + ${slot * PITCH_VH}vh)`,
                  height: `${PLATE_VH}vh`,
                  ...(isActive ? { viewTransitionName: `work-${w.slug}` } : null),
                }}
                className="absolute inset-x-0 flex gap-[12px]"
              >
                {plates.map((m, k) => (
                  <span key={k} className="min-w-0 flex-1 overflow-hidden bg-ws-fill">
                    <MediaRenderer media={m} fit="cover" />
                  </span>
                ))}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right margin — metadata for whichever plate holds the centre.
          Stacked in columns 11-12 now that the media block runs through
          column 10.

          Right-aligned, so the block hangs off the page's right edge
          rather than off the media's. The left-hand title reads outward
          from the swatch strip; this reads inward from the margin, and
          the two ragged edges face each other across the spread. */}
      <div
        data-enter=""
        style={{ ["--enter" as string]: 2 }}
        className="pointer-events-none col-span-12 col-start-1 row-start-1 hidden h-full items-center md:col-span-2 md:col-start-11 md:flex"
      >
        {/* Label over value, one spacing token between the pair and
            three between groups — the same rhythm the case-study header
            uses. Set inline, a long role like "concept + direction"
            wrapped under its own label and the rows stopped lining up. */}
        <div className="flex w-full flex-col gap-[var(--space-3)] text-right">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="text-value uppercase text-ws-ink-mute">{m.label}</p>
              <p className="mt-[var(--space-1)] text-label text-ws-ink">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
