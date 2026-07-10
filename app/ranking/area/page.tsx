import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";

import AreaSummary from "../../../components/ranking/AreaSummary";

import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
    .filter(
      (c) =>
        c.area &&
        !c.name.includes("特別区部")
    )
    .sort(
      (a, b) =>
        (b.area ?? 0) - (a.area ?? 0)
    )
    .slice(0, 50);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        🗺️ 面積ランキング
      </h1>

      <MetricBox
        title="指標定義"
        unit="km²"
        definition="国土地理院が公表する自治体面積です。"
        formula="自治体面積（平方キロメートル）"
        example={{
          name: ranking[0].name,
          value: ranking[0].area ?? 0,
        }}
      />

      <AreaSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.area ?? 0,
        }))}
      />

      <div style={{ marginTop: 20 }}>
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
    </main>
  );
}