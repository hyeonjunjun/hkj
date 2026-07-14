import Link from "next/link";
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";
import WindBlurReveal from "./WindBlurReveal";

interface WordmarkProps {
  /**
   * "hero" (default) is the full-size landing masthead mark, rendered as
   * an <h1>. "room" is the shrunk 60px mark used in RoomHeader, wrapped
   * in a link back to "/" instead — a page should have exactly one <h1>,
   * and that's the landing page's job, not every room's.
   */
  variant?: "hero" | "room";
}

/** The studio's mark. Mobile/tablet sizes are flat pixel values for the hero variant; desktop scales fluidly with viewport width. */
export default function Wordmark({ variant = "hero" }: WordmarkProps) {
  if (variant === "hero") {
    return (
      <WindBlurReveal delay={delay.wordmark} duration={duration.reveal}>
        <h1>
          <span className="font-display font-bold leading-[0.85] tracking-[-0.04em] text-ws-ink text-[72px] md:text-[100px] lg:text-[clamp(140px,14vw,220px)]">
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
