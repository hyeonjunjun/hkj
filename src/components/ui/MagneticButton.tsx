"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  scale?: number;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  strength = 0.3,
  radius = 100,
  scale = 1.05,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;

    const node = ref.current;
    quickToX.current = gsap.quickTo(node, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    quickToY.current = gsap.quickTo(node, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    return () => {
      if (node) {
        gsap.set(node, { x: 0, y: 0, scale: 1 });
      }
    };
  }, [reduced]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current || !quickToX.current || !quickToY.current)
        return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        quickToX.current(dx * strength);
        quickToY.current(dy * strength);
      }
    },
    [strength, radius, reduced]
  );

  const handleMouseEnter = useCallback(() => {
    if (reduced || !ref.current) return;
    gsap.to(ref.current, { scale, duration: 0.4, ease: "power2.out" });
  }, [scale, reduced]);

  const handleMouseLeave = useCallback(() => {
    if (reduced || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  }, [reduced]);

  return (
    <div
      ref={ref}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-block ${className}`}
      style={{ willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter") onClick(); } : undefined}
      data-cursor="magnetic"
    >
      {children}
    </div>
  );
}
