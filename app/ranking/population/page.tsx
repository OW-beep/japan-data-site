import RankCard from "@/components/RankCard";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>
        人口ランキング TOP50
      </h1>

      <p style={{ fontSize: 12, color: "#666" }}>
        ※最新公開統計ベース（推計値）
      </p>

      <div style={{ marginTop: 16 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population}
            unit="人"
            highlight={i < 3}
          />
        ))}
      </div>
    </div>
  );
}