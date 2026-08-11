import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import UnemploymentSummary from "../../../components/ranking/UnemploymentSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/unemployment" },
  title: "全国自治体 完全失業率ランキング",
  description:
    "全国自治体の完全失業率をランキング形式で比較。福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのか、その背景を解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.unemployedCount != null &&
        c.laborForceCount != null
    )
    .map((c) => {
      const labor =
        (c.laborForceCount ?? 0) + (c.unemployedCount ?? 0);
      return {
        ...c,
        rate:
          labor > 0
            ? ((c.unemployedCount ?? 0) / labor) * 100
            : 0,
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        💼 完全失業率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/unemployment-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fff7ed",
          color: "#c2410c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 完全失業率ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="就業者数と完全失業者数の合計(労働力人口)に占める完全失業者数の割合"
        formula="完全失業率 = 完全失業者数 ÷ (就業者数 + 完全失業者数) × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].rate.toFixed(1)),
        }}
      />

      <UnemploymentSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          rate: c.rate,
        }))}
        average={average}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </div>
  );
}
