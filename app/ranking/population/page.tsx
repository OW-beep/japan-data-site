import cities from "../../../data/cities.json";
import RankingLayout from "../../../components/RankingLayout";
import RankCard from "../../../components/RankCard";
import DataNote from "../../../components/DataNote";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.code !== "13100")
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 50);

  return (
    <RankingLayout
      title="🏙 人口ランキング TOP50"
      description="最新e-Statデータによる自治体ランキング"
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