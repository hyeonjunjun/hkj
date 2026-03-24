"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteAnnouncer — announces route changes to screen readers via an ARIA
 * live region. Visually hidden; fires on every pathname change.
 */
export default function RouteAnnouncer() {
  const pathname = usePathname();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcerRef.current) {
      announcerRef.current.textContent = "";
      // Defer to let the new page title settle before announcing
      const id = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent =
            document.title || `Navigated to ${pathname}`;
        }
      }, 100);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    />
  );
}
