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
      description="自治体人口の最新ランキング"
    >
      <MetricBox
        title="人口とは"
        unit="人"
        definition="各自治体に居住する総人口（e-Stat統計）"
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