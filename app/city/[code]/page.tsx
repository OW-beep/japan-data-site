import cities from "@/data/cities.json";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find(
    (c) => c.code === params.code
  );

  return {
    title: city
      ? `${city.name}の人口・データ`
      : "自治体データ",
    description: city
      ? `${city.name}の人口は${city.population.toLocaleString()}人です。全国自治体データを比較できます。`
      : "自治体データページ",
  };
}

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
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>{city.name}</h1>

      <div style={box}>
        👥 人口：
        <strong>
          {city.population.toLocaleString()}
        </strong>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/ranking/population">
          ← 人口ランキングへ
        </Link>
      </div>
    </main>
  );
}

const box = {
  marginTop: 20,
  padding: 16,
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};