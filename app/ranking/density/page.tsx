import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DensitySummary from "../../../components/ranking/DensitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import CompareCTA from "../../../components/CompareCTA";
import JsonLd from "../../../components/JsonLd";
import Link from "next/link";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/density" },
  title: "全国自治体 人口密度ランキング",
  description:
    "全国自治体の人口密度(1平方キロメートルあたりの人口)をランキング形式で比較。都市部の過密と地方の過疎の差がわかります。",
};

export default function Page() {
  const fullRanking = getMunicipalities()
    .filter((c) => c.populationDensity != null)
    .sort(
      (a, b) =>
        (b.populationDensity ?? 0) -
        (a.populationDensity ?? 0)
    );

  const ranking = fullRanking.slice(0, 50);

  const lowest = fullRanking[fullRanking.length - 1];
  const average =
    fullRanking.reduce((s, c) => s + (c.populationDensity ?? 0), 0) /
    fullRanking.length;

  const faq = [
    {
      q: "人口密度が最も高い自治体はどこですか？",
      a: `${ranking[0]?.name}で、1平方キロメートルあたり${(
        ranking[0]?.populationDensity ?? 0
      ).toLocaleString()}人です。全国平均(${Math.round(
        average
      ).toLocaleString()}人/km²)を大きく上回っており、東京都特別区や近隣の都市部が上位を独占しています。`,
    },
    {
      q: "人口密度が最も低い自治体はどこですか？",
      a: `${lowest?.name}で、1平方キロメートルあたり${(
        lowest?.populationDensity ?? 0
      ).toLocaleString()}人です。北海道や山間部、離島の自治体が下位に多く並びます。`,
    },
    {
      q: "人口密度ランキングは何自治体を対象にしていますか？",
      a: `全国${fullRanking.length.toLocaleString()}自治体(政令指定都市の区・東京都特別区部の集計行を除く)を対象に、人口密度が高い順にランキング化しています。`,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        🏙️ 人口密度ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/density-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eff6ff",
          color: "#1d4ed8",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 なぜ東京都特別区が上位を独占するのか、分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人/km²"
        definition="人口密度は1平方キロメートルあたりの人口です。"
        formula="人口密度 = 人口 ÷ 面積"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.populationDensity ?? 0,
        }}
      source={dataSources["density"]}
      />

      <DensitySummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.populationDensity ?? 0,
        }))}
      />

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          人口密度ランキングの見方
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.9 }}>
          人口密度は「人口 ÷ 面積」で算出されるため、面積の小さい
          都心部の自治体ほど上位に来やすい指標です。上位には
          {ranking[0]?.name}をはじめ東京都特別区・大阪市・
          川崎市など、面積が狭く高層マンションが集積するエリアが
          並びます。一方で下位には、面積が広大な割に人口が
          少ない北海道の町村や、山間部・離島の自治体が
          多く含まれています。同じ「人口密度」でも、都市部の
          過密と地方の過疎という、正反対の事情が背景にある点が
          このランキングの特徴です。
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>
          Q&amp;A：人口密度ランキングについてよくある質問
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
            href="/articles/density-analysis"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            人口密度の分析記事を読む →
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

      <AdSense />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.populationDensity ?? 0}
            unit="人/km²"
          />
        ))}
      </div>
    </div>
  );
}