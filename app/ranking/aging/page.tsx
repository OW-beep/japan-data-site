import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.elderlyPopulation && c.population)
    .map((c) => ({
      ...c,
      rate: (c.elderlyPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  return (
    <div>
      <h1>高齢化率ランキング</h1>

      <MetricBox
        title="指標定義"
        definition="総人口に対する65歳以上人口の割合"
        unit="%"
        formula="高齢化率(%) = 高齢者人口 ÷ 総人口 × 100"
        example={{
          name: "例：〇〇市",
          value: Number(ranking[0]?.rate?.toFixed(2) ?? 0),
        }}
      />

      <div style={{ marginTop: 12 }}>
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
    </div>
  );
}