import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";
import type { City } from "../../../types/city";

export default function Page() {
  const ranking = [...(cities as City[])]
    .filter((c) => c.area != null)
    .sort((a, b) => (b.area ?? 0) - (a.area ?? 0))
    .slice(0, 50);

  return (
    <div>
      <h1>🗺️ 面積ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="km²"
        definition="国土地理院が公表している自治体面積です。"
        formula="自治体面積（平方キロメートル）"
        example={{
          name: ranking[0]?.name ?? "",
          value: ranking[0]?.area ?? 0,
        }}
      />

      <div style={{ marginTop: 12 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.area ?? 0}
            unit="km²"
          />
        ))}
      </div>
    </div>
  );
}