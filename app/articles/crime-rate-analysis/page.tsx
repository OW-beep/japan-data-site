import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import { getPrefectureStats } from "@/lib/prefectureStats";
import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/crime-rate-analysis" },
  title: "刑法犯認知件数ランキング分析｜大阪府が突出、都市化との関係を検証",
  description:
    "都道府県別の刑法犯認知件数(人口千人あたり)を分析。大阪府が全国最多で、人口密度との相関係数は0.43。都市化が進むほど犯罪機会も増える傾向を、本サイトの人口密度データと掛け合わせて検証します。",
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
    (r) => r.stats.crimeRate != null
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
      crimeRate: r.stats.crimeRate ?? 0,
      year: r.stats.crimeRateYear,
      density: (popTotal.get(r.pref) ?? 0) / (areaTotal.get(r.pref) ?? 1),
    }));

  const densities = merged.map((m) => m.density);
  const crimes = merged.map((m) => m.crimeRate);
  const correlation = corr(densities, crimes);

  const ranked = [...merged].sort((a, b) => b.crimeRate - a.crimeRate);
  const top10 = ranked.slice(0, 10);
  const bottom5 = ranked.slice(-5).reverse();

  const year = top10[0]?.year?.slice(0, 4);

  const faq = [
    {
      q: "刑法犯認知件数(人口千人あたり)が最も多い都道府県はどこですか？",
      a: `大阪府(${top10[0].crimeRate})です。2位の群馬県、3位の茨城県を大きく引き離しています。`,
    },
    {
      q: "犯罪率は人口密度と関係がありますか？",
      a: `一定の相関があります。相関係数は${correlation.toFixed(
        2
      )}で、人口密度が高い(都市化が進んでいる)都道府県ほど犯罪率も高い傾向が見られました。人や物が集まる都市部ほど、犯罪の機会自体が増えやすいという一般的な傾向を裏付けています。`,
    },
    {
      q: "犯罪率が最も低い都道府県はどこですか？",
      a: `岩手県(${bottom5[0].crimeRate})です。秋田県・山形県など、東北地方の県が下位に並んでいます。`,
    },
  ];

  return (
    <ArticleLayout
      title="刑法犯認知件数ランキング分析：大阪府が突出、都市化との関係を検証"
      summary={`都道府県別の刑法犯認知件数(人口千人あたり)を分析すると、大阪府が全国最多の${top10[0].crimeRate}でした。人口密度との相関係数は${correlation.toFixed(
        2
      )}で、都市化が進むほど犯罪率も高くなる傾向が見られました。`}
      heroLabel="刑法犯認知件数 全国1位"
      heroValue={`${top10[0].pref} ${top10[0].crimeRate}`}
      rankingLink="/ranking/crime-rate"
      path="/articles/crime-rate-analysis"
      tags={["population"]}
      publishedAt="2026-09-03"
      top3={[
        { rank: 1, name: top10[0].pref, value: `${top10[0].crimeRate}` },
        { rank: 2, name: top10[1].pref, value: `${top10[1].crimeRate}` },
        { rank: 3, name: top10[2].pref, value: `${top10[2].crimeRate}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          総務省「社会・人口統計体系」({year}年度)をもとに、
          都道府県別の刑法犯認知件数(人口千人あたり)を
          分析しました。この統計を、本サイトが持つ市区町村
          単位の人口密度データと掛け合わせることで、犯罪率と
          都市化の関係を検証します。
        </p>
      </div>

      <div style={box}>
        <h2>大阪府が突出、上位は都市部・関東周辺に集中</h2>

        <p>
          1位は大阪府({top10[0].crimeRate})で、2位の群馬県
          ({top10[1].crimeRate})、3位の茨城県
          ({top10[2].crimeRate})を大きく引き離しています。
          上位には埼玉県・兵庫県など、大都市圏に含まれる、
          または隣接する都道府県が目立ちます。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度との相関は中程度</h2>

        <p>
          都道府県内の人口密度(市区町村データを集計)と
          犯罪率の相関係数は{correlation.toFixed(2)}でした。
          明確な相関ではあるものの、完全に一致するわけでは
          ありません。群馬県・茨城県のように、人口密度が
          突出して高いわけではないのに犯罪率が上位に入る
          県もあり、都市化以外の要因(幹線道路沿いの広域
          からの人の流入など)も影響していると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>犯罪率が低いのは東北地方</h2>

        <p>
          下位には岩手県({bottom5[0].crimeRate})・
          秋田県・山形県など、東北地方の県が並びます。
          地方ブロック格差レポートで見た、東北地方の
          人口密度の低さ・都市化の度合いの低さと、
          今回の犯罪率の低さは、方向性が一致しています。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          刑法犯認知件数は、犯罪の発生件数そのものであり、
          住民の体感治安や、検挙率とは別の指標です。また
          都道府県単位のデータのため、同じ県内でも都市部と
          郊外で実際の治安には大きな差がある可能性が
          あります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：犯罪率ランキングについてよくある質問</h2>

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
          犯罪率は都市化との一定の相関が確認できましたが、
          完全に説明できるものではなく、地域ごとの個別
          事情も影響しています。平均年収ランキング分析の
          記事とあわせて読むことで、経済活動の活発さと
          治安の関係もより立体的に見えてきます。
        </p>

        <p>
          <Link href="/ranking/crime-rate" style={link}>
            刑法犯認知件数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/prefecture-income-analysis" style={link}>
            都道府県別平均年収ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/traffic-accident-analysis" style={link}>
            交通事故発生件数ランキング分析を見る
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
