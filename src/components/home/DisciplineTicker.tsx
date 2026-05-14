// src/components/home/DisciplineTicker.tsx
"use client";

import Marquee from "react-fast-marquee";

const DISCIPLINES = [
  "Brand Identity",
  "Design Engineering",
  "Creative Direction",
  "Art Direction",
  "Motion",
  "Editorial",
  "Product",
];

export function DisciplineTicker() {
  return (
    <div className="ticker" aria-label="Disciplines">
      <Marquee
        speed={32}
        gradient={false}
        pauseOnHover
        autoFill
      >
        {DISCIPLINES.map((d, i) => (
          <span key={i} className="t-meta ticker__item">
            {d}
            <span className="t-sep ticker__sep" aria-hidden>·</span>
          </span>
        ))}
      </Marquee>

      <style>{`
        .ticker {
          width: 100%;
          color: var(--ink-3);
          text-transform: uppercase;
        }
        .ticker__item {
          margin-right: 24px;
          white-space: nowrap;
        }
        .ticker__sep {
          margin-left: 24px;
          color: var(--ink-4);
        }
        @media (prefers-reduced-motion: reduce) {
          .rfm-marquee {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </div>
  );
}
