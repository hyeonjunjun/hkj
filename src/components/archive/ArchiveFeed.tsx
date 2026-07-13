import type { ArchiveEntry as ArchiveEntryData } from "@/data/archive";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "../MotionReveal";
import ArchiveEntry from "./ArchiveEntry";

interface ArchiveFeedProps {
  entries: ArchiveEntryData[];
}

export default function ArchiveFeed({ entries }: ArchiveFeedProps) {
  if (entries.length === 0) {
    return (
      <p className="max-w-[720px] font-mono text-[12px] uppercase tracking-[0.08em] text-mist">
        First entries coming soon.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-[720px]">
      {sorted.map((entry, i) => (
        <div key={entry.id}>
          <MotionReveal
            delay={delay.primary + i * delay.stagger}
            duration={duration.reveal}
          >
            <ArchiveEntry entry={entry} />
          </MotionReveal>
          {i < sorted.length - 1 && <hr className="my-8 border-t border-paper-edge" />}
        </div>
      ))}
    </div>
  );
}
