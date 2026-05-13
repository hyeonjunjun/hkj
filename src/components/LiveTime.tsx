"use client";

import { useEffect, useState } from "react";

/**
 * LiveTime — split-flap departure-board clock.
 *
 * Renders the New York wall-clock time as HH:MM with each digit
 * wrapped in a FlapDigit that animates a vertical scaleY collapse-
 * and-expand whenever its value changes. The colon stays static —
 * only digits flap. Animation timing (320ms total, content swap at
 * 160ms midpoint) borrowed from the Solari mechanism: the flap
 * card collapses to invisible, the next character is revealed,
 * then the new card unfolds. Reduced-motion users get the same
 * digits without the rotation.
 *
 * The component emits text only — no font, no size, no color. The
 * consuming parent (the banner's __time slot) controls typography
 * via cascade, so the digits inherit the banner's amber + tabular
 * mono treatment.
 */

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function FlapDigit({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value === shown) return;
    // Defer the state changes into async callbacks so they don't fire
    // synchronously inside the effect body (which would cascade an
    // immediate re-render). 0ms is one microtask — imperceptible, and
    // satisfies the react-hooks/set-state-in-effect rule.
    //
    // Swap the rendered character at the midpoint of the flip — the
    // moment the flap is at scaleY ~0, when the eye can't read what's
    // there. This gives the illusion of a single mechanical action
    // ending on the new value.
    const startFlip = setTimeout(() => setFlipping(true), 0);
    const swap = setTimeout(() => setShown(value), 160);
    const stop = setTimeout(() => setFlipping(false), 320);
    return () => {
      clearTimeout(startFlip);
      clearTimeout(swap);
      clearTimeout(stop);
    };
  }, [value, shown]);

  return (
    <span className="flap-digit" data-flipping={flipping ? "" : undefined}>
      {shown}
    </span>
  );
}

export default function LiveTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const render = () => setTime(FORMATTER.format(new Date()));
    render();

    // Align the first tick to the next whole-second boundary so the
    // flap fires on the wall clock, not 1000ms after page load.
    // Subsequent ticks are a plain 1000ms interval.
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      render();
      intervalId = setInterval(render, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // SSR placeholder + initial paint before useEffect resolves the
  // real time. Same character count so the layout slot is stable.
  if (!time) {
    return (
      <span className="live-time" aria-label="Loading time">
        ——:——:——
      </span>
    );
  }

  // Intl.DateTimeFormat returns "HH:MM:SS" — split into individual
  // digit slots so each can flap independently. Hours flip ~1×/hr,
  // minutes ~1×/min, seconds 1×/sec. The seconds are the visible
  // heartbeat; the rest are quiet.
  const [h1, h2, , m1, m2, , s1, s2] = time;

  return (
    <span className="live-time" aria-live="off" aria-label={`Local time ${time}`}>
      <FlapDigit value={h1} />
      <FlapDigit value={h2} />
      <span className="live-time__colon">:</span>
      <FlapDigit value={m1} />
      <FlapDigit value={m2} />
      <span className="live-time__colon">:</span>
      <FlapDigit value={s1} />
      <FlapDigit value={s2} />
      <style>{`
        .live-time {
          display: inline-flex;
          align-items: baseline;
          font-variant-numeric: tabular-nums;
        }
        .flap-digit {
          display: inline-block;
          min-width: 0.62em;
          text-align: center;
          transform-origin: center;
          backface-visibility: hidden;
          will-change: transform;
        }
        .flap-digit[data-flipping] {
          animation: flap-flip 320ms cubic-bezier(.4, 0, .2, 1);
        }
        @keyframes flap-flip {
          0%   { transform: scaleY(1); }
          48%  { transform: scaleY(0.04); }
          52%  { transform: scaleY(0.04); }
          100% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flap-digit[data-flipping] { animation: none; }
        }
        .live-time__colon {
          display: inline-block;
          padding: 0 0.05em;
        }
      `}</style>
    </span>
  );
}
