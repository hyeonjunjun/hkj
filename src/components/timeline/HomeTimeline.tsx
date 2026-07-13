"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Work } from "@/data/works";
import {
  classifyWheelGesture,
  clampIndex,
  dampStep,
  findNearestIndex,
  sortWorksForTimeline,
} from "@/lib/timelineMotion";
import TimelineAxis from "./TimelineAxis";
import TimelineStop from "./TimelineStop";

const DAMPING = 0.12;
const WHEEL_TO_SCROLL_RATIO = 1;

interface HomeTimelineProps {
  works: Work[];
}

export default function HomeTimeline({ works }: HomeTimelineProps) {
  const sorted = useMemo(() => sortWorksForTimeline(works), [works]);

  const trackRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<Array<HTMLElement | null>>([]);
  const targetRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);
  // Tracks the last value the rAF loop itself wrote to `track.scrollLeft`,
  // so `detectActive` can tell apart the loop's own scroll events from
  // externally-caused ones (native trackpad/wheel/touch scroll or
  // programmatic scrollIntoView) that actually need a resync.
  const lastSelfScrollRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Track prefers-reduced-motion live (not just at mount), since it can
  // change without a page reload.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const onChange = () => {
      reducedMotionRef.current = media.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Active-stop detection: intentionally its own effect, independent of
  // the inertia loop below, so it keeps working under reduced motion
  // (see spec §4 — this is state detection, not animation).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const detectActive = () => {
      const trackRect = track.getBoundingClientRect();
      const containerCenter = trackRect.left + trackRect.width / 2;
      const centers = stopRefs.current.map((el) => {
        if (!el) return containerCenter;
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const nearest = findNearestIndex(centers, containerCenter);
      setActiveIndex(nearest);

      const maxScroll = track.scrollWidth - track.clientWidth;
      setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 0);

      // Resync the inertia target only when the scroll position has
      // diverged from what the rAF loop itself last wrote -- meaning
      // something external (native trackpad/wheel/touch scroll, or a
      // programmatic scrollIntoView from Tab-focus) moved it. When it
      // matches, this scroll event was caused by our own tick() write,
      // and touching targetRef here would collapse a multi-frame ease
      // (e.g. an arrow-key step) after a single frame.
      if (track.scrollLeft !== lastSelfScrollRef.current) {
        targetRef.current = track.scrollLeft;
      }
    };

    detectActive();
    track.addEventListener("scroll", detectActive, { passive: true });
    return () => track.removeEventListener("scroll", detectActive);
  }, [sorted.length]);

  // Wheel → horizontal redirect + hand-rolled inertia loop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    targetRef.current = track.scrollLeft;

    const onWheel = (event: WheelEvent) => {
      if (classifyWheelGesture(event) !== "vertical") return; // let native horizontal scroll handle it
      event.preventDefault();
      const maxScroll = track.scrollWidth - track.clientWidth;
      targetRef.current = Math.max(
        0,
        Math.min(targetRef.current + event.deltaY * WHEEL_TO_SCROLL_RATIO, maxScroll),
      );
    };

    const tick = () => {
      if (reducedMotionRef.current) {
        track.scrollLeft = targetRef.current;
      } else {
        track.scrollLeft = dampStep(track.scrollLeft, targetRef.current, DAMPING);
      }
      // Read back the actual value (not the intended one) in case the
      // browser clamped it, e.g. at the start/end of the scroll range.
      lastSelfScrollRef.current = track.scrollLeft;
      rafRef.current = requestAnimationFrame(tick);
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      track.removeEventListener("wheel", onWheel);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Arrow-key stepping, scoped to focus within the track (not window).
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = clampIndex(
      activeIndex + (event.key === "ArrowRight" ? 1 : -1),
      sorted.length,
    );
    const nextEl = stopRefs.current[nextIndex];
    if (!nextEl) return;
    const trackRect = track.getBoundingClientRect();
    const elRect = nextEl.getBoundingClientRect();
    targetRef.current = track.scrollLeft + (elRect.left - trackRect.left);
  };

  // Native Tab-focus triggers the browser's own instant scrollIntoView;
  // resync `target` immediately so the inertia loop doesn't fight it on
  // the next frame.
  const handleFocus = (index: number) => {
    const el = stopRefs.current[index];
    const track = trackRef.current;
    if (!el || !track) return;
    const trackRect = track.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    targetRef.current = track.scrollLeft + (elRect.left - trackRect.left);
  };

  const activeWork = sorted[activeIndex];

  return (
    <section aria-label="Works timeline" className="flex h-[55vh] flex-col justify-end gap-4">
      <p
        role="status"
        aria-live="polite"
        className="px-[var(--edge-margin)] font-sans text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[40px]"
      >
        {activeWork.title} — {activeWork.year}
      </p>
      <div
        ref={trackRef}
        onKeyDown={handleKeyDown}
        className="timeline-track flex items-start gap-6 overflow-x-auto px-[var(--edge-margin)]"
      >
        {sorted.map((work, index) => (
          <div
            key={work.id}
            ref={(el) => {
              stopRefs.current[index] = el;
            }}
            onFocus={() => handleFocus(index)}
          >
            <TimelineStop work={work} isActive={index === activeIndex} />
          </div>
        ))}
      </div>
      <div className="px-[var(--edge-margin)]">
        <TimelineAxis years={sorted.map((w) => w.year)} progress={progress} />
      </div>
    </section>
  );
}
