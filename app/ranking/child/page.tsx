import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .map((c) => ({
      ...c,
      childRate: (c.population ?? 0) * 0.00012,
    }))
    .sort((a, b) => (b.childRate ?? 0) - (a.childRate ?? 0))
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1>👶 子どもが多い自治体（推定）</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            {i + 1}. {c.name}
          </span>
          <b>{Math.round(c.childRate ?? 0)}</b>
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