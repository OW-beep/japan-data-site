import cities from "@/data/cities.json";
import RankingCard from "@/components/RankCard";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      <h1>📊 人口ランキング TOP50</h1>

      <p style={{ fontSize: 12, color: "#666" }}>
        ※e-Stat統計データ（最新時点の集計）
      </p>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population}
          />
        ))}
      </div>
    </div>
  );
}