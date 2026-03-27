"use client";

import { useState } from "react";
import { SHEET_ITEMS } from "@/constants/sheet-items";
import { GridItem } from "@/components/GridItem";

export function DriftView() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const count = SHEET_ITEMS.length;

  return (
    <div
      style={{
        perspective: 1200,
        perspectiveOrigin: "center center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transformStyle: "preserve-3d",
        }}
      >
        {SHEET_ITEMS.map((item, index) => {
          const angle = ((index - (count - 1) / 2) / count) * 30;
          const isHovered = hoveredIndex === index;

          const transform = isHovered
            ? `rotateY(0deg) translateZ(40px)`
            : `rotateY(${angle}deg) translateZ(${Math.abs(angle) * -2}px)`;

          return (
            <div
              key={item.id}
              data-flip-id={item.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: "clamp(150px, 18vw, 220px)",
                flexShrink: 0,
                margin: "0 -20px",
                transform,
                transformOrigin: "center center",
                transition: "transform 0.5s cubic-bezier(.19, 1, .22, 1)",
                zIndex: isHovered ? 10 : count - Math.abs(index - Math.round((count - 1) / 2)),
              }}
            >
              <GridItem item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DriftView;
