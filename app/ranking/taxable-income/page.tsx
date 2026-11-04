import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import AdSense from "../../../components/AdSense";
import { getMunicipalities } from "../../../lib/municipalities";
import { getTax, nationalIncomePerTaxpayer } from "../../../lib/taxableIncome";

import RankingCommentary from "@/components/ranking/RankingCommentary";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/taxable-income" },
  title: "全国市区町村 所得ランキング(納税義務者1人あたり課税対象所得・令和7年度)",
  description:
    "全国の市区町村を、納税義務者1人あたりの課税対象所得でランキング。総務省「市町村税課税状況等の調」令和7年度のデータから、所得が高い街・低い街と、全国平均との差がわかります。",
};

export default function TaxableIncomeRankingPage() {
  const ranking = getMunicipalities()
    .filter((c) => c.population >= 3000)
    .map((c) => ({ c, t: getTax(c.code) }))
    .filter((r): r is { c: (typeof r)["c"]; t: NonNullable<(typeof r)["t"]> } => r.t != null)
    .sort((a, b) => b.t.incomePerTaxpayer - a.t.incomePerTaxpayer)
    .slice(0, 100);

  const national = nationalIncomePerTaxpayer();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>💴 所得ランキング(納税義務者1人あたり課税対象所得)</h1>

      <a
        href="/articles/municipal-income-analysis"
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
        📖 所得が高い街・低い街と、暮らしとの関係を分析した記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="万円"
        definition="住民税(所得割)を納める人の、前年(令和6年)の所得の合計を、その人数で割った金額です。年収ではなく所得で、所得控除の前の金額です。住民全員の平均ではありません。"
        formula="課税対象所得 ÷ 所得割の納税義務者数"
        example={{
          name: ranking[0]?.c.name ?? "",
          value: `${Math.round(ranking[0]?.t.incomePerTaxpayer ?? 0).toLocaleString()}万円`,
        }}
        source={dataSources["taxable-income"]}
      />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        全国の合計では、納税義務者1人あたりの課税対象所得は{national.toFixed(1)}万円です。人口3,000人以上の市区町村のうち、
        上位100自治体を表示しています。
      </p>

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((r, index) => (
          <RankCard
            key={r.c.code}
            rank={index + 1}
            name={r.c.name}
            value={Math.round(r.t.incomePerTaxpayer).toLocaleString()}
            unit="万円"
          />
        ))}
      </div>

      <RankingCommentary slug="taxable-income" />
    </main>
  );
}
