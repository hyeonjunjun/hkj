import Link from "next/link";
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";
import WindBlurReveal from "./WindBlurReveal";

interface WordmarkProps {
  /**
   * "hero" (default) is the landing masthead mark, rendered as an <h1>
   * in the clean grotesque register (General Sans, matching Nav's landing
   * variant and every other landing text element), top-aligned rather
   * than a large display mark. "room" is the shrunk 60px sans mark used
   * in RoomHeader, wrapped in a link back to "/" instead — a page should
   * have exactly one <h1>, and that's the landing page's job, not every
   * room's.
   */
  variant?: "hero" | "room";
}

/** The studio's mark. Mobile/tablet sizes are flat pixel values for the hero variant; desktop scales fluidly with viewport width. */
export default function Wordmark({ variant = "hero" }: WordmarkProps) {
  if (variant === "hero") {
    return (
      <WindBlurReveal delay={delay.wordmark} duration={duration.reveal}>
        <h1>
          <span className="font-display font-bold uppercase leading-[0.85] tracking-[-0.01em] text-ws-ink text-[12px] md:text-[24px] lg:text-[clamp(20px,14vw,60px)]">
            {studio.wordmark}
          </span>
        </h1>
      </WindBlurReveal>
    );
  }

  return (
    <MotionReveal delay={delay.wordmark} duration={duration.reveal}>
      <div role="banner">
        <Link href="/">
          <span className="font-sans font-bold leading-[0.85] tracking-[-0.04em] text-ink text-[60px]">
            {studio.wordmark}
          </span>
        </Link>
      </div>
    </MotionReveal>
  );
}
