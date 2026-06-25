import cities from "@/data/cities.json";
import ArticleLayout from "@/components/ArticleLayout";

export default function Page() {
  const ranking = [...cities]
    .map((c) => ({
      ...c,
      rate:
        (c.childPopulation / c.population) * 100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) /
    ranking.length;

  return (
    <ArticleLayout
      title="子ども人口ランキングTOP50分析"
      summary="子ども比率が高い自治体を分析しました。"
      heroLabel="TOP50平均子ども比率"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/child"
      top3={[
        {
          rank: 1,
          name: ranking[0].name,
          value: `${ranking[0].rate.toFixed(1)}%`,
        },
        {
          rank: 2,
          name: ranking[1].name,
          value: `${ranking[1].rate.toFixed(1)}%`,
        },
        {
          rank: 3,
          name: ranking[2].name,
          value: `${ranking[2].rate.toFixed(1)}%`,
        },
      ]}
    >
      <h2>分析結果</h2>

      <p>
        子ども比率が高い自治体は、
        若い世代が多い地域と言えます。
      </p>

      <p>
        将来の人口維持という観点でも注目されています。
      </p>
    </ArticleLayout>
  );
}