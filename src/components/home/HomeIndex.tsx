"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import SwatchRail from "./SwatchRail";
import { glideTo, jumpTo } from "@/lib/lenis";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Copies of the list stacked to make the scroll loop. Must be odd. */
const SETS = 3;
/** Quiet time after scrolling before the page settles onto a project. */
const SETTLE_MS = 160;
/**
 * The hand has to be off the wheel this long before anything settles.
 * Scroll events alone are not enough of a signal: Lenis keeps emitting
 * them through its own easing, and a trackpad drag can leave gaps
 * longer than SETTLE_MS between wheel events, so a debounce on scroll
 * fired mid-gesture and yanked the page while the viewer was still
 * moving it.
 */
const GESTURE_QUIET_MS = 220;
/** Below this, a wheel event is momentum residue rather than intent. */
const GESTURE_MIN_DELTA = 20;
/** Wheel events this soon after a glide starts are that glide's own tail. */
const GLIDE_GRACE_MS = 260;
/** How long to wait before re-checking while a glide is in flight. */
const GLIDE_CHECK_MS = 900;
/** Index of the set the viewer actually occupies. */
const MIDDLE = Math.floor(SETS / 2);

interface HomeIndexProps {
  works: Work[];
}

/**
 * Home: a looping column of plates, on GSP's composition
 * (gsproductions.co.za) with dylan.camera's swatch navigation.
 *
 * GSP measured live at 1920x1000 — plate x329, 626x962 (32.6% of width,
 * 96.2% of height) at column 3 span 4, with the nav and the right-margin
 * metadata sharing columns 8/9/10/11.
 *
 * SCROLL MODEL
 *
 * Plates are a plain vertical column in document flow; the page scrolls
 * and Lenis smooths it at lerp 0.1 (GSP's own measured value). Nothing
 * hijacks the wheel.
 *
 * LOOPING
 *
 * The list is rendered SETS times and the viewer starts in the middle
 * copy. When scroll leaves that copy in either direction the position
 * jumps by exactly one set-height. The jump is invisible because the
 * content at the destination is identical to the content being left —
 * the pixels do not change, only the scroll number does.
 *
 * The jump goes through Lenis rather than window.scrollTo: Lenis
 * animates toward its own target every frame and would undo a native
 * jump on the next tick. See lib/lenis.
 *
 * ACTIVE WORK
 *
 * Whichever plate crosses the viewport's centre line, via an
 * IntersectionObserver whose root margin collapses the root to that
 * single line — so a project becomes current the moment its leading
 * edge passes the centre. The rail and the right-hand metadata both
 * read from it.
 *
 * Deliberately absent: waveform, scrubber, transport bar. The
 * horizontal waveform line has been rejected on this project repeatedly
 * for cutting across the composition.
 */
