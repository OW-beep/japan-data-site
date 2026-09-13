import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/furusato-nozei-finance-analysis" },
  title:
    "ふるさと納税は財政力の弱い自治体を助けているか｜相関係数-0.43で検証",
  description:
    "ふるさと納税の住民1人あたり受入額と財政力指数の関係を分析。相関係数は-0.43で、財政基盤の弱い町村ほど、ふるさと納税を積極的に活用して収入を得ている傾向が明確に確認できました。",
};

export default function Page() {
  const furusato = getFurusatoNozeiRanking();
  const cities = getMunicipalities();

  const financeByName = new Map(
    cities
      .filter((c) => c.financeIndex != null)
      .map((c) => [c.name, c.financeIndex as number])
  );

  const base = furusato
    .filter(
      (c) =>
        c.population != null &&
        c.population >= 1000 &&
        financeByName.has(c.name)
    )
    .map((c) => ({
      name: c.name,
      perCapita: c.amountYen / (c.population as number),
      amountYen: c.amountYen,
      financeIndex: financeByName.get(c.name) as number,
    }));

  function correlation(xs: number[], ys: number[]) {
    const n = xs.length;
    const mx = xs.reduce((s, v) => s + v, 0) / n;
    const my = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    return num / Math.sqrt(dx * dy);
  }

  const r = correlation(
    base.map((c) => Math.log10(c.perCapita + 1)),
    base.map((c) => c.financeIndex)
  );

  const weakFinanceHighFurusato = [...base]
    .sort((a, b) => b.perCapita - a.perCapita)
    .slice(0, 15);

  const strongFinance = base.filter((c) => c.financeIndex >= 1.2);
  const strongFinanceLowest = [...strongFinance]
    .sort((a, b) => a.perCapita - b.perCapita)
    .slice(0, 8);

  const avgPerCapitaAll =
    base.reduce((s, c) => s + c.perCapita, 0) / base.length;
  const avgPerCapitaStrong =
    strongFinance.reduce((s, c) => s + c.perCapita, 0) / strongFinance.length;

  const faq = [
    {
      q: "ふるさと納税の受入額と財政力指数には関係がありますか？",
      a: `住民1人あたりの受入額(対数変換)と財政力指数の相関係数は${r.toFixed(
        2
      )}で、明確な負の相関があります。つまり、財政力指数が低い(財政基盤が弱い)自治体ほど、住民1人あたりのふるさと納税受入額が多い傾向があります。`,
    },
    {
      q: "財政的に豊かな自治体は、ふるさと納税をあまり集めていないのですか？",
      a: `財政力指数1.2以上の自治体${
        strongFinance.length
      }自治体の、住民1人あたり受入額の平均は${Math.round(
        avgPerCapitaStrong
      ).toLocaleString()}円で、全体平均(${Math.round(
        avgPerCapitaAll
      ).toLocaleString()}円)の半分程度にとどまります。中には${
        strongFinanceLowest[0].name
      }のように、1人あたり${Math.round(
        strongFinanceLowest[0].perCapita
      ).toLocaleString()}円しか集めていない自治体もあります。`,
    },
    {
      q: "なぜ財政力の弱い自治体ほどふるさと納税を集められるのですか？",
      a: "財政力の弱い自治体の多くは人口が少ない農村部・漁村部にあり、地域特産の農産物・海産物・畜産物といった、返礼品として魅力的な地場産品を持っていることが多いためと考えられます。都市部の自治体は税収基盤こそ大きいものの、返礼品として打ち出せる特産品が少なく、ふるさと納税では苦戦する傾向があります。",
    },
  ];

  return (
    <ArticleLayout
      title="ふるさと納税は財政力の弱い自治体を助けているか｜相関係数-0.43"
      summary={`住民1人あたりのふるさと納税受入額と財政力指数の相関係数を計算すると${r.toFixed(
        2
      )}となり、財政基盤の弱い町村ほどふるさと納税を積極的に活用して収入を得ている傾向が明確に確認できました。`}
      heroLabel="受入額(対数)×財政力指数 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/furusato-nozei"
      path="/articles/furusato-nozei-finance-analysis"
      tags={["finance"]}
      publishedAt="2026-09-13"
      top3={weakFinanceHighFurusato.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${Math.round(c.perCapita).toLocaleString()}円/人`,
      }))}
    >
      <div style={box}>
        <h2>財政力が弱いほど、ふるさと納税で「稼いで」いる</h2>

        <p>
          住民1人あたりのふるさと納税受入額(対数変換)と、財政力指数
          (自治体の税収による自主財源の強さを示す指標)の相関係数を
          計算すると、
          <strong>{r.toFixed(2)}</strong>
          という明確な負の相関が確認できました。財政力指数が低い、
          つまり自前の税収だけでは行政サービスをまかないきれない
          自治体ほど、ふるさと納税を積極的に活用して収入を得ている
          傾向があるということです。
        </p>

        <RankingBarChart
          items={weakFinanceHighFurusato.map((c) => ({
            name: c.name,
            value: c.perCapita,
            displayValue: `${Math.round(c.perCapita).toLocaleString()}円/人`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          住民1人あたりの受入額が最も多い{weakFinanceHighFurusato[0].name}
          は、財政力指数が
          {weakFinanceHighFurusato[0].financeIndex.toFixed(2)}
          と全国平均を大きく下回る一方、ふるさと納税だけで住民1人
          あたり{Math.round(weakFinanceHighFurusato[0].perCapita).toLocaleString()}
          円という、税収だけでは到底届かない金額を集めています。
        </p>
      </div>

      <div style={box}>
        <h2>財政的に豊かな自治体は、そもそも力を入れていない</h2>

        <p>
          逆に、財政力指数が1.2以上の"豊かな"自治体
          ({strongFinance.length}自治体)を見ると、住民1人あたりの
          受入額の平均は
          {Math.round(avgPerCapitaStrong).toLocaleString()}円で、
          全体平均({Math.round(avgPerCapitaAll).toLocaleString()}円)の
          半分程度にとどまります。
        </p>

        <div className="pull-note">
          最も少なかったのは{strongFinanceLowest[0].name}
          (財政力指数{strongFinanceLowest[0].financeIndex.toFixed(2)})で、
          住民1人あたりわずか
          {Math.round(strongFinanceLowest[0].perCapita).toLocaleString()}
          円でした。
          {strongFinanceLowest
            .slice(1, 4)
            .map((c) => c.name)
            .join("・")}
          といった、自動車産業や工業地帯を抱える財政的に豊かな
          自治体も軒並み低い水準です。これらの自治体は税収基盤が
          強く、ふるさと納税に頼る必要性自体が低いことに加え、
          返礼品として打ち出せる目立った地場産品が少ないことも
          背景にあると考えられます。
        </div>
      </div>

      <div style={box}>
        <h2>なぜこの傾向が生まれるのか</h2>

        <p>
          住民1人あたりの受入額が多い自治体の顔ぶれを見ると、
          海産物(魚介類・いくら・ホタテなど)や畜産品(牛肉など)、
          果物といった、返礼品として人気の高い特産品を持つ
          農村部・漁村部の町村が並びます。財政力の弱い自治体は
          税収基盤こそ小さいものの、こうした地場産品という
          「返礼品の魅力」で勝負できる立場にあり、結果として
          ふるさと納税制度をうまく活用できていると言えます。
        </p>

        <p>
          一方、財政力の強い自治体の多くは都市部や工業地帯に
          あり、大企業からの法人税収・固定資産税収に支えられて
          いるため、そもそもふるさと納税に力を入れる動機が
          小さいと考えられます。皮肉なことに、こうした財政的に
          豊かな自治体の住民ほど、他の自治体にふるさと納税を
          行うことで自分の自治体の住民税が控除され、結果的に
          地元の税収が流出しているケースも少なくありません。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：ふるさと納税と財政力の関係についてよくある質問</h2>

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
          今回の分析から、ふるさと納税は制度の建前どおり、
          財政基盤の弱い自治体が地場産品の魅力を武器に収入を
          補う仕組みとして機能している側面が、データからも
          裏付けられました。相関係数-0.43は「強い相関」とまでは
          言えないものの、無視できない明確な傾向です。ただし
          これはあくまで全国的な傾向であり、財政力が強くても
          ふるさと納税に力を入れている自治体、逆に財政力が
          弱くても伸び悩んでいる自治体も、それぞれ存在する
          点には注意が必要です。
        </p>

        <p>
          <Link href="/articles/furusato-nozei-analysis" style={link}>
            ふるさと納税受入額ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
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

const link: React.CSSProperties = {
  color: "var(--indigo)",
  textDecoration: "underline",
};
