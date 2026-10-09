import { ImageResponse } from "next/og";

// Cream badge with rose-gold "Dikor" — mirrors the Instagram logo.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 256,
          background: "#F3EAD9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "14px solid #C9A227",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 150, color: "#96555F" }}>
          Dikor
        </div>
      </div>
    ),
    { ...size }
  );
}
