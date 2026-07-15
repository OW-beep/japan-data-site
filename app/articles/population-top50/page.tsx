import cities from "@/data/cities.json";
import ArticleLayout from "@/components/ArticleLayout";

export const metadata = {
  title: "人口が多い自治体TOP50｜全国自治体データ",
  description:
    "全国自治体の人口ランキングトップ50を紹介。政令指定都市・県庁所在地を中心に人口分布の特徴を解説します。",
};

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  const average = Math.round(
    ranking.reduce((s, c) => s + c.population, 0) /
      ranking.length
  );

  const totalPopulation =
    ranking.reduce(
      (s, c) => s + c.population,
      0
    );

  const top10Population =
    ranking
      .slice(0, 10)
      .reduce(
        (s, c) => s + c.population,
        0
      );

  return (
    <ArticleLayout
      title="人口ランキングTOP50分析"
      summary="全国自治体の人口データを分析しました。"
      heroLabel="TOP50平均人口"
      heroValue={`${average.toLocaleString()}人`}
      rankingLink="/ranking/population"
      top3={[
        {
          rank: 1,
          name: ranking[0].name,
          value: `${ranking[0].population.toLocaleString()}人`,
        },
        {
          rank: 2,
          name: ranking[1].name,
          value: `${ranking[1].population.toLocaleString()}人`,
        },
        {
          rank: 3,
          name: ranking[2].name,
          value: `${ranking[2].population.toLocaleString()}人`,
        },
      ]}
    >
      <div style={box}>
        <h2>主要データ</h2>

        <ul>
          <li>
            TOP10人口合計：
            {top10Population.toLocaleString()}人
          </li>

          <li>
            TOP50人口合計：
            {totalPopulation.toLocaleString()}人
          </li>

          <li>
            最大人口：
            {ranking[0].population.toLocaleString()}人
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>人口TOP10</h2>

        <ol>
          {ranking
            .slice(0, 10)
            .map((c) => (
              <li key={c.code}>
                {c.name}
                （
                {c.population.toLocaleString()}
                人）
              </li>
            ))}
        </ol>
      </div>

      <div style={box}>
        <h2>分析ポイント</h2>

        <p>
          上位自治体は大都市圏に集中しています。
        </p>

        <p>
          首都圏・関西圏・中京圏が
          全国人口を支えていることが
          分かります。
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};