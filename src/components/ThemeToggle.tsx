"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const [theme, , toggle] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="theme-toggle"
      data-state={isDark ? "on" : "off"}
    >
      <svg
        width="18"
        height="28"
        viewBox="0 0 18 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* plate */}
        <rect
          x="0.5"
          y="0.5"
          width="17"
          height="27"
          rx="1"
          stroke="currentColor"
          strokeOpacity="0.55"
          fill="none"
        />
        {/* inner bezel */}
        <rect
          x="3"
          y="3"
          width="12"
          height="22"
          rx="0.5"
          stroke="currentColor"
          strokeOpacity="0.28"
          fill="none"
        />
        {/* handle — shifts vertically based on state */}
        <g className="theme-toggle__handle">
          <rect
            x="5"
            y={isDark ? "12" : "5"}
            width="8"
            height="11"
            rx="0.5"
            fill="currentColor"
          />
          {/* tiny Hanada indicator dot — only visible in dark */}
          {isDark ? (
            <circle cx="9" cy="14" r="0.9" fill="var(--accent)" />
          ) : null}
        </g>
      </svg>
      <style>{`
        .theme-toggle {
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: currentColor;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
          transition: opacity 200ms var(--ease);
          opacity: 0.65;
        }
        .theme-toggle:hover,
        .theme-toggle:focus-visible { opacity: 1; }
        .theme-toggle:focus-visible {
          outline: 1px solid var(--accent);
          outline-offset: 3px;
        }
        .theme-toggle__handle {
          transition: transform 180ms var(--ease);
        }
      `}</style>
    </button>
  );
}
