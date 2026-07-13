import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

/**
 * Bottom-right statement, present on the landing masthead and every
 * room. Absolutely positioned within the poster canvas on tablet/desktop;
 * falls back to normal document flow on mobile.
 *
 * Positioning lives on this outer div, not on the element MotionReveal
 * wraps directly — MotionReveal sets an inline `transform` on its own
 * wrapper, and CSS makes *any* element with an active transform (even
 * translateY(0)) a containing block for absolutely-positioned
 * descendants, regardless of that element's own `position` value. Put
 * `absolute` on the same node MotionReveal wraps and it positions itself
 * relative to MotionReveal's zero-height wrapper instead of <main>.
 */
export default function ThesisStatement() {
  return (
    <div className="static px-[var(--edge-margin)] pb-8 md:absolute md:bottom-[var(--edge-margin)] md:right-[var(--edge-margin)] md:max-w-[55vw] md:px-0 md:pb-0">
      <MotionReveal delay={delay.thesis} duration={duration.reveal}>
        <p className="thesis text-[24px] font-bold leading-[1] tracking-[-0.03em] text-ink md:text-[32px] lg:text-[clamp(36px,4vw,60px)]">
          {studio.thesis}
        </p>
      </MotionReveal>
    </div>
  );
}
