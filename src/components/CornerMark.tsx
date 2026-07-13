import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import Clock from "./Clock";
import MotionReveal from "./MotionReveal";

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
 */
export default function CornerMark() {
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
