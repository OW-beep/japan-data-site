import Link from "next/link";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import { getCities } from "@/lib/getCities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/real-estate-price-analysis" },
  title: "不動産価格ランキング分析｜港区は天栄村の8,000倍、地価は人口密度と強く連動",
  description:
    "国土交通省「不動産情報ライブラリ」の実際の取引データで、市区町村別の土地・中古マンション価格を分析。地価と人口密度の相関係数は+0.83と非常に強い関係がありました。",
};

const MIN_SAMPLE = 10;

export default function Page() {
  const all = getRealEstatePriceRanking();
  const cities = getCities();
  const densityByCode = new Map(
    cities.map((c) => [c.code, c.populationDensity])
  );

  const landRanking = all
    .filter((c) => c.landPricePerSqm != null && c.landSampleSize >= MIN_SAMPLE)
    .sort((a, b) => (b.landPricePerSqm ?? 0) - (a.landPricePerSqm ?? 0));

  const condoRanking = all
    .filter(
      (c) => c.condoPricePerSqm != null && c.condoSampleSize >= MIN_SAMPLE
    )
    .sort((a, b) => (b.condoPricePerSqm ?? 0) - (a.condoPricePerSqm ?? 0));

  const top12Land = landRanking.slice(0, 12);
  const lowest = landRanking[landRanking.length - 1];
  const highest = landRanking[0];
  const ratio = (highest.landPricePerSqm ?? 0) / (lowest.landPricePerSqm ?? 1);

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

  const pairsForCorr = landRanking
    .map((c) => ({ price: c.landPricePerSqm as number, density: densityByCode.get(c.code) }))
    .filter((p) => p.density != null && p.density > 0) as {
    price: number;
    density: number;
  }[];

  const r = correlation(
    pairsForCorr.map((p) => Math.log10(p.price)),
    pairsForCorr.map((p) => Math.log10(p.density))
  );

  const suzu = landRanking.find((c) => c.name.includes("珠洲市"));

  const faq = [
    {
      q: "土地の価格が最も高い自治体はどこですか？",
      a: `${highest.name}で、平米単価は約${Math.round(
        (highest.landPricePerSqm ?? 0) / 10000
      ).toLocaleString()}万円/m²です。`,
    },
    {
      q: "土地の価格が最も安い自治体はどこですか？",
      a: `${lowest.name}で、平米単価は約${lowest.landPricePerSqm?.toLocaleString()}円/m²です。最も高い${
        highest.name
      }とは、約${Math.round(ratio).toLocaleString()}倍の差があります。`,
    },
    {
      q: "地価は人口密度と関係がありますか？",
      a: `対数変換した地価と人口密度の相関係数は+${r.toFixed(
        2
      )}で、非常に強い正の相関があります。土地が希少な人口密集地ほど地価が高くなるという、経済学的に自然な関係がデータでも裏付けられました。`,
    },
    {
      q: "このデータはどのくらいの取引件数をもとにしていますか？",
      a: `国土交通省「不動産情報ライブラリ」が公開する実際の取引価格情報(直近1年分)をもとに、市区町村ごとに平均しています。取引件数が${MIN_SAMPLE}件未満の自治体はランキングから除外しており、件数が少ない自治体ほど数値が特定の物件に左右されやすい点にはご注意ください。`,
    },
  ];

  return (
    <ArticleLayout
      title="不動産価格ランキング分析｜港区は天栄村の8,000倍"
      summary={`国土交通省「不動産情報ライブラリ」の実際の取引データで、市区町村別の土地価格を分析。最高値の${highest.name}と最安値の${lowest.name}では約${Math.round(
        ratio
      ).toLocaleString()}倍の差があり、地価と人口密度の相関係数は+${r.toFixed(2)}と非常に強い関係がありました。`}
      heroLabel="地価×人口密度 相関係数(対数)"
      heroValue={`+${r.toFixed(2)}`}
      rankingLink="/ranking/real-estate-price"
      path="/articles/real-estate-price-analysis"
      tags={["population"]}
      publishedAt="2026-09-14"
      top3={top12Land.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${Math.round((c.landPricePerSqm ?? 0) / 10000).toLocaleString()}万円/m²`,
      }))}
    >
      <div style={box}>
        <h2>地価TOP12(宅地・平米単価)</h2>

        <p>
          国土交通省「不動産情報ライブラリ」が公開する、実際の
          不動産取引価格情報(直近1年分)をもとに、市区町村別の
          宅地(土地)の平米単価を集計しました。
        </p>

        <RankingBarChart
          items={top12Land.map((c) => ({
            name: c.name,
            value: (c.landPricePerSqm ?? 0) / 10000,
            displayValue: `${Math.round(
              (c.landPricePerSqm ?? 0) / 10000
            ).toLocaleString()}万円/m²`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          1位の{highest.name}は平米あたり約
          {Math.round((highest.landPricePerSqm ?? 0) / 10000).toLocaleString()}
          万円。最も安い{lowest.name}(約
          {lowest.landPricePerSqm?.toLocaleString()}円/m²)とは、実に約
          {Math.round(ratio).toLocaleString()}倍の開きがあります。
        </p>
      </div>

      <div style={box}>
        <h2>地価は人口密度と強く連動する</h2>

        <p>
          地価(対数変換)と人口密度(対数変換)の相関係数を計算すると
          <strong>+{r.toFixed(2)}</strong>
          という、非常に強い正の相関が確認できました。土地が
          希少な人口密集地ほど地価が高くなるという、経済学的に
          自然な関係が、実際の取引データでもはっきり裏付けられた
          形です。これは「人口密度ランキング」と「不動産価格
          ランキング」の上位が、東京都心・大阪市心部を中心に
          大きく重なることからも分かります。
        </p>
      </div>

      <div style={box}>
        <h2>価格が安い地域にも、それぞれ事情がある</h2>

        <p>
          地価が安い自治体の中には、{suzu?.name}のように、令和6年
          能登半島地震で大きな被害を受けた地域も含まれています。
          震災後は住宅需要そのものが落ち込んでいることが、地価
          にも影響していると考えられます。地価の安さを単純に
          「不人気」と捉えるのではなく、その背景にある事情を
          あわせて見ることが大切です。
        </p>

        <p>
          一方で、単に人口が少なく取引自体が少ない自治体では、
          数件の特殊な取引だけで平均値が大きく振れることもある
          ため、取引件数が少ないランキング下位の数値は、参考
          程度に見るのがよいでしょう。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：不動産価格ランキングについてよくある質問</h2>

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
          実際の取引データから見えてきたのは、地価が人口密度と
          いう物理的な制約に強く規定されているという、ある意味で
          当たり前でありながら、データで裏付けるまでは断言
          できなかった事実です。中古マンション価格についても
          同様の傾向があり、都心部への集中がいかに強いかが
          分かります。
        </p>

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16 }}>
          出典：国土交通省「不動産情報ライブラリ」不動産価格
          (取引価格・成約価格)情報
        </p>

        <p>
          <Link href="/ranking/real-estate-price" style={link}>
            不動産価格ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/density" style={link}>
            人口密度ランキングを見る
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
