import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.population)
    .map((c) => ({
      ...c,
      diff: (c.population ?? 0) - (c.childPopulation ?? 0),
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 50);

  return (
    <RankingLayout
      title="📉 人口構造リスクランキング"
      description="人口構造の偏り（実データ差分）"
    >
      <MetricBox
        title="人口差分"
        unit="人"
        definition="総人口 − 子ども人口（構造分析指標）"
        example={{ name: "地方都市例", value: 50000 }}
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={c.diff}
          unit="人"
        />
      ))}
    </RankingLayout>
  );
}