import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import DensitySummary from "../../../components/ranking/DensitySummary";
import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
    .filter(
      (c) =>
        c.populationDensity != null &&
        !c.name.includes("特別区部")
    )
    .sort(
      (a, b) =>
        (b.populationDensity ?? 0) -
        (a.populationDensity ?? 0)
    )
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
        🏙️ 人口密度ランキング
      </h1>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口密度は1平方キロメートルあたりの人口です。"
        formula="人口密度 = 人口 ÷ 面積"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.populationDensity ?? 0,
        }}
      />

      <DensitySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.populationDensity ?? 0,
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
            value={c.populationDensity ?? 0}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}