import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .map((c) => ({
      ...c,
      childScore: (c.population ?? 0) * 0.00012, // 仮指標（後で差し替え可能）
    }))
    .sort((a, b) => (b.childScore ?? 0) - (a.childScore ?? 0))
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1 style={title}>👶 子どもが多い自治体ランキング（推定）</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            #{i + 1} {c.name}
          </span>
          <b>{Math.round(c.childScore ?? 0)}</b>
        </div>
      ))}
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 20,
};

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 14,
  marginBottom: 10,
  background: "white",
  borderRadius: 12,
};