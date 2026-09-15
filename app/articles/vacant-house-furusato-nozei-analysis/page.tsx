import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/vacant-house-furusato-nozei-analysis" },
  title:
    "空き家率とふるさと納税の関係｜相関係数+0.37、ただし因果関係ではない",
  description:
    "空き家率とふるさと納税の住民1人あたり受入額の相関係数は+0.37。ただし人口規模を考慮した偏相関係数は+0.28まで下がり、因果関係ではなく共通要因による見かけ上の関係である可能性が高いことを検証しました。",
};

export default function Page() {
  const furusato = getFurusatoNozeiRanking();
  const cities = getMunicipalities();

  const vacantByName = new Map(
    cities
      .filter(
        (c) =>
          c.vacantHouseCount != null &&
          c.totalHousingCount != null &&
          c.totalHousingCount > 0
      )
      .map((c) => [
        c.name,
        ((c.vacantHouseCount as number) / (c.totalHousingCount as number)) *
          100,
      ])
  );

  const base = furusato
    .filter(
      (c) =>
        c.population != null && c.population >= 1000 && vacantByName.has(c.name)
    )
    .map((c) => ({
      name: c.name,
      perCapita: c.amountYen / (c.population as number),
      vacantRate: vacantByName.get(c.name) as number,
      population: c.population as number,
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
    base.map((c) => c.vacantRate),
    base.map((c) => Math.log10(c.perCapita + 1))
  );

  const logPop = base.map((c) => Math.log10(c.population));
  const vacArr = base.map((c) => c.vacantRate);
  const furArr = base.map((c) => Math.log10(c.perCapita + 1));
  const rVacPop = correlation(vacArr, logPop);
  const rFurPop = correlation(furArr, logPop);
  const rPartial =
    (r - rVacPop * rFurPop) /
    Math.sqrt((1 - rVacPop ** 2) * (1 - rFurPop ** 2));

  const top15 = [...base].sort((a, b) => b.vacantRate - a.vacantRate).slice(0, 15);

  const sortedByVacant = [...base].sort((a, b) => a.vacantRate - b.vacantRate);
  const bucketSize = Math.floor(sortedByVacant.length / 5);
  const low20 = sortedByVacant.slice(0, bucketSize);
  const high20 = sortedByVacant.slice(-bucketSize);
  const avgLow = low20.reduce((s, c) => s + c.perCapita, 0) / low20.length;
  const avgHigh = high20.reduce((s, c) => s + c.perCapita, 0) / high20.length;

  const karuizawa = base.find((c) => c.name.includes("軽井沢町"));
  const yubari = base.find((c) => c.name.includes("夕張市"));

  const faq = [
    {
      q: "空き家率とふるさと納税の受入額には関係がありますか？",
      a: `相関係数は+${r.toFixed(
        2
      )}で、正の相関が見られます。ただし、人口規模という共通要因の影響を取り除いた偏相関係数は${rPartial.toFixed(
        2
      )}まで下がるため、この関係の一部は「人口が少ない自治体ほど両方の数値が大きくなりやすい」という共通要因によるものです。`,
    },
    {
      q: "空き家率が高いことが、ふるさと納税を集める原因になっているのですか？",
      a: "そうとは言えません。相関関係は因果関係を意味しません。空き家率が高い自治体は、①別荘地のように知名度が高い、②過疎地のように財政基盤が弱く返礼品獲得に積極的、という異なる背景を持っていることが多く、これらの背景こそが受入額を左右している可能性が高いと考えられます。空き家そのものがふるさと納税の受入額を増やしているわけではありません。",
    },
    {
      q: "空き家率が高い自治体は、すべて過疎化が原因ですか？",
      a: "いいえ。空き家率が最も高い長野県軽井沢町(70.4%)は、別荘・セカンドハウスとして所有される住宅が多いために空き家率が高くなっている高級リゾート地です。一方、北海道夕張市のように、人口減少そのものが原因で空き家が増えている自治体もあり、同じ「空き家率が高い」でも背景は大きく異なります。",
    },
  ];

  return (
    <ArticleLayout
      title="空き家率とふるさと納税受入額の相関｜因果関係ではないことに注意"
      summary={`空き家率と住民1人あたりのふるさと納税受入額の相関係数は+${r.toFixed(
        2
      )}でした。ただし人口規模を考慮した偏相関係数は+${rPartial.toFixed(
        2
      )}まで下がり、単純な因果関係ではなく、人口規模という共通要因が背景にある可能性が高いことが分かりました。`}
      heroLabel="人口規模を調整した後の偏相関係数"
      heroValue={`+${rPartial.toFixed(2)}`}
      rankingLink="/ranking/furusato-nozei"
      path="/articles/vacant-house-furusato-nozei-analysis"
      tags={["population"]}
      publishedAt="2026-09-13"
      top3={top15.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `空き家率${c.vacantRate.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>空き家率が高いほど、受入額も多い</h2>

        <p>
          このサイトですでに公開している「空き家率」データと、
          先日追加した「ふるさと納税受入額」データを掛け合わせて
          みたところ、相関係数
          <strong>+{r.toFixed(2)}</strong>
          という、はっきりした正の相関が見つかりました。空き家率
          (対数変換した住民1人あたり受入額との相関)が高い自治体
          ほど、ふるさと納税を多く集めている傾向があります。
        </p>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.vacantRate,
            displayValue: `${c.vacantRate.toFixed(1)}%`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          空き家率が低い方から20%の自治体群では住民1人あたり平均
          約{Math.round(avgLow).toLocaleString()}円なのに対し、
          空き家率が高い方から20%の自治体群では約
          {Math.round(avgHigh).toLocaleString()}円と、約
          {(avgHigh / avgLow).toFixed(1)}倍の差がありました。
        </p>
      </div>

      <div style={box}>
        <h2>これは因果関係ではありません</h2>

        <p>
          先に結論から言うと、この相関関係は「空き家が多いこと」
          が「ふるさと納税を稼ぐ」原因になっている、というような
          直接の因果関係を示すものではありません。両方の指標が、
          共通の第三の要因によって同時に動いている可能性が高い
          ことが、詳しく調べると分かりました。
        </p>

        <p>
          最も疑わしい共通要因は「人口規模」です。人口(対数)と
          空き家率の相関係数は
          {rVacPop.toFixed(2)}
          、人口(対数)と住民1人あたり受入額の相関係数は
          {rFurPop.toFixed(2)}
          で、どちらも人口の小さい自治体ほど数値が大きくなる
          傾向があります。人口が少ない自治体ほど、①住宅の
          流通量が少なく空き家の比率が数字上大きくなりやすい
          こと、②1人あたりの受入額という「割り算」の分母が
          小さいため、少数の人気返礼品だけで数値が跳ね上がり
          やすいこと、の2つが同時に起きるため、見かけ上の相関が
          生まれやすい構造になっています。
        </p>

        <p>
          そこで、人口規模の影響を取り除いた「偏相関係数」を
          計算すると
          <strong>{rPartial.toFixed(2)}</strong>
          となりました。元の相関係数(+{r.toFixed(2)})より弱まっては
          いますが、ゼロにはならず、なお正の関連が残っています。
          つまり、人口規模だけでは説明しきれない部分があるものの、
          相関の少なくとも一部は「人口が少ない自治体ほど、
          空き家率も受入額(1人あたり)も大きくなりやすい」という
          共通要因によるものだと考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>同じ「空き家率が高い」でも、中身は正反対</h2>

        <p>
          人口規模という共通要因に加えて、空き家率が高い理由
          そのものが自治体によってまったく異なる点にも注意が
          必要です。
        </p>

        <div className="pull-note">
          <strong>パターン1・別荘地型</strong>
          <br />
          空き家率トップの{karuizawa?.name}(空き家率
          {karuizawa?.vacantRate.toFixed(1)}%)は、避暑地として
          有名な高級リゾート地です。空き家の多くは別荘・
          セカンドハウスとして所有されており、人口減少による
          「空き家問題」とは性質が異なります。それでも住民1人
          あたり{Math.round(karuizawa?.perCapita ?? 0).toLocaleString()}
          円のふるさと納税を集めていますが、これは「空き家が
          多いから」ではなく、全国的な知名度の高さが返礼品需要に
          つながっている、という別の経路だと考えるのが自然です。
        </div>

        <div className="pull-note">
          <strong>パターン2・過疎地型</strong>
          <br />
          一方、{yubari?.name}(空き家率{yubari?.vacantRate.toFixed(1)}%)
          は、かつて炭鉱で栄えた後、人口減少が続く自治体です。
          こちらは住民が減った結果、使われなくなった住宅が
          そのまま空き家になっているという、典型的な過疎地型の
          空き家です。財政再建団体としても知られるこの町も、
          住民1人あたり{Math.round(yubari?.perCapita ?? 0).toLocaleString()}
          円をふるさと納税で集めていますが、これも「空き家が
          原因」ではなく、財政基盤の弱さから返礼品獲得に力を
          入れざるを得ない事情があると見る方が妥当です。
        </div>

        <p>
          このように、空き家率と受入額はどちらも「人口減少」や
          「知名度」といった別の要因の"結果"として同時に現れて
          いるだけで、空き家率そのものがふるさと納税額を左右
          しているわけではないと考えるのが、データから読み取れる
          最も妥当な解釈です。
        </p>
      </div>


      <div style={box}>
        <h2>Q&amp;A：空き家率とふるさと納税の関係についてよくある質問</h2>

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
          空き家率とふるさと納税受入額の間には、見かけ上の正の
          相関がありました。しかし、人口規模という共通要因を
          考慮すると相関は弱まり、さらに「別荘地型」「過疎地型」
          という異なる背景が混在していることを踏まえると、
          「空き家が多いからふるさと納税を稼げる」という
          因果関係として読むのは誤りです。相関関係を見つけた
          ときほど、それが因果関係なのか、それとも共通の
          第三の要因による見かけ上の関係なのかを、一歩立ち
          止まって検証することが大切だと、今回の分析はあらためて
          示しています。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/vacant-house" style={link}>
            空き家率ランキングを見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/furusato-nozei-analysis" style={link}>
            ふるさと納税受入額ランキング分析を見る
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
