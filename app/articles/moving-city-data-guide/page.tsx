import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalitiesPop, isShi, shortName } from "@/lib/cityPopulation";

const PATH = "/articles/moving-city-data-guide";
const MIN_POP = 100_000;

export const metadata = {
  alternates: { canonical: PATH },
  title: "移住先の選び方｜データで見る自治体選びの5指標と失敗しない手順",
  description:
    "移住先・引っ越し先の自治体選びで見るべき5つのデータ(社会増減率、人口の将来、財政力指数、空き家率、昼夜間人口比率)を、実際のランキングとあわせて解説。候補を3つに絞る手順と、データでは分からない現地確認のポイントもまとめました。",
};

export default function Page() {
  const { rows, label } = getMunicipalitiesPop();
  const cities = rows.filter(
    (c) => isShi(c.name) && c.population >= MIN_POP && c.inMigrants != null && c.outMigrants != null
  );
  const withRate = cities.map((c) => ({
    ...c,
    socialRate: (((c.inMigrants ?? 0) - (c.outMigrants ?? 0)) / c.population) * 100,
  }));
  const socialTop = [...withRate].sort((a, b) => b.socialRate - a.socialRate).slice(0, 5);
  const socialBottom = [...withRate].sort((a, b) => a.socialRate - b.socialRate).slice(0, 3);

  const faq = [
    {
      q: "移住先を選ぶとき、最初に見るべきデータは何ですか？",
      a: "社会増減率(転入と転出の差)です。実際に引っ越してくる人が多い街は、仕事・交通・生活環境のどこかで選ばれている理由があります。次に、人口の増減傾向と財政力指数を見ると、その街の10年後の姿が想像しやすくなります。",
    },
    {
      q: "人口が減っている街は、移住先として避けるべきですか？",
      a: "一概には言えません。日本全体が人口減少局面にあるため、多くの自治体で人口は減っています。減り方の緩やかさと、社会増減(引っ越しによる増減)がプラスかどうかが目安です。自然減(高齢化による減少)が中心で社会増がプラスの街は、子育て世代などに選ばれている可能性があります。",
    },
    {
      q: "財政力指数はどれくらいあれば安心ですか？",
      a: "1.0を超えると、国からの地方交付税に頼らず自前の収入で運営できる水準とされます。全国的には0.5前後の自治体が多く、0.3を下回ると財政の余裕は小さいと見られます。ただし指数が低くても、借金の少なさなど別の健全さもあります。実質公債費比率などとあわせて見てください。",
    },
    {
      q: "空き家率が高い街は、家が安く買えるということですか？",
      a: "空き家が多い分、物件の選択肢と価格交渉の余地は広がります。ただし空き家率の高さは、裏返すとその地域の住宅需要の弱さでもあります。買った後の修繕費や、将来手放すときの売りにくさまで含めて判断してください。自治体の空き家バンクに登録されている物件は、現地の窓口で状態を確認できます。",
    },
    {
      q: "データだけで移住先を決めても大丈夫ですか？",
      a: "データは候補を絞るためのもので、最終決定には現地確認が欠かせません。駅やスーパーまでの実際の距離、夜の街の様子、坂や水害リスク(ハザードマップ)は、統計では分かりません。候補を2〜3に絞ってから、平日と休日の両方に訪れるのがおすすめです。",
    },
  ];

  return (
    <ArticleLayout
      title="移住先の選び方｜データで見る自治体選びの5指標と失敗しない手順"
      summary="移住先選びで失敗しやすいのは、「雰囲気がよさそう」で決めてしまうことです。この記事では、社会増減率・人口の将来・財政力指数・空き家率・昼夜間人口比率の5指標で候補を絞る方法を、実際のデータとあわせて解説します。"
      heroLabel="社会増減率が最も高い市(人口10万人以上)"
      heroValue={shortName(socialTop[0].name)}
      rankingLink="/ranking/balance-ratio"
      path={PATH}
      tags={["migration"]}
      publishedAt="2026-11-16"
      dataNote={`人口・転入転出: ${label}および住民基本台帳ベースの移動データ(当サイト収録分)。社会増減率は(転入者数-転出者数)÷人口×100で計算。対象は人口${MIN_POP.toLocaleString()}人以上の市。`}
      top3={socialTop.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: shortName(c.name),
        value: `社会増減率 +${c.socialRate.toFixed(2)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:「選ばれている街」かどうかは、人の動きで分かる</h2>
        <p>
          自治体の宣伝文句や移住フェアの印象だけで決めると、住んでから
          「思っていたのと違う」になりがちです。まず見るべきは、実際に
          人が動いた結果である<strong>社会増減</strong>です。転入が転出を
          上回る街には、雇用・交通・子育て環境など、何かしら選ばれる理由が
          あります。逆に、どれだけ家賃が安くても転出超過が続く街は、
          仕事や生活の不便さが理由であることが少なくありません。
        </p>
        <p>
          この記事の5指標は、すべて当サイトのランキングで自治体ごとに
          確認できます。感覚ではなく数字で候補を3つまで絞り、最後に
          現地で確かめる、という順番が失敗を減らします。
        </p>
      </div>

      <div style={box}>
        <h2>指標1:社会増減率 ― 実際に選ばれている街か</h2>
        <p>
          人口{MIN_POP.toLocaleString()}人以上の市で、社会増減率
          (転入超過の割合)が高いのは次の自治体です。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={{ ...th, textAlign: "left" }}>市</th>
                <th style={thR}>社会増減率</th>
                <th style={thR}>人口</th>
              </tr>
            </thead>
            <tbody>
              {socialTop.map((c, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{c.name}</td>
                  <td style={tdR}>+{c.socialRate.toFixed(2)}%</td>
                  <td style={tdR}>{c.population.toLocaleString()}人</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          一方で、転出超過が大きい市もあります(
          {socialBottom.map((c) => `${shortName(c.name)}(${c.socialRate.toFixed(2)}%)`).join("、")})。
          順位の理由は自治体ごとに違うため、気になる街は
          <Link prefetch={false} href="/ranking/balance-ratio" style={link}>
            社会増減率ランキング
          </Link>
          と、その街のページで転入・転出の内訳まで確認してください。
        </p>
      </div>

      <div style={box}>
        <h2>指標2:人口の将来 ― 10年後もサービスが続くか</h2>
        <p>
          人口減少そのものは全国的な傾向ですが、減る速度には大きな差が
          あります。人口が急減する街では、バス路線の廃止、スーパーや
          病院の撤退といった形で暮らしに影響が出やすくなります。
          直近の国勢調査で2020年からどう変わったかと、将来推計で
          2050年にどれだけ残るかを見るのが目安です。当サイトでは
          各自治体ページに将来推計も載せています。
        </p>
        <p>
          ポイントは「増えているか」より「社会増減がプラスか」です。
          高齢化で自然減があっても、引っ越しで人が入ってくる街は、
          年齢構成が若返りやすく、子育て関連のサービスが維持されやすい
          傾向があります。
        </p>
      </div>

      <div style={box}>
        <h2>指標3:財政力指数 ― 街の「お財布」に余裕があるか</h2>
        <p>
          財政力指数は、自治体が自前の収入でどれだけ行政をまかなえるかを
          示す数字で、1.0が一つの区切りです。財政に余裕のある自治体は、
          子育て支援や医療費助成などの独自サービスを続けやすく、
          逆に財政が厳しい自治体では、公共施設の統廃合や使用料の
          見直しが進みやすくなります。
        </p>
        <p>
          ただし、指数だけで「良い街・悪い街」は決まりません。借金の
          多さを示す実質公債費比率や、貯金にあたる基金の状況も含め、
          <Link prefetch={false} href="/ranking/finance" style={link}>
            財政力指数ランキング
          </Link>
          と自治体の決算資料で確認するのが確実です。
        </p>
      </div>

      <div style={box}>
        <h2>指標4:空き家率 ― 家の探しやすさと、街の需要</h2>
        <p>
          空き家率が高い街は、中古住宅や賃貸の選択肢が多く、価格も
          抑えめです。移住の初期費用を下げたい人には有利な条件です。
          一方で、空き家率の高さは住宅需要の弱さの裏返しでもあり、
          購入後に値下がりしやすい点は織り込んでおく必要があります。
        </p>
        <p>
          目安として、全国平均(住宅・土地統計調査でおよそ14%)を
          大きく上回る地域では、駅周辺などエリアを絞って探すのが
          現実的です。自治体の空き家バンクは、市場に出回らない物件が
          見つかる半面、修繕前提の物件も多いため、内見は必須です。
        </p>
      </div>

      <div style={box}>
        <h2>指標5:昼夜間人口比率 ― 昼の街の活気と通勤</h2>
        <p>
          昼夜間人口比率は、夜の人口に対して昼間に何人いるかを示します。
          100%を大きく上回る街は働く場所が集まる街、下回る街は
          周辺都市へ通勤するベッドタウンです。テレワーク中心なら
          ベッドタウンの住環境が合い、出社中心なら職場への近さが
          優先になります。自分の働き方と照らして見る指標です。
        </p>
      </div>

      <div style={box}>
        <h2>候補を3つに絞る手順</h2>
        <ol>
          <li>
            <strong>通勤・生活圏を先に決める:</strong>
            職場や実家など、動かせない拠点から移動可能な範囲を決めます。
            ここが曖昧だと、候補が無限に広がります。
          </li>
          <li>
            <strong>5指標で比べる:</strong>
            候補の自治体を並べ、社会増減率・人口増減・財政力指数・
            空き家率・昼夜間人口比率を確認します。当サイトの
            <Link prefetch={false} href="/compare" style={link}>
              自治体比較ツール
            </Link>
            では2つの自治体を16指標で並べて比べられます。
          </li>
          <li>
            <strong>現地で3点だけ確認する:</strong>
            駅・スーパー・病院までの実際の移動時間、夜の街の明るさと
            人通り、水害・土砂災害のハザードマップ。この3点は統計では
            分かりません。
          </li>
        </ol>
      </div>

      <div style={box}>
        <h2>データで分からないこと</h2>
        <p>
          統計は「街の平均像」しか映しません。同じ市内でも駅前と郊外では
          暮らしが別物ですし、気候の体感、近所づきあいの濃さ、自分の
          職種の求人の有無は、データでは測れません。お試し移住や
          短期滞在の制度を用意している自治体も多いので、大きな決断の
          前に一度「住む側」で数日過ごしてみることをおすすめします。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
        <CompareCTA />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
