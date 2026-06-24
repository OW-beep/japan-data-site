import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.childPopulation)
    .map((c) => ({
      ...c,
      rate: (c.childPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  return (
    <div>
      <h1>子ども人口ランキング</h1>

      <MetricNote
        title="指標定義"
        description="総人口に対する15歳未満人口の割合"
        formula="子ども比率(%) = 子ども人口 ÷ 総人口 × 100"
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