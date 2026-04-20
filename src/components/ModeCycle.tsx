"use client";

import type { Mode } from "@/hooks/useMode";
import { MODES } from "@/hooks/useMode";

type Props = {
  mode: Mode;
  onSelect: (m: Mode) => void;
};

export default function ModeCycle({ mode, onSelect }: Props) {
  return (
    <div className="mode-cycle" role="tablist" aria-label="Scene">
      {MODES.map((m, i) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          className={`mode-cycle__label ${mode === m ? "is-active" : ""}`}
          onClick={() => onSelect(m)}
        >
          {m.toUpperCase()}
          {i < MODES.length - 1 ? (
            <span className="mode-cycle__sep" aria-hidden>
              {" "}·{" "}
            </span>
          ) : null}
        </button>
      ))}
      <style>{`
        .mode-cycle {
          display: inline-flex;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }
        .mode-cycle__label {
          background: transparent;
          border: none;
          padding: 4px 2px;
          font-family: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: var(--ink-muted);
          cursor: pointer;
          transition: color 180ms var(--ease);
          position: relative;
        }
        .mode-cycle__label:hover { color: var(--ink); }
        .mode-cycle__label.is-active { color: var(--ink); }
        .mode-cycle__label.is-active::after {
          content: "";
          position: absolute;
          left: 2px;
          right: 2px;
          bottom: 0;
          height: 1.5px;
          background: var(--accent);
          transform-origin: left;
          animation: mode-pulse 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes mode-pulse {
          0%   { background: var(--accent); box-shadow: 0 0 0 rgba(91,137,181,0); transform: scaleX(0.5); }
          30%  { background: var(--accent-deep); box-shadow: 0 0 8px rgba(91,137,181,0.5); transform: scaleX(1); }
          100% { background: var(--accent); box-shadow: 0 0 0 rgba(91,137,181,0); transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mode-cycle__label.is-active::after { animation: none; }
        }
        .mode-cycle__sep {
          color: var(--ink-faint);
          padding: 0 2px;
        }
        .mode-cycle__label:focus-visible {
          outline: 1px solid var(--accent);
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
