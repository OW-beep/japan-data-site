import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";
import type { City } from "../../../types/city";

export default function Page() {
  const ranking = [...(cities as City[])]
    .filter((c) => c.populationDensity != null)
    .sort(
      (a, b) =>
        (b.populationDensity ?? 0) -
        (a.populationDensity ?? 0)
    )
    .slice(0, 50);

  return (
    <div>
      <h1>🏙️ 人口密度ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口密度は1平方キロメートル当たりの人口を表します。"
        formula="人口密度 = 人口 ÷ 面積"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.populationDensity ?? 0,
        }}
      />

      <div style={{ marginTop: 12 }}>
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