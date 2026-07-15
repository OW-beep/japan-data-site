import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";

export const metadata = {
  title: "人口が多い自治体TOP50｜全国自治体データ",
  description:
    "全国自治体の人口ランキングトップ50を紹介。政令指定都市・県庁所在地を中心に人口分布の特徴を解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
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
            (全国自治体人口の約
            {((totalPopulation / 126146099) * 100).toFixed(
              1
            )}
            %)
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

        <ol>
          {ranking.slice(0, 10).map((c) => (
            <li key={c.code}>
              {c.name}（{c.population.toLocaleString()}人）
            </li>
          ))}
        </ol>
      </div>

      <div style={box}>
        <h2>分析ポイント</h2>

        <p>
          全国{50 - 0 + 0}位まで見ても、上位自治体は
          ほぼすべて三大都市圏(首都圏・中京圏・関西圏)か、
          各地方の中心都市(札幌市・福岡市・仙台市・広島市など)に
          集中しています。特に1位の
          {ranking[0].name}は、2位の{ranking[1].name}
          と比べて人口が約{Math.round(gap / 10000)}万人多く、
          単独で突出した規模を持っています。
        </p>

        <p>
          TOP50自治体の人口を合計すると
          {totalPopulation.toLocaleString()}人となり、
          これは全国{" "}
          {getMunicipalities().length.toLocaleString()}
          自治体の総人口のおよそ
          {((totalPopulation / 126146099) * 100).toFixed(0)}
          %にあたります。つまり、全自治体のわずか
          {(
            (50 / getMunicipalities().length) *
            100
          ).toFixed(1)}
          %にすぎない上位50自治体に、人口の3割近くが
          集中している計算になり、日本の人口分布が
          いかに偏っているかが分かります。
        </p>

        <p>
          また、人口100万人を超える自治体は全国でわずか
          {million.length}にとどまります。
          政令指定都市は全国に20市ありますが、
          そのうち人口100万人を超えているのは半数程度で、
          「政令指定都市だから人口が多い」とは限らない点にも
          注意が必要です。たとえば同じ政令指定都市でも、
          人口規模には数倍の差があります。
        </p>

        <p>
          こうした偏りは、明治期以降の産業集積、
          戦後の高度経済成長期における工業化、
          そして近年の金融・IT・サービス業の都市集中という、
          複数の時代の要因が積み重なって形成されたものです。
          人口ランキングの上位自治体を見ることは、
          日本の産業構造や都市形成の歴史を映し出す
          鏡でもあると言えます。
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
          興味深いのは、TOP50の中には県庁所在地ではない
          自治体も少なからず含まれている点です。神奈川県の
          川崎市(県庁所在地は横浜市)や、埼玉県のさいたま市は
          県庁所在地ですが、兵庫県の姫路市や東京都の八王子市
          のように、県庁所在地でなくても独自の産業基盤や
          交通結節点としての機能を持つことで、人口規模を
          維持・拡大している自治体も存在します。人口の多さは
          必ずしも「行政上の中心地」であることとイコールでは
          なく、産業立地や交通インフラといった経済的な要因が
          大きく影響していることが読み取れます。
        </p>

        <p>
          TOP50平均人口は{average.toLocaleString()}人であり、
          これは全国の市区町村の中央値(秋田県にかほ市、
          約23,400人)のおよそ
          {Math.round(average / 23435)}
          倍にあたります。上位50自治体と、それ以外
          約1,690自治体との間には、これほど大きな
          人口規模の差が存在しているのです。
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
          実際、財政力指数(自治体がどの程度自前の税収だけで
          行政サービスをまかなえるかを示す指標)で見ると、
          必ずしも人口上位の自治体が最上位に来るとは限らず、
          工業・商業が盛んな中規模都市が高い指数を示すことも
          珍しくありません。
        </p>

        <p>
          このように、人口ランキングは自治体の「規模」を
          示す指標であり、「豊かさ」や「住みやすさ」を
          直接示すものではありません。人口ランキングを
          出発点として、財政力指数や人口密度、高齢化率など
          他の指標もあわせて確認することで、より正確に
          自治体の実態を把握することができます。本サイトの
          各ランキングページでは、こうした複数の視点から
          自治体を比較できるようにしています。
        </p>
      </div>

      <div style={box}>
        <h2>順位の変動をどう捉えるか</h2>

        <p>
          人口ランキングの順位は、毎年少しずつ入れ替わります。
          特にTOP10からTOP20あたりの自治体は、大規模な
          宅地開発や工場誘致、あるいは近隣自治体との合併の
          有無によって、数年単位で順位が変動することがあります。
          そのため、単年のランキングだけを見るのではなく、
          複数年の推移を追うことで、その自治体が
          「成長している」のか「縮小している」のかという
          トレンドをより正確に把握できます。本サイトでは
          定期的にデータを更新しているため、時期を変えて
          ランキングを見比べていただくのもおすすめです。
        </p>
      </div>

      <div style={box}>
        <h2>TOP50以外の自治体にも目を向ける</h2>

        <p>
          本記事ではTOP50に注目しましたが、全国
          1,741自治体の97%以上は、このランキングには
          登場しません。人口規模では目立たなくても、
          出生率や人口密度、財政力指数といった別の
          指標で見れば上位に来る自治体は数多くあります。
          「人口が多い」という一面だけで自治体を
          評価するのではなく、目的に応じて複数の
          ランキングを参照することで、より多角的に
          日本の自治体の姿を理解できるはずです。
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
