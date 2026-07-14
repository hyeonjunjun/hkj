import { MotionConfig } from "framer-motion";
import { studio } from "@/data/studio";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";

/**
 * Windswept landing page -- a locked, zero-scroll identity page, no
 * work content. Three corner-anchored zones, using this project's
 * established absolute-corner-anchor technique (the same pattern
 * ThesisStatement/CornerMark have always used) rather than a literal
 * CSS Grid: nav "doors" top-right, the composed identity block
 * (Wordmark + Standfirst + ThesisStatement) bottom-left, CornerMark's
 * landing variant bottom-right (self-positioning). Everything else is
 * intentional empty space.
 *
 * <MotionConfig reducedMotion="user"> gives the new Framer-Motion-driven
 * components (Nav landing variant, CornerMark landing variant,
 * Standfirst, ThesisStatement) real prefers-reduced-motion handling --
 * the project's existing global CSS rule only reaches MotionReveal/
 * WindBlurReveal (both CSS-transition-driven), not Framer Motion.
 */
export default function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen w-full bg-ws-paper font-sans md:h-screen md:overflow-hidden">
        <div className="static flex justify-end px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:top-0 md:right-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
          <Nav items={studio.navItems} variant="landing" />
        </div>

        <div className="static px-[var(--edge-margin)] pb-8 md:absolute md:bottom-[var(--edge-margin)] md:left-[var(--edge-margin)] md:max-w-[55vw] md:px-0 md:pb-0">
          <Wordmark />
          <Standfirst />
          <ThesisStatement />
        </div>

        <CornerMark variant="landing" />
      </main>
    </MotionConfig>
  );
}
