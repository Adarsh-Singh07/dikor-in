import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#F3EAD9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "6px solid #C9A227",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 56, color: "#96555F" }}>
          Dikor
        </div>
      </div>
    ),
    { ...size }
  );
}
