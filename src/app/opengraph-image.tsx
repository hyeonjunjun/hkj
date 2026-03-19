import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "HKJ — Design Engineering";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F2ED",
          color: "#1A1917",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontFamily: "serif",
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            hkj
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#7A756D",
            }}
          >
            Design Engineering — Ryan Jun
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
