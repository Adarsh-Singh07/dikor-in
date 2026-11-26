import { ImageResponse } from "next/og";

// DIKOR Apple touch icon: the new brand mark, scaled down.
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
          background: "#FAF5EC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "6px solid #C9A227",
        }}
      >
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 104, color: "#2A2320", lineHeight: 0.9 }}>
          D
        </div>
        <div style={{ width: 74, height: 7, borderRadius: 4, background: "#C9A227", marginTop: 7 }} />
      </div>
    ),
    { ...size }
  );
}
