/**
 * PaperGrain — a single static fractal-noise layer applied across the
 * whole viewport via mix-blend-multiply. Gives the site the tactile
 * feel of printed stock without ever moving. Invisible at a glance,
 * felt when the eye rests. No rAF loop, no interaction, no cost after
 * first paint — the filter runs once and the browser caches it.
 *
 * Baseline values: baseFrequency=0.9 → fine grain; numOctaves=2 →
 * enough variance to feel organic; opacity=0.055 → barely there.
 * Tweak the opacity (not the filter) if the paper feels too heavy or
 * too flat.
 *
 * Blend mode + opacity are applied via the .paper-grain class in
 * globals.css so theme-aware overrides can win without !important
 * (inline styles win over external CSS otherwise). Dark mode swaps
 * to mix-blend-mode: screen so the grain stays visible on warm-near-
 * black ground.
 */
export default function PaperGrain() {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className="paper-grain"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <filter id="paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="7"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}
