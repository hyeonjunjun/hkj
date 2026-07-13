import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

export default function Standfirst() {
  return (
    <MotionReveal delay={delay.standfirst} duration={duration.reveal}>
      <p className="mt-10 max-w-[380px] font-sans text-[14px] leading-[1.5] text-ink">
        {studio.standfirst}
      </p>
    </MotionReveal>
  );
}
