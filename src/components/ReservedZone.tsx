"use client";

import ThemeToggle from "@/components/ThemeToggle";
import ViewToggle from "@/components/ViewToggle";

/**
 * ReservedZone — grid-cell-shaped container in the home hero.
 *
 * In Phase 2, mounts as the LAST cell of the existing 2-col grid
 * (transitional placement). In Phase 4, the home grid switches to
 * 3-col and the reserved zone moves to row 1 col 3.
 *
 * Holds the theme toggle today; in Phase 4 also holds the view
 * toggle (gallery/list); future fillable with status feeds, "now"
 * lines, build SHA, etc.
 */
export default function ReservedZone() {
  return (
    <aside className="reserved" aria-label="Settings">
      <div className="reserved__cluster">
        <ThemeToggle />
        <ViewToggle />
      </div>

      <style>{`
        .reserved {
          display: grid;
          align-items: end;
          justify-items: end;
          padding: clamp(20px, 3vh, 36px);
          min-height: 0;
        }
        .reserved__cluster {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(12px, 2vw, 20px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: var(--microtype-tracking);
          text-transform: lowercase;
          color: var(--ink-3);
        }
      `}</style>
    </aside>
  );
}
