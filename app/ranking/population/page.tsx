import RankCard from "@/components/RankCard";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      <h1>人口ランキング TOP50</h1>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}