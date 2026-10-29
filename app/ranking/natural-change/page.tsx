import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import NaturalChangeSummary from "../../../components/ranking/NaturalChangeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/natural-change" },
  title: "全国自治体 自然増減率ランキング（出生数-死亡数）",
  description:
    "出生数から死亡数を引いた自然増減率を全国自治体でランキング。全国1740自治体のうち自然増加なのはわずか34自治体だけという実態を、社会増減率(転入出)とあわせて紹介します。",
};

export default function Page() {
  const base = getMunicipalities2025()
    .filter(
      (c) => c.births != null && c.deaths != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      naturalRate:
        (((c.births ?? 0) - (c.deaths ?? 0)) / c.population) * 1000,
    }));

  const ranking = [...base]
    .sort((a, b) => b.naturalRate - a.naturalRate)
    .slice(0, 50);

  const positiveCount = base.filter((c) => c.naturalRate > 0).length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        👶 自然増減率ランキング（出生数-死亡数）
      </h1>

      <DataAsOf text="出生数・死亡数:2023年(人口動態調査)、人口:令和7年国勢調査(確定値)" />

      <a
        href="/articles/natural-change"
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
        📖 自然増減率ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="‰(人口千人あたり)"
        definition="出生数から死亡数を引いた自然増減数の、人口千人あたりの比率。転入出による社会増減とは別の指標"
        formula="自然増減率 = (出生数 - 死亡数) ÷ 人口 × 1,000"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].naturalRate.toFixed(1)),
        }}
      source={dataSources["natural-change"]}
      />

      <NaturalChangeSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          naturalRate: c.naturalRate,
        }))}
        positiveCount={positiveCount}
        totalCount={base.length}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.naturalRate.toFixed(1)}
            unit="‰"
          />
        ))}
      </div>

      <RankingCommentary slug="natural-change" />

    </div>
  );
}
