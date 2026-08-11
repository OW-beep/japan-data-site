import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/marriage-rate-analysis" },
  title: "婚姻率ランキング分析｜東京都心とその郊外、同じ東京でなぜ差が",
  description:
    "人口1,000人あたりの婚姻件数(婚姻率)をランキング分析。台東区・墨田区など東京都心の特別区が上位を占める一方、同じ東京都でも八王子市・町田市など郊外の都市は低い水準にとどまる理由を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.marriages != null && c.population >= 3000)
    .map((c) => ({
      ...c,
      marriageRate: ((c.marriages ?? 0) / c.population) * 1000,
    }));

  const ranking = [...base].sort((a, b) => b.marriageRate - a.marriageRate);
  const top12 = ranking.slice(0, 12);

  const bigCities = base
    .filter((c) => c.population >= 300000)
    .sort((a, b) => b.marriageRate - a.marriageRate);

  const bigTop8 = bigCities.slice(0, 8);
  const bigBottom5 = [...bigCities]
    .sort((a, b) => a.marriageRate - b.marriageRate)
    .slice(0, 5);

  const average =
    base.reduce((s, c) => s + c.marriageRate, 0) / base.length;

  const tokyoWardsInTop12 = top12.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  return (
    <ArticleLayout
      title="婚姻率ランキング分析:同じ東京都でも、都心の区と郊外の市でここまで差が出る理由"
      summary={`人口1,000人あたりの婚姻件数(婚姻率)を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        2
      )}件に対し、上位12自治体のうち${tokyoWardsInTop12}自治体を東京都の特別区が占めました。一方、同じ東京都内でも八王子市・町田市など郊外の都市は平均以下にとどまり、同じ都道府県の中でも婚姻率に大きな差があることが分かりました。`}
      heroLabel="婚姻率 全国1位"
      heroValue={`${top12[0].name} ${top12[0].marriageRate.toFixed(2)}件`}
      rankingLink="/ranking/marriage-rate"
      tags={["household"]}
      publishedAt="2026-08-06"
      top3={[
        { rank: 1, name: top12[0].name, value: `${top12[0].marriageRate.toFixed(2)}件` },
        { rank: 2, name: top12[1].name, value: `${top12[1].marriageRate.toFixed(2)}件` },
        { rank: 3, name: top12[2].name, value: `${top12[2].marriageRate.toFixed(2)}件` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          婚姻率は、人口1,000人あたりの年間婚姻件数を示す
          指標です。婚姻件数は結婚した夫婦の居住地をもとに
          集計されるため、独身の若い世代がどれだけその地域に
          集まっているかを映す、少し変わった切り口の指標
          でもあります。全国
          {base.length.toLocaleString()}
          自治体の平均は
          {average.toFixed(2)}
          件でした。
        </p>
      </div>

      <div style={box}>
        <h2>婚姻率TOP12</h2>

        <RankingBarChart
          items={top12.map((c) => ({
            name: c.name,
            value: c.marriageRate,
            displayValue: `${c.marriageRate.toFixed(2)}件`,
          }))}
          barColor="#db2777"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の{top12[0].name}
          は人口1,000人あたり
          {top12[0].marriageRate.toFixed(2)}
          件と、全国平均の3倍以上に達しました。TOP12のうち
          {tokyoWardsInTop12}
          自治体を東京都の特別区(
          {top12
            .filter((c) => c.name.startsWith("東京都"))
            .map((c) => c.name.replace("東京都 ", ""))
            .join("・")}
          )が占めています。子ども人口割合ランキングでは
          目立たない都心区が、婚姻率という切り口では上位に
          並ぶのは興味深い対比です。
        </p>

        <p>
          婚姻届の多くは、平日の役所窓口で提出されます。
          職場が都心にある人にとっては、住民票のある区役所
          よりも、勤務先近くの区役所で手続きを済ませる方が
          都合が良いというケースも一定数あると考えられ、
          こうした実務的な要因も、都心区の数値を押し上げて
          いる一因かもしれません。
        </p>
      </div>

      <div style={box}>
        <h2>同じ東京都でも、都心の区と郊外の市で対極の結果に</h2>

        <RankingBarChart
          items={bigTop8.map((c) => ({
            name: c.name,
            value: c.marriageRate,
            displayValue: `${c.marriageRate.toFixed(2)}件`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口30万人以上の大都市に絞ってみても、上位は中野区・
          品川区・新宿区・豊島区といった東京都心の区が並びます。
          ところが同じ東京都内でも、
          {bigBottom5
            .filter((c) => c.name.startsWith("東京都"))
            .map((c) => c.name)
            .join("・")}
          といった郊外の市は
          {bigBottom5
            .find((c) => c.name.startsWith("東京都"))
            ?.marriageRate.toFixed(2)}
          件前後と、全国平均を下回る水準にとどまっています。
          都心の区には、就職や進学を機に上京した独身の
          若い世代が集中しやすく、そうした層が結婚するタイミング
          でそのまま都心に住み続けるケースが多いことが、この
          差の背景にあると考えられます。
        </p>

        <PersonalNote>
          出生率の記事でも書きましたが、「地方の方が出生率が
          高い」というイメージを持っていた私にとって、婚姻率
          が最も高いのが地方ではなく東京都心だったのは、また
          違った驚きでした。婚姻率が高い=子育て世帯が多い、
          というわけでは必ずしもなく、都心区は「これから
          家庭を持つ人が集まる街」、郊外や地方は「すでに家庭を
          持った人が住み続ける街」という、ライフステージの
          違う人たちがそれぞれ集まっているだけなのかもしれ
          ません。1つの数字だけで街の子育てしやすさを判断
          せず、出生率・子ども人口割合・婚姻率をあわせて見る
          ことで、その街がどんな世代に選ばれているのかが
          見えてきます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>全国1位は、なぜ東京都心ではなく山梨県の村なのか</h2>

        <p>
          今回のランキングで唯一、東京都心の区を上回って
          全国1位となったのが山梨県忍野村です。人口
          {top12[0].population.toLocaleString()}
          人という小規模な自治体のため、婚姻件数がわずかに
          変動するだけで比率が大きく動く可能性がある点には
          注意が必要ですが、富士山麓の工業団地に勤務する
          若い世代の転入が続いていることが、婚姻率の高さに
          つながっていると考えられます。人口5,000〜1万人
          規模の自治体では、こうした特殊要因による数値の
          振れが起こりやすいため、上位であっても一つの参考
          情報として見るのが適切です。
        </p>
      </div>

      <div style={box}>
        <h2>婚姻率は「子育てのしやすさ」とは別の指標</h2>

        <p>
          注意したいのは、婚姻率が高い=子育て環境が良い、
          という意味ではない点です。子ども人口割合ランキング
          分析の記事では、東京都心の区はむしろ子ども人口
          割合が低い傾向にあることを紹介しました。婚姻率が
          高くても、結婚後に郊外や地方へ転居する夫婦が
          多ければ、その街の子ども人口割合には反映されません。
          婚姻率はあくまで「結婚のタイミングでその街に
          住んでいた人がどれだけいたか」を示す指標であり、
          その後の子育て環境を示す指標とは切り分けて考える
          必要があります。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          婚姻件数の統計は、婚姻届を提出した際の夫婦の住所を
          もとに集計されています。結婚を機に転居するケースも
          多いため、統計上の「婚姻率が高い自治体」が、必ずしも
          結婚生活を始めた後もそのまま住み続けている自治体
          とは限りません。また、人口の少ない自治体では婚姻
          件数が数件変わるだけで比率が大きく動くため、人口
          3,000人未満の自治体は今回の集計対象から除外して
          います。ランキング上位・下位の細かな順位よりも、
          都市規模ごとの大まかな傾向として捉えるのが実態に
          近い読み方です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          婚姻率ランキングは、東京都心の特別区が全国トップ
          クラスを占めるという、直感とは異なる結果になりました。
          同じ東京都内でも都心と郊外でこれほど差が出ることは、
          「東京は一つではない」ことを数字で裏付けています。
          結婚や子育てのタイミングで住む場所を考える際は、
          婚姻率だけでなく、出生率や子ども人口割合など複数の
          指標をあわせて確認することをおすすめします。
        </p>

        <p>
          <Link href="/ranking/marriage-rate" style={link}>
            婚姻率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
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
