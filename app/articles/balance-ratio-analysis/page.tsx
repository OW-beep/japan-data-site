import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  title: "経常収支比率ランキング分析｜原発立地自治体と夕張市の対極",
  description:
    "財政の余裕度を示す経常収支比率をランキング分析。原子力発電所を抱える町村が上位を占める一方、財政破綻した北海道夕張市が最下位となった背景、大都市の中では東京23区と豊田市が強い理由を解説します。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.ordinaryBalanceRatio != null &&
      c.ordinaryBalanceRatio > 0 &&
      !Number.isNaN(c.ordinaryBalanceRatio)
  );

  const ranking = [...base].sort(
    (a, b) => (a.ordinaryBalanceRatio ?? 0) - (b.ordinaryBalanceRatio ?? 0)
  );

  const top12 = ranking.slice(0, 12);

  const worst10 = [...base]
    .sort((a, b) => (b.ordinaryBalanceRatio ?? 0) - (a.ordinaryBalanceRatio ?? 0))
    .slice(0, 10);

  const bigCities = base
    .filter((c) => c.population >= 300000)
    .sort((a, b) => (a.ordinaryBalanceRatio ?? 0) - (b.ordinaryBalanceRatio ?? 0));

  const bigTop10 = bigCities.slice(0, 10);

  const average =
    base.reduce((s, c) => s + (c.ordinaryBalanceRatio ?? 0), 0) / base.length;

  const tokyoWardsInBigTop10 = bigTop10.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  return (
    <ArticleLayout
      title="経常収支比率ランキング分析:原発立地自治体はなぜ強く、夕張市はなぜ最下位なのか"
      summary={`財政の余裕度を示す経常収支比率を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}%に対し、上位には原子力発電所を抱える町村、下位には財政破綻の歴史を持つ北海道夕張市が並びました。人口30万人以上の大都市に絞ると、東京23区と愛知県豊田市の強さが際立ちます。`}
      heroLabel="経常収支比率 全国1位(最も健全)"
      heroValue={`${top12[0].name} ${top12[0].ordinaryBalanceRatio?.toFixed(1)}%`}
      rankingLink="/ranking/balance-ratio"
      tags={["finance"]}
      publishedAt="2026-08-06"
      top3={[
        { rank: 1, name: top12[0].name, value: `${top12[0].ordinaryBalanceRatio?.toFixed(1)}%` },
        { rank: 2, name: top12[1].name, value: `${top12[1].ordinaryBalanceRatio?.toFixed(1)}%` },
        { rank: 3, name: top12[2].name, value: `${top12[2].ordinaryBalanceRatio?.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          経常収支比率は、人件費や扶助費など毎年必ずかかる
          支出が、地方税などの経常的な収入のうちどれだけを
          占めているかを示す指標です。財政力指数とは違い、
          <strong>数字が低いほど「新しい事業に回せる財政的な
          余裕がある」</strong>
          ことを意味します。全国
          {base.length.toLocaleString()}
          自治体の平均は
          {average.toFixed(1)}
          %でした。
        </p>
      </div>

      <div style={box}>
        <h2>財政に最も余裕がある自治体TOP12</h2>

        <RankingBarChart
          items={top12.map((c) => ({
            name: c.name,
            value: c.ordinaryBalanceRatio ?? 0,
            displayValue: `${c.ordinaryBalanceRatio?.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位には、北海道泊村・福井県高浜町・新潟県刈羽村
          など、原子力発電所を抱える町村が並びます。電源
          立地地域対策交付金や、発電施設にかかる大きな固定
          資産税収入によって、人口規模に比べて財政的な余裕が
          大きくなっているためです。財政力指数ランキング分析
          の記事でも触れましたが、特定の産業・施設に支えられた
          自治体は、一般的な人口統計だけでは説明できない財政の
          強さを持つことがあり、経常収支比率でも同じ傾向が
          はっきりと確認できました。
        </p>
      </div>

      <div style={box}>
        <h2>逆に財政が厳しいのは、財政破綻の歴史を持つ夕張市</h2>

        <RankingBarChart
          items={worst10.map((c) => ({
            name: c.name,
            value: c.ordinaryBalanceRatio ?? 0,
            displayValue: `${c.ordinaryBalanceRatio?.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全国最下位は
          {worst10[0].name}
          で、{worst10[0].ordinaryBalanceRatio?.toFixed(1)}
          %と、経常収入だけでは経常支出を賄いきれない
          「自転車操業」の状態にありました。2007年に財政
          再建団体(財政破綻)となったことで知られる北海道
          夕張市も僅差で続いており、下位には大阪府泉佐野市・
          福岡県田川市・宮城県石巻市など、ふるさと納税を
          めぐる問題や震災復興など、それぞれ個別の事情を
          抱えた自治体が並んでいます。
        </p>
      </div>

      <div style={box}>
        <h2>大都市の中では、東京23区と豊田市が強い</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.ordinaryBalanceRatio ?? 0,
            displayValue: `${c.ordinaryBalanceRatio?.toFixed(1)}%`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口30万人以上の大都市
          {bigCities.length}
          自治体だけで比較すると、上位10自治体のうち
          {tokyoWardsInBigTop10}
          自治体を東京都の特別区が占めました。もう一つ目を
          引くのが2位の愛知県豊田市です。トヨタ自動車の
          本社・工場が立地する「企業城下町」として知られ、
          製造業の集積による安定した税収が、財政の余裕度に
          直結しています。
        </p>

        <PersonalNote>
          財政関連の資料を扱っていたころの実感として、経常
          収支比率は財政力指数よりも「今、その自治体が身動き
          を取れるかどうか」を生々しく映す指標だと感じます。
          財政力指数が高くても、経常収支比率も同時に高い
          自治体は、収入は豊かでも新しい施策に回す余裕が
          ほとんどないという状態になりがちです。逆に財政力
          指数がそれほど高くなくても、経常収支比率が低く
          抑えられている自治体は、身の丈に合った堅実な財政
          運営をしていると言えます。1つの指標だけで自治体の
          財政を判断せず、複数の指標を組み合わせて見ることの
          大切さを、この2つの指標の対比からあらためて感じます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>財政力指数が高くても、経常収支比率が低いとは限らない</h2>

        <p>
          もう一つ興味深いのは、経常収支比率と財政力指数の
          関係です。一般的には、財政力指数が高い(税収が
          豊かな)自治体ほど経常収支比率も低く抑えられそうに
          思えますが、実際には両者の相関はそれほど強くは
          ありません。税収が豊かでも、都市インフラの維持費や
          社会保障費の負担が大きい自治体では、経常収支比率が
          高止まりすることがあります。逆に税収がそこまで
          豊かでなくても、身の丈に合った歳出管理を徹底して
          いる自治体は、経常収支比率を低く保てています。
        </p>
      </div>

      <div style={box}>
        <h2>目安となる「80%」「100%」というライン</h2>

        <p>
          総務省の目安では、経常収支比率は都市部で80%程度、
          町村部で70%程度が望ましいとされ、90%を超えると
          財政の硬直化が始まっていると見なされます。今回の
          全国平均{average.toFixed(1)}
          %は、この目安をやや上回る水準であり、多くの自治体で
          財政に余裕がない状態が常態化していることを示して
          います。100%を超える自治体は、経常的な収入だけでは
          経常的な支出すら賄えておらず、基金の取り崩しや
          臨時の財源に頼らざるを得ない状況にあります。
        </p>
      </div>

      <div style={box}>
        <h2>小規模町村ほど数値が振れやすい点にも注意</h2>

        <p>
          経常収支比率は、分母となる経常一般財源の規模が
          小さい自治体ほど、大型の公共施設整備や職員数の
          増減といった一時的な要因で数値が大きく動きやすい
          という性質があります。今回上位に入った町村の中にも、
          原発関連の交付金という特殊要因が数値を押し上げて
          いる例が多く含まれているため、必ずしも「行政運営が
          特別優れている」ことを意味するわけではありません。
          あくまで、その時点での財政の余力を測る一つの
          ものさしとして捉えるのが適切です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          経常収支比率ランキングからは、原子力発電所という
          特定の施設に支えられた小規模な町村の財政的な強さと、
          過去の財政破綻や近年の財政問題を抱える自治体の
          厳しさという、両極端な姿が見えてきました。大都市の
          中では、行政改革を進めてきた東京23区と、安定した
          製造業を持つ豊田市が高い水準を維持しています。財政
          力指数とあわせてこの指標を見ることで、自治体の
          財政の「豊かさ」と「柔軟さ」を、より立体的に
          理解することができます。
        </p>

        <p>
          <Link href="/ranking/balance-ratio" style={link}>
            経常収支比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/tax-composition" style={link}>
            地方税自主財源比率ランキング分析を見る
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
