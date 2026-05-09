/**
 * PaperGrain — fixed full-viewport noise overlay.
 *
 * Pure SVG turbulence rendered as an inline data URL. Multiply blend
 * over the paper register so the texture sits inside the surface
 * rather than on top of it. 0.04 opacity is the threshold where the
 * grain reads as paper rather than as decoration.
 *
 * No JS. pointer-events: none. aria-hidden. Reduced-motion safe by
 * construction (the noise itself doesn't animate).
 */
const NOISE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' seed='3'/>
    <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/>
  </filter>
  <rect width='100%' height='100%' filter='url(#n)'/>
</svg>`)}`;

export default function PaperGrain() {
  return (
    <div className="paper-grain" aria-hidden>
      <style>{`
        .paper-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: url("${NOISE_SVG}");
          background-size: 240px 240px;
          background-repeat: repeat;
          /* Overlay multiplies on dark and screens on light, so the
             same noise SVG reads as warm-paper texture on the old
             paper register and as soft board grain on the inverted
             dark register without changing the source bitmap. */
          mix-blend-mode: overlay;
          opacity: 0.06;
        }
        @media (prefers-reduced-motion: reduce) {
          .paper-grain { opacity: 0.04; }
        }
      `}</style>
    </div>
  );
}
