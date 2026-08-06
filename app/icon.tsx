import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          background: "#1d4ed8",
          borderRadius: 7,
          padding: "6px 5px",
        }}
      >
        <div
          style={{
            width: 5,
            height: 10,
            borderRadius: 1,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            width: 5,
            height: 16,
            borderRadius: 1,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            width: 5,
            height: 20,
            borderRadius: 1,
            background: "#93c5fd",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
