import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .sort(
      (a, b) =>
        (b.population ?? 0) - (a.population ?? 0)
    )
    .slice(0, 50);

  return (
    <main style={{ padding: 20 }}>
      <h1>人口ランキング TOP50</h1>

      <ol>
        {ranking.map((c) => (
          <li key={c.code}>
            {c.name}：{c.population?.toLocaleString()}
          </li>
        ))}
      </ol>
    </main>
  );
}