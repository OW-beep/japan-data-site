import type { Metadata } from "next";

import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";
import JsonLd from "../../../components/JsonLd";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import Link from "next/link";
import { getRealEstatePriceRanking } from "../../../lib/realEstatePrice";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/real-estate-price" },
  title: "不動産価格ランキング｜市区町村別の実勢価格(土地・中古マンション)",
  description:
    "国土交通省「不動産情報ライブラリ」の実際の取引データをもとにした、市区町村別の不動産価格ランキング。宅地(土地)と中古マンションの平米単価を掲載しています。",
};

// サンプル数が少なすぎるランキングはノイズが大きいため、
// 最低限の取引件数がある自治体のみをランキング対象にする。
const MIN_SAMPLE = 10;

export default function Page() {
  const all = getRealEstatePriceRanking();

  const landRanking = all
    .filter((c) => c.landPricePerSqm != null && c.landSampleSize >= MIN_SAMPLE)
    .sort((a, b) => (b.landPricePerSqm ?? 0) - (a.landPricePerSqm ?? 0))
    .slice(0, 50);

  const condoRanking = all
    .filter(
      (c) => c.condoPricePerSqm != null && c.condoSampleSize >= MIN_SAMPLE
    )
    .sort((a, b) => (b.condoPricePerSqm ?? 0) - (a.condoPricePerSqm ?? 0))
    .slice(0, 50);

  const faq = [
    {
      q: "土地の価格が最も高い自治体はどこですか？",
      a: `${landRanking[0].name}で、平米単価は約${Math.round(
        (landRanking[0].landPricePerSqm ?? 0) / 10000
      ).toLocaleString()}万円/m²です。`,
    },
    {
      q: "中古マンションの価格が最も高い自治体はどこですか？",
      a: `${condoRanking[0].name}で、平米単価は約${Math.round(
        (condoRanking[0].condoPricePerSqm ?? 0) / 10000
      ).toLocaleString()}万円/m²です。`,
    },
    {
      q: "このデータの出典と算出方法は何ですか？",
      a: `国土交通省「不動産情報ライブラリ」が公開する、実際の不動産取引価格情報(直近1年分)をもとに、市区町村ごとの平米単価を平均して算出しています。取引件数が${MIN_SAMPLE}件未満の自治体は、数値が不安定になるためランキングから除外しています。`,
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
        🏠 不動産価格ランキング(市区町村別)
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
          国土交通省「不動産情報ライブラリ」の実際の取引データをもとにした、
          市区町村別の不動産価格(平米単価)です。宅地(土地)と中古マンションの
          2種類を掲載しています。
        </p>
      </div>

      <AdSense />

      <h2 style={{ fontSize: 22, marginTop: 24, marginBottom: 12 }}>
        宅地(土地)の平米単価 TOP50
      </h2>

      <RankingInsightFAQ
        metricName="宅地(土地)の平米単価"
        items={landRanking.slice(0, 10).map((c) => ({
          name: c.name,
          displayValue: `${Math.round(
            (c.landPricePerSqm ?? 0) / 10000
          ).toLocaleString()}万円/m²`,
        }))}
        totalCount={landRanking.length}
      />

      <div style={{ marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>自治体</th>
              <th style={th}>平米単価</th>
              <th style={th}>取引件数</th>
            </tr>
          </thead>
          <tbody>
            {landRanking.map((c, i) => (
              <tr key={c.code}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>
                  {Math.round((c.landPricePerSqm ?? 0) / 10000).toLocaleString()}
                  万円
                </td>
                <td style={td}>{c.landSampleSize}件</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>
        中古マンションの平米単価 TOP50
      </h2>

      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>自治体</th>
              <th style={th}>平米単価</th>
              <th style={th}>取引件数</th>
            </tr>
          </thead>
          <tbody>
            {condoRanking.map((c, i) => (
              <tr key={c.code}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>
                  {Math.round(
                    (c.condoPricePerSqm ?? 0) / 10000
                  ).toLocaleString()}
                  万円
                </td>
                <td style={td}>{c.condoSampleSize}件</td>
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
          Q&amp;A：不動産価格ランキングについて
        </h2>

        {faq.map((item) => (
          <p key={item.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}

        <p style={{ marginTop: 12 }}>
          <Link prefetch={false}
            href="/articles/real-estate-price-analysis"
            style={{ color: "var(--indigo)", textDecoration: "underline" }}
          >
            不動産価格の分析記事を読む →
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
