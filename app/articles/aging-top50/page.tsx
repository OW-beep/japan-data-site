import cities from "@/data/cities.json";
import ArticleLayout from "@/components/ArticleLayout";

export default function Page() {
  const ranking = [...cities]
    .map((c) => ({
      ...c,
      rate:
        (c.elderlyPopulation / c.population) *
        100,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) /
    ranking.length;

  return (
    <ArticleLayout
      title="高齢化率ランキングTOP50分析"
      summary="高齢化率上位自治体を分析しました。"
      heroLabel="TOP50平均高齢化率"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/aging"
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
        上位自治体では高齢者人口の割合が非常に高くなっています。
      </p>

      <p>
        地域ごとの人口構成の違いが見えてきます。
      </p>
    </ArticleLayout>
  );
}