import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find(
    (c) => c.code === params.code
  );

  if (!city) {
    return <main>データなし</main>;
  }

  return (
    <main style={page}>
      <h1 style={h1}>{city.name}</h1>

      <div style={box}>
        👥 人口：{" "}
        <b>
          {city.population?.toLocaleString()}人
        </b>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/ranking/population">
          ← 人口ランキングへ
        </Link>
      </div>
    </main>
  );
}

const page = {
  maxWidth: 700,
  margin: "0 auto",
  padding: 24,
};

const h1 = {
  fontSize: 28,
  fontWeight: 800,
};

const box = {
  marginTop: 20,
  padding: 16,
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};