import type { Reference } from "@/data/references";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "../MotionReveal";
import ReferenceCard from "./ReferenceCard";

interface ReferenceGridProps {
  references: Reference[];
}

export default function ReferenceGrid({ references }: ReferenceGridProps) {
  if (references.length === 0) {
    return (
      <p className="font-instrument-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
        References collection begins soon.
      </p>
    );
  }

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
    >
      {references.map((reference, i) => (
        <MotionReveal
          key={reference.id}
          delay={delay.primary + i * delay.stagger}
          duration={duration.reveal}
        >
          <ReferenceCard reference={reference} />
        </MotionReveal>
      ))}
    </div>
  );
}
