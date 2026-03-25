"use client";

import { useCallback, type ReactNode, type CSSProperties } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  flipId?: string; // e.g. "project-gyeol" — triggers FLIP transition
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  [key: string]: unknown;
}

export default function TransitionLink({
  href,
  children,
  flipId,
  className,
  style,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const transitioning = useStudioStore((s) => s.transitioning);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (transitioning) return;
      if (pathname === href) return;
      if (onClick) onClick();

      // On touch/mobile devices, skip FLIP — use standard fade instead
      const isTouch =
        typeof window !== "undefined" &&
        (window.matchMedia("(hover: none)").matches || navigator.maxTouchPoints > 0);

      let sourceRect: DOMRect | null = null;
      let coverImageSrc: string | null = null;

      if (flipId && !isTouch) {
        // Find the [data-cover-image] inside the clicked element
        const el = e.currentTarget as HTMLElement;
        const coverEl = el.querySelector("[data-cover-image]");
        if (coverEl) {
          sourceRect = coverEl.getBoundingClientRect();
          // Try to grab the image src for the clone
          const img = coverEl.querySelector("img");
          if (img) coverImageSrc = img.currentSrc || img.src || null;
        }
      }

      const event = new CustomEvent("page-transition", {
        detail: {
          href,
          flipId: flipId && !isTouch ? flipId : null,
          sourceRect: sourceRect || null,
          coverImageSrc: coverImageSrc || null,
        },
      });
      window.dispatchEvent(event);
    },
    [href, pathname, transitioning, onClick, flipId]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
