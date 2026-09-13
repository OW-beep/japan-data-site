import type { Metadata } from "next";

import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";
import JsonLd from "../../../components/JsonLd";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import Link from "next/link";
import { getCapitalElevationRanking } from "../../../lib/capitalElevation";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/capital-elevation" },
  title: "都道府県庁所在地 標高ランキング｜1位は長野市371.5m",
  description:
    "国土地理院のデータをもとにした、都道府県庁所在地の標高ランキング。1位は長野市の371.5m、最も低いのは長崎市の2.1mです。",
};

export default function Page() {
  const ranking = getCapitalElevationRanking();
  const average =
    ranking.reduce((s, c) => s + c.elevationM, 0) / ranking.length;

  const faq = [
    {
      q: "都道府県庁所在地で最も標高が高いのはどこですか？",
      a: `${ranking[0].pref}${ranking[0].city}で、標高${ranking[0].elevationM}mです。`,
    },
    {
      q: "都道府県庁所在地で最も標高が低いのはどこですか？",
      a: `${ranking[ranking.length - 1].pref}${
        ranking[ranking.length - 1].city
      }で、標高${ranking[ranking.length - 1].elevationM}mです。`,
    },
    {
      q: "このデータの出典は何ですか？",
      a: "国土地理院「都道府県の庁舎及び東西南北端点の経緯度(世界測地系)」に基づく数値です。約5m四方間隔の航空レーザ測量によるもので、誤差は0.3m以内とされています。",
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
        ⛰️ 都道府県庁所在地 標高ランキング
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
          国土地理院のデータに基づく、47都道府県庁所在地の標高一覧です。
          平均は{average.toFixed(1)}mですが、内陸の盆地に位置する県庁と、
          海に面した県庁とで、大きな差があります。
        </p>
      </div>

      <AdSense />

      <RankingInsightFAQ
        metricName="県庁所在地の標高"
        unitLabel="都道府県"
        items={ranking.map((c) => ({
          name: `${c.pref} ${c.city}`,
          displayValue: `${c.elevationM}m`,
        }))}
        topNote="内陸の盆地にあり、周囲を山に囲まれた立地が背景にあります。"
      />

      <div style={{ marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>都道府県</th>
              <th style={th}>県庁所在地</th>
              <th style={th}>標高</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((c, i) => (
              <tr key={c.pref}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{c.pref}</td>
                <td style={td}>{c.city}</td>
                <td style={td}>{c.elevationM}m</td>
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
          Q&amp;A：県庁所在地の標高について
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
            href="/articles/capital-elevation-analysis"
            style={{ color: "var(--indigo)", textDecoration: "underline" }}
          >
            標高ランキングの分析記事を読む →
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
