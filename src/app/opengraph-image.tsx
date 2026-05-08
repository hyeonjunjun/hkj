import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "stray — a creative studio. New York.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image — the studio's identity card.
 *
 * Pixelated cloud monogram centered, "stray" wordmark below, role
 * line below that. Same 8×5 silhouette as the favicon, scaled up to
 * OG-card size (~14px per pixel). Mono throughout. Founder name
 * (Ryan Jun) lives only on /studio as editorial, not promoted here.
 */
const CLOUD: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

export default async function Image() {
  const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
  const PX = 14;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FBFAF6",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: 56,
          position: "relative",
          fontFamily: MONO,
        }}
      >
        {/* Top register — eyebrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.55)",
            width: "100%",
          }}
        >
          <span>Studio · 2026</span>
          <span>New York</span>
        </div>

        {/* Center — cloud monogram + wordmark + role */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {/* Pixelated cloud */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CLOUD.map((row, ri) => (
              <div key={ri} style={{ display: "flex" }}>
                {row.map((cell, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: PX,
                      height: PX,
                      background: cell ? "#000000" : "transparent",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#000000",
              display: "flex",
            }}
          >
            stray
          </div>

          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.55)",
              display: "flex",
            }}
          >
            A creative studio
          </div>
        </div>

        {/* Bottom register */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.55)",
            width: "100%",
          }}
        >
          <span>rykjun@gmail.com</span>
          <span>40°43′N 73°59′W</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
