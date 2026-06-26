import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .filter(
      (c: any) =>
        c.populationDensity !== null &&
        c.populationDensity !== undefined
    )
    .sort(
      (a: any, b: any) =>
        b.populationDensity - a.populationDensity
    )
    .slice(0, 50);

  return (
    <div>
      <h1>🏙️ 人口密度ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口密度は、1平方キロメートルあたりに何人住んでいるかを表す指標です。都市部ほど高く、郊外や山間部ほど低くなる傾向があります。"
        formula="人口密度 = 総人口 ÷ 面積(km²)"
        example={{
          name: ranking[0]?.name ?? "",
          value: ranking[0]?.populationDensity ?? 0,
        }}
      />

      <div style={{ marginTop: 12 }}>
        {ranking.map((c: any, i: number) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.populationDensity}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}