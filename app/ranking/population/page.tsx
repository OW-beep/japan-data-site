import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import RankingAnalysis from "../../../components/ranking/RankingAnalysis";
import { getCities } from "../../../lib/getCities";

export default function Page() {
  const ranking = getCities()
    .sort((a, b) => b.population - a.population)
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
        👥 人口ランキング
      </h1>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="各自治体の総人口（住民基本台帳ベース）を集計した値です。"
        formula="人口 = 住民登録人口"
        example={{
          name: ranking[0]?.name ?? "",
          value: ranking[0]?.population ?? 0,
        }}
      />

      {/* 追加 */}
      <RankingAnalysis
        type="population"
        ranking={ranking.map((city) => ({
          name: city.name,
          value: city.population,
        }))}
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.population}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}