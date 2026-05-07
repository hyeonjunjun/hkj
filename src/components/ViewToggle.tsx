"use client";

/**
 * ViewToggle — pure presentational Grid / List switcher per spec §05.
 *
 *   GRID  ·  LIST
 *
 * Two text-styled buttons separated by a hairline `·`. Active label
 * carries var(--ink); inactive sits at var(--ink-3). Microtype register
 * (Geist Sans 11px uppercase, 0.12em tracking) — the same voice as
 * .eyebrow / nav, so it reads as chrome data, not editorial copy.
 *
 * 180ms color transition, disabled under prefers-reduced-motion.
 */
type Props = {
  value: "grid" | "list";
  onChange: (next: "grid" | "list") => void;
};

export default function ViewToggle({ value, onChange }: Props) {
  return (
    <div
      className="view-toggle"
      role="group"
      aria-label="Catalog view mode"
    >
      <button
        type="button"
        className="view-toggle__btn"
        data-active={value === "grid" ? "" : undefined}
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <span className="view-toggle__sep" aria-hidden>
        ·
      </span>
      <button
        type="button"
        className="view-toggle__btn"
        data-active={value === "list" ? "" : undefined}
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
      >
        List
      </button>

      <ToggleStyle />
    </div>
  );
}

function ToggleStyle() {
  return (
    <style>{`
      .view-toggle {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-stack-mono);
        font-size: var(--type-nav);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        line-height: 1;
      }
      .view-toggle__btn {
        background: none;
        border: 0;
        padding: 0;
        margin: 0;
        font: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
        color: var(--ink-3);
        cursor: pointer;
        transition: color 180ms var(--ease);
      }
      .view-toggle__btn[data-active] {
        color: var(--ink);
      }
      .view-toggle__btn:hover {
        color: var(--ink);
      }
      .view-toggle__sep {
        color: var(--ink-4);
        user-select: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .view-toggle__btn { transition: none; }
      }
    `}</style>
  );
}
