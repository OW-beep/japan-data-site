import type { Metadata } from "next";

import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";
import JsonLd from "../../../components/JsonLd";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import Link from "next/link";
import { getCorporateGrowthRanking } from "../../../lib/corporateRegistration";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/corporate-growth" },
  title: "新設法人 純増数ランキング｜市区町村別(直近12か月)",
  description:
    "国税庁「法人番号公表サイト」のデータをもとにした、市区町村別の新設法人純増数(新設-閉鎖)ランキング。直近12か月分の企業の勢いを比較できます。",
};

const MIN_POPULATION = 1000;

export default function Page() {
  const all = getCorporateGrowthRanking();

  const ranking = all
    .filter((c) => c.population != null && c.population >= MIN_POPULATION)
    .sort((a, b) => b.netGrowth - a.netGrowth)
    .slice(0, 100);

  const bottom20 = [...all]
    .filter((c) => c.population != null && c.population >= MIN_POPULATION)
    .sort((a, b) => a.netGrowth - b.netGrowth)
    .slice(0, 20);

  const faq = [
    {
      q: "新設法人の純増数が最も多い自治体はどこですか？",
      a: `${ranking[0].name}で、直近12か月の純増数は${ranking[0].netGrowth.toLocaleString()}件です(新設${ranking[0].newCount.toLocaleString()}件、閉鎖${ranking[0].closeCount.toLocaleString()}件)。`,
    },
    {
      q: "純増数がマイナス(純減)の自治体もありますか？",
      a: `あります。${bottom20[0].name}は純増${bottom20[0].netGrowth.toLocaleString()}件と、新設よりも閉鎖の方が多くなっています。`,
    },
    {
      q: "このデータの出典と算出方法は何ですか？",
      a: "国税庁「法人番号公表サイト」が公開する全件データ(設立登記法人のみ)をもとに、直近12か月間で新たに法人番号が指定された件数(新設)と、登記記録が閉鎖された件数(閉鎖)を市区町村ごとに集計し、その差を純増数としています。",
    },
  ];

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏢 新設法人 純増数ランキング(市区町村別)
      </h1>

      <DataAsOf />

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <p style={{ color: "var(--muted)", lineHeight: 1.9, margin: 0 }}>
          国税庁「法人番号公表サイト」のデータをもとにした、市区町村別の
          新設法人純増数(新設数-閉鎖数、直近12か月)です。単なる新設数
          ではなく、閉鎖数を差し引いた「実質的な企業の増減」を示します。
        </p>
      </div>

      <AdSense />

      <RankingInsightFAQ
        metricName="新設法人純増数"
        items={ranking.slice(0, 10).map((c) => ({
          name: c.name,
          displayValue: `${c.netGrowth.toLocaleString()}件`,
        }))}
        totalCount={ranking.length}
        topNote="新設法人数が閉鎖法人数を大きく上回っており、企業活動が活発な地域であることを示します。"
      />

      <div style={{ marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>自治体</th>
              <th style={th}>純増数</th>
              <th style={th}>新設</th>
              <th style={th}>閉鎖</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((c, i) => (
              <tr key={c.code}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.netGrowth.toLocaleString()}</td>
                <td style={td}>{c.newCount.toLocaleString()}</td>
                <td style={td}>{c.closeCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          padding: "20px 24px",
          marginTop: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          Q&amp;A：新設法人純増数ランキングについて
        </h2>

        {faq.map((item) => (
          <p key={item.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}

        <p style={{ marginTop: 12 }}>
          <Link
            href="/articles/corporate-growth-analysis"
            style={{ color: "var(--indigo)", textDecoration: "underline" }}
          >
            新設法人純増数の分析記事を読む →
          </Link>
        </p>
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

      <CompareCTA />
    </main>
  );
}

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
