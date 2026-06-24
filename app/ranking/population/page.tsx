import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const ranking = [...cities]
    .filter(
      (c) =>
        c.code !== "13100" && // 特別区部除外
        c.population > 0
    )
    .sort(
      (a, b) =>
        (b.population ?? 0) -
        (a.population ?? 0)
    )
    .slice(0, 50); // ←ここ重要

  return (
    <main style={page}>
      <h1 style={h1}>📊 人口ランキング TOP50</h1>

      <p style={sub}>
        全国自治体の人口ランキング（e-Statデータ）
      </p>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <Link
            key={c.code}
            href={`/city/${c.code}`}
            style={card}
          >
            <span>
              {i + 1}. {c.name}
            </span>
            <span style={{ fontWeight: 700 }}>
              {c.population?.toLocaleString()}人
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

const page = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
};

const h1 = {
  fontSize: 26,
  fontWeight: 800,
};

const sub = {
  color: "#666",
  marginTop: 6,
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  padding: 14,
  marginTop: 10,
  background: "white",
  borderRadius: 12,
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};