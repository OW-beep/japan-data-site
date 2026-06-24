import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";
import MetricBox from "@/components/MetricBox";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.code !== "13100")
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 50);

  return (
    <RankingLayout
      title="🏙 人口ランキング TOP50"
      description="e-Stat実測データ"
    >
      <MetricBox
        title="人口"
        unit="人"
        definition="住民基本台帳・国勢調査に基づく総人口"
        example={{ name: "横浜市", value: 3777491 }}
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={c.population}
          unit="人"
        />
      ))}
    </RankingLayout>
  );
}