import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.population > 0)
    .sort((a, b) => {
      // ★「人口に対して名前が小さい自治体っぽさ」
      return (
        a.name.length - b.name.length ||
        b.population - a.population
      );
    })
    .slice(0, 50);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>🔥 意外ランキングTOP50</h1>

      <p style={{ color: "#666" }}>
        名前が短い＝コンパクトな都市ランキング（独自指標）
      </p>

      <ol style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <li
            key={c.code}
            style={{
              marginBottom: 10,
              padding: 10,
              background: "white",
              borderRadius: 10,
            }}
          >
            {i + 1}. {c.name}（{c.population?.toLocaleString()}人）
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 30 }}>
        <Link href="/ranking/population">
          ← 人口ランキングへ
        </Link>
      </div>
    </main>
  );
}