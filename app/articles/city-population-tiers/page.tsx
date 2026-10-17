import Link from "next/link";
import { notFound } from "next/navigation";
import { isReleased, releaseDate } from "@/lib/release";

import ArticleLayout from "@/components/ArticleLayout";
import ClusterLinks from "@/components/ClusterLinks";
import JsonLd from "@/components/JsonLd";
import { isDesignatedCity } from "@/lib/designatedCities";
import { getMunicipalitiesPop, getCitiesPopWithTokyo23, isShi, shortName } from "@/lib/cityPopulation";

const TIERS = [
  { min: 1_000_000, label: "100万人以上", href: "/articles/million-cities" },
  { min: 500_000, label: "50万人以上", href: "/ranking/large-cities" },
  { min: 300_000, label: "30万人以上", href: isReleased("/ranking/mid-cities") ? "/ranking/mid-cities" : undefined },
  { min: 200_000, label: "20万人以上", href: undefined },
  { min: 100_000, label: "10万人以上", href: undefined },
  { min: 50_000, label: "5万人以上", href: undefined },
];

function getData() {
  const { rows, label, use2025 } = getMunicipalitiesPop();
  const shi = rows.filter((c) => isShi(c.name));
  const tokyo23 = getCitiesPopWithTokyo23().rows.find((c) => c.name === "東京都 特別区部");
  const counts = TIERS.map((t) => ({ ...t, shi: shi.filter((c) => c.population >= t.min) }));
  const sortedPop = shi.map((c) => c.population).sort((a, b) => a - b);
  const median = sortedPop[Math.floor(sortedPop.length / 2)];
  return { shi, counts, tokyo23, median, label, use2025 };
}

export function generateMetadata() {
  const { counts, shi, use2025 } = getData();
  const c = (min: number) => counts.find((x) => x.min === min)!.shi.length;
  return {
    alternates: { canonical: "/articles/city-population-tiers" },
    title: `人口規模別の都市一覧${use2025 ? "(2025年)" : ""}｜100万人以上${c(1_000_000)}市・50万人以上${c(500_000)}市・10万人以上${c(100_000)}市`,
    description: `全国${shi.length}市を人口規模で区切ると、100万人以上は${c(1_000_000)}市(東京23区を足すと${c(1_000_000) + 1})、50万人以上${c(500_000)}市、30万人以上${c(300_000)}市、20万人以上${c(200_000)}市、10万人以上${c(100_000)}市。政令指定都市・中核市・市の人口要件もあわせて整理しました。`,
  };
}

