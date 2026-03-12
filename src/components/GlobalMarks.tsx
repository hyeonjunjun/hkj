"use client";

import { useEffect, useState } from "react";

/**
 * GlobalMarks — Registration Marks & Grid
 * Uses CSS-positioned wrappers to avoid invalid calc() in SVG transforms.
 */
export default function GlobalMarks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const Mark = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" />
      <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[40] opacity-[0.15] mix-blend-difference" style={{ color: "currentColor" }}>
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Corners */}
      <div className="absolute top-6 left-6"><Mark /></div>
      <div className="absolute top-6 right-6"><Mark /></div>
      <div className="absolute bottom-6 left-6"><Mark /></div>
      <div className="absolute bottom-6 right-6"><Mark /></div>
    </div>
  );
}
