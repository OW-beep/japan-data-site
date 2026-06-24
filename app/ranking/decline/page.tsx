import RankCard from "@/components/RankCard";
import MetricNote from "@/components/MetricNote";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.populationChange !== undefined)
    .map((c) => ({
      ...c,
      rate: c.populationChange,
    }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 50);

  return (
    <div>
      <h1>人口減少ランキング</h1>

      <MetricNote
        title="指標定義"
        description="一定期間における人口増減率（自然増減＋社会増減）"
        formula="人口増減率(%) = (今年人口 - 前年人口) ÷ 前年人口 × 100"
      />

      {ranking.map((c, i) => (
        <RankCard
          key={c.code}
          rank={i + 1}
          name={c.name}
          value={c.rate.toFixed(2)}
          unit="%"
        />
      ))}
    </div>
  );
}