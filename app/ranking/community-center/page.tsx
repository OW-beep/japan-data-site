import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import CommunityCenterSummary from "../../../components/ranking/CommunityCenterSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 公民館数ランキング｜集落ごとに1館の町も",
  description:
    "公民館1館あたりの人口をランキング形式で比較。長野県など、集落ごとに公民館が置かれている地域と、公民館が1館もない都市部の違いを紹介します。",
};

export default function CommunityCenterRankingPage() {
  const all = getMunicipalities().filter(
    (c) => c.communityCenterCount != null && c.population >= 3000
  );

  const zeroCount = all.filter((c) => c.communityCenterCount === 0).length;

  const ranking = all
    .filter((c) => (c.communityCenterCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      perFacility: c.population / (c.communityCenterCount ?? 1),
    }))
    .sort((a, b) => a.perFacility - b.perFacility)
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
        🏘️ 公民館数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/community-center-analysis"
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
        📖 分析記事「集落ごとに公民館がある町」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="公民館1館あたりの人口です。数字が小さいほど、人口に対して公民館が多いことを意味します。令和3年度社会教育調査に基づきます。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="人口 ÷ 公民館数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${Math.round(ranking[0]?.perFacility ?? 0).toLocaleString()}`,
        }}
      />

      <CommunityCenterSummary
        zeroCount={zeroCount}
        totalCount={all.length}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.perFacility,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={Math.round(city.perFacility).toLocaleString()}
            unit="人/館"
          />
        ))}
      </div>
    </main>
  );
}
