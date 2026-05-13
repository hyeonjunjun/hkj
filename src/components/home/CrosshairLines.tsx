export function CrosshairLines() {
  return (
    <svg
      className="crosshair"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* vectorEffect="non-scaling-stroke" + strokeWidth="1" yields a
          crisp 1-CSS-pixel line regardless of how the SVG is scaled
          across the viewport. */}
      <line x1="0" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

      <style>{`
        .crosshair {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </svg>
  );
}
