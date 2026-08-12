import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import TaxRatioSummary from "../../../components/ranking/TaxRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/tax-ratio" },
  title: "全国自治体 地方税自主財源比率ランキング",
  description:
    "全国自治体の歳入に占める地方税の割合(自主財源比率)をランキング形式で比較。企業城下町やリゾート地が上位を占める一方、離島・山村は国からの財政移転への依存度が高い実態を紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.totalRevenue != null &&
        c.localTax != null &&
        c.totalRevenue > 0
    )
    .map((c) => ({
      ...c,
      taxRatio:
        ((c.localTax ?? 0) / (c.totalRevenue ?? 1)) * 100,
    }))
    .sort((a, b) => b.taxRatio - a.taxRatio)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.taxRatio, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        💴 地方税自主財源比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/tax-composition"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#f0fdf4",
          color: "#047857",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 財政の中身分析の記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="歳入決算総額に占める地方税収入の割合。高いほど国からの財政移転に頼らず自前の税収で運営できていることを示す"
        formula="地方税自主財源比率 = 地方税 ÷ 歳入決算総額 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].taxRatio.toFixed(1)),
        }}
      source={dataSources["tax-ratio"]}
      />

      <TaxRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          taxRatio: c.taxRatio,
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
            value={c.taxRatio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </div>
  );
}
