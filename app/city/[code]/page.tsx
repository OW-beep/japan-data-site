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

  const prefCode = city.code.slice(0, 2);

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 26 }}>
        {city.name}
      </h1>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <p>
          👥 人口：
          <strong>
            {city.population?.toLocaleString()}
          </strong>
        </p>
      </div>

      <h2 style={{ marginTop: 30 }}>
        🔗 関連リンク
      </h2>

      <div style={{ marginTop: 10 }}>
        <Link href={`/pref/${prefCode}`}>
          👉 同じ都道府県を見る
        </Link>
        <br />
        <Link href="/ranking/population">
          👉 人口ランキング
        </Link>
      </div>
    </main>
  );
}