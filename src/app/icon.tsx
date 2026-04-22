import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — tiny h·j monogram on paper. Same mark used in OG and across
 * the portfolio's identity surfaces. Monospace, letter-spaced slightly.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FBFAF6",
          color: "#111110",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontWeight: 500,
          letterSpacing: "0.03em",
        }}
      >
        h·j
      </div>
    ),
    { ...size }
  );
}
