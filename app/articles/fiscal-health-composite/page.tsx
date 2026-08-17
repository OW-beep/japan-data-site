import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/fiscal-health-composite" },
  title: "自治体・財政健全度スコア｜4指標を統合した独自ランキング",
  description:
    "財政力指数・経常収支比率・自主財源比率・実質公債費比率の4つの財政指標をZスコアで統合し、独自の「財政健全度スコア」を算出。愛知県飛島村が全国1位、夕張市が2位以下を大きく引き離す最下位という結果になりました。",
};

function average(values: number[]) {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function zScores(values: number[]) {
  const mean = average(values);
  const sd = Math.sqrt(average(values.map((v) => (v - mean) ** 2)));
  return values.map((v) => (v - mean) / sd);
}

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.financeIndex != null &&
      c.ordinaryBalanceRatio != null &&
      c.totalRevenue &&
      c.localTax != null &&
      c.realDebtServiceRatio != null
  );

  const withTaxRatio = base.map((c) => ({
    ...c,
    taxRatio: ((c.localTax ?? 0) / (c.totalRevenue ?? 1)) * 100,
  }));

  const zFin = zScores(withTaxRatio.map((c) => c.financeIndex ?? 0));
  const zBal = zScores(withTaxRatio.map((c) => c.ordinaryBalanceRatio ?? 0));
  const zTax = zScores(withTaxRatio.map((c) => c.taxRatio));
  const zDebt = zScores(withTaxRatio.map((c) => c.realDebtServiceRatio ?? 0));

  const scored = withTaxRatio.map((c, i) => ({
    ...c,
    score: zFin[i] - zBal[i] + zTax[i] - zDebt[i],
  }));

  const ranked = [...scored].sort((a, b) => b.score - a.score);
  const top10 = ranked.slice(0, 10);
  const bottom10 = [...ranked].slice(-10).reverse();

  const bigCities = ranked
    .filter((c) => c.population >= 300000)
    .sort((a, b) => b.score - a.score);
  const bigTop5 = bigCities.slice(0, 5);
  const bigBottom5 = [...bigCities].slice(-5).reverse();

  const secondWorst = bottom10[1];
  const worst = bottom10[0];
  const gap = secondWorst.score - worst.score;

  const faq = [
    {
      q: "財政健全度スコアとは何ですか？",
      a: "財政力指数・経常収支比率・自主財源比率(地方税収入割合)・実質公債費比率という、性質の異なる4つの財政指標をそれぞれZスコア化し、合算した本サイト独自の指標です。単一の指標だけでは見えない、自治体の財政の「総合力」を横断的に比較することを目的としています。",
    },
    {
      q: "財政健全度スコアが最も高い自治体はどこですか？",
      a: `愛知県飛島村(人口${top10[0].population.toLocaleString()}人)です。名古屋港の一角に位置し、臨海部の工業地帯からの税収により、人口規模に対して極めて豊かな財政基盤を持っています。`,
    },
    {
      q: "財政健全度スコアが最も低い自治体はどこですか？",
      a: `北海道夕張市です。スコアは${worst.score.toFixed(1)}で、2番目に低い自治体(${secondWorst.name}、${secondWorst.score.toFixed(1)})と比べても4倍以上低く、他のどの自治体とも隔絶した水準になっています。`,
    },
    {
      q: "人口30万人以上の大都市の中で、財政健全度スコアが最も高いのはどこですか？",
      a: `愛知県豊田市です。自動車関連産業の集積による税収基盤の強さが、財政力指数だけでなく他の3指標にも一貫して表れており、大都市の中では突出したスコアになりました。`,
    },
  ];

  return (
    <ArticleLayout
      title="自治体・財政健全度スコア：4指標を統合した独自ランキング"
      summary={`財政力指数・経常収支比率・自主財源比率・実質公債費比率という4つの財政指標を統合し、本サイト独自の「財政健全度スコア」を算出しました。全国${ranked.length.toLocaleString()}自治体の中で1位は愛知県飛島村。最下位の北海道夕張市は、2番目に低い自治体と比べても4倍以上のスコア差があり、他のどの自治体とも隔絶した位置にあります。`}
      heroLabel="財政健全度スコア 全国1位"
      heroValue={`${top10[0].name} ${top10[0].score.toFixed(1)}`}
      rankingLink="/ranking/finance"
      path="/articles/fiscal-health-composite"
      tags={["finance"]}
      publishedAt="2026-08-15"
      top3={[
        { rank: 1, name: top10[0].name, value: top10[0].score.toFixed(1) },
        { rank: 2, name: top10[1].name, value: top10[1].score.toFixed(1) },
        { rank: 3, name: top10[2].name, value: top10[2].score.toFixed(1) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          本サイトではこれまで、財政力指数・経常収支比率・
          自主財源比率(地方税収入割合)・実質公債費比率という
          4つの財政指標を、それぞれ個別のランキング記事で
          分析してきました。しかし実際の自治体財政は、
          どれか1つの指標だけで判断できるものではありません。
          そこで今回、4指標をZスコア(平均からどれだけ
          離れているかを表す統計的な尺度)に変換して統合し、
          「財政健全度スコア」という独自の総合指標を算出
          しました。
        </p>
      </div>

      <div style={box}>
        <h2>財政健全度スコア TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.score,
            displayValue: c.score.toFixed(1),
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は愛知県飛島村(人口
          {top10[0].population.toLocaleString()}人)でした。
          名古屋港に面した臨海工業地帯を抱え、人口規模に
          対して非常に大きな税収基盤を持っています。2位の
          新潟県刈羽村、6位の福島県広野町のように、原子力
          発電所関連の施設を抱える自治体も上位に入りました。
          一方で4位の東京都港区、10位の武蔵野市のように、
          都市部の富裕な自治体も上位にランクインしており、
          「財政的に豊かな自治体」には、大きく分けて
          「特定の大規模施設に依存する小規模自治体」と
          「都市部の豊かな税収基盤を持つ自治体」という
          2つのパターンがあることが見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>最下位・夕張市は「桁が違う」</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.score,
            displayValue: c.score.toFixed(1),
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最下位は北海道夕張市で、スコアは
          {worst.score.toFixed(1)}でした。2番目に低い
          {secondWorst.name}({secondWorst.score.toFixed(1)})
          との差は{gap.toFixed(1)}ポイントにのぼり、これは
          3位から10位までの差(
          {(bottom10[1].score - bottom10[7].score).toFixed(1)}
          ポイント)よりもさらに大きい開きです。実質公債費
          比率ランキング分析の記事でも触れた通り、夕張市は
          2007年の財政破綻以降、巨額の負債返済を続けており、
          今回の統合スコアでもその特異な財政状況が、他の
          どの自治体とも隔絶した形ではっきりと表れました。
        </p>
      </div>

      <div style={box}>
        <h2>大都市の中では豊田市がトップ、京都市・高知市が下位</h2>

        <RankingBarChart
          items={bigTop5.map((c) => ({
            name: c.name,
            value: c.score,
            displayValue: c.score.toFixed(1),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16 }}>
          人口30万人以上の大都市に絞ると、愛知県豊田市が
          突出したスコア({bigTop5[0].score.toFixed(1)})で
          1位でした。自動車関連産業の集積による税収の強さが、
          財政力指数だけでなく自主財源比率・実質公債費比率
          など他の指標にも一貫して良い影響を与えていることが
          分かります。
        </p>

        <RankingBarChart
          items={bigBottom5.map((c) => ({
            name: c.name,
            value: c.score,
            displayValue: c.score.toFixed(1),
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16 }}>
          一方、大都市の中で下位に入ったのは京都市・旭川市・
          北九州市・長崎市・高知市でした。いずれも歴史の
          古い地方の中核都市で、人口減少や産業構造の転換に
          直面している都市が多いという共通点があります。

        </p>

        <PersonalNote>
          複数の財政指標を1つのスコアにまとめる作業をして
          改めて感じたのは、「財政が強い自治体」にも複数の
          パターンがあるということです。工業地帯や発電所を
          抱える小さな自治体の強さと、自動車産業のような
          裾野の広い産業を持つ大都市の強さは、同じ「財政力が
          高い」でも中身がまったく違います。行政の現場でも、
          単年の財政指標だけを見て自治体の状況を判断するのは
          危険で、複数の指標を組み合わせ、かつその背景にある
          産業構造まで見て初めて、実態に近い理解に近づけると
          感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>このスコアの限界</h2>

        <p>
          このスコアはあくまで4つの財政指標を統計的に
          統合した独自集計であり、公式な財政健全度の
          判定基準ではありません。また、Zスコアという
          性質上、全国の分布の中での「相対的な位置」を
          示すものであり、絶対的な財政の良し悪しを保証する
          ものではない点にご注意ください。人口規模が
          極端に小さい自治体は、特定の施設の有無で数値が
          大きく振れやすいため、参考値として捉えることを
          おすすめします。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：財政健全度スコアについてよくある質問</h2>

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
          4つの財政指標を統合した独自スコアからは、単一
          指標だけでは見えなかった自治体財政の全体像が
          見えてきました。飛島村・港区のような「財政的な
          勝ち組」にも複数のパターンがあり、夕張市の
          突出した厳しさは、どの角度から見ても揺るがない
          事実として改めて浮かび上がりました。個別の
          財政指標記事とあわせて読むことで、より立体的に
          自治体の財政を理解できます。
        </p>

        <p>
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/balance-ratio-analysis" style={link}>
            経常収支比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/debt-service-ratio-analysis" style={link}>
            実質公債費比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/tax-composition" style={link}>
            財政の中身分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-diversity-index" style={link}>
            産業の多様性指数(HHI)を見る
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
