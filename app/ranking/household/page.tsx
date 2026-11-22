import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import HouseholdSummary from "../../../components/ranking/HouseholdSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalitiesForHouseholds } from "../../../lib/households2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/household" },
  title: "全国自治体 単独世帯割合ランキング",
  description:
    "全国自治体の単独世帯割合(一人暮らし世帯の割合)をランキング形式で比較。都市部と震災復興地域、それぞれ異なる背景を解説します。",
};

export default function Page() {
  // 人口と世帯数は、必ず同じ年にそろえる。令和7年の世帯数が取得済みなら令和7年、未取得なら令和2年(lib/households2025.ts)
  const { list, label, use2025 } = getMunicipalitiesForHouseholds(true);
  const ranking = list
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
        📖 都心と被災地、単独世帯が多い2つの理由を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          単身世帯率の中央値は35.0%で、50%を超える自治体は92あります。上位には大熊町(84.6%)、占冠村(76.4%)、青ヶ島村(75.0%)のように、帰還の動きやリゾート、離島といった事情を持つ自治体と、新宿区(70.2%)のような都心が並びます。平均世帯人員で見ると、大熊町は1.23人です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          単身世帯率は、高齢者の一人暮らしだけでなく、若い単身者の流入や寮・社宅の存在でも上がります。最も低い川北町は13.7%で、家族世帯を中心とした構成です。「単身世帯が多い=高齢化が進んでいる」と決めつけず、年齢構成とあわせて読むことが大切です。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="全世帯のうち一人暮らし(単独)世帯が占める割合"
        formula="単独世帯割合 = 単独世帯数 ÷ 総世帯数 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: ranking[0].ratio,
        }}
      source={{
        ...dataSources["household"],
        dataYear: label,
        ...(use2025 ? { sourceName: "e-Stat「令和7年国勢調査 人口等基本集計」(総務省統計局)" } : {}),
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

      <RankingCommentary slug="household" />

    </div>
  );
}
