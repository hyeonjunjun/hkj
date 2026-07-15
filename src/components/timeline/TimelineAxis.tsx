interface TimelineAxisProps {
  /** Years in display order (may repeat — one label per distinct year is shown). */
  years: string[];
  /** Scroll progress, 0 (start) to 1 (end). */
  progress: number;
}

const TICKS_PER_YEAR = 12;

/**
 * The dense tick-mark scrubber below the media row. Fine unlabeled ticks
 * give a sense of temporal density; labels mark each distinct year in
 * `years` (deduplicated, in the order given — this project's data is
 * year-granular, unlike the month-granular reference). The progress
 * indicator is a plain position readout, not itself interactive — the
 * media row above is where scrolling actually happens.
 */
export default function TimelineAxis({ years, progress }: TimelineAxisProps) {
  const distinctYears = years.filter((year, i) => years.indexOf(year) === i);
  const tickCount = Math.max(distinctYears.length * TICKS_PER_YEAR, 1);

  return (
    <div className="relative w-full">
      <div className="flex items-end gap-[2px]" aria-hidden="true">
        {Array.from({ length: tickCount }, (_, i) => (
          <span
            key={i}
            className={
              i % TICKS_PER_YEAR === 0
                ? "h-3 w-px bg-ws-ink/60"
                : "h-1.5 w-px bg-ws-ink/20"
            }
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-display text-[10px] uppercase tracking-[0.1em] text-ws-ink/50">
        {distinctYears.map((year) => (
          <span key={year}>{year}</span>
        ))}
      </div>
      <span
        data-testid="timeline-axis-progress"
        className="absolute top-0 h-3 w-[2px] -translate-x-1/2 bg-ws-accent"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}
