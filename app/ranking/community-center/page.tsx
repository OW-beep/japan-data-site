import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import CommunityCenterSummary from "../../../components/ranking/CommunityCenterSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/community-center" },
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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          公民館1館あたりの人口の中央値は6,156人です。最も少ない山添村は98人/館、飯豊町は103人/館で、集落ごとに小規模な館を置いてきた地域が上位に並びます。上位には阿南町、上松町、木島平村と長野県の町村が複数入っており、地域の集いの場を細かく維持してきた歴史がうかがえます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方、対象1,575自治体のうち公民館が1館もない自治体は281(約18%)あります。都市部では公民館に相当する役割を別の公共施設や民間施設が担うことも多く、「0館」は地域活動の弱さと同義ではありません。人口あたりの館数が多い地域は、身近な拠点が多い反面、維持や担い手の確保が今後の論点になります。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="公民館1館あたりの人口です。数字が小さいほど、人口に対して公民館が多いことを意味します。令和3年度社会教育調査に基づきます。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="人口 ÷ 公民館数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${Math.round(ranking[0]?.perFacility ?? 0).toLocaleString()}`,
        }}
      source={dataSources["community-center"]}
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

      <RankingCommentary slug="community-center" />

    </main>
  );
}
