import cities from "@/data/cities.json";
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
      description="人口ベースの推定指標（実測値ではありません）"
    >
      <MetricBox
        title="子どもスコアとは"
        unit="指数"
        definition="人口規模から推定した比較指標です（実測データではありません）"
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