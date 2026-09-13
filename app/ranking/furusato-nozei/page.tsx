import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";
import JsonLd from "../../../components/JsonLd";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import Link from "next/link";
import { getFurusatoNozeiRanking } from "../../../lib/furusatoNozei";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/furusato-nozei" },
  title: "ふるさと納税 受入額ランキング｜市区町村別(令和7年度)",
  description:
    "総務省「ふるさと納税に関する現況調査結果」をもとにした、市区町村別のふるさと納税受入額ランキング(令和7年度)。人口1人あたりの受入額もあわせて掲載しています。",
};

export default function Page() {
  const all = getFurusatoNozeiRanking();

  const ranking = [...all]
    .sort((a, b) => b.amountYen - a.amountYen)
    .slice(0, 100);

  const perCapitaRanking = all
    .filter((c) => c.population != null && c.population >= 1000)
    .sort((a, b) => (b.amountPerCapita ?? 0) - (a.amountPerCapita ?? 0))
    .slice(0, 20);

  const total = all.reduce((s, c) => s + c.amountYen, 0);

  const faq = [
    {
      q: "ふるさと納税の受入額が最も多い市区町村はどこですか？",
      a: `${ranking[0].name}で、令和7年度の受入額は約${(
        ranking[0].amountYen / 100000000
      ).toFixed(1)}億円です。`,
    },
    {
      q: "人口1人あたりの受入額で見ると、どこが1位ですか？",
      a: `${perCapitaRanking[0].name}です。1人あたり約${Math.round(
        perCapitaRanking[0].amountPerCapita ?? 0
      ).toLocaleString()}円のふるさと納税を受け入れており、総額ベースの順位とは大きく異なる顔ぶれになります。`,
    },
    {
      q: "このデータの出典は何ですか？",
      a: "総務省 自治税務局市町村税課「ふるさと納税に関する現況調査結果」(令和8年度実施)の公表資料です。令和7年度(令和7年4月〜令和8年3月)の受入額決算見込みの数値を使用しています。",
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
        🎁 ふるさと納税 受入額ランキング(市区町村別)
      </h1>

      <DataAsOf />

      <MetricBox
        title="ふるさと納税 受入額"
        unit="円"
        definition="住民や企業が、応援したい自治体に寄附をする「ふるさと納税」制度における、各市区町村が実際に受け取った寄附金の総額です。"
        example={{
          name: ranking[0].name,
          value: `${(ranking[0].amountYen / 100000000).toFixed(1)}億円`,
        }}
        source={{
          sourceName:
            "総務省「ふるさと納税に関する現況調査結果(令和8年度実施)」",
          dataYear: "令和7年度(令和7年4月〜令和8年3月)決算見込み",
          scope: "全国1,741市区町村",
          notes:
            "受入額には返礼品の調達・送付費用等が含まれており、自治体の実質的な収入額とは異なります。",
        }}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="ふるさと納税受入額"
        items={ranking.slice(0, 10).map((c) => ({
          name: c.name,
          displayValue: `${(c.amountYen / 100000000).toFixed(1)}億円`,
        }))}
        totalCount={all.length}
        topNote="返礼品の魅力と寄附額の大きさで全国トップに立っています。"
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((c, i) => (
          <RankCard
            key={c.name}
            rank={i + 1}
            name={c.name}
            value={Math.round(c.amountYen / 10000)}
            unit="万円"
          />
        ))}
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          padding: "20px 24px",
          marginTop: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          人口1人あたりの受入額ランキング(人口1,000人以上)
        </h2>

        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          総額ランキングは人口の多い自治体が有利になりがちです。
          住民1人あたりで見ると、人口の少ない町村がどれだけ
          「稼いでいる」かが分かります。
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>自治体</th>
              <th style={th}>1人あたり</th>
              <th style={th}>総額</th>
            </tr>
          </thead>
          <tbody>
            {perCapitaRanking.map((c, i) => (
              <tr key={c.name}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>
                  {Math.round(c.amountPerCapita ?? 0).toLocaleString()}円
                </td>
                <td style={td}>
                  {(c.amountYen / 100000000).toFixed(1)}億円
                </td>
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
          Q&amp;A：ふるさと納税ランキングについて
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
            href="/articles/furusato-nozei-analysis"
            style={{ color: "var(--indigo)", textDecoration: "underline" }}
          >
            ふるさと納税の分析記事を読む →
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