export default function HomeIndex({ works }: HomeIndexProps) {
  const [active, setActive] = useState(0);
  const columnRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const n = works.length;
  const total = n * SETS;

  /**
   * Geometry, measured off the plates themselves rather than inferred.
   *
   *   base  — document offset of the very first plate. NOT zero: the
   *           sticky nav and the column's own padding sit above it
   *           (measured at 1002px), and ignoring that was what put the
   *           opening centre line in the last plate of set 0 instead of
   *           the first of the middle set — the counter opened on
   *           05 / 05.
   *   pitch — plate height plus gap, i.e. one work.
   *   h     — one whole set, the distance the wrap moves by.
   */
  const geom = useRef({ base: 0, pitch: 0, plateH: 0, h: 0 });
  /**
   * Where the page last came to rest. A ref, not an effect-local, because
   * the swatch click has to keep it in step too — when it did not, a
   * click followed by a scroll measured travel from a stale origin and
   * stepped to the wrong multiple, landing 366px off centre.
   */
  const restY = useRef(0);
  /**
   * True while the page is being moved by us rather than by the viewer.
   * A ref, not an effect-local, because the swatch click also needs to
   * claim it: its glide emits scroll events, which armed the settle
   * timer, which then glided somewhere else and overrode the click. That
   * was the "sticks off centre" case — 366px out, with no correction.
   */
  const snapping = useRef(false);
  const releaseTimer = useRef<number | null>(null);
  /** When the in-flight programmatic scroll began. */
  const glideStart = useRef(0);
  /**
   * The settle routine, published by the scroll effect so the guard's
   * own release can call it.
   *
   * Without this the page could be abandoned off centre: the guard
   * releases on a timer, and if scrolling had already stopped by then
   * nothing was left to re-arm the settle. Traced it — a click glide
   * followed by a wheel, followed by the loop wrap, left the page at
   * index 4.56 and simply sat there.
   */
  const settleRef = useRef<(() => void) | null>(null);

  /**
   * The one way the page is moved programmatically. Claims the guard,
   * records the destination as the new resting position, and releases a
   * little after the glide's own duration so its scroll events cannot
   * re-arm the settle.
   */
  const glideToRest = useCallback((target: number, seconds: number) => {
    snapping.current = true;
    glideStart.current = performance.now();
    restY.current = target;
    glideTo(target, seconds);
    if (releaseTimer.current !== null) clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(
      () => {
        snapping.current = false;
        releaseTimer.current = null;
        // Scrolling may already have stopped, in which case no scroll
        // event is coming to re-arm the settle. Check once, here.
        settleRef.current?.();
      },
      seconds * 1000 + 150,
    );
  }, []);

  /** Scroll position that puts the plate starting at `top` on the
   *  viewport's centre line. Uses the plate's own height, not the
   *  pitch — the pitch includes the gap between plates, and using it
   *  here left every plate resting 32px high. */
  const centreOf = useCallback((top: number) => {
    const { plateH } = geom.current;
    return top + plateH / 2 - window.innerHeight / 2;
  }, []);

  // Layout effect so the initial jump lands before paint; in a passive
  // effect the first frame shows set 0 and then lurches.
  useLayoutEffect(() => {
    const col = columnRef.current;
    if (!col || n === 0) return;

    const measure = () => {
      const a = plateRefs.current[0];
      const b = plateRefs.current[1] ?? plateRefs.current[0];
      if (!a || !b) return 0;
      const pitch = n > 1 ? b.offsetTop - a.offsetTop : a.offsetHeight;
      geom.current = { base: a.offsetTop, pitch, plateH: a.offsetHeight, h: pitch * n };
      return geom.current.h;
    };

    const h = measure();
    if (h > 0) {
      // Centre the middle set's FIRST plate on the viewport centre line,
      // which is the same line the observer tests against.
      const { base } = geom.current;
      const opening = centreOf(base + MIDDLE * h);
      jumpTo(opening);
      restY.current = opening;
    }

    const ro = new ResizeObserver(measure);
    ro.observe(col);
    return () => ro.disconnect();
    // centreOf is a stable useCallback with no deps of its own; listed to
    // satisfy the exhaustive-deps rule rather than because it can change.
  }, [n, centreOf]);

  /**
   * The wrap, plus the settle.
   *
   * WRAP — deliberately outside React state: this runs on every scroll
   * frame and must not re-render anything.
   *
   * SETTLE — while the page scrolls freely, a timer is kept alive. When
   * scrolling stops for SETTLE_MS the nearest plate is glided onto the
   * centre line, so the page always comes to rest on a project rather
   * than halfway between two. One flick therefore lands on the next
   * project in the direction of travel, because that is the plate
   * nearest the centre once the flick's momentum has run out.
   *
   * Guarded by `snapping`: glideTo emits scroll events of its own, and
   * without the guard the settle would retrigger itself forever. The
   * guard is cleared on a real user gesture too, so a scroll during the
   * glide takes control back immediately rather than being fought.
   */
  useEffect(() => {
    if (n === 0) return;

    let timer: number | null = null;
    /**
     * Direction of the last deliberate wheel, consumed by the next
     * settle. Taken from the gesture rather than inferred by comparing
     * against restY: that comparison had to stay correct across glides
     * and loop wraps, and when it did not the page stepped to the wrong
     * plate or simply stayed put off centre.
     */
    let gestureDir = 0;
    /** When the viewer last physically moved the page. */
    let lastGesture = 0;
    if (restY.current === 0) restY.current = window.scrollY;

    /**
     * Where the page should come to rest — always an ACTUAL plate centre.
     *
     * The first version returned restY + steps * pitch, which is only a
     * plate centre if restY is one. Anything that moved the page without
     * telling us (the swatch click's native scrollIntoView, a browser
     * scroll restore) put restY off a centre, and every subsequent rest
     * inherited that error — the page would settle between plates and
     * stay there. Computing the index and rebuilding the position from
     * `base` means the worst a stale restY can now cause is stepping the
     * wrong number of plates, never resting off one.
     *
     * Direction still comes from travel: a sub-plate move rounds up to
     * one plate the way it was going, so a single flick is one project.
     */
    /**
     * Where the page should come to rest — always an ACTUAL plate centre,
     * rebuilt from `base` so it cannot inherit drift.
     *
     * Two modes:
     *   gestureDir set — the viewer scrolled, so step that way. A move
     *     of less than one plate still counts as one, which is what
     *     makes a single flick advance exactly one project.
     *   gestureDir clear — nobody scrolled, so this is a recovery: just
     *     centre whatever is nearest. This is the branch that rescues a
     *     position abandoned by an interrupted glide or a loop wrap.
     */
    const restingTarget = () => {
      const { base, pitch, plateH, h } = geom.current;
      if (h <= 0 || pitch <= 0) return null;

      const now =
        (window.scrollY + window.innerHeight / 2 - base - plateH / 2) / pitch;

      const idx =
        gestureDir === 0
          ? Math.round(now)
          : (() => {
              const from = Math.round(
                (restY.current + window.innerHeight / 2 - base - plateH / 2) / pitch,
              );
              const moved = Math.abs(now - from);
              return from + gestureDir * (moved < 1 ? 1 : Math.round(moved));
            })();

      return base + idx * pitch + plateH / 2 - window.innerHeight / 2;
    };

    const settle = () => {
      // Still scrolling — come back later rather than grabbing the page.
      const quiet = performance.now() - lastGesture;
      if (quiet < GESTURE_QUIET_MS) {
        if (timer !== null) clearTimeout(timer);
        timer = window.setTimeout(settle, GESTURE_QUIET_MS - quiet);
        return;
      }
      const target = restingTarget();
      if (target === null) return;
      // Already there — do not start a glide that would claim the guard
      // for nothing.
      if (Math.abs(target - window.scrollY) < 2) {
        gestureDir = 0;
        return;
      }
      gestureDir = 0;
      glideToRest(target, 0.55);
    };
    settleRef.current = settle;

    const onScroll = () => {
      const { base, h } = geom.current;
      if (h > 0) {
        const rel = window.scrollY + window.innerHeight / 2 - base;
        // The wrap moves the page by one set. If a glide is in flight it
        // is still aimed at the pre-wrap position, and Lenis will happily
        // drag the page all the way back to it — which is exactly what
        // stranded the first upward step out of project 1 (off by 339px,
        // counter stuck). So the in-flight target moves with the page.
        let shift = 0;
        if (rel < MIDDLE * h) shift = h;
        else if (rel >= (MIDDLE + 1) * h) shift = -h;

        if (shift !== 0) {
          jumpTo(window.scrollY + shift);
          restY.current += shift;
          if (snapping.current) glideTo(restY.current, 0.35);
        }
      }
      // Scheduled even while a glide is in flight, just further out.
      // Returning outright here is what let an interrupted glide strand
      // the page: scrolling stopped before the guard released, so no
      // event was ever left to arm the check. settle() no-ops when the
      // page is already centred, so the extra pass is free.
      if (timer !== null) clearTimeout(timer);
      timer = window.setTimeout(settle, snapping.current ? GLIDE_CHECK_MS : SETTLE_MS);
    };

    /**
     * A deliberate new gesture takes control back from an in-flight
     * glide. Deliberate is doing real work here.
     *
     * This used to clear the guard on ANY wheel event, which meant the
     * residual momentum of the very flick that triggered the settle
     * cancelled that settle a frame or two in. The glide stopped
     * partway, nothing re-armed, and the page sat off centre — measured
     * 366px out after a click, 396px after a trackpad-style burst. That
     * is the "sticks sometimes" case.
     *
     * So: ignore small deltas, and ignore anything arriving within
     * GLIDE_GRACE_MS of the glide starting, which is where momentum
     * tails live. A real intent to scroll clears both bars easily.
     */
    const onGesture = (event: Event) => {
      // Stamped for EVERY physical input, including deltas too small to
      // count as a direction change — the question here is "is a hand on
      // it", not "did they mean to go somewhere".
      lastGesture = performance.now();
      const dy = (event as WheelEvent).deltaY;
      const deliberate = dy === undefined || Math.abs(dy) >= GESTURE_MIN_DELTA;
      if (!deliberate) return;
      if (dy) gestureDir = Math.sign(dy);
      if (!snapping.current) return;
      // Momentum tails arrive right after a glide starts; a real intent
      // to scroll does not.
      if (performance.now() - glideStart.current < GLIDE_GRACE_MS) return;
      snapping.current = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    window.addEventListener("touchmove", onGesture, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("touchmove", onGesture);
      if (timer !== null) clearTimeout(timer);
      settleRef.current = null;
    };
  }, [n, glideToRest]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = plateRefs.current.indexOf(entry.target as HTMLAnchorElement);
          if (i !== -1) setActive(i % n);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    plateRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [total, n]);

  const work = works[active];

  /**
   * Swatch click. Targets that work's copy in whichever set the viewer
   * currently occupies, so a click never scrolls through a whole set to
   * reach a plate that also exists right beside them.
   */
  const goTo = useCallback(
    (i: number) => {
      const { base, h } = geom.current;
      if (h <= 0) return;
      const rel = window.scrollY + window.innerHeight / 2 - base;
      const currentSet = Math.floor(rel / h);
      const flat = currentSet * n + i;
      const el = plateRefs.current[flat] ?? plateRefs.current[MIDDLE * n + i];
      if (!el) return;
      // glideTo, not scrollIntoView: the native smooth scroll animates the
      // same property Lenis is animating, and the two fight — that is how
      // an interrupted click ended up 366px off centre. Going through
      // Lenis also means one easing for the whole page.
      glideToRest(centreOf(el.offsetTop), 0.6);
    },
    [n, centreOf, glideToRest],
  );

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

  return (
    <div className="grid12 items-start">
      {/* Left margin — rail plus the active title, held at the viewport's
          middle. Spans 4 columns so the title has room; the swatches
          themselves stay at column 1. */}
      <div className="sticky top-0 z-10 col-span-12 col-start-1 flex h-screen items-center md:col-span-4">
        <SwatchRail works={works} activeIndex={active} onSelect={goTo} />
      </div>

      {/* Centre column — SETS copies of the list, in normal flow.

          Gap is 26vh against a 52vh plate, which is what keeps the
          neighbours out of frame: centred, a plate spans 24-76vh, so the
          next one starts at 102vh and the previous ends at -2vh. At 18vh
          both showed as slivers top and bottom.

          The media block is columns 3-10 at a fixed height, and however
          many plates a work has divide that width with one gutter
          between — dylan.camera's rule, measured off his site at 1920:
          the block is 8 columns (1260px) and 1/2/3 items come out at
          1260 / 624 / 412px against his measured 1259 / 624 / 410.

          Nothing preserves aspect ratio. Everything cover-crops to the
          shared height, which is what lets a 16:9 still sit beside a
          portrait without the row going ragged. */}
      <div
        ref={columnRef}
        className="col-span-12 col-start-1 flex flex-col gap-[26vh] py-[26vh] md:col-span-8 md:col-start-3"
      >
        {Array.from({ length: SETS }).flatMap((_, s) =>
          works.map((w, i) => {
            const flat = s * n + i;
            const isPrimary = s === MIDDLE;
            const plates = w.plates?.length ? w.plates : [w.media];
            return (
              <Link
                key={`${s}-${w.id}`}
                href={`/works/${w.slug}`}
                aria-label={`Open ${w.title}`}
                aria-hidden={!isPrimary}
                tabIndex={isPrimary ? undefined : -1}
                ref={(el) => {
                  plateRefs.current[flat] = el;
                }}
                /* Only the middle copy is named for the view transition:
                   a view-transition-name must be unique per document, and
                   three copies sharing one cancels the transition. */
                style={isPrimary ? { viewTransitionName: `work-${w.slug}` } : undefined}
                className="flex h-[52vh] gap-[12px]"
              >
                {plates.map((m, k) => (
                  <span key={k} className="min-w-0 flex-1 overflow-hidden bg-ws-fill">
                    <MediaRenderer media={m} fit="cover" />
                  </span>
                ))}
              </Link>
            );
          }),
        )}
      </div>

      {/* Right margin — metadata for whichever plate holds the centre.
          Stacked in columns 11-12 now that the media block runs through
          column 10.

          Right-aligned, so the block hangs off the page's right edge
          rather than off the media's. The left-hand title reads outward
          from the swatch strip; this reads inward from the margin, and
          the two ragged edges face each other across the spread. */}
      <div className="pointer-events-none sticky top-0 col-span-12 col-start-1 hidden h-screen md:col-span-2 md:col-start-11 md:block">
        {/* Label over value, one spacing token between the pair and
            three between groups — the same label/value rhythm the case
            study header uses. Set inline, a long role like
            "concept + direction" wrapped under its own label and the
            three rows stopped lining up. */}
        <div className="flex h-full flex-col justify-center gap-[var(--space-3)] text-right">
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
