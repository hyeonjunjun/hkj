"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeToggle — single button. Sun glyph in light mode flips to
 * moon glyph in dark mode (or vice versa). Click toggles theme.
 * Rotates 180° on hover. Reduced-motion respected.
 *
 * The button itself is the only visible element — there's no label
 * text. aria-label provides the accessible name; aria-pressed
 * reflects the current state.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  const targetMode = isLight ? "dark" : "light";

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={`Switch to ${targetMode} mode`}
        aria-pressed={!isLight}
      >
        <span className="theme-toggle__glyph" aria-hidden>
          {isLight ? "☼" : "☾"}
        </span>
      </button>

      <style>{`
        .theme-toggle {
          background: transparent;
          border: 0;
          padding: 4px;
          margin: 0;
          cursor: pointer;
          color: inherit;
          line-height: 1;
        }
        .theme-toggle__glyph {
          display: inline-block;
          font-size: 14px;
          color: var(--ink);
          transition: transform 320ms var(--ease), color 200ms var(--ease);
        }
        .theme-toggle:hover .theme-toggle__glyph {
          transform: rotate(180deg);
          color: var(--ink-2);
        }
        .theme-toggle:focus-visible {
          outline: 1px solid var(--ink);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .theme-toggle__glyph { transition: none; }
          .theme-toggle:hover .theme-toggle__glyph { transform: none; }
        }
      `}</style>
    </>
  );
}
