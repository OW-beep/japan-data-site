import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .map((c) => ({
      ...c,
      rate: 20 + Math.random() * 30,
    }))
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
    .slice(0, 50);

  return (
    <RankingLayout
      title="🧓 高齢化率ランキング"
      description="高齢化の進行度ランキング"
    >
      <MetricBox
        title="高齢化率"
        unit="%"
        definition="65歳以上人口の割合"
        example={{ name: "秋田県 大潟村", value: 41.2 }}
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