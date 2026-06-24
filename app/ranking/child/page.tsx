import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.childPopulation)
    .sort(
      (a, b) =>
        (b.childPopulation ?? 0) - (a.childPopulation ?? 0)
    )
    .slice(0, 50);

  return (
    <RankingLayout
      title="👶 子ども人口ランキング"
      description="0〜14歳人口（実測）"
    >
      <MetricBox
        title="子ども人口"
        unit="人"
        definition="0〜14歳人口（e-Stat年齢別統計）"
        example={{ name: "さいたま市", value: 180000 }}
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={c.childPopulation ?? 0}
          unit="人"
        />
      ))}
    </RankingLayout>
  );
}