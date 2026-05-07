import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Stray — design engineering studio, New York";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image — the studio's identity card.
 *
 * Stray wordmark centered on the warm paper ground, with role line
 * below. Mono throughout, paper-and-ink palette. Matches the
 * portfolio's masthead and footer registers.
 */
export default async function Image() {
  const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

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

        {/* Center — wordmark + role */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
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
            Design engineering studio
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
    { ...size }
  );
}
