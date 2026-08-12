import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DebtServiceRatioSummary from "../../../components/ranking/DebtServiceRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/debt-service-ratio" },
  title: "全国自治体 実質公債費比率ランキング｜借金返済の負担度",
  description:
    "全国自治体の実質公債費比率をランキング形式で比較。過去の借金(地方債)の返済が財政をどれだけ圧迫しているかを示す指標で、18%超で起債に許可が必要、25%超で早期健全化団体に指定されます。",
};

export default function DebtServiceRatioRankingPage() {
  const ranking = getMunicipalities()
    .filter((c) => c.realDebtServiceRatio != null)
    .sort(
      (a, b) =>
        (b.realDebtServiceRatio ?? 0) - (a.realDebtServiceRatio ?? 0)
    )
    .slice(0, 100);

  return (
    <main
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
        💳 実質公債費比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/debt-service-ratio-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fef2f2",
          color: "#b91c1c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 実質公債費比率ランキング分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="標準的な財政規模に対して、地方債の返済(元利償還金等)がどれだけの割合を占めているかを示す指標です。3か年平均で算出され、18%以上で起債に都道府県知事の許可が必要、25%以上で早期健全化団体に指定されます。"
        formula="実質公債費比率 = (地方債の元利償還金等 − 特定財源等) ÷ 標準財政規模 × 100(3か年平均)"
        example={{
          name: ranking[0]?.name ?? "",
          value: ranking[0]?.realDebtServiceRatio?.toFixed(1) ?? "0.0",
        }}
      source={dataSources["debt-service-ratio"]}
      />

      <DebtServiceRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.realDebtServiceRatio ?? 0,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.realDebtServiceRatio ?? 0).toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </main>
  );
}
