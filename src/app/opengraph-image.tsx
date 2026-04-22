import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Hyeonjoon Jun — design engineer, New York";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image — the portfolio's identity card.
 *
 * ASCII monogram mark (3-line framed stamp) centered, with name and
 * role below. Mono throughout. Paper-and-ink palette. Matches the
 * /contact business-card composition's hierarchy.
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
          color: "#111110",
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
            fontSize: 15,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#8E8E87",
            width: "100%",
          }}
        >
          <span>Observation Log</span>
          <span>New York · 2026</span>
        </div>

        {/* Center — mark + name + role */}
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
          {/* ASCII logo mark — 3-line framed stamp */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: "0.05em",
              textAlign: "center",
              whiteSpace: "pre",
              color: "#111110",
              marginBottom: 32,
            }}
          >
            <div>·───·</div>
            <div> h·j </div>
            <div>·───·</div>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 44,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#111110",
              display: "flex",
            }}
          >
            Hyeonjoon Jun
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: 15,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#55554F",
              display: "flex",
            }}
          >
            Design engineer
          </div>
        </div>

        {/* Bottom register */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8E8E87",
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
