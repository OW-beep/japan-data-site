import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import RakutenGifts from "@/components/RakutenGifts";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/articles/furusato-nozei-analysis" },
  title:
    "ふるさと納税 受入額ランキング分析｜全国1兆3,314億円、白糠町は住民1人あたり306万円",
  description:
    "総務省「ふるさと納税に関する現況調査結果」(令和8年度実施)をもとに、市区町村別の受入額ランキングとお金の流れを分析。北海道白糠町は住民1人あたり306万円を受け入れています。",
};

export default function Page() {
  const all = getFurusatoNozeiRanking();

  const top10 = [...all]
    .sort((a, b) => b.amountYen - a.amountYen)
    .slice(0, 10);

  const perCapita = all
    .filter((c) => c.population != null && c.population >= 1000)
    .sort((a, b) => (b.amountPerCapita ?? 0) - (a.amountPerCapita ?? 0));

  const shiranuka = perCapita[0];

  const faq = [
    {
      q: "ふるさと納税の全国の受入額はいくらですか？",
      a: "総務省の調査によると、令和7年度(令和7年4月〜令和8年3月)の全国計は約1兆3,314億円、受入件数は約5,963万件です。制度開始時(平成20年度、約81億円)と比べると、17年間で160倍以上に拡大しています。",
    },
    {
      q: "受入額が最も多い自治体はどこですか？",
      a: `${top10[0].name}で、令和7年度の受入額は約${(
        top10[0].amountYen / 100000000
      ).toFixed(1)}億円です。`,
    },
    {
      q: "ふるさと納税は寄附額のすべてが自治体の収入になりますか？",
      a: "いいえ。総務省の調査では、返礼品の調達・送付費用、広報費、決済手数料、事務費などを合計すると、全国計で受入額の47.9%が費用として使われており、自治体が自由に使える財源として残るのは受入額の52.1%(令和7年度)です。令和8年度の税制改正により、この「自治体が活用できる財源の割合」を60%以上に引き上げることが法律で定められ、令和8年指定から段階的に適用されます。",
    },
    {
      q: "ポータルサイトはどのくらい利用されていますか？",
      a: "令和7年度の受入額のうち97.2%(約1兆2,947億円)が、さとふる・楽天ふるさと納税といったポータルサイトを経由しています。ポータルサイト運営事業者への支払総額は2,433億円で、受入額の18.8%にのぼります。",
    },
  ];

  return (
    <ArticleLayout
      title="ふるさと納税 受入額ランキング分析｜白糠町は住民1人あたり306万円"
      summary="総務省「ふるさと納税に関する現況調査結果」(令和8年度実施)をもとに、市区町村別の受入額ランキングと、寄附金がどこに使われているかを分析します。"
      heroLabel="令和7年度 全国受入額"
      heroValue="1兆3,314億円"
      rankingLink="/ranking/furusato-nozei"
      path="/articles/furusato-nozei-analysis"
      tags={["finance"]}
      publishedAt="2026-09-13"
      top3={top10.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${(c.amountYen / 100000000).toFixed(1)}億円`,
      }))}
    >
      <div style={box}>
        <h2>受入額TOP10</h2>

        <p>
          総務省が令和8年7月に公表した「ふるさと納税に関する現況調査結果」
          によると、令和7年度(令和7年4月〜令和8年3月)の全国の受入額は
          約1兆3,314億円、受入件数は約5,963万件でした。制度が始まった
          平成20年度の受入額は約81億円だったので、17年間で160倍以上に
          拡大したことになります。
        </p>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.amountYen / 100000000,
            displayValue: `${(c.amountYen / 100000000).toFixed(1)}億円`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          1位の{top10[0].name}をはじめ、
          <span className="stat-chip">北海道 白糠町</span>
          <span className="stat-chip">宮崎県 都城市</span>
          <span className="stat-chip">北海道 別海町</span>
          <span className="stat-chip">愛知県 名古屋市</span>
          など、返礼品が充実した自治体が上位に並びます。
        </p>
      </div>

      <div style={box}>
        <h2>住民1人あたりで見ると：白糠町が突出</h2>

        <p>
          総額ランキングは人口の多い自治体が有利になりますが、
          住民1人あたりの受入額で見ると、全く違う実態が見えてきます。
        </p>

        <div className="pull-note">
          <strong>{shiranuka.name}</strong>
          は、令和7年度の受入額が約
          {(shiranuka.amountYen / 100000000).toFixed(1)}
          億円、人口{shiranuka.population?.toLocaleString()}人に対して、
          住民1人あたり
          <strong>
            約{Math.round(shiranuka.amountPerCapita ?? 0).toLocaleString()}円
          </strong>
          のふるさと納税を受け入れている計算になります。これは、
          白糠町の税収規模をはるかに超える金額で、いくつかの返礼品
          サイトで話題になった、いくらの返礼品を中心とした人気の
          高さが背景にあります。
        </div>

        <p>
          {perCapita[1]?.name}(
          {Math.round(perCapita[1]?.amountPerCapita ?? 0).toLocaleString()}
          円/人)、{perCapita[2]?.name}(
          {Math.round(perCapita[2]?.amountPerCapita ?? 0).toLocaleString()}
          円/人)も、人口数千人規模の町でありながら、住民1人あたりでは
          極めて大きな金額を集めています。総額ランキングの上位には
          出てこない小さな町ほど、実は「稼ぐ力」が大きいケースがある
          という点が、このランキングの面白いところです。
        </p>
      </div>

      <RakutenGifts
        keyword="いくら 訳あり 北海道"
        heading="白糠町の人気を支える「いくら」を楽天市場で見る"
      />

      <div style={box}>
        <h2>受入額の47.9%は費用として使われている</h2>

        <p>
          ふるさと納税の受入額は、そのすべてが自治体の収入になる
          わけではありません。総務省の調査では、受入額に占める
          費用の内訳が公表されています。
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>区分</th>
              <th style={th}>金額</th>
              <th style={th}>受入額に占める割合</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>返礼品の調達費用</td>
              <td style={td}>3,528億円</td>
              <td style={td}>26.5%</td>
            </tr>
            <tr>
              <td style={td}>返礼品の送付費用</td>
              <td style={td}>756億円</td>
              <td style={td}>5.7%</td>
            </tr>
            <tr>
              <td style={td}>広報費用</td>
              <td style={td}>93億円</td>
              <td style={td}>0.7%</td>
            </tr>
            <tr>
              <td style={td}>決済費用</td>
              <td style={td}>196億円</td>
              <td style={td}>1.5%</td>
            </tr>
            <tr>
              <td style={td}>事務費用等</td>
              <td style={td}>1,809億円</td>
              <td style={td}>13.6%</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 700 }}>費用合計</td>
              <td style={{ ...td, fontWeight: 700 }}>6,382億円</td>
              <td style={{ ...td, fontWeight: 700 }}>47.9%</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 12 }}>
          差し引き、自治体が自由に使える財源として残るのは受入額の
          52.1%(約6,932億円)です。返礼品の上限は地方税法で「受入額の
          3割以下」と定められていますが、送付・広報・決済・事務費を
          含めた費用全体には、総務省告示で「受入額の5割以下」という
          上限があります。
        </p>

        <div className="pull-note">
          <strong>令和8年度税制改正</strong>：この「自治体が活用できる
          財源の割合」を60%以上に引き上げることが法律で定められました。
          令和8年度指定から段階的に適用され、52.5%(R8)→55%(R9)→
          57.5%(R10)→60%(R11以降)と、費用の上限が徐々に引き下げられて
          いきます。
        </div>
      </div>

      <div style={box}>
        <h2>97.2%がポータルサイト経由</h2>

        <p>
          令和7年度の受入額のうち97.2%(約1兆2,947億円)が、さとふる・
          楽天ふるさと納税といったポータルサイトを経由して受け入れ
          られています。ポータルサイト運営事業者への支払総額は
          2,433億円で、受入額の18.8%にのぼります。制度開始当初は
          自治体が直接寄附を募るケースも多くありましたが、いまや
          ふるさと納税はポータルサイト抜きには成り立たない仕組みに
          なっていることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>クラウドファンディング型の広がり</h2>

        <p>
          使途を選択できる自治体は1,749団体(98.2%)にのぼり、
          そのうち586団体が具体的な事業を選択できるようにして
          います。中でも「クラウドファンディング型」(目標金額・
          募集期間を定めて特定の事業に寄附を募る方式)を実施した
          団体は516団体、プロジェクト数は1,547件、受入総額は
          333億円に達しました。
        </p>

        <p>
          代表例として、秋田県はツキノワグマの大量出没を受けた
          安全対策(放任果樹の除去・通学路の見回りなど)に対する
          寄附を募り、目標額の124%を達成しました(返礼品なし)。
          広島県北広島町は、未活用の廃校をパン屋やカフェとして
          再生する事業に活用し、令和7年度の来客数は5,000人を
          超えています。返礼品だけでなく、使い道そのものに
          共感して寄附する動きが広がっていることがうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：ふるさと納税の受入額についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          ふるさと納税は制度開始から17年で1兆円を超える規模に
          成長し、多くの自治体にとって重要な財源になっています。
          一方で、受入額の半分近くが費用として使われている実態や、
          総額ランキングだけでは見えない「住民1人あたりの受入額」
          という切り口からは、この制度の別の顔が見えてきます。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/furusato-nozei" style={link}>
            ふるさと納税受入額ランキングを見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 16,
          }}
        >
          出典：総務省 自治税務局市町村税課「ふるさと納税に関する
          現況調査結果(令和8年度実施)」(令和8年7月31日公表)
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)",
  padding: "20px 24px",
  border: "1px solid var(--line)",
  marginBottom: 20,
};

const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "2px solid var(--line)",
  padding: "8px 6px",
  fontSize: 14,
};

const td: React.CSSProperties = {
  borderBottom: "1px solid var(--line)",
  padding: "8px 6px",
  fontSize: 14,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
  textDecoration: "underline",
};
