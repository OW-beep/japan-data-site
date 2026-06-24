import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => {
      // 仮指標：人口が少ない順
      return (a.population ?? 0) - (b.population ?? 0);
    })
    .slice(0, 50);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>📉 人口少ないランキング</h1>

      <ol>
        {ranking.map((c, i) => (
          <li key={c.code}>
            {i + 1}. {c.name}（{c.population?.toLocaleString()}）
          </li>
        ))}
      </ol>

      <Link href="/ranking/population">
        ← 人口ランキング
      </Link>
    </main>
  );
}