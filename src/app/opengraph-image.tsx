import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "HKJ — Hyeonjoon, design engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F7F7F5",
          color: "#1C1C1A",
          padding: 56,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontFamily: "monospace",
              letterSpacing: "0.14em",
              color: "#1C1C1A",
            }}
          >
            HKJ
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: "#5A5A56",
            }}
          >
            STUDIO · NEW YORK · 2026
          </div>
        </div>

        {/* Centered block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            <line x1="90" y1="10" x2="90" y2="170" stroke="#1C1C1A" strokeWidth="3" />
            <line x1="10" y1="90" x2="170" y2="90" stroke="#1C1C1A" strokeWidth="3" />
            <circle cx="90" cy="90" r="3" fill="#1C1C1A" />
          </svg>
          <div
            style={{
              fontSize: 56,
              fontFamily: "serif",
              fontStyle: "italic",
              color: "#1C1C1A",
              marginTop: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Hyeonjoon, design engineer
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: "#5A5A56",
            }}
          >
            HKJ · N40.71° W74.00°
          </div>
          <div
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              color: "#5A5A56",
            }}
          >
            AVAILABLE 2026
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
