import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 50);

  return (
    <main>
      <h1 style={title}>🏆 人口ランキング TOP50</h1>

      <div style={wrap}>
        {ranking.map((c, i) => (
          <div key={c.code} style={card}>
            <div style={left}>
              <div style={rank}>#{i + 1}</div>
              <div style={name}>{c.name}</div>
            </div>

            <div style={pop}>
              {c.population?.toLocaleString()}
              <span style={unit}>人</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 18,
};

const wrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderRadius: 14,
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  transition: "0.2s",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const rank: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 16,
  color: "#4f46e5",
  width: 40,
};

const name: React.CSSProperties = {
  fontWeight: 700,
};

const pop: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 18,
  color: "#111",
};

const unit: React.CSSProperties = {
  fontSize: 12,
  marginLeft: 4,
  color: "#666",
};