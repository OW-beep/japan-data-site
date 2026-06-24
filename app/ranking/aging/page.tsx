import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.elderlyPopulation && c.population)
    .map((c) => ({
      ...c,
      rate: (c.elderlyPopulation! / c.population!) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  return (
    <RankingLayout
      title="🧓 高齢化率ランキング"
      description="65歳以上人口比率（実測）"
    >
      <MetricBox
        title="高齢化率"
        unit="%"
        definition="65歳以上人口 ÷ 総人口 × 100"
        example={{ name: "秋田県 ○○市", value: 41.2 }}
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={Number(c.rate.toFixed(1))}
          unit="%"
        />
      ))}
    </RankingLayout>
  );
}