import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import VacantHouseSummary from "../../../components/ranking/VacantHouseSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/vacant-house" },
  title: "全国自治体 空き家率ランキング｜軽井沢町が全国1位の理由",
  description:
    "総住宅数に占める空き家の割合(空き家率)を全国の自治体でランキング形式で比較。別荘地の軽井沢町・那須町・熱海市と、旧産炭地の夕張市が上位に並ぶ理由を解説します。",
};

export default function VacantHouseRankingPage() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.vacantHouseCount != null &&
        c.totalHousingCount != null &&
        c.totalHousingCount > 0
    )
    .map((c) => ({
      ...c,
      vacancyRate: ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100,
    }))
    .sort((a, b) => b.vacancyRate - a.vacancyRate)
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
        🏚️ 空き家率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/vacant-house-analysis"
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
        📖 分析記事「別荘地と旧産炭地、2つの空き家率」もあわせて読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="総住宅数に占める空き家の割合です。令和5年(2023年)住宅・土地統計調査に基づく、市・区および人口1万5千人以上の町村のデータです(それ未満の小規模な町村は調査の性質上、対象外です)。"
        formula="空き家数 ÷ 総住宅数 × 100"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.vacancyRate?.toFixed(1) ?? "0.0"}`,
        }}
      source={dataSources["vacant-house"]}
      />

      <VacantHouseSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.vacancyRate,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.vacancyRate.toFixed(1)}
            unit="%"
          />
        ))}
      </div>
    </main>
  );
}
