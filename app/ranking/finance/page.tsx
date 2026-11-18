import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import FinanceSummary from "../../../components/ranking/FinanceSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingJsonLd from "../../../components/RankingJsonLd";
import RakutenGifts from "../../../components/RakutenGifts";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/finance" },
  title: "財政力指数ランキング【全国自治体】高い自治体・低い自治体一覧",
  description:
    "全国自治体の財政力指数をランキング形式で一覧比較。財政力指数が高い「稼げる自治体」から低い自治体まで、1.0を超えるとどうなるか、指数の見方も解説します。",
};

export default function FinanceRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.financeIndex != null &&
        !Number.isNaN(c.financeIndex)
    )
    .sort(
      (a, b) =>
        (b.financeIndex ?? 0) -
        (a.financeIndex ?? 0)
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
      <RankingJsonLd
        path="/ranking/finance"
        title="財政力指数ランキング"
        items={ranking}
      />
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        💰 財政力指数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/finance-analysis"
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
        📖 なぜ小さな村が全国トップなのか、分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit=""
        definition="自治体が自前の税収でどれだけ行政サービスを賄えるかを表す指標です。"
        formula="基準財政収入額 ÷ 基準財政需要額"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.financeIndex?.toFixed(2) ??
            "0.00",
        }}
      source={dataSources["finance"]}
      />

      <FinanceSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.financeIndex ?? 0,
        }))}
      />

      <AdSense />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.financeIndex ?? 0).toFixed(2)}
            unit=""
          />
        ))}
      </div>

      <RankingCommentary slug="finance" />

      {/* 自治体の財政に関心を持った人向けに、ふるさと納税の返礼品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="ふるさと納税 返礼品"
        heading="楽天市場でふるさと納税の返礼品を見る"
        hits={3}
      />

    </main>
  );
}