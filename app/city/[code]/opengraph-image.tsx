import { ImageResponse } from "next/og";
import cities from "@/data/cities.json";

export const runtime = "edge";

export default function Image({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find(
    (c) => c.code === params.code
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#111827",
          color: "white",
          fontSize: 64,
          fontWeight: 800,
          textAlign: "center",
          padding: 40,
        }}
      >
        <div>{city?.name}</div>

        <div style={{ fontSize: 36, marginTop: 20 }}>
          人口 {city?.population?.toLocaleString()}人
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}