import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HouseholdSizeSummary from "../../../components/ranking/HouseholdSizeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalitiesForHouseholds } from "../../../lib/households2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/household-size" },
  title: "全国自治体 平均世帯人員ランキング",
  description:
    "全国自治体の平均世帯人員(1世帯あたりの人数)をランキング形式で比較。3世代同居が多い東北の農村部と、単身世帯が多い都市部の違いを解説します。",
};

export default function Page() {
  // 人口と世帯数は、必ず同じ年にそろえる。令和7年の世帯数が取得済みなら令和7年、未取得なら令和2年(lib/households2025.ts)
  const { list, label, use2025 } = getMunicipalitiesForHouseholds(false);
  const all = list
    .filter((c) => c.households != null && c.households > 0)
    .map((c) => ({
      ...c,
      avgSize: c.population / (c.households ?? 1),
    }))
    .sort((a, b) => b.avgSize - a.avgSize);

  const ranking = all.slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.avgSize, 0) / ranking.length;

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
        👨‍👩‍👧‍👦 平均世帯人員ランキング
      </h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

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
        📖 世帯データランキング分析を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          平均世帯人員が3人以上になる自治体は、全国1,740のうち
          わずか6つしかありません。自治体を並べた中央値は2.29人で、
          「平均的な世帯像」はすでに2人強です。2人を切る自治体も
          213あり、単身世帯と二人世帯が多数派になった姿が
          数字に表れています(令和7年国勢調査ベース)。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          上位は長野県川上村(3.64人)、群馬県川場村(3.26人)、
          秋田県大潟村(3.22人)など、家族経営の農業が残る町村が
          中心で、3世代同居や親子での営農が世帯を大きくしています。
          下位には単身世帯の多い地域に加え、帰還世帯の多くが
          単身・二人世帯である福島県大熊町(1.23人)のような
          特殊な事情の自治体も含まれます。一人暮らしの街選びでは、
          世帯人員の小さい地域ほど単身向けの住宅や店舗が
          そろっている可能性があり、
          <a href="/articles/young-single-city-guide" style={{ color: "#2563eb" }}>
            一人暮らしの街選びガイド
          </a>
          も参考になります。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口を世帯数で割った、1世帯あたりの平均人数"
        formula="平均世帯人員 = 総人口 ÷ 総世帯数"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].avgSize.toFixed(2)),
        }}
      source={{
        ...dataSources["household-size"],
        dataYear: label,
        ...(use2025 ? { sourceName: "e-Stat「令和7年国勢調査 人口等基本集計」(総務省統計局)" } : {}),
      }}
      />

      <HouseholdSizeSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          avgSize: c.avgSize,
        }))}
        average={average}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="平均世帯人員"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.avgSize.toFixed(2)}人`,
        }))}
        totalCount={all.length}
        topNote="1世帯あたりの人数が最も多い自治体です。全国で平均世帯人員が3人以上の自治体は6つだけです。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.avgSize.toFixed(2)}
            unit="人"
          />
        ))}
      </div>

      <RankingCommentary slug="household-size" />

    </div>
  );
}
