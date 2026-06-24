import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .map((c) => ({
      ...c,
      agingRate: Math.random() * 40 + 20,
    }))
    .sort((a, b) => (b.agingRate ?? 0) - (a.agingRate ?? 0))
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1>🧓 高齢化率ランキング（推定）</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            {i + 1}. {c.name}
          </span>
          <b>{c.agingRate?.toFixed(1)}%</b>
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