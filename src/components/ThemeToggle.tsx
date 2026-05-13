"use client";

import { useEffect, useState } from "react";

/**
 * ThemeToggle — light / dark theme switcher.
 *
 *   light · dark
 *   ─────
 *
 * The active theme is underlined; clicking the other label flips
 * the root's data-theme attribute and persists the choice in
 * localStorage. The inline init script in layout.tsx applies the
 * stored theme before paint so there's no flash on load.
 *
 * Default theme is light (the user prefers it). System preference
 * (prefers-color-scheme: dark) is deliberately ignored — the user's
 * stated taste overrides OS defaults.
 *
 * Renders nothing on first paint until the component reads the
 * actual current theme from the root element (avoids hydration
 * mismatch between server-rendered HTML and client state).
 */

type Theme = "light" | "dark";
const STORAGE_KEY = "rj-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // The inline script in <head> has already set data-theme by the
    // time we mount. Read it back rather than computing it again, so
    // we stay in sync with the actual rendered state.
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable in private mode
    }
    setTheme(next);
  };

  if (!theme) return null;

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className="theme-toggle__btn"
        data-active={theme === "light" ? "" : undefined}
        aria-pressed={theme === "light"}
        onClick={() => apply("light")}
      >
        light
      </button>
      <span className="theme-toggle__sep" aria-hidden>
        ·
      </span>
      <button
        type="button"
        className="theme-toggle__btn"
        data-active={theme === "dark" ? "" : undefined}
        aria-pressed={theme === "dark"}
        onClick={() => apply("dark")}
      >
        dark
      </button>

      <style>{`
        .theme-toggle {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          font-family: var(--font-stack-sans);
          font-size: clamp(12px, 0.95vw, 14px);
          letter-spacing: 0;
          line-height: 1;
          color: var(--ink);
        }
        .theme-toggle__btn {
          font: inherit;
          letter-spacing: inherit;
          color: var(--ink-3);
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          text-transform: lowercase;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition:
            color 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
            background-size 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .theme-toggle__btn[data-active] {
          color: var(--ink);
          background-size: 100% 1px;
        }
        .theme-toggle__btn:hover {
          color: var(--ink);
        }
        .theme-toggle__sep {
          color: var(--ink-4);
          user-select: none;
        }
      `}</style>
    </div>
  );
}
