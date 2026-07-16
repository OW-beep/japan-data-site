import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "人口が多い自治体TOP50",
  description:
    "全国自治体の人口ランキングトップ50を紹介。政令指定都市・県庁所在地を中心に人口分布の特徴を解説します。",
};

export default function Page() {
  const municipalities = getMunicipalities();

  const totalNationalPopulation = municipalities.reduce(
    (s, c) => s + c.population,
    0
  );

  const ranking = [...municipalities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 50);

  const average = Math.round(
    ranking.reduce((s, c) => s + c.population, 0) /
      ranking.length
  );

  const totalPopulation = ranking.reduce(
    (s, c) => s + c.population,
    0
  );

  const top10Population = ranking
    .slice(0, 10)
    .reduce((s, c) => s + c.population, 0);

  const million = ranking.filter(
    (c) => c.population >= 1000000
  );

  const gap = ranking[0].population - ranking[1].population;

  const sortedAll = [...municipalities].sort(
    (a, b) => a.population - b.population
  );

  const median =
    sortedAll[Math.floor(sortedAll.length / 2)];

  const top50Share =
    (totalPopulation / totalNationalPopulation) * 100;

  const top50CountShare =
    (50 / municipalities.length) * 100;

  return (
    <ArticleLayout
      title="人口ランキングTOP50分析"
      summary="全国自治体の人口データを分析しました。上位50自治体だけで全国人口の何割を占めているのか、実際の数字で見ていきます。"
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
            (全国自治体人口の約{top50Share.toFixed(1)}%)
          </li>

          <li>
            人口100万人以上の自治体：{million.length}
          </li>

          <li>
            最大人口：
            {ranking[0].population.toLocaleString()}人
          </li>

          <li>
            1位と2位の人口差：
            {gap.toLocaleString()}人
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>人口TOP10</h2>

        <RankingBarChart
          items={ranking.slice(0, 10).map((c) => ({
            name: c.name,
            value: c.population,
            displayValue: `${c.population.toLocaleString()}人`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>分析ポイント</h2>

        <p>
          TOP50自治体の人口は{totalPopulation.toLocaleString()}
          人で、全国人口({totalNationalPopulation.toLocaleString()}
          人)の約{top50Share.toFixed(1)}%を占めています。
          一方でTOP50自治体数は、全
          {municipalities.length.toLocaleString()}
          自治体の約{top50CountShare.toFixed(1)}
          %に過ぎません。自治体数では2%に満たない
          グループに、人口の3割近くが集中している
          ことになります。
        </p>

        <p>
          1位の{ranking[0].name}
          （{ranking[0].population.toLocaleString()}人）は、
          2位の{ranking[1].name}
          （{ranking[1].population.toLocaleString()}人）と
          比べて人口が{gap.toLocaleString()}人多く、
          TOP50の中でも単独で突出した規模です。上位10自治体は
          いずれも政令指定都市または東京都特別区であり、
          三大都市圏(首都圏・中京圏・関西圏)と、各地方の
          広域中心都市(札幌市・福岡市・仙台市・広島市)に
          集中しています。
        </p>

        <p>
          人口100万人を超える自治体は全国で{million.length}
          にとどまります。全国の政令指定都市は20市ある
          一方、実際に人口100万人を超えているのは
          {million.length}市のみで、半数以上は100万人に
          届いていません。「政令指定都市だから人口が
          多い」とは必ずしも言えず、同じ政令指定都市でも
          最大の{ranking[0].name}と最小規模の指定都市との
          間には数倍の人口差があります。
        </p>
      </div>

      <div style={box}>
        <h2>TOP50に入る自治体の顔ぶれ</h2>

        <p>
          TOP50をよく見ると、単純な「都会・田舎」という
          分類には収まらない多様さがあります。上位10位までは
          横浜市・大阪市・名古屋市・札幌市・福岡市・川崎市・
          神戸市・京都市・さいたま市・広島市といった、
          いずれも都道府県の主要都市や政令指定都市が並びます。
          一方、11位以降になると、東京都世田谷区のような
          特別区や、千葉市・北九州市・堺市など、規模はやや
          小さくなりつつも、それぞれの都市圏で中核を担う
          自治体が続きます。
        </p>

        <p>
          TOP50の中には県庁所在地ではない自治体も含まれて
          います。神奈川県の川崎市(県庁所在地は横浜市)が
          その代表例です。人口の多さは必ずしも
          「都道府県庁の所在地であること」とイコールでは
          なく、産業立地や交通インフラといった経済的な
          要因が大きく影響しています。
        </p>

        <p>
          TOP50平均人口は{average.toLocaleString()}人で、
          全国の中央値である{median.name}
          （{median.population.toLocaleString()}人）の
          約{Math.round(average / median.population)}倍に
          あたります。TOP50に入る自治体と、それ以外
          約{(
            municipalities.length - 50
          ).toLocaleString()}
          自治体との間には、これだけの人口規模の差が
          あります。
        </p>
      </div>

      <div style={box}>
        <h2>人口規模と行政サービスの関係</h2>

        <p>
          人口規模が大きい自治体ほど、税収の絶対額が
          大きくなり、公共施設やインフラへの投資余力も
          高まる傾向があります。一方で、人口が多いほど
          行政需要(道路や上下水道の維持、教育・福祉サービスの
          提供など)も比例して増えるため、人口規模がそのまま
          「財政的な余裕」を意味するわけではありません。
          財政力指数(自治体がどの程度自前の税収だけで
          行政サービスをまかなえるかを示す指標)で見ると、
          必ずしも人口上位の自治体が最上位に来るとは限らず、
          工業・商業が盛んな中規模都市が高い指数を示すことも
          あります。
        </p>

        <p>
          人口ランキングは自治体の「規模」を示す指標で
          あり、財政力指数や人口密度、高齢化率といった
          指標とは異なる側面を表しています。本サイトの
          各ランキングページでは、これらの指標を個別に
          確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>順位の変動をどう捉えるか</h2>

        <p>
          人口ランキングの順位は、大規模な宅地開発や
          工場誘致、近隣自治体との合併の有無によって、
          数年単位で変動することがあります。特にTOP10から
          TOP20あたりの自治体で入れ替わりが起きやすい
          傾向があります。本サイトはe-Statの公開データを
          定期的に取得し直しているため、ページ上部の
          「データ更新日」を確認いただくことで、
          いつ時点の順位かを把握できます。
        </p>
      </div>

      <div style={box}>
        <h2>TOP50以外の自治体にも目を向ける</h2>

        <p>
          本記事ではTOP50に注目しましたが、全国
          {municipalities.length.toLocaleString()}
          自治体のうち{(100 - top50CountShare).toFixed(1)}
          %はこのランキングには登場しません。人口規模では
          目立たなくても、出生率や人口密度、財政力指数と
          いった別の指標で見れば上位に来る自治体は数多く
          あります。本サイトでは人口以外のランキングも
          掲載していますので、あわせてご確認ください。
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
