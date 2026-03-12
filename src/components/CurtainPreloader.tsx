"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useStudioStore } from "@/lib/store";

/**
 * Preloader — Voku.studio-inspired
 *
 * Vertical text cycling with refined serif typography.
 * "Design Engineering" → "Systems Thinking" → "NYC / Seoul" → "HKJ Studio"
 * Each phrase slides up with a smooth ease, dwells briefly, then the next appears.
 * Final phrase holds, then the entire preloader crossfades out to reveal the hero.
 * ~2.5s total. Session-cached via sessionStorage.
 */

const PHRASES = [
  "Design Engineering",
  "Systems Thinking",
  "NYC / Seoul",
  "HKJ Studio",
];

export default function CurtainPreloader() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const finish = useCallback(() => {
    setFading(true);
    setLoaded(true);
    sessionStorage.setItem("hkj-v5", "1");
    timerRef.current = setTimeout(() => setVisible(false), 1000);
  }, [setLoaded]);

  useEffect(() => {
    if (sessionStorage.getItem("hkj-v5")) {
      setLoaded(true);
      setVisible(false);
      return;
    }

    let i = 0;
    const advance = () => {
      i++;
      if (i < PHRASES.length) {
        setIndex(i);
        timerRef.current = setTimeout(advance, 620);
      } else {
        timerRef.current = setTimeout(finish, 500);
      }
    };

    timerRef.current = setTimeout(advance, 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [setLoaded, finish]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#F7F3ED",
        opacity: fading ? 0 : 1,
        transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Cycling text */}
      <div className="overflow-hidden" style={{ height: "1.35em" }}>
        <div
          style={{
            transform: `translateY(-${index * 1.35}em)`,
            transition: "transform 480ms cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        >
          {PHRASES.map((phrase, i) => (
            <div
              key={phrase}
              className="flex items-center justify-center font-serif select-none"
              style={{
                height: "1.35em",
                lineHeight: 1.35,
                fontSize: "clamp(1.25rem, 1rem + 1vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#151518",
                opacity: i === index ? 1 : 0.15,
                transition: "opacity 380ms ease",
              }}
            >
              {phrase}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
