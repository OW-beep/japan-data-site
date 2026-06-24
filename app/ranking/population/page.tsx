import RankCard from "@/components/RankCard";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      {/* タイトル */}
      <h1 style={title}>人口ランキング</h1>

      {/* 説明（重要） */}
      <p style={note}>
        ※総務省・e-Stat公開データをもとにした人口規模ランキング
      </p>

      {/* ランキング即表示（ここが重要） */}
      <div style={{ marginTop: 12 }}>
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

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 4,
};

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  marginBottom: 12,
};