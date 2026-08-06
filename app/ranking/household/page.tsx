import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import HouseholdSummary from "../../../components/ranking/HouseholdSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 単独世帯割合ランキング",
  description:
    "全国自治体の単独世帯割合(一人暮らし世帯の割合)をランキング形式で比較。都市部と震災復興地域、それぞれ異なる背景を解説します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.households != null && c.households > 0)
    .map((c) => ({
      ...c,
      ratio:
        ((c.singleHouseholds ?? 0) / (c.households ?? 1)) * 100,
      avgSize: c.population / (c.households ?? 1),
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.ratio, 0) / ranking.length;

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
        🏠 単独世帯割合ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/household-analysis"
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
        📖 都心と被災地、単独世帯が多い2つの理由を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="全世帯のうち一人暮らし(単独)世帯が占める割合"
        formula="単独世帯割合 = 単独世帯数 ÷ 総世帯数 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: ranking[0].ratio,
        }}
      />

      <HouseholdSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          ratio: c.ratio,
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
            value={c.ratio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </div>
  );
}
