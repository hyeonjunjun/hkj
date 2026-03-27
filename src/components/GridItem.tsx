"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import type { SheetItemData } from "@/constants/sheet-items";

interface GridItemProps {
  item: SheetItemData;
  style?: React.CSSProperties;
  className?: string;
}

export function GridItem({ item, style, className }: GridItemProps) {
  return (
    <motion.div
      data-flip-id={item.id}
      className={className}
      onClick={() => useStudioStore.getState().setActiveItemId(item.id)}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 32px rgba(var(--ink-rgb), 0.08)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        position: "relative",
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: "1",
        ...style,
      }}
    >
      {/* Image or color block */}
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="20vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: item.color ?? "#888",
          }}
        >
          {/* CSS noise grain overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
              opacity: 0.4,
            }}
          />
        </div>
      )}

      {/* Number: top-left */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--ink-whisper)",
          lineHeight: 1,
          zIndex: 2,
        }}
      >
        {item.number}
      </span>

      {/* WIP badge: top-right */}
      {item.wip && (
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: 2,
            lineHeight: 1,
            zIndex: 2,
            letterSpacing: "0.04em",
          }}
        >
          IN PROGRESS
        </span>
      )}

      {/* Type tag on hover: bottom-right */}
      <motion.span
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          bottom: 6,
          right: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          backgroundColor: "rgba(var(--ink-rgb), 0.05)",
          padding: "2px 6px",
          borderRadius: 2,
          zIndex: 2,
          letterSpacing: "0.04em",
          lineHeight: 1.4,
        }}
      >
        {item.type}
      </motion.span>
    </motion.div>
  );
}

export default GridItem;
