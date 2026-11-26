import { ImageResponse } from "next/og";

// DIKOR app icon: the new brand mark — a heavy charcoal "D" standing on a thin
// gold plinth rule, on cream. No sparkle, no gradient.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 112,
          background: "#FAF5EC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "16px solid #C9A227",
        }}
      >
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 300, color: "#2A2320", lineHeight: 0.9 }}>
          D
        </div>
        <div style={{ width: 210, height: 18, borderRadius: 9, background: "#C9A227", marginTop: 18 }} />
      </div>
    ),
    { ...size }
  );
}
