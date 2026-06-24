import RankCard from "@/components/RankCard";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.population && c.name)
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      {/* ページタイトル（SEO用・軽め） */}
      <h2 style={title}>人口ランキング TOP50</h2>

      {/* 注記：データ定義 */}
      <p style={note}>
        ※人口は最新公開統計（e-Stat等）をもとにした推計値です
      </p>

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

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 8,
};

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  marginBottom: 12,
};