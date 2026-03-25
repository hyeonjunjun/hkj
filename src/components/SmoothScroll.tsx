"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

interface SmoothScrollProps {
  children: React.ReactNode;
}

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<React.ComponentRef<typeof ReactLenis>>(null);
  const setScrollProgress = useStudioStore((s) => s.setScrollProgress);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Sync Lenis scroll events with ScrollTrigger and track scroll progress
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    const onScroll = () => {
      ScrollTrigger.update();
      // Update scroll progress in store for WallLight atmospheric parallax
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollH));
        setScrollProgress(progress);
      }
    };
    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [setScrollProgress]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false, // GSAP ticker drives the RAF loop
      }}
    >
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
