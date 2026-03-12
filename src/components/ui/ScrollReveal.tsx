"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "fade-up" | "fade-in" | "clip-up" | "slide-left";
  start?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  scrub?: boolean | number;
  disabled?: boolean;
  className?: string;
  as?: React.ElementType;
}

function getFromVars(animation: string) {
  switch (animation) {
    case "fade-up":
      return { opacity: 0, y: 60 };
    case "fade-in":
      return { opacity: 0 };
    case "clip-up":
      return { clipPath: "inset(100% 0 0 0)" };
    case "slide-left":
      return { opacity: 0, x: -40 };
    default:
      return { opacity: 0, y: 60 };
  }
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  start = "top 85%",
  stagger = 0.08,
  delay = 0,
  duration = 0.8,
  ease = "power3.out",
  scrub = false,
  disabled = false,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (disabled || reduced || !ref.current) return;

      const directChildren = ref.current.children;
      if (!directChildren.length) return;

      const fromVars = getFromVars(animation);

      const tween: gsap.TweenVars = {
        ...fromVars,
        stagger,
        duration,
        ease,
        delay,
      };

      if (scrub !== false) {
        tween.scrollTrigger = {
          trigger: ref.current,
          start,
          end: "bottom 60%",
          scrub: typeof scrub === "number" ? scrub : 1.5,
        };
      } else {
        tween.scrollTrigger = {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        };
      }

      gsap.from(directChildren, tween);
    },
    { scope: ref, dependencies: [animation, disabled, reduced] }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
