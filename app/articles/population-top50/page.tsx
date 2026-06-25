import cities from "@/data/cities.json";
import ArticleLayout from "@/components/ArticleLayout";

export default function Page() {
  const ranking = [...cities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  const average = Math.round(
    ranking.reduce((s, c) => s + c.population, 0) /
      ranking.length
  );

  return (
    <ArticleLayout
      title="人口ランキングTOP50分析"
      summary="人口上位自治体をデータから分析しました。"
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
      <h2>分析結果</h2>

      <p>
        人口上位自治体は首都圏・関西圏・中京圏に集中しています。
      </p>

      <p>
        大都市圏への人口集中傾向がデータから確認できます。
      </p>
    </ArticleLayout>
  );
}