import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          background: "#1d4ed8",
          padding: "34px 28px",
        }}
      >
        <div
          style={{
            width: 28,
            height: 56,
            borderRadius: 6,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            width: 28,
            height: 92,
            borderRadius: 6,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            width: 28,
            height: 116,
            borderRadius: 6,
            background: "#93c5fd",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
