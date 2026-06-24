import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1>🏙 人口ランキング TOP50</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            {i + 1}. {c.name}
          </span>
          <b>{c.population?.toLocaleString()}</b>
        </div>
      ))}
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
};

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 14,
  marginBottom: 8,
  background: "white",
  borderRadius: 12,
};