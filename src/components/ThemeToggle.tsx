"use client";

import { useSyncExternalStore } from "react";

/**
 * ThemeToggle — light / dark theme switcher.
 *
 *   light · dark
 *   ─────
 *
 * Reads the active theme from `<html data-theme>` via
 * useSyncExternalStore — the idiomatic React 19 way to bind UI to an
 * external store (here, the document element). A MutationObserver on
 * `data-theme` drives re-renders when the attribute changes from any
 * source (this component, the inline init script, devtools).
 *
 * Default theme is light (the user's preference); system preference
 * (prefers-color-scheme: dark) is deliberately ignored — the user's
 * stated taste overrides OS defaults.
 *
 * Renders nothing during SSR and on hydration so the server output
 * (null) matches the first client render. After hydration commits,
 * useSyncExternalStore detects the snapshot diff and schedules a
 * second render with the actual theme — no hydration mismatch warning.
 */

type Theme = "light" | "dark";
const STORAGE_KEY = "rj-theme";

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!theme) return null;

  const apply = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable in private mode
    }
    // MutationObserver picks up the attribute change and triggers
    // useSyncExternalStore to re-render with the new snapshot.
  };

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
