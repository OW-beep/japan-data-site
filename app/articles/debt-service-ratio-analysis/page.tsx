import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/debt-service-ratio-analysis" },
  title: "実質公債費比率ランキング分析｜夕張市が突出、東京23区は軒並みマイナス",
  description:
    "過去の借金返済の重さを示す実質公債費比率をランキング分析。財政破綻した北海道夕張市が2位以下を大きく引き離す一方、東京23区の多くがマイナス値という対照的な結果になりました。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) => c.realDebtServiceRatio != null
  );

  const worst10 = [...base]
    .sort((a, b) => (b.realDebtServiceRatio ?? 0) - (a.realDebtServiceRatio ?? 0))
    .slice(0, 10);

  const best10 = [...base]
    .sort((a, b) => (a.realDebtServiceRatio ?? 0) - (b.realDebtServiceRatio ?? 0))
    .slice(0, 10);

  const average =
    base.reduce((s, c) => s + (c.realDebtServiceRatio ?? 0), 0) /
    base.length;

  const over18 = base.filter((c) => (c.realDebtServiceRatio ?? 0) >= 18);

  const tokyoWardsInBest10 = best10.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const bigCities = base
    .filter((c) => c.population >= 300000)
    .sort((a, b) => (b.realDebtServiceRatio ?? 0) - (a.realDebtServiceRatio ?? 0));

  const bigWorst5 = bigCities.slice(0, 5);

  const faq = [
    {
      q: "実質公債費比率が最も高い自治体はどこですか？",
      a: `北海道夕張市が${worst10[0].realDebtServiceRatio?.toFixed(
        1
      )}%で全国1位です。2位以下(${worst10[1].name}の${worst10[1].realDebtServiceRatio?.toFixed(
        1
      )}%)を大きく引き離しており、突出した数値です。`,
    },
    {
      q: "実質公債費比率がマイナスとはどういう意味ですか？",
      a: "積立基金の運用益などが、地方債の元利償還負担額を上回っている状態を示します。借金が全くないという意味ではなく、財政的な余力が負担額を相殺できるほど大きいことを意味します。",
    },
    {
      q: "実質公債費比率が18%・25%を超えるとどうなりますか？",
      a: "18%以上になると、地方債を発行する際に総務大臣または都道府県知事の許可が必要になります。25%以上になると「早期健全化団体」に指定され、財政健全化計画の策定が義務付けられます。",
    },
    {
      q: "なぜ東京23区は実質公債費比率が低い(マイナスの)自治体が多いのですか？",
      a: "地価の高さを背景にした豊富な税収と、基金(貯金)の積立残高の大きさが要因です。元利償還負担額に対して運用益等が上回るため、指標上はマイナス表示になる区が多くなっています。",
    },
  ];

  return (
    <ArticleLayout
      title="実質公債費比率ランキング分析：夕張市が突出、東京23区は軒並みマイナス"
      summary={`過去の借金(地方債)の返済負担を示す実質公債費比率を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}%に対し、財政破綻の歴史を持つ北海道夕張市が${worst10[0].realDebtServiceRatio?.toFixed(
        1
      )}%で突出。一方、東京23区の多くはマイナス値という対照的な結果になりました。`}
      heroLabel="実質公債費比率 全国1位(最も負担が重い)"
      heroValue={`${worst10[0].name} ${worst10[0].realDebtServiceRatio?.toFixed(1)}%`}
      rankingLink="/ranking/debt-service-ratio"
      path="/articles/debt-service-ratio-analysis"
      tags={["finance"]}
      publishedAt="2026-08-11"
      top3={[
        { rank: 1, name: worst10[0].name, value: `${worst10[0].realDebtServiceRatio?.toFixed(1)}%` },
        { rank: 2, name: worst10[1].name, value: `${worst10[1].realDebtServiceRatio?.toFixed(1)}%` },
        { rank: 3, name: worst10[2].name, value: `${worst10[2].realDebtServiceRatio?.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          実質公債費比率は、標準的な財政規模に対して、過去に
          発行した地方債の元利償還負担がどれだけの割合を
          占めているかを示す指標です。経常収支比率が「日々の
          運営の余裕」を測るのに対し、実質公債費比率は
          <strong>「過去の借金の重さ」</strong>
          を測る指標という違いがあります。全国
          {base.length.toLocaleString()}
          自治体の平均は{average.toFixed(1)}%でした。
        </p>
      </div>

      <div style={box}>
        <h2>負担が最も重い自治体TOP10</h2>

        <RankingBarChart
          items={worst10.map((c) => ({
            name: c.name,
            value: c.realDebtServiceRatio ?? 0,
            displayValue: `${c.realDebtServiceRatio?.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全国1位は{worst10[0].name}で、
          {worst10[0].realDebtServiceRatio?.toFixed(1)}
          %と、2位の{worst10[1].name}(
          {worst10[1].realDebtServiceRatio?.toFixed(1)}%)を
          50ポイント近く引き離す突出した数値です。夕張市は
          2007年に財政再建団体(財政破綻)に指定された自治体で、
          炭鉱閉山後の観光開発関連事業への過大投資が原因となった
          巨額の負債の返済が、今なお財政を強く圧迫しています。
        </p>
      </div>

      <div style={box}>
        <h2>逆に最も負担が軽いのは、東京23区が並ぶ</h2>

        <RankingBarChart
          items={best10.map((c) => ({
            name: c.name,
            value: c.realDebtServiceRatio ?? 0,
            displayValue: `${c.realDebtServiceRatio?.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          負担が最も軽い(マイナス幅が大きい)上位10自治体のうち
          {tokyoWardsInBest10}
          自治体を東京都特別区が占めています。地価の高さを
          背景にした豊富な地方税収と、積み立ててきた基金の
          運用益が、地方債の返済負担を相殺してなお余りある
          状態です。経常収支比率ランキング分析の記事でも
          触れたとおり、東京23区は財政の「余裕度」と「過去の
          借金の軽さ」の両方で、全国的に見て極めて健全な
          水準にあります。
        </p>
      </div>

      <div style={box}>
        <h2>大都市(人口30万人以上)の中では高知市・京都市が高め</h2>

        <RankingBarChart
          items={bigWorst5.map((c) => ({
            name: c.name,
            value: c.realDebtServiceRatio ?? 0,
            displayValue: `${c.realDebtServiceRatio?.toFixed(1)}%`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口30万人以上の大都市に絞ると、高知市・京都市・
          新潟市・千葉市・北九州市が上位に入りました。いずれも
          10%台前半で、全国平均を上回るものの、都道府県の許可が
          必要になる18%のラインには届いていません。地下鉄・
          都市高速など大型インフラ投資の歴史を持つ都市ほど、
          この数値がやや高くなる傾向があります。

        </p>

        <PersonalNote>
          財政関連の資料を見ていた頃、実質公債費比率は
          「その自治体が過去にどれだけ大きな投資をしてきたか」
          の裏返しでもあると感じていました。数値が高いことが
          必ずしも失敗を意味するわけではなく、地下鉄や上下水道
          といった大型インフラを早期に整備した都市ほど、その
          返済負担が今の指標に表れやすい面があります。夕張市の
          ように事業そのものが破綻したケースと、計画的な
          インフラ投資の結果として数値が高いケースは、原因が
          全く異なる点に注意が必要です。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>18%・25%という制度上の節目</h2>

        <p>
          実質公債費比率が18%以上になると、地方債を発行する際に
          総務大臣または都道府県知事の許可が必要になります。
          25%以上になると「早期健全化団体」に指定され、財政
          健全化計画の策定が義務付けられます。今回の集計では、
          18%を超えているのは夕張市
          {over18.length === 1 ? "のみ" : `を含む${over18.length}自治体`}
          で、大半の自治体はこの節目を大きく下回る、比較的
          落ち着いた水準にあることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>経常収支比率との違いに注意</h2>

        <p>
          経常収支比率ランキング分析の記事で紹介した原発
          立地自治体は、経常収支比率では全国トップクラスの
          健全さを示す一方、実質公債費比率で見ると必ずしも
          上位に来るとは限りません。経常収支比率は「今の
          収支」、実質公債費比率は「過去の借金の重さ」を
          見る指標であり、両方を組み合わせて初めて、ある
          自治体の財政状況を立体的に理解できます。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：実質公債費比率ランキングについてよくある質問</h2>

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
          実質公債費比率ランキングからは、財政破綻の歴史を
          持つ夕張市の負担の重さと、豊富な税収・基金を背景に
          した東京23区の健全さという、対照的な姿が見えて
          きました。大都市の中でも数値には差があり、大型
          インフラ投資の歴史が影響している可能性があります。
          経常収支比率とあわせて見ることで、自治体の財政を
          「今の余裕」と「過去の借金」の両面から理解できます。
        </p>

        <p>
          <Link href="/ranking/debt-service-ratio" style={link}>
            実質公債費比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/balance-ratio-analysis" style={link}>
            経常収支比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
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
