import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ryan Jun — design engineer, New York.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image — the portfolio's identity card.
 *
 * Single ruled departure-board frame in the same dark register as the
 * site: pure black ground, warm cream type, one amber detail (the
 * pulse glyph next to the role line). Wordmark "Ryan Jun" big-center,
 * with station-meta above and a single-line schedule strip below.
 */
export default async function Image() {
  const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

  const PAPER = "#000000";
  const INK = "#F8F8F8";
  const INK_3 = "rgba(248,248,248,0.45)";
  const INK_4 = "rgba(248,248,248,0.30)";
  const INK_HAIR = "rgba(248,248,248,0.16)";
  const ACCENT = "#E8B25A";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PAPER,
          color: INK,
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
            color: INK_3,
            width: "100%",
            paddingBottom: 18,
            borderBottom: `1px solid ${INK_HAIR}`,
          }}
        >
          <span>Portfolio · 2026</span>
          <span>New York · EDT</span>
        </div>

        {/* Center — wordmark + role */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: INK,
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
            }}
          >
            Ryan Jun
          </div>

          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: INK_3,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ color: ACCENT }}>◆</span>
            <span>Multidisciplinary · Design · Engineering · Direction</span>
          </div>
        </div>

        {/* Bottom register — single departure-board strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK_4,
            width: "100%",
            paddingTop: 18,
            borderTop: `1px solid ${INK_HAIR}`,
          }}
        >
          <span>rykjun@gmail.com</span>
          <span>40°43′N · 73°59′W</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
