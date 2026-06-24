import RankCard from "../../components/RankCard";
import MetricBox from "../../components/MetricBox";
import cities from "../../../data/cities.json";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  return (
    <div>
      <h1>人口ランキング</h1>

      {/* 👇ここが重要（定義） */}
      <MetricNote
        title="指標定義"
        description="各自治体の総人口（住民基本台帳ベース）を集計した値"
        formula="人口 = 住民登録人口（外国人含む場合あり）"
      />

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
  );
}