import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1C1C1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1="2" x2="10" y2="18" stroke="#F7F7F5" strokeWidth="1.5" />
          <line x1="2" y1="10" x2="18" y2="10" stroke="#F7F7F5" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
