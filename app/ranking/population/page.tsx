import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities].sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0)
  );

  return (
    <main className="p-8">
      <h1>人口ランキング</h1>

      <ul>
        {ranking.map((c) => (
          <li key={c.code}>
            {c.name}：{c.population?.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}