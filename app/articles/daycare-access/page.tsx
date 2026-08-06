import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  title: "保育園あたり子ども人口ランキング分析｜東京23区と大阪の差",
  description:
    "保育園1施設あたりの子ども人口をランキング分析。小規模町村が上位を占める一方、人口20万人以上の都市だけで比較すると東京23区と大阪府内の自治体で驚くほど差が開く理由を、元自治体職員の視点も交えて解説します。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.daycareCount != null &&
      c.daycareCount > 0 &&
      c.childPopulation >= 500
  );

  const ranking = base
    .map((c) => ({
      ...c,
      childPerDaycare: c.childPopulation / (c.daycareCount ?? 1),
    }))
    .sort((a, b) => a.childPerDaycare - b.childPerDaycare);

  const top15 = ranking.slice(0, 15);

  const bigCities = ranking
    .filter((c) => c.population >= 200000)
    .sort((a, b) => a.childPerDaycare - b.childPerDaycare);

  const bigTop10 = bigCities.slice(0, 10);
  const bigBottom5 = [...bigCities]
    .sort((a, b) => b.childPerDaycare - a.childPerDaycare)
    .slice(0, 5);

  const tokyoWardsInTop10 = bigTop10.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const average =
    ranking.reduce((s, c) => s + c.childPerDaycare, 0) /
    ranking.length;

  return (
    <ArticleLayout
      title="保育園あたり子ども人口ランキング分析:東京23区と大阪府内の自治体で、なぜここまで差が開くのか"
      summary={`全国${ranking.length.toLocaleString()}自治体の「保育園1施設あたりの子ども人口」を比較すると、全国平均${average.toFixed(
        0
      )}人に対し、人口20万人以上の都市に絞ると東京23区が上位を独占する一方、大阪府内の自治体が軒並み下位に沈むという、はっきりした地域差が見えてきました。`}
      heroLabel="保育園あたり子ども人口 全国1位"
      heroValue={`${top15[0].name} ${top15[0].childPerDaycare.toFixed(0)}人`}
      rankingLink="/ranking/daycare"
      tags={["child"]}
      publishedAt="2026-08-06"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].childPerDaycare.toFixed(0)}人` },
        { rank: 2, name: top15[1].name, value: `${top15[1].childPerDaycare.toFixed(0)}人` },
        { rank: 3, name: top15[2].name, value: `${top15[2].childPerDaycare.toFixed(0)}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          保育園(保育所)1施設あたりの子ども人口は、数字が
          小さいほど、その地域の子どもの数に対して保育施設に
          余裕があることを意味します。全国
          {ranking.length.toLocaleString()}
          自治体を比較すると、全国平均は
          {average.toFixed(0)}
          人でした。ただし、この数字は単純な「保育の充実度
          ランキング」として読むと、実態を見誤ります。
        </p>
      </div>

      <div style={box}>
        <h2>全自治体ランキングTOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.childPerDaycare,
            displayValue: `${c.childPerDaycare.toFixed(0)}人`,
          }))}
          barColor="#0891b2"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を対象にすると、上位には
          {top15
            .slice(0, 5)
            .map((c) => c.name)
            .join("・")}
          など、人口数千人規模の小さな町村が並びます。子ども
          の絶対数が少ないぶん、保育園1施設あたりの人数も
          自然と少なくなるため、これだけを見て「保育が
          充実している」と判断するのは早計です。
        </p>
      </div>

      <div style={box}>
        <h2>人口20万人以上の都市に絞ると、東京23区が上位独占</h2>

        <p>
          そこで、人口規模による差を取り除くために、人口20万人
          以上の都市{bigCities.length}
          自治体だけを抜き出して、あらためてランキングを
          作り直してみました。すると、上位10自治体のうち
          {tokyoWardsInTop10}
          自治体を東京都の特別区(
          {bigTop10
            .filter((c) => c.name.startsWith("東京都"))
            .map((c) => c.name.replace("東京都 ", ""))
            .join("・")}
          )が占めるという、明確な傾向が見えてきました。
        </p>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.childPerDaycare,
            displayValue: `${c.childPerDaycare.toFixed(0)}人`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          東京23区は、2010年代の「待機児童問題」を受けて、
          保育施設の整備に大規模な予算を投じてきた経緯があります。
          {bigTop10[0].name}
          は保育園1施設あたり
          {bigTop10[0].childPerDaycare.toFixed(0)}
          人と、同規模の都市の中でも際立って少ない水準です。
        </p>
      </div>

      <div style={box}>
        <h2>一方、大阪府内の都市は軒並み下位に</h2>

        <RankingBarChart
          items={bigBottom5.map((c) => ({
            name: c.name,
            value: c.childPerDaycare,
            displayValue: `${c.childPerDaycare.toFixed(0)}人`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          対照的に、人口20万人以上の都市の中で保育園1施設
          あたりの子ども人口が最も多かったのは
          {bigBottom5[0].name}
          で、{bigBottom5[0].childPerDaycare.toFixed(0)}
          人と、東京23区の上位とは10倍以上の開きがありました。
          下位5自治体のうち{
            bigBottom5.filter((c) => c.name.startsWith("大阪府")).length
          }
          自治体が大阪府内の都市で占められており、同じ大都市
          圏でも保育施設への投資度合いには大きな差があること
          がうかがえます。
        </p>

        <PersonalNote>
          自治体職員として統計データを扱っていた立場から言うと、
          この「保育園数」という統計は少し注意が必要です。認可
          保育所・認定こども園・小規模保育事業所など、施設の
          種類によって集計対象が変わりやすく、特に大都市では
          統計の取り方次第で数字が変わる可能性があります。ただ、
          それを差し引いても、東京23区と大阪府内の自治体で
          ここまではっきり傾向が分かれるのは、単なる統計の
          ブレでは説明しきれない、実際の政策投資の差が表れて
          いるように感じます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>都道府県単位で見ても、西高東低ならぬ「西厳しめ」の傾向</h2>

        <p>
          市区町村単位だけでなく、都道府県ごとの平均値を
          比較しても、興味深い傾向が見えてきます。対象5
          自治体以上ある都道府県の中で、保育園1施設あたりの
          子ども人口が最も少ない(=余裕がある)のは島根県・
          高知県・熊本県・宮崎県で、いずれも平均400人前後
          でした。逆に最も多い(=厳しい)のは大阪府・兵庫県・
          滋賀県で、特に大阪府は平均2,000人を超え、島根県の
          8倍以上という差がついています。人口減少が進む
          山陰・四国・九州の県ほど子どもの絶対数が少ないため
          単純比較には注意が必要ですが、それでも近畿圏の
          数値の高さは際立っています。
        </p>
      </div>

      <div style={box}>
        <h2>この指標を子育て世帯の引っ越し先選びにどう使うか</h2>

        <p>
          この指標を実際に住む場所選びに活かすなら、まず
          候補の自治体を人口規模でグループ分けし、同じ規模の
          自治体同士で比較することをおすすめします。人口
          5万人の町と人口100万人の政令指定都市を単純比較
          しても、子どもの絶対数が違いすぎて参考になりません。
          また、待機児童数の推移や、認可外保育施設・企業主導型
          保育事業の有無など、この指標だけでは分からない
          情報もあわせて自治体の公式サイトで確認すると、より
          実態に近い判断ができます。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回用いた保育園数は、政府統計に基づく特定時点の
          スナップショットであり、その後の新規開設や統廃合は
          反映されていません。また、企業主導型保育事業や
          幼稚園型認定こども園など、統計上「保育園」に分類
          されない施設で実際には保育機能を担っているケースも
          あります。ランキングの順位そのものよりも、同じ人口
          規模の自治体を比較したときの相対的な傾向として
          参考にしていただくのが良いと思います。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          保育園1施設あたりの子ども人口は、人口規模の異なる
          自治体を単純に並べると「子どもが少ない町村ほど
          余裕がある」という当たり前の結果になります。しかし
          同じ人口規模の都市だけで比較することで、その自治体が
          どれだけ保育施設に予算と人員を投じてきたかという、
          政策的な差がはっきりと浮かび上がってきます。子育て
          世帯が引っ越し先を検討する際は、この指標を都市の
          人口規模でグループ分けしたうえで見比べることを
          おすすめします。
        </p>

        <p>
          <Link href="/ranking/daycare" style={link}>
            保育園あたり子ども人口ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/child-top50" style={link}>
            子ども人口ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-analysis" style={link}>
            単独世帯割合ランキング分析を見る
          </Link>
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

const lead: React.CSSProperties = {
  fontSize: 16,
  color: "#374151",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
