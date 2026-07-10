import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import ChildSummary from "../../../components/ranking/ChildSummary";
import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
    .filter(
      (c) =>
        c.childPopulation != null &&
        c.population > 0 &&
        !c.name.includes("特別区部")
    )
    .map((c) => ({
      ...c,
      rate:
        (c.childPopulation / c.population) *
        100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        👶 子ども人口割合ランキング
      </h1>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="総人口に占める15歳未満人口の割合"
        formula="子ども人口 ÷ 総人口 ×100"
        example={{
          name:
            ranking[0]?.name ?? "",
          value: Number(
            ranking[0]?.rate.toFixed(2) ??
              0
          ),
        }}
      />

      <ChildSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.rate,
        }))}
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
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