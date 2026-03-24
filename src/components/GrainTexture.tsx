/**
 * Grain overlay that references the global #grain filter in layout.tsx.
 * Gives flat color fields the quality of printed paper.
 */
export function GrainTexture({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      className={dark ? "grain-overlay grain-overlay--dark" : "grain-overlay"}
      aria-hidden="true"
    >
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
