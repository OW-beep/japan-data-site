import cities from "@/data/cities.json";
import ArticleLayout from "@/components/ArticleLayout";

export default function Page() {
const ranking = [...cities]
.filter((c) => c.population >= 1000000)
.sort((a, b) => b.population - a.population);

return (
<ArticleLayout
title="人口100万人超の自治体一覧"
summary="全国で人口100万人を超える自治体をまとめました。"
heroLabel="100万人超自治体数"
heroValue={`${ranking.length}自治体`}
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
> <div> <h2>人口100万人超自治体一覧</h2>


    <ol>
      {ranking.map((c) => (
        <li key={c.code}>
          {c.name}
          （
          {c.population.toLocaleString()}
          人）
        </li>
      ))}
    </ol>
  </div>

  <div>
    <h2>特徴</h2>

    <p>
      人口100万人超の自治体は、
      日本の人口が集中する大都市です。
    </p>

    <p>
      首都圏・関西圏・中京圏への
      集中傾向が見られます。
    </p>
  </div>
</ArticleLayout>


);
}
