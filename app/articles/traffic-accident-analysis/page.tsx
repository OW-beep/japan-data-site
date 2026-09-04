import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import { getPrefectureStats } from "@/lib/prefectureStats";
import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/traffic-accident-analysis" },
  title: "交通事故発生件数ランキング分析｜「田舎は車社会だから事故が多い」は誤解だった",
  description:
    "都道府県別の交通事故発生件数(人口10万人あたり)を分析。静岡県・群馬県が上位の一方、人口密度との相関係数はわずか0.12。「車社会の田舎ほど事故が多い」という直感は、データでは裏付けられませんでした。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return cov / (sx * sy);
}

export default function Page() {
  const prefStats = getPrefectureStats().filter(
    (r) => r.stats.trafficAccidentRate != null
  );

  const cityBase = getMunicipalities().filter(
    (c) => c.population >= 3000 && c.populationDensity != null && c.area
  );
  const areaTotal = new Map<string, number>();
  const popTotal = new Map<string, number>();
  cityBase.forEach((c) => {
    const pref = c.name.split(" ")[0];
    areaTotal.set(pref, (areaTotal.get(pref) ?? 0) + (c.area ?? 0));
    popTotal.set(pref, (popTotal.get(pref) ?? 0) + c.population);
  });

  const merged = prefStats
    .filter((r) => areaTotal.has(r.pref))
    .map((r) => ({
      pref: r.pref,
      rate: r.stats.trafficAccidentRate ?? 0,
      year: r.stats.trafficAccidentRateYear,
      density: (popTotal.get(r.pref) ?? 0) / (areaTotal.get(r.pref) ?? 1),
    }));

  const densities = merged.map((m) => m.density);
  const rates = merged.map((m) => m.rate);
  const correlation = corr(densities, rates);

  const ranked = [...merged].sort((a, b) => b.rate - a.rate);
  const top10 = ranked.slice(0, 10);
  const bottom5 = ranked.slice(-5).reverse();

  const top10AvgDensity =
    top10.reduce((s, m) => s + m.density, 0) / top10.length;
  const bottom5AvgDensity =
    bottom5.reduce((s, m) => s + m.density, 0) / bottom5.length;

  const year = top10[0]?.year?.slice(0, 4);

  const faq = [
    {
      q: "交通事故発生件数(人口10万人あたり)が最も多い都道府県はどこですか？",
      a: `静岡県(${top10[0].rate})です。2位の群馬県、3位の福岡県が続きます。`,
    },
    {
      q: "「車社会の田舎ほど交通事故が多い」というのは本当ですか？",
      a: `データからは裏付けられませんでした。人口密度と交通事故率の相関係数はわずか${correlation.toFixed(
        2
      )}で、ほとんど無関係です。上位10都道府県の平均人口密度(${Math.round(
        top10AvgDensity
      )}人/km²)と、下位5県の平均(${Math.round(
        bottom5AvgDensity
      )}人/km²)を比べても、明確な傾向差はありません。`,
    },
    {
      q: "交通事故が少ない都道府県はどこですか？",
      a: `島根県(${bottom5[0].rate})が最も少なく、秋田県・鳥取県・岩手県・新潟県が続きます。`,
    },
  ];

  return (
    <ArticleLayout
      title="交通事故発生件数ランキング分析：「田舎は車社会だから事故が多い」は誤解だった"
      summary={`都道府県別の交通事故発生件数(人口10万人あたり)を分析すると、静岡県が全国最多の${top10[0].rate}件でした。「車社会の田舎ほど事故が多い」という直感を検証するため人口密度との相関を調べたところ、相関係数はわずか${correlation.toFixed(
        2
      )}で、ほぼ無関係という結果になりました。`}
      heroLabel="交通事故発生件数 全国1位"
      heroValue={`${top10[0].pref} ${top10[0].rate}`}
      rankingLink="/ranking/traffic-accident-rate"
      path="/articles/traffic-accident-analysis"
      tags={["population"]}
      publishedAt="2026-09-03"
      top3={[
        { rank: 1, name: top10[0].pref, value: `${top10[0].rate}` },
        { rank: 2, name: top10[1].pref, value: `${top10[1].rate}` },
        { rank: 3, name: top10[2].pref, value: `${top10[2].rate}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          総務省「社会・人口統計体系」({year}年度)をもとに、
          都道府県別の交通事故発生件数(人口10万人あたり)を
          分析しました。「公共交通機関が少ない地方ほど、
          車に頼らざるを得ず事故が多いのではないか」という
          仮説を、本サイトの人口密度データと掛け合わせて
          検証しました。
        </p>
      </div>

      <div style={box}>
        <h2>1位は静岡県、上位に人口密集地も過疎県も混在</h2>

        <p>
          1位は静岡県({top10[0].rate}件)、2位は群馬県
          ({top10[1].rate}件)でした。3位の福岡県、5位の
          愛知県のように人口密度が比較的高い都道府県が
          入る一方、群馬県・佐賀県のように人口密度が
          さほど高くない県も同じ上位グループに入っています。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度とはほぼ無関係という意外な結果</h2>

        <p>
          人口密度と交通事故率の相関係数はわずか
          {correlation.toFixed(2)}でした。犯罪率ランキング
          分析の記事で見た人口密度との相関(0.43)と比べても、
          はるかに弱い関係です。上位10都道府県の平均人口
          密度は{Math.round(top10AvgDensity)}人/km²、
          下位5県の平均は{Math.round(bottom5AvgDensity)}
          人/km²で、大きな差はありません。「車社会の田舎
          ほど事故が多い」という直感的なイメージは、少なくとも
          都道府県単位のデータでは裏付けられませんでした。
        </p>

        <p>
          これは、交通事故の発生に人口密度以上に影響する
          別の要因(道路の構造、幹線道路の交通量、気候・
          積雪、運転免許保有率など)があることを示唆して
          います。単純に「都会か田舎か」で交通安全を語る
          ことはできないようです。
        </p>
      </div>

      <div style={box}>
        <h2>交通事故が少ないのは島根県・秋田県などの日本海側</h2>

        <p>
          下位には島根県({bottom5[0].rate}件)・秋田県・
          鳥取県・岩手県・新潟県と、日本海側や東北の県が
          並びます。これらの県は人口密度は低いものの、
          交通量そのものが少ないことが、事故件数の少なさに
          つながっている可能性があります。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          交通事故発生件数は人口10万人あたりで算出されて
          いますが、実際の事故リスクは走行距離や交通量に
          対する割合で見る方が適切な場合もあります。また
          都道府県単位のデータのため、県内でも幹線道路
          沿いと山間部では実際の事故リスクが大きく異なる
          可能性があります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：交通事故発生件数ランキングについてよくある質問</h2>

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
          交通事故発生件数は、犯罪率とは異なり人口密度との
          関係がほとんど見られませんでした。都道府県別
          平均年収ランキング分析の記事で紹介した通り、
          静岡県は「稼げて治安も良いが事故はワースト1位」
          という多面的な結果になっています。1つの指標だけで
          地域を評価しないことの大切さが、ここでもあらためて
          確認できました。
        </p>

        <p>
          <Link href="/ranking/traffic-accident-rate" style={link}>
            交通事故発生件数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/crime-rate-analysis" style={link}>
            刑法犯認知件数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/prefecture-income-analysis" style={link}>
            都道府県別平均年収ランキング分析を見る
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
