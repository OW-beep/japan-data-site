import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import AffiliateSlot from "@/components/AffiliateSlot";
import { getMunicipalities } from "@/lib/municipalities";
import { isDesignatedCity } from "@/lib/designatedCities";
import type { City } from "@/lib/City";

export const metadata = {
  alternates: { canonical: "/articles/designated-cities-comparison" },
  title:
    "政令指定都市20市の人口ランキング｜面積・人口密度・高齢化率で比べる",
  description:
    "政令指定都市20市を人口の多い順に一覧比較。人口だけでなく、面積・人口密度・高齢化率で並べ替えると、同じ「政令指定都市」でも都市の姿がまったく違うことが分かります。人口100万人に届かない都市はどこかも解説します。",
};

type Row = City & {
  aging: number | null;
};

function agingOf(c: City): number | null {
  if (c.elderlyPopulation == null || c.population <= 0) return null;
  return (c.elderlyPopulation / c.population) * 100;
}

export default function Page() {
  const all = getMunicipalities();

  const cities: Row[] = all
    .filter((c) => isDesignatedCity(c.name))
    .map((c) => ({ ...c, aging: agingOf(c) }))
    .sort((a, b) => b.population - a.population);

  if (cities.length < 3) return null;

  const shortName = (c: City) => c.name.split(" ").pop() ?? c.name;

  const over100 = cities.filter((c) => c.population >= 1_000_000);
  const under100 = cities.filter((c) => c.population < 1_000_000);

  const totalPop = cities.reduce((s, c) => s + c.population, 0);
  const nationalPop = all.reduce((s, c) => s + c.population, 0);
  const share = nationalPop > 0 ? (totalPop / nationalPop) * 100 : 0;

  const withAging = cities.filter((c) => c.aging != null) as (Row & {
    aging: number;
  })[];
  const agingSorted = [...withAging].sort((a, b) => b.aging - a.aging);
  const agingHigh = agingSorted[0];
  const agingLow = agingSorted[agingSorted.length - 1];

  const withDensity = cities.filter((c) => c.populationDensity != null);
  const densitySorted = [...withDensity].sort(
    (a, b) => (b.populationDensity ?? 0) - (a.populationDensity ?? 0)
  );
  const densityHigh = densitySorted[0];
  const densityLow = densitySorted[densitySorted.length - 1];

  const withArea = cities.filter((c) => c.area != null);
  const areaSorted = [...withArea].sort(
    (a, b) => (b.area ?? 0) - (a.area ?? 0)
  );
  const areaBig = areaSorted[0];
  const areaSmall = areaSorted[areaSorted.length - 1];

  const biggest = cities[0];
  const smallest = cities[cities.length - 1];
  const populationGap = smallest.population > 0
    ? biggest.population / smallest.population
    : null;

  // 人口50万人以上なのに政令指定都市ではない都市
  const notDesignated = all
    .filter((c) => c.population >= 500_000 && !isDesignatedCity(c.name))
    .sort((a, b) => b.population - a.population);

  // 「都市」として並べるのは市だけ。東京23区は市ではないので別に扱う
  const notDesignatedCities = notDesignated.filter((c) => c.name.trim().endsWith("市"));
  const notDesignatedWards = notDesignated.filter((c) => !c.name.trim().endsWith("市"));

  const faq = [
    {
      q: "政令指定都市は全国にいくつありますか？",
      a: `${cities.length}市です。人口の多い順に、${cities
        .slice(0, 5)
        .map(shortName)
        .join("、")}などが並びます。一覧はこの記事の表で確認できます。`,
    },
    {
      q: "政令指定都市になる条件は何ですか？",
      a: "地方自治法では人口50万人以上の市が対象と定められており、実際には総務大臣が政令で指定します。運用上はおおむね人口70万人以上が目安とされ、周辺市町村との合併などを経て指定を受ける例が多くなっています。",
    },
    {
      q: "政令指定都市でも人口100万人に届かない都市はありますか？",
      a:
        under100.length > 0
          ? `あります。このデータでは${under100.length}市が100万人未満で、${under100
              .map(shortName)
              .join("、")}が該当します。100万人以上は${over100.length}市です。`
          : "このデータでは、政令指定都市はすべて人口100万人以上です。",
    },
    {
      q: "政令指定都市の中で高齢化率が最も高い・低いのはどこですか？",
      a:
        agingHigh && agingLow
          ? `このデータでは、高齢化率が最も高いのは${shortName(agingHigh)}(${agingHigh.aging.toFixed(1)}%)、最も低いのは${shortName(agingLow)}(${agingLow.aging.toFixed(1)}%)です。`
          : "高齢化率のデータを確認できませんでした。",
    },
    {
      q: "人口が50万人以上でも政令指定都市ではない都市はありますか？",
      a:
        notDesignatedCities.length > 0
          ? `あります。このデータでは${notDesignatedCities
              .map(shortName)
              .join("、")}が該当します。人口が多いことは指定の必要条件の一つですが、それだけで指定されるわけではありません。${
              notDesignatedWards.length > 0
                ? "東京都の特別区にも人口50万人以上の区がありますが、特別区は市ではないため、指定の対象外です。"
                : ""
            }`
          : "このデータでは、人口50万人以上の市はすべて政令指定都市です。",
    },
  ];

  return (
    <ArticleLayout
      title={`政令指定都市${cities.length}市の人口ランキング｜面積・人口密度・高齢化率で比べる`}
      summary={`政令指定都市${cities.length}市を人口の多い順に並べ、面積・人口密度・高齢化率で比較しました。同じ「政令指定都市」でも、人口は最大の${shortName(biggest)}と最小の${shortName(smallest)}で大きく違い、都市の姿も指標ごとに入れ替わります。`}
      heroLabel="政令指定都市の数"
      heroValue={`${cities.length}市`}
      rankingLink="/ranking/large-cities"
      path="/articles/designated-cities-comparison"
      tags={["population", "aging", "geography"]}
      publishedAt="2026-09-30"
      top3={cities.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${c.population.toLocaleString()}人`,
      }))}
    >
      <div style={box}>
        <h2>政令指定都市の人口ランキング</h2>

        <RankingBarChart
          items={cities.map((c) => ({
            name: c.name,
            value: c.population,
            displayValue: `${c.population.toLocaleString()}人`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>基本データ</h2>

        <ul>
          <li>政令指定都市の数:{cities.length}市</li>
          <li>合計人口:{totalPop.toLocaleString()}人(全国の市区町村人口の約{share.toFixed(0)}%)</li>
          <li>
            人口100万人以上:{over100.length}市、100万人未満:{under100.length}市
          </li>
          <li>
            最大:{biggest.name}({biggest.population.toLocaleString()}人)
          </li>
          <li>
            最小:{smallest.name}({smallest.population.toLocaleString()}人)
            {populationGap != null
              ? `、最大は最小の約${populationGap.toFixed(1)}倍`
              : ""}
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>20市を4つの指標で一覧比較</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都市</th>
                <th style={thNum}>人口(人)</th>
                <th style={thNum}>面積(km²)</th>
                <th style={thNum}>人口密度(人/km²)</th>
                <th style={thNum}>高齢化率</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                  <td style={tdNum}>{c.population.toLocaleString()}</td>
                  <td style={tdNum}>
                    {c.area != null
                      ? c.area.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })
                      : "―"}
                  </td>
                  <td style={tdNum}>
                    {c.populationDensity != null
                      ? Math.round(c.populationDensity).toLocaleString()
                      : "―"}
                  </td>
                  <td style={tdNum}>
                    {c.aging != null ? `${c.aging.toFixed(1)}%` : "―"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>指標を変えると、都市の顔ぶれが入れ替わる</h2>

        <p>
          人口の順位だけを見ると{shortName(biggest)}が突出していますが、
          面積・人口密度・高齢化率で並べ替えると、上位に来る都市はまったく別の
          顔ぶれになります。
        </p>

        <ul>
          {areaBig && areaSmall && (
            <li>
              面積:最も広いのは{shortName(areaBig)}(
              {(areaBig.area ?? 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}km²)、
              最も狭いのは{shortName(areaSmall)}(
              {(areaSmall.area ?? 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}km²)です。
            </li>
          )}
          {densityHigh && densityLow && (
            <li>
              人口密度:最も高いのは{shortName(densityHigh)}(
              {Math.round(densityHigh.populationDensity ?? 0).toLocaleString()}人/km²)、
              最も低いのは{shortName(densityLow)}(
              {Math.round(densityLow.populationDensity ?? 0).toLocaleString()}人/km²)です。
            </li>
          )}
          {agingHigh && agingLow && (
            <li>
              高齢化率:最も高いのは{shortName(agingHigh)}({agingHigh.aging.toFixed(1)}%)、
              最も低いのは{shortName(agingLow)}({agingLow.aging.toFixed(1)}%)です。
            </li>
          )}
        </ul>

        <p>
          政令指定都市は「人口の多い大都市」という共通のイメージで語られがちですが、
          市域に広大な山間部や農地を含む都市と、市域が狭く人口が密集している都市では、
          暮らしや行政サービスの課題が大きく異なります。同じ枠組みの中でも、
          都市の実態には大きな幅があります。
        </p>
      </div>

      {withAging.length > 0 && (
        <div style={box}>
          <h2>高齢化率の高い順に並べると</h2>

          <RankingBarChart
            items={agingSorted.map((c) => ({
              name: c.name,
              value: c.aging,
              displayValue: `${c.aging.toFixed(1)}%`,
            }))}
            barColor="#b45309"
          />

          <p style={{ marginTop: 16, color: "#4b5563" }}>
            高齢化率は65歳以上人口が総人口に占める割合です。全国の自治体別の順位は
            <Link prefetch={false} href="/ranking/aging" style={link}>
              高齢化率ランキング
            </Link>
            で確認できます。
          </p>
        </div>
      )}

      <div style={box}>
        <h2>政令指定都市とは？条件と「区」の仕組み</h2>

        <p>
          政令指定都市は、地方自治法で「人口50万人以上」の市を対象に政令で指定される
          制度です。指定を受けると、児童福祉や保健衛生、都市計画など、本来は都道府県が
          担う事務の一部を市が処理できるようになります。あわせて市内に行政区が
          設けられ、区役所が住民サービスの窓口になります。
        </p>

        <p>
          法律上の要件は50万人以上ですが、運用上はおおむね70万人以上が目安と
          されています。そのため、指定を受けた都市は、この記事の表のとおり、
          人口の大きな都市が中心です。一方で、「政令指定都市=人口100万人以上」ではなく、
          {under100.length > 0
            ? `${under100.map(shortName).join("、")}のように100万人に届いていない都市もあります。`
            : "現時点ではすべて100万人を超えています。"}
          100万人以上の都市だけを知りたい方は、
          <Link prefetch={false} href="/articles/million-cities" style={link}>
            100万人都市の一覧
          </Link>
          をご覧ください。
        </p>

        {notDesignatedCities.length > 0 && (
          <p>
            反対に、人口50万人以上でも政令指定都市ではない市もあります(
            {notDesignatedCities.map(shortName).join("、")})。
            {notDesignatedWards.length > 0
              ? "東京都の特別区にも人口50万人以上の区がありますが、特別区は市ではないため、指定の対象外です。"
              : ""}
            50万人以上の都市を指定の有無にかかわらず並べた一覧は、
            <Link prefetch={false} href="/ranking/large-cities" style={link}>
              人口50万人以上の都市ランキング
            </Link>
            にまとめています。
          </p>
        )}
      </div>

      <div style={box}>
        <h2>Q&amp;A：政令指定都市についてよくある質問</h2>

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
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          政令指定都市{cities.length}市は、合計で全国の市区町村人口の約
          {share.toFixed(0)}%を占めます。人口の規模だけでなく、面積・人口密度・
          高齢化率で見ると、都市ごとの違いがはっきり表れます。気になる都市は、
          比較ページで他の自治体と並べて確認できます。
        </p>

        <p>
          <Link prefetch={false} href="/articles/near-million-cities" style={link}>
            人口90万人・80万人都市一覧
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            人口ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/density" style={link}>
            人口密度ランキング
          </Link>
        </p>

        <CompareCTA />
      </div>

      <AffiliateSlot topic="moving" />
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

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const thNum: React.CSSProperties = { ...th, textAlign: "right" };

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};

const tdNum: React.CSSProperties = { ...td, textAlign: "right" };

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
