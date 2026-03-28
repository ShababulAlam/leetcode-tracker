import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          fontWeight: 800,
          color: "#fff",
          fontFamily: "sans-serif",
          letterSpacing: "-2px",
        }}
      >
        LC
      </div>
    ),
    { ...size }
  );
}
