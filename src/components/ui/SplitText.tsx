"use client";

import { useRef, createElement } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SplitTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  type?: "chars" | "words" | "lines";
  animation?: "slide-up" | "fade-in" | "clip-reveal";
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  scrub?: boolean | number;
  disabled?: boolean;
  className?: string;
  splitClassName?: string;
  style?: React.CSSProperties;
}

function splitIntoUnits(text: string, type: "chars" | "words" | "lines"): string[] {
  switch (type) {
    case "chars":
      return text.split("");
    case "words":
      return text.split(/(\s+)/); // preserve whitespace
    case "lines":
      return text.split("\n");
  }
}

function getAnimationFrom(animation: string) {
  switch (animation) {
    case "slide-up":
      return { opacity: 0, y: 60, rotateX: -40 };
    case "fade-in":
      return { opacity: 0 };
    case "clip-reveal":
      return { clipPath: "inset(100% 0 0 0)" };
    default:
      return { opacity: 0, y: 60 };
  }
}

export default function SplitText({
  text,
  tag = "div",
  type = "chars",
  animation = "slide-up",
  stagger = 0.06,
  delay = 0,
  duration = 1,
  ease = "power3.out",
  scrub = false,
  disabled = false,
  className = "",
  splitClassName = "",
  style: externalStyle,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const units = splitIntoUnits(text, type);

  useGSAP(
    () => {
      if (disabled || reduced || !containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(".split-unit");
      if (!elements.length) return;

      const fromVars = getAnimationFrom(animation);

      const tween: gsap.TweenVars = {
        ...fromVars,
        stagger,
        duration,
        ease,
        delay,
      };

      if (scrub !== false) {
        tween.scrollTrigger = {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 60%",
          scrub: typeof scrub === "number" ? scrub : 1.5,
        };
      } else {
        tween.scrollTrigger = {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        };
      }

      gsap.from(elements, tween);
    },
    { scope: containerRef, dependencies: [text, animation, disabled, reduced] }
  );

  const children = units.map((unit, i) => {
    if (type === "words" && /^\s+$/.test(unit)) {
      return <span key={i}>&nbsp;</span>;
    }

    return (
      <span
        key={i}
        className={`split-unit inline-block ${splitClassName}`}
        style={animation === "clip-reveal" ? { clipPath: "inset(0)" } : undefined}
      >
        {unit === " " ? "\u00A0" : unit}
      </span>
    );
  });

  return createElement(
    tag,
    {
      // eslint-disable-next-line react-hooks/refs
      ref: containerRef,
      className: `overflow-hidden ${className}`,
      style: {
        perspective: animation === "slide-up" ? "600px" : undefined,
        ...externalStyle,
      },
    },
    children
  );
}
