import type { ReactNode, CSSProperties } from "react";

interface BracketProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Opacity of the bracket chars relative to content (0-1) */
  bracketOpacity?: number;
}

/**
 * Wraps content in [ ] brackets rendered as pseudo-elements
 * for consistent spacing and color inheritance.
 * Usage: <Bracket>HKJ_01_26</Bracket> → [HKJ_01_26]
 */
export default function Bracket({
  children,
  className = "",
  style = {},
  bracketOpacity = 0.5,
}: BracketProps) {
  return (
    <span
      className={`bracket-wrap ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.25em",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{ opacity: bracketOpacity }}
      >
        [
      </span>
      <span>{children}</span>
      <span
        aria-hidden="true"
        style={{ opacity: bracketOpacity }}
      >
        ]
      </span>
    </span>
  );
}
