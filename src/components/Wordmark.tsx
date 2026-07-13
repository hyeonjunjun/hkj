import Link from "next/link";
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

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
  const sizeClasses =
    variant === "hero"
      ? "text-[72px] md:text-[100px] lg:text-[clamp(140px,14vw,220px)]"
      : "text-[60px]";

  const mark = (
    <span
      className={`font-sans font-bold leading-[0.85] tracking-[-0.04em] text-ink ${sizeClasses}`}
    >
      {studio.wordmark}
    </span>
  );

  return (
    <MotionReveal delay={delay.wordmark} duration={duration.reveal}>
      {variant === "hero" ? (
        <h1>{mark}</h1>
      ) : (
        <div role="banner">
          <Link href="/">{mark}</Link>
        </div>
      )}
    </MotionReveal>
  );
}
