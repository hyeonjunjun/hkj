import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — single-letter mark on warm paper. The s shares the
 * portfolio's mono register and ink primary. At 32×32 a wordmark
 * doesn't survive; one letter does.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FBFAF6",
          color: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontWeight: 500,
          letterSpacing: "0",
          textTransform: "lowercase",
        }}
      >
        s
      </div>
    ),
    { ...size }
  );
}
