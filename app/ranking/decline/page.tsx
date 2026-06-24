import cities from "@/data/cities.json";
import RankingLayout from "@/components/RankingLayout";
import RankCard from "@/components/RankCard";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.code !== "13100")
    .sort((a, b) => (a.population ?? 0) - (b.population ?? 0))
    .slice(0, 50);

  return (
    <RankingLayout
      title="📉 人口減少ランキング TOP50"
      description="人口が少ない自治体を可視化したランキング。"
    >
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