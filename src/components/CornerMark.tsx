"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delay, duration, delaySeconds, durationSeconds, windEasing } from "@/lib/motion";
import Clock from "./Clock";
import MotionReveal from "./MotionReveal";

interface CornerMarkProps {
  /**
   * "room" (default) is today's full studio-info stack, used on the
   * landing masthead and every room -- unchanged, since neither this
   * page's other callers pass a variant today. "landing" is the
   * Windswept treatment: repositioned to the opposite corner (the
   * identity block now occupies bottom-left), showing only
   * availability/location/time, since Wordmark already carries the
   * studio name elsewhere on the landing page.
   */
  variant?: "room" | "landing";
}

/**
 * Bottom-left studio info stack, present on the landing masthead and
 * every room. The leading ember dot pulses via the global `pulse-soft`
 * keyframe (disabled automatically under prefers-reduced-motion via the
 * global rule in globals.css).
 *
 * Positioning lives on this outer div, not on the element MotionReveal
 * wraps directly — see the comment in ThesisStatement.tsx for why: an
 * active `transform` on an ancestor (which MotionReveal always sets,
 * even at rest) makes that ancestor a containing block for absolutely-
 * positioned descendants regardless of its own `position` value.
 *
 * (This doc comment describes the room/default variant below, which is
 * unchanged from the original file. The landing variant, added in this
 * task, is a separate branch with its own positioning/motion approach.)
 */
export default function CornerMark({ variant = "room" }: CornerMarkProps) {
  if (variant === "landing") {
    return (
      <div className="static px-[var(--edge-margin)] pb-[var(--edge-margin)] md:absolute md:bottom-[var(--edge-margin)] md:right-[var(--edge-margin)] md:px-0 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delaySeconds.cornerMark, duration: durationSeconds.reveal, ease: windEasing }}
        >
          <aside
            aria-label="Studio information"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ws-ink"
          >
            <span
              aria-hidden="true"
              className="text-ws-accent animate-[pulse-soft_2400ms_ease-in-out_infinite]"
            >
              •
            </span>
            <span>( {studio.availability} )</span>
            <span aria-hidden="true">//</span>
            <span>{studio.location}</span>
            <span aria-hidden="true">//</span>
            <Clock />
          </aside>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="static px-[var(--edge-margin)] pb-[var(--edge-margin)] md:absolute md:bottom-[var(--edge-margin)] md:left-[var(--edge-margin)] md:px-0 md:pb-0">
      <MotionReveal delay={delay.cornerMark} duration={duration.reveal}>
        <aside
          aria-label="Studio information"
          className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mist"
        >
          <p>
            <span
              aria-hidden="true"
              className="text-ember animate-[pulse-soft_2400ms_ease-in-out_infinite]"
            >
              •
            </span>{" "}
            {studio.fullName}©
          </p>
          <p>EST {studio.established}</p>
          <p>{studio.location}</p>
          <p>{studio.availability}</p>
          <Clock />
        </aside>
      </MotionReveal>
    </div>
  );
}
