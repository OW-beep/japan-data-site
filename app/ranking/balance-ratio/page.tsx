import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import BalanceRatioSummary from "../../../components/ranking/BalanceRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/balance-ratio" },
  title: "全国自治体 経常収支比率ランキング｜財政の余裕度がわかる",
  description:
    "全国自治体の経常収支比率をランキング形式で比較。財政力指数だけでは見えない「新しい事業に回せる財政的な余裕」がある自治体、逆に自転車操業状態の自治体がわかります。",
};

export default function BalanceRatioRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.ordinaryBalanceRatio != null &&
        !Number.isNaN(c.ordinaryBalanceRatio) &&
        c.ordinaryBalanceRatio > 0
    )
    .sort(
      (a, b) =>
        (a.ordinaryBalanceRatio ?? 0) -
        (b.ordinaryBalanceRatio ?? 0)
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
        🧮 経常収支比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/balance-ratio-analysis"
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
        📖 分析記事「原発立地自治体と夕張市」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          経常収支比率の中央値は89.5%で、90%以上が790自治体(全体の45%)、100%を超える自治体も8つあります。最も低いのは泊村の44.5%で、発電所立地による税収が財政の余裕を生んでいます。逆に最も高い新地町は124.1%、夕張市は123.5%と、経常的な収入だけでは経常的な支出を賄えない水準です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          この指標は単年度の姿を映すため、大規模な建設事業や災害復旧の年には跳ね上がります。また、低いことがそのまま健全さとも限らず、必要な投資を先送りしていないかは別の視点が必要です。<a href="/ranking/finance" style={{ color: "#2563eb" }}>財政力指数</a>(税収の強さ)と並べると、「稼ぐ力」と「余裕」の違いが見えてきます。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="人件費・扶助費・公債費など、毎年必ず発生する経常的な支出が、地方税などの経常的な収入のうちどれだけを占めているかを示す指標です。低いほど、新しい施策に回せる財政的な余裕があります。"
        formula="経常経費充当一般財源 ÷ 経常一般財源総額 × 100"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.ordinaryBalanceRatio?.toFixed(1) ?? "0.0"}`,
        }}
      source={dataSources["balance-ratio"]}
      />

      <BalanceRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.ordinaryBalanceRatio ?? 0,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.ordinaryBalanceRatio ?? 0).toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="balance-ratio" />

    </main>
  );
}