export default function Page() {
  // 予約公開(lib/release.ts)。日付が来るまでは 404
  if (!isReleased("/articles/city-population-tiers")) notFound();
  const { shi, counts, tokyo23, median, label, use2025 } = getData();
  const c = (min: number) => counts.find((x) => x.min === min)!.shi;
  const under50k = shi.length - c(50_000).length;
  const designated = shi.filter((x) => isDesignatedCity(x.name));
  const smallestDesignated = [...designated].sort((a, b) => a.population - b.population)[0];

  const faq = [
    {
      q: "人口100万人以上の市はいくつありますか？",
      a: `「市」だけで数えると${c(1_000_000).length}市です。東京都特別区部(23区の合計)を1つの都市として数えると${c(1_000_000).length + 1}都市になります(${label})。`,
    },
    {
      q: "政令指定都市・中核市になるには人口がいくら必要ですか？",
      a: "政令指定都市は法律上は人口50万人以上、中核市は人口20万人以上が要件です。ただし政令指定都市は人口だけで決まらず、実際の運用ではおおむね70万人以上が目安とされてきました。",
    },
    {
      q: "人口10万人以上の市は全国にいくつありますか？",
      a: `${c(100_000).length}市です(全${shi.length}市のうち${((c(100_000).length / shi.length) * 100).toFixed(0)}%。${label})。市の人口の中央値は約${(median / 10000).toFixed(1)}万人でした。`,
    },
  ];

  return (
    <ArticleLayout
      title={`人口規模別の都市一覧｜100万人・50万人・30万人・10万人以上は何市？`}
      summary={`全国${shi.length}市を人口で区切って数えました。100万人以上${c(1_000_000).length}市、50万人以上${c(500_000).length}市、30万人以上${c(300_000).length}市、10万人以上${c(100_000).length}市。市の約${((under50k / shi.length) * 100).toFixed(0)}%は人口5万人未満です。`}
      heroLabel="人口10万人以上の市"
      heroValue={`${c(100_000).length}市`}
      rankingLink={isReleased("/ranking/mid-cities") ? "/ranking/mid-cities" : "/ranking/large-cities"}
      path="/articles/city-population-tiers"
      tags={["population"]}
      publishedAt={releaseDate("/articles/city-population-tiers", "2026-10-15")}
      dataNote={`${label}(総務省統計局)。「市」のみ集計し、東京都特別区は含めていません。`}
      top3={[
        { rank: 1, name: "人口100万人以上", value: `${c(1_000_000).length}市` },
        { rank: 2, name: "人口50万人以上", value: `${c(500_000).length}市` },
        { rank: 3, name: "人口30万人以上", value: `${c(300_000).length}市` },
      ]}
    >
      <div style={box}>
        <h2>人口規模別の市の数</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>人口規模</th>
                <th style={thR}>市の数</th>
                <th style={thR}>全体に占める割合</th>
                <th style={th}>詳しい一覧</th>
              </tr>
            </thead>
            <tbody>
              {counts.map((t) => (
                <tr key={t.min}>
                  <td style={td}>{t.label}</td>
                  <td style={tdR}>{t.shi.length}市</td>
                  <td style={tdR}>{((t.shi.length / shi.length) * 100).toFixed(1)}%</td>
                  <td style={td}>
                    {t.href ? (
                      <Link prefetch={false} href={t.href} style={link}>
                        一覧を見る
                      </Link>
                    ) : (
                      "―"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tokyo23 && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
            東京都特別区部(23区の合計)の人口は{tokyo23.population.toLocaleString()}人です。特別区は「市」ではないため上の表には含めていません。
            特別区部を1つの都市として数える「100万人都市一覧」では、人口100万人以上は{c(1_000_000).length + 1}都市になります。
          </p>
        )}
      </div>

      <div style={box}>
        <h2>人口100万人以上の市({c(1_000_000).length}市)</h2>
        <p>{c(1_000_000).map((x) => shortName(x.name)).join("・")}</p>
        <h2>人口50万人台の市({c(500_000).length - c(1_000_000).length}市)</h2>
        <p>
          {c(500_000)
            .filter((x) => x.population < 1_000_000)
            .map((x) => shortName(x.name))
            .join("・")}
        </p>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          ここには人口50万〜100万人の市がすべて入っています。{smallestDesignated ? `政令指定都市の中で最も人口が少ないのは${shortName(smallestDesignated.name)}(${smallestDesignated.population.toLocaleString()}人)です。` : ""}
        </p>
      </div>

      <div style={box}>
        <h2>市・中核市・政令指定都市の人口要件</h2>
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>区分</th>
              <th style={th}>人口の要件(法律上)</th>
              <th style={th}>メモ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>市</td>
              <td style={td}>5万人以上(地方自治法)</td>
              <td style={td}>合併特例などで5万人未満の市もある</td>
            </tr>
            <tr>
              <td style={td}>中核市</td>
              <td style={td}>20万人以上</td>
              <td style={td}>2015年に要件が人口20万人以上に統一された</td>
            </tr>
            <tr>
              <td style={td}>政令指定都市</td>
              <td style={td}>50万人以上</td>
              <td style={td}>実際の運用では70万人程度以上が目安</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          {use2025 ? "令和7年国勢調査" : "国勢調査"}で見ると、市の人口の中央値は約{(median / 10000).toFixed(1)}万人、
          全{shi.length}市のうち人口5万人未満は{under50k}市です。要件を知ったうえで数字を見ると、
          「市」という名前から連想する規模と実際の人口にはかなり幅があることが分かります。
          {isReleased("/ranking/smallest-cities") && (
            <>
              人口が最も少ない側は
              <Link prefetch={false} href="/ranking/smallest-cities" style={link}>
                人口が少ない市ランキング
              </Link>
              で確認できます。
            </>
          )}
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

      <ClusterLinks current="/articles/city-population-tiers" />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
  lineHeight: 1.9,
};
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
