import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";
import type { City } from "../../../types/city";

export default function Page() {
  const ranking = [...(cities as City[])]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      <h1>人口ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="各自治体の総人口です。"
        formula="住民基本台帳人口"
        example={{
          name: ranking[0]?.name ?? "",
          value: ranking[0]?.population ?? 0,
        }}
      />

      <div style={{ marginTop: 12 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.population}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}