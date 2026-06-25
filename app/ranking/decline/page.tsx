import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .map((c) => {
      // 仮の「人口減少率」＝子ども＋高齢者の比率で代替（データ仮設）
      const changeRate =
        ((c.childPopulation + c.elderlyPopulation) / c.population) * 100;

      return {
        ...c,
        rate: changeRate,
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  return (
    <div>
      <h1>人口構造変化ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="人口構造の変化度（若年＋高齢人口比率）"
        formula="構造変化率 = (子ども人口 + 高齢者人口) ÷ 総人口 × 100"
        example={{
          name: "例：横浜市",
          value: ranking[0]?.rate ?? 0,
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