"use client";
import React from "react";

export type AnnotationItem = {
  variant: "hand" | "editorial";
  label: string;           // e.g. "me", "fall line goggles"
  brand?: string;          // editorial only — e.g. "oakley" (light weight)
  bold?: boolean;          // editorial only — bold the label
  anchorX: number;         // 0-100 % — where the label text sits
  anchorY: number;
  targetX: number;         // 0-100 % — where the arrow/line points (subject)
  targetY: number;
  rotate?: number;         // hand variant — random tilt (-8 to 8 deg)
};

export type AnnotatedMediaProps = {
  children: React.ReactNode;     // the media element (img, video)
  annotations?: AnnotationItem[];
  aspectRatio?: string;          // e.g. "3 / 4"
  className?: string;
};

export default function AnnotatedMedia({ children, annotations = [], aspectRatio, className }: AnnotatedMediaProps) {
  return (
    <div className={`annotated ${className ?? ""}`} style={{ aspectRatio }}>
      <div className="annotated__media">{children}</div>
      {annotations.length > 0 && (
        <svg className="annotated__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {annotations.map((a, i) => (
            <AnnotationLine key={i} item={a} />
          ))}
        </svg>
      )}
      {annotations.map((a, i) => (
        <AnnotationLabel key={i} item={a} />
      ))}
      <style>{`
        .annotated {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .annotated__media {
          position: absolute;
          inset: 0;
        }
        .annotated__media > * {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .annotated__lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          overflow: visible;
        }
        .annotation-label {
          position: absolute;
          pointer-events: none;
          z-index: 3;
          white-space: nowrap;
        }
        /* HAND variant */
        .annotation-label--hand {
          font-family: var(--font-stack-hand);
          font-size: clamp(16px, 2vw, 26px);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          transform: translate(-50%, -50%) rotate(var(--rot, 0deg));
          letter-spacing: 0.01em;
        }
        /* EDITORIAL variant */
        .annotation-label--editorial {
          font-family: var(--font-stack-mono);
          font-size: clamp(10px, 1vw, 13px);
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.95);
          transform: translate(0, -50%);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .annotation-label--editorial .annotation-brand {
          font-weight: 400;
          color: rgba(255, 255, 255, 0.75);
          margin-right: 6px;
        }
        .annotation-label--editorial .annotation-name {
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }
      `}</style>
    </div>
  );
}

function AnnotationLabel({ item }: { item: AnnotationItem }) {
  const style: React.CSSProperties = {
    left: `${item.anchorX}%`,
    top: `${item.anchorY}%`,
  };
  if (item.variant === "hand") {
    (style as React.CSSProperties & Record<string, string>)["--rot"] = `${item.rotate ?? 0}deg`;
    return <div className="annotation-label annotation-label--hand" style={style}>{item.label}</div>;
  }
  return (
    <div className="annotation-label annotation-label--editorial" style={style}>
      {item.brand && <span className="annotation-brand">{item.brand}</span>}
      <span className="annotation-name">{item.label}</span>
    </div>
  );
}

function AnnotationLine({ item }: { item: AnnotationItem }) {
  if (item.variant === "hand") {
    // Hand-drawn squiggly path
    const { anchorX: x1, anchorY: y1, targetX: x2, targetY: y2 } = item;
    // offset start so line begins below the label text
    const startY = y1 + 2;
    const midX = (x1 + x2) / 2 + Math.sin((x1 + y1) * 0.3) * 3;
    const midY = (startY + y2) / 2 + Math.cos((x1 + y1) * 0.3) * 2;
    const path = `M ${x1} ${startY} Q ${midX} ${midY} ${x2} ${y2}`;
    return (
      <g>
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="0.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: "2px" }}
        />
        {/* Arrowhead */}
        <ArrowHead x={x2} y={y2} fromX={midX} fromY={midY} />
      </g>
    );
  }
  // Editorial — straight thin line with corner bracket terminus
  const { anchorX: x1, anchorY: y1, targetX: x2, targetY: y2 } = item;
  // Line extends from label end toward target. Two-segment elbow path.
  const kinkX = x2 < x1 ? x2 + 3 : x2 - 3;
  const path = `M ${x1} ${y1} L ${kinkX} ${y1} L ${x2} ${y2}`;
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: "1px" }}
      />
      {/* Tiny corner bracket at the target */}
      <rect
        x={x2 - 1} y={y2 - 1}
        width="2" height="2"
        fill="none"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: "1px" }}
      />
    </g>
  );
}

function ArrowHead({ x, y, fromX, fromY }: { x: number; y: number; fromX: number; fromY: number }) {
  const angle = Math.atan2(y - fromY, x - fromX);
  const size = 2;
  const a1x = x - size * Math.cos(angle - 0.5);
  const a1y = y - size * Math.sin(angle - 0.5);
  const a2x = x - size * Math.cos(angle + 0.5);
  const a2y = y - size * Math.sin(angle + 0.5);
  return (
    <path
      d={`M ${a1x} ${a1y} L ${x} ${y} L ${a2x} ${a2y}`}
      fill="none"
      stroke="rgba(255,255,255,0.9)"
      strokeWidth="0.4"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ strokeWidth: "2px" }}
    />
  );
}
