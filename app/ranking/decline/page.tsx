import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .sort((a, b) => (a.population ?? 0) - (b.population ?? 0)) // 小さい順＝疑似減少
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1 style={title}>📉 人口が少ない自治体ランキング TOP50</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            #{i + 1} {c.name}
          </span>
          <b>{c.population?.toLocaleString()}人</b>
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
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};