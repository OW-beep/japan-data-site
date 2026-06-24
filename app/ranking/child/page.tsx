import cities from "@/data/cities.json";
import DataNote from "@/components/DataNote";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.name !== "特別区部")
    .map((c) => ({
      ...c,
      childScore: (c.population ?? 0) * 0.00012,
    }))
    .sort((a, b) => (b.childScore ?? 0) - (a.childScore ?? 0))
    .slice(0, 50);

  return (
    <main style={wrap}>
      <h1>👶 子どもが多い自治体（推定）</h1>

      {ranking.map((c, i) => (
        <div key={c.code} style={card}>
          <span>
            {i + 1}. {c.name}
          </span>import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .map((c) => ({
      ...c,
      score: (c.population ?? 0) * 0.00015,
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 50);

  return (
    <RankingLayout
      title="👶 子どもが多い自治体ランキング"
      description="人口ベースの推定指標"
    >
      <MetricBox
        title="子どもスコア"
        unit="指数"
        definition="人口から推定した比較用指標（実測値ではありません）"
        example={{ name: "さいたま市", value: 1200 }}
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={Math.round(c.score)}
          unit=""
        />
      ))}
    </RankingLayout>
  );
}
          <b>{Math.round(c.childScore ?? 0)}</b>
        </div>
      ))}

      <DataNote />
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