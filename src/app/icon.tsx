import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — pixelated cloud monogram on warm paper.
 *
 * The cloud is the studio's quiet mark — same atmosphere as the
 * homepage hero (cloudsatsea.mp4), rendered at 8-bit register: a
 * fixed 8×5 silhouette of pure ink pixels on the paper ground.
 * No text, no kerning to worry about at 32×32.
 */
const CLOUD: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

export default function Icon() {
  const PX = 3; // 8 × 3 = 24 wide, 5 × 3 = 15 tall — fits 32×32 with margin

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FBFAF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
      </div>
    ),
    { ...size },
  );
}
