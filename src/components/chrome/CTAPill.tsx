// src/components/chrome/CTAPill.tsx
"use client";

import { CONTACT_EMAIL } from "@/constants/contact";

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <rect x="1.5" y="2.5" width="9" height="8" />
      <line x1="1.5" y1="4.5" x2="10.5" y2="4.5" />
      <line x1="3.5" y1="1.5" x2="3.5" y2="3.5" />
      <line x1="8.5" y1="1.5" x2="8.5" y2="3.5" />
    </svg>
  );
}

export function CTAPill() {
  return (
    <a
      className="cta-pill"
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label="Contact via email"
    >
      <CalendarIcon />
      <span className="t-footnote cta-pill__label">Available</span>

      <style>{`
        .cta-pill {
          position: fixed;
          right: -3px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--paper);
          padding: 8px 16px 8px 12px;
          border-radius: 4px 0 0 4px;
          transition: opacity 180ms var(--ease);
        }
        .cta-pill:hover { opacity: 0.85; }
        .cta-pill__label {
          color: var(--paper);
          text-transform: uppercase;
        }
      `}</style>
    </a>
  );
}
