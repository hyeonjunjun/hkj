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
const SETTLE_MS = 140;
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
      const { base, pitch } = geom.current;
      jumpTo(centreOf(base + MIDDLE * h));
    }

    const ro = new ResizeObserver(measure);
    ro.observe(col);
    return () => ro.disconnect();
  }, [n]);

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
    let snapping = false;
    // The position the page last came to rest at; every step is measured
    // from here rather than from wherever the current frame happens to be.
    let restY = window.scrollY;

    /**
     * Where the page should come to rest.
     *
     * NOT the nearest plate. A flick moves a few hundred pixels and the
     * pitch is ~838, so "nearest" is almost always the plate you started
     * on — the page would drag you back and scrolling would appear
     * broken. It did, in the first version of this.
     *
     * Instead: measure how far you travelled from the last resting
     * position in whole plates, and if you moved at all but less than
     * one, round that up to one in the direction you went. So a single
     * flick advances exactly one project, and a long drag advances as
     * many as it covered.
     */
    const restingTarget = () => {
      const { pitch, h } = geom.current;
      if (h <= 0) return null;
      const delta = window.scrollY - restY;
      if (Math.abs(delta) < 4) return null;
      const whole = delta / pitch;
      const steps =
        Math.abs(whole) < 1 ? Math.sign(whole) : Math.round(whole);
      return restY + steps * pitch;
    };

    const settle = () => {
      const target = restingTarget();
      if (target === null) return;
      snapping = true;
      restY = target;
      glideTo(target, 0.55);
      // Released a little after the glide's own duration, so the scroll
      // events it emits do not re-arm the timer and loop forever.
      window.setTimeout(() => {
        snapping = false;
      }, 700);
    };

    const onScroll = () => {
      const { base, h } = geom.current;
      if (h > 0) {
        const rel = window.scrollY + window.innerHeight / 2 - base;
        if (rel < MIDDLE * h) {
          jumpTo(window.scrollY + h);
          restY += h;
        } else if (rel >= (MIDDLE + 1) * h) {
          jumpTo(window.scrollY - h);
          restY -= h;
        }
      }
      if (snapping) return;
      if (timer !== null) clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_MS);
    };

    // A real gesture always wins over an in-flight snap.
    const onGesture = () => {
      snapping = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("touchstart", onGesture);
      if (timer !== null) clearTimeout(timer);
    };
  }, [n]);

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
      const rel = window.scrollY + window.innerHeight / 2 - base;
      const currentSet = h > 0 ? Math.floor(rel / h) : MIDDLE;
      const el = plateRefs.current[currentSet * n + i] ?? plateRefs.current[MIDDLE * n + i];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [n],
  );

  const meta = [
    { label: "Client", value: work.title.toLowerCase() },
    { label: "Role", value: work.role.toLowerCase() },
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

      {/* Centre column — SETS copies of the list, in normal flow. */}
      <div
        ref={columnRef}
        className="col-span-12 col-start-1 flex flex-col gap-[var(--space-8)] py-[var(--space-8)] md:col-span-4 md:col-start-3"
      >
        {Array.from({ length: SETS }).flatMap((_, s) =>
          works.map((w, i) => {
            const flat = s * n + i;
            const isPrimary = s === MIDDLE;
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
                className="block h-[86vh] overflow-hidden bg-ws-fill"
              >
                <MediaRenderer media={w.media} fit="cover" />
              </Link>
            );
          }),
        )}
      </div>

      {/* Right margin — metadata for whichever plate holds the centre. */}
      <div className="pointer-events-none sticky top-0 col-span-12 col-start-1 hidden h-screen md:col-span-5 md:col-start-8 md:block">
        <div className="grid h-full grid-cols-5 items-center gap-x-[var(--gutter)]">
          {meta.map((m, i) => (
            <p key={m.label} className={["col-start-1", "col-start-3", "col-start-5"][i]}>
              <span className="text-value text-ws-ink-mute">{m.label}</span>{" "}
              <span className="text-label text-ws-ink">{m.value}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Position readout, bottom right — GSP's 0%. */}
      <p className="pointer-events-none fixed bottom-[var(--space-2)] right-[var(--gutter)] z-10 text-value tabular-nums text-ws-ink-mute">
        {pad2(active + 1)} / {pad2(n)}
      </p>
    </div>
  );
}
