"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

/**
 * ScrollColorController
 * ─────────────────────
 * Uses GSAP ScrollTrigger to interpolate CSS custom properties
 * as the user scrolls through Day → Dusk → Night phases.
 * Uses gsap.quickSetter for batched, high-perf variable updates.
 */

// Color tokens per phase
const DAY = {
  bg: [247, 243, 237],       // #F7F3ED
  surface: [239, 234, 228],  // #EFEAE4
  text: [21, 21, 24],        // #151518
  textDim: [74, 74, 80],     // #4A4A50
  textGhost: [138, 138, 144],// #8A8A90
};

const DUSK = {
  bg: [50, 52, 60],          // #32343C
  surface: [58, 60, 68],     // #3A3C44
  text: [232, 228, 222],     // #E8E4DE
  textDim: [154, 154, 160],  // #9A9AA0
  textGhost: [106, 106, 112],// #6A6A70
};

const NIGHT = {
  bg: [21, 21, 24],          // #151518
  surface: [30, 30, 34],     // #1E1E22
  text: [247, 243, 237],     // #F7F3ED
  textDim: [176, 176, 181],  // #B0B0B5
  textGhost: [106, 106, 112],// #6A6A70
};

function lerpRgb(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const blue = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${blue})`;
}

function lerpBorderRgba(textRgb: number[], t: number): string {
  // Border uses text color at low opacity — interpolate between dark text + light text
  return `rgba(${textRgb[0]},${textRgb[1]},${textRgb[2]},${0.1})`;
}

function lerpBorderStrong(textRgb: number[]): string {
  return `rgba(${textRgb[0]},${textRgb[1]},${textRgb[2]},${0.25})`;
}

export default function ScrollColorController() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setColorPhase = useStudioStore((s) => s.setColorPhase);
  const experienceMode = useStudioStore((s) => s.experienceMode);

  useEffect(() => {
    // Skip color interpolation in recruiter mode
    if (experienceMode === "recruiter") return;

    const root = document.documentElement;

    function applyColors(from: typeof DAY, to: typeof DAY, progress: number) {
      root.style.setProperty("--color-bg", lerpRgb(from.bg, to.bg, progress));
      root.style.setProperty("--color-surface", lerpRgb(from.surface, to.surface, progress));
      root.style.setProperty("--color-text", lerpRgb(from.text, to.text, progress));
      root.style.setProperty("--color-text-dim", lerpRgb(from.textDim, to.textDim, progress));
      root.style.setProperty("--color-text-ghost", lerpRgb(from.textGhost, to.textGhost, progress));

      const currentText = from.text.map((v, i) => Math.round(v + (to.text[i] - v) * progress));
      root.style.setProperty("--color-border", lerpBorderRgba(currentText, progress));
      root.style.setProperty("--color-border-strong", lerpBorderStrong(currentText));

      // Noise opacity
      const noiseOp = 0.03 + progress * 0.015;
      root.style.setProperty("--noise-opacity", String(noiseOp));
    }

    // Day → Dusk: triggered when [data-section="about"] scrolls into view
    const aboutEl = document.querySelector("[data-section='about']");
    const contactEl = document.querySelector("[data-section='contact']");

    const triggers: gsap.core.Tween[] = [];

    if (aboutEl) {
      const dayToDusk = gsap.to({}, {
        scrollTrigger: {
          trigger: aboutEl,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          onUpdate: (self) => {
            applyColors(DAY, DUSK, self.progress);
            if (self.progress > 0.5) {
              setColorPhase("dusk");
            } else {
              setColorPhase("day");
            }
          },
        },
      });
      triggers.push(dayToDusk);
    }

    // Dusk → Night: triggered when [data-section="contact"] scrolls into view
    if (contactEl) {
      const duskToNight = gsap.to({}, {
        scrollTrigger: {
          trigger: contactEl,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
          onUpdate: (self) => {
            applyColors(DUSK, NIGHT, self.progress);
            if (self.progress > 0.5) {
              setColorPhase("night");
            }
          },
        },
      });
      triggers.push(duskToNight);
    }

    return () => {
      triggers.forEach((t) => t.scrollTrigger?.kill());
      // Reset to day
      root.style.removeProperty("--color-bg");
      root.style.removeProperty("--color-surface");
      root.style.removeProperty("--color-text");
      root.style.removeProperty("--color-text-dim");
      root.style.removeProperty("--color-text-ghost");
      root.style.removeProperty("--color-border");
      root.style.removeProperty("--color-border-strong");
      root.style.removeProperty("--noise-opacity");
    };
  }, [experienceMode, setColorPhase]);

  return <div ref={containerRef} className="hidden" />;
}
