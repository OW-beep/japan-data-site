import cities from "@/data/cities.json";

export default function Page() {
  const list = [...cities]
    .filter((c) => c.population > 0)
    .sort(
      (a, b) =>
        (a.population ?? 0) -
        (b.population ?? 0)
    )
    .slice(0, 50);

  return (
    <main style={{ padding: 20 }}>
      <h1>📉 人口が少ない自治体ランキング</h1>

      {list.map((c, i) => (
        <div
          key={c.code}
          style={{
            padding: 12,
            background: "white",
            marginTop: 8,
            borderRadius: 10,
          }}
        >
          {i + 1}. {c.name}（
          {c.population?.toLocaleString()}人）
        </div>
      ))}
    </main>
  );
}